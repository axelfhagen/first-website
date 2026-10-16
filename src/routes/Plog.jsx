import { useI18n } from '../i18n/useI18n.js';
import { usePageTitle } from '../usePageTitle.js';
import { photoStore, tripYear } from '../data/photos.js';
import PhotoGrid from '../components/PhotoGrid.jsx';
import TripCard from '../components/TripCard.jsx';
import Reveal from '../components/Reveal.jsx';
import styles from './Plog.module.css';

function groupByYear(trips) {
  const groups = new Map();
  for (const trip of trips) {
    const year = tripYear(trip);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(trip);
  }
  return [...groups];
}

export default function Plog() {
  const { t } = useI18n();
  usePageTitle(t('plog.title'));

  const featured = photoStore.featured();
  const years = groupByYear(photoStore.trips());
  const recent = photoStore.recent(24);

  return (
    <div className="page">
      <header className={styles.header}>
        <h1 className={`display ${styles.title}`}>{t('plog.title')}</h1>
        <p className={styles.lead}>{t('plog.lead')}</p>
      </header>

      {featured.length > 0 && (
        <section className={styles.section} aria-labelledby="highlights">
          <h2 id="highlights" className="eyebrow">
            {t('plog.highlights')}
          </h2>
          <div className={styles.strip}>
            <PhotoGrid photos={featured} layout="strip" showTripLinks label={t('plog.highlights')} priority={2} />
          </div>
        </section>
      )}

      <section className={styles.section} aria-labelledby="trips">
        <h2 id="trips" className="eyebrow">
          {t('plog.trips')}
        </h2>
        {years.map(([year, trips]) => (
          <Reveal key={year} className={styles.year}>
            <h3 className={`display ${styles.yearLabel}`}>{year}</h3>
            <ul className={styles.tripList}>
              {trips.map((trip) => (
                <li key={trip.id}>
                  <TripCard trip={trip} variant="row" />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </section>

      {recent.length > 0 && (
        <section className={styles.section} aria-labelledby="recent">
          <h2 id="recent" className="eyebrow">
            {t('plog.recent')}
          </h2>
          <div className={styles.grid}>
            <PhotoGrid photos={recent} showTripLinks label={t('plog.recent')} />
          </div>
        </section>
      )}
    </div>
  );
}
