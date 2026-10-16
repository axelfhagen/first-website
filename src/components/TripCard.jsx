import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { formatTripDates, photoStore, tripTitle } from '../data/photos.js';
import Photo from './Photo.jsx';
import styles from './TripCard.module.css';

/**
 * Trip teaser. With a cover photo it's an image card; without one it falls
 * back to a typographic card built from the story's first lines.
 */
export default function TripCard({ trip, variant = 'card' }) {
  const { t, lang, locale } = useI18n();
  const cover = photoStore.cover(trip);
  const count = trip.photoIds.length;
  const title = tripTitle(trip, lang);
  const dates = formatTripDates(trip.start, trip.end, locale);

  if (variant === 'row') {
    return (
      <Link to={`/plog/${trip.id}`} className={styles.row}>
        <span className={styles.rowThumb} aria-hidden="true">
          {cover ? <Photo photo={cover} fit="cover" sizes="6rem" /> : <span className={styles.monogram}>{title.charAt(0)}</span>}
        </span>
        <span className={styles.rowMain}>
          <span className={`display ${styles.rowTitle}`}>{title}</span>
          <span className={styles.rowMeta}>{[trip.location, dates].filter(Boolean).join(' · ')}</span>
        </span>
        <span className={styles.rowCount}>
          {count === 0 ? t('plog.story') : count === 1 ? t('plog.photo') : t('plog.photos', { n: count })}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </Link>
    );
  }

  return (
    <Link to={`/plog/${trip.id}`} className={styles.card}>
      <span className={`${styles.media} ${cover ? '' : styles.textMedia}`}>
        {cover ? (
          <Photo photo={cover} fit="cover" sizes="(min-width: 64rem) 24rem, (min-width: 40rem) 50vw, 100vw" />
        ) : (
          <span className={styles.textCover}>
            <span className={styles.quote}>“{trip.excerpt}”</span>
          </span>
        )}
      </span>
      <span className={styles.meta}>{[trip.location, dates].filter(Boolean).join(' · ')}</span>
      <span className={`display ${styles.title}`}>{title}</span>
    </Link>
  );
}
