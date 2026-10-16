import { describe, expect, it } from 'vitest';
import { createPhotoStore, formatTripDates, tripTitle } from './photos.js';
import { fixture } from '../test/fixture.js';

const store = createPhotoStore(fixture);

describe('photo store', () => {
  it('hides draft trips and their photos', () => {
    expect(store.trips().map((t) => t.id)).toEqual(['new-trip', 'old-trip']);
    expect(store.trip('draft-trip')).toBeNull();
    expect(store.featured().map((p) => p.id)).toEqual(['new-trip/a']);
  });

  it('returns recent photos newest first', () => {
    expect(store.recent(2).map((p) => p.id)).toEqual(['new-trip/b', 'new-trip/a']);
  });

  it('resolves trip photos, covers and neighbours', () => {
    const trip = store.trip('new-trip');
    expect(store.tripPhotos(trip)).toHaveLength(2);
    expect(store.cover(trip).id).toBe('new-trip/a');
    expect(store.cover(store.trip('old-trip'))).toBeNull();
    expect(store.neighbours('new-trip')).toMatchObject({ newer: null, older: { id: 'old-trip' } });
  });
});

describe('formatTripDates', () => {
  it('handles year, month and day precision', () => {
    expect(formatTripDates('2025', null, 'en-GB')).toBe('2025');
    expect(formatTripDates('2025-10', null, 'en-GB')).toBe('October 2025');
    expect(formatTripDates('2025-09-08', null, 'en-GB')).toBe('8 September 2025');
  });

  it('collapses shared month/year in ranges', () => {
    expect(formatTripDates('2025-11-17', '2025-11-23', 'en-GB')).toMatch(/^17\s*[–-]\s*23 November 2025$/);
  });

  it('localises to Norwegian', () => {
    expect(formatTripDates('2025-10', null, 'nb-NO')).toBe('oktober 2025');
  });
});

describe('tripTitle', () => {
  it('uses the Norwegian title when present', () => {
    expect(tripTitle(fixture.trips[0], 'no')).toBe('Ny tur');
    expect(tripTitle(fixture.trips[2], 'no')).toBe('Old Trip');
  });
});
