import generated from './photos.generated.json';

/**
 * Read-only queries over the manifest produced by `npm run photos`.
 * `createPhotoStore` is exported so tests can run the same queries on fixture data.
 */
export function createPhotoStore({ trips, photos }) {
  const visibleTrips = trips.filter((t) => !t.draft);
  const visiblePhotos = photos.filter((p) => !p.draft);
  const photoById = new Map(visiblePhotos.map((p) => [p.id, p]));
  const byDateDesc = (a, b) => (b.date ?? '').localeCompare(a.date ?? '');

  return {
    trips: () => visibleTrips,
    trip: (id) => visibleTrips.find((t) => t.id === id) ?? null,
    tripPhotos: (trip) => trip.photoIds.map((id) => photoById.get(id)).filter(Boolean),
    cover: (trip) => (trip.cover ? photoById.get(trip.cover) ?? null : null),
    featured: () => visiblePhotos.filter((p) => p.featured),
    recent: (n = 12) => [...visiblePhotos].sort(byDateDesc).slice(0, n),
    /** Trips before/after `id` in the (newest-first) list. */
    neighbours: (id) => {
      const i = visibleTrips.findIndex((t) => t.id === id);
      return { newer: visibleTrips[i - 1] ?? null, older: visibleTrips[i + 1] ?? null };
    },
  };
}

export const photoStore = createPhotoStore(generated);

/** Trip title in the current language. */
export function tripTitle(trip, lang) {
  return (lang === 'no' && trip.title_no) || trip.title;
}

/**
 * Human date range for a trip. Accepts "2025", "2025-10" or "2025-10-03" for
 * start/end, and avoids repeating the month/year when they're shared.
 */
export function formatTripDates(start, end, locale) {
  if (!start) return '';
  const parts = (s) => s.split('-').map(Number);
  const [y1, m1, d1] = parts(start);
  const fmt = (opts, y, m = 1, d = 1) => new Intl.DateTimeFormat(locale, { ...opts, timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d));

  if (!m1) return String(y1);
  if (!d1) return fmt({ month: 'long', year: 'numeric' }, y1, m1);
  if (!end || end === start) return fmt({ day: 'numeric', month: 'long', year: 'numeric' }, y1, m1, d1);

  const [y2, m2, d2] = parts(end);
  if (!d2) return fmt({ day: 'numeric', month: 'long', year: 'numeric' }, y1, m1, d1);
  try {
    const f = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    return f.formatRange(Date.UTC(y1, m1 - 1, d1), Date.UTC(y2, m2 - 1, d2));
  } catch {
    return `${fmt({ day: 'numeric', month: 'long', year: 'numeric' }, y1, m1, d1)} – ${fmt({ day: 'numeric', month: 'long', year: 'numeric' }, y2, m2, d2)}`;
  }
}

export function tripYear(trip) {
  return trip.start ? trip.start.slice(0, 4) : '—';
}

export const portrait = generated.portrait ?? null;
