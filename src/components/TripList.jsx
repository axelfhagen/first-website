import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { tripTitle } from '../data/photos.js';
import styles from './TripList.module.css';

/** "2025-11-17" or "2025-11" → "Nov 2025". */
function monthYear(start, locale) {
  const [y, m = 1] = start.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1)).toLocaleDateString(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** Trips as log entries: month, title, place. */
export default function TripList({ trips }) {
  const { t, lang, locale } = useI18n();
  return (
    <ul className={styles.list}>
      {trips.map((trip) => {
        const n = trip.photoIds.length;
        return (
          <li key={trip.id}>
            <Link to={`/plog/${trip.id}`} className={styles.entry}>
              <time className={`meta ${styles.date}`} dateTime={trip.start ?? undefined}>
                {trip.start ? monthYear(trip.start, locale) : ''}
              </time>
              <span className={styles.title}>{tripTitle(trip, lang)}</span>
              <span className={`meta ${styles.place}`}>
                {[trip.location, n > 0 && (n === 1 ? t('plog.photo') : t('plog.photos', { n }))].filter(Boolean).join(' · ')}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
