import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { usePageTitle } from '../usePageTitle.js';
import { site } from '../data/site.js';
import { projects } from '../data/projects.js';
import { photoStore, portrait } from '../data/photos.js';
import Photo from '../components/Photo.jsx';
import PhotoGrid from '../components/PhotoGrid.jsx';
import ProjectList from '../components/ProjectList.jsx';
import SocialIcon from '../components/SocialIcon.jsx';
import TripList from '../components/TripList.jsx';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useI18n();
  usePageTitle(null);

  return (
    <div className="wrap">
      <section className={styles.intro}>
        {portrait && (
          <div className={styles.portrait}>
            <Photo photo={{ ...portrait, alt: t('intro.portraitAlt') }} fit="cover" sizes="13rem" eager />
          </div>
        )}
        <div className={`narrow ${styles.text}`}>
          <h1 className={styles.hello}>{t('intro.hello')}</h1>
          <p>{t('intro.body')}</p>
          <p>{t('intro.plog')}</p>
          <p className={styles.links}>
            <a href={`mailto:${site.email}`}>
              <SocialIcon name="email" />
              {site.email}
            </a>
            <a href={site.links.github} target="_blank" rel="noreferrer">
              <SocialIcon name="github" />
              GitHub
            </a>
            <a href={site.links.linkedin} target="_blank" rel="noreferrer">
              <SocialIcon name="linkedin" />
              LinkedIn
            </a>
            <a href={t('links.cvFile')} target="_blank" rel="noreferrer">
              {t('links.cv')}
            </a>
          </p>
        </div>
      </section>

      <section id="projects" className={styles.section} aria-labelledby="projects-title">
        <h2 id="projects-title" className="section-title">
          {t('projects.title')}
        </h2>
        <ProjectList projects={projects} />
        <p className={styles.more}>
          <a href={site.links.github} target="_blank" rel="noreferrer">
            {t('projects.more')}
          </a>
        </p>
      </section>

      <section id="plog" className={styles.section} aria-labelledby="plog-title">
        <h2 id="plog-title" className="section-title">
          <Link to="/plog">{t('plog.title')}</Link>
        </h2>
        <PhotoGrid photos={photoStore.recent(15)} layout="rows" showTripLinks label={t('plog.recent')} />
        <div className={styles.trips}>
          <TripList trips={photoStore.trips().slice(0, 5)} />
        </div>
        <p className={styles.more}>
          <Link to="/plog">{t('plog.allLink')}</Link>
        </p>
      </section>
    </div>
  );
}
