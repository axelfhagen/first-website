import { useI18n } from '../i18n/useI18n.js';
import { usePageTitle } from '../usePageTitle.js';
import { photoStore } from '../data/photos.js';
import PhotoGrid from '../components/PhotoGrid.jsx';
import TripList from '../components/TripList.jsx';
import styles from './Plog.module.css';

export default function Plog() {
  const { t } = useI18n();
  usePageTitle(t('plog.title'));

  const favourites = photoStore.featured();
  const all = photoStore.recent(Infinity);

  return (
    <div className="wrap">
      <header className={styles.header}>
        <h1>{t('plog.title')}</h1>
        <p className="muted">{t('plog.lead')}</p>
      </header>

      <section className={styles.section} aria-labelledby="trips">
        <h2 id="trips" className="section-title">
          {t('plog.trips')}
        </h2>
        <TripList trips={photoStore.trips()} />
      </section>

      {favourites.length > 0 && (
        <section className={styles.section} aria-labelledby="favourites">
          <h2 id="favourites" className="section-title">
            {t('plog.favourites')}
          </h2>
          <PhotoGrid photos={favourites} layout="rows" showTripLinks label={t('plog.favourites')} priority={6} />
        </section>
      )}

      {all.length > 0 && (
        <section className={styles.section} aria-labelledby="all">
          <h2 id="all" className="section-title">
            {t('plog.all')} <span className="meta muted">({all.length})</span>
          </h2>
          <PhotoGrid photos={all} showTripLinks label={t('plog.all')} />
        </section>
      )}
    </div>
  );
}
