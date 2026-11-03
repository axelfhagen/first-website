import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { usePageTitle } from '../usePageTitle.js';
import { formatTripDates, photoStore, tripTitle } from '../data/photos.js';
import PhotoGrid from '../components/PhotoGrid.jsx';
import NotFound from './NotFound.jsx';
import styles from './Trip.module.css';

export default function Trip() {
  const { tripId } = useParams();
  const { t, lang, locale } = useI18n();
  const trip = photoStore.trip(tripId);
  usePageTitle(trip ? tripTitle(trip, lang) : null);

  if (!trip) return <NotFound />;

  const photos = photoStore.tripPhotos(trip);
  const { newer, older } = photoStore.neighbours(trip.id);

  return (
    <article className="wrap">
      <header className={styles.header}>
        <p className={styles.back}>
          <Link to="/plog">← {t('plog.back')}</Link>
        </p>
        <h1>{tripTitle(trip, lang)}</h1>
        <p className="meta muted">
          {[formatTripDates(trip.start, trip.end, locale), trip.location].filter(Boolean).join(' · ')}
        </p>
      </header>

      {trip.bodyHtml && (
        // Markdown from our own content/ folder, rendered at build time.
        <div className={`prose ${styles.story}`} dangerouslySetInnerHTML={{ __html: trip.bodyHtml }} />
      )}

      <section className={styles.photos} aria-label={t('plog.photos', { n: photos.length })}>
        {photos.length > 0 ? <PhotoGrid photos={photos} priority={3} /> : <p className="muted">{t('plog.noPhotos')}</p>}
      </section>

      {(newer || older) && (
        <nav className={styles.pager} aria-label={t('plog.trips')}>
          {older ? (
            <Link to={`/plog/${older.id}`}>
              <span className="meta muted">← {t('plog.prev')}</span>
              {tripTitle(older, lang)}
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link to={`/plog/${newer.id}`} className={styles.next}>
              <span className="meta muted">{t('plog.next')} →</span>
              {tripTitle(newer, lang)}
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
