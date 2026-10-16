import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { usePageTitle } from '../usePageTitle.js';
import { formatTripDates, photoStore, tripTitle } from '../data/photos.js';
import PhotoGrid from '../components/PhotoGrid.jsx';
import Reveal from '../components/Reveal.jsx';
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
  const title = tripTitle(trip, lang);

  return (
    <article className="page">
      <header className={styles.header}>
        <Link to="/plog" className="arrow-link">
          <span className="arrow">←</span> {t('plog.back')}
        </Link>
        <p className="eyebrow">
          {[trip.location, formatTripDates(trip.start, trip.end, locale)].filter(Boolean).join(' · ')}
        </p>
        <h1 className={`display ${styles.title}`}>{title}</h1>
      </header>

      {trip.bodyHtml && (
        <Reveal className={styles.story}>
          {/* Markdown from our own content/ folder, rendered at build time. */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: trip.bodyHtml }} />
        </Reveal>
      )}

      <section className={styles.gallery} aria-label={t('plog.photos', { n: photos.length })}>
        {photos.length > 0 ? <PhotoGrid photos={photos} priority={3} /> : <p className="muted">{t('plog.noPhotos')}</p>}
      </section>

      {(newer || older) && (
        <nav className={styles.pager} aria-label={t('plog.trips')}>
          {older ? (
            <Link to={`/plog/${older.id}`} className={styles.pagerLink}>
              <span className="eyebrow">← {t('plog.prev')}</span>
              <span className={`display ${styles.pagerTitle}`}>{tripTitle(older, lang)}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link to={`/plog/${newer.id}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
              <span className="eyebrow">{t('plog.next')} →</span>
              <span className={`display ${styles.pagerTitle}`}>{tripTitle(newer, lang)}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
