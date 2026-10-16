import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { usePageTitle } from '../usePageTitle.js';
import { site } from '../data/site.js';
import { projects } from '../data/projects.js';
import { photoStore, portrait } from '../data/photos.js';
import Photo from '../components/Photo.jsx';
import PhotoGrid from '../components/PhotoGrid.jsx';
import ProjectRow from '../components/ProjectRow.jsx';
import TripCard from '../components/TripCard.jsx';
import Reveal from '../components/Reveal.jsx';
import styles from './Home.module.css';

function SectionHead({ num, title, children }) {
  return (
    <div className={styles.sectionHead}>
      <h2 className="eyebrow">
        <span className="num">{num}</span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();
  usePageTitle(null);

  const latestTrips = photoStore.trips().slice(0, 3);
  const recent = photoStore.recent(10);

  return (
    <>
      <section className={`page ${styles.hero}`}>
        <div className={styles.heroText}>
          <h1 className={`display ${styles.statement}`}>{t('hero.statement')}</h1>
          <p className={styles.aside}>{t('hero.aside')}</p>
          <p className={styles.contacts}>
            <a className="arrow-link" href={site.links.github} target="_blank" rel="noreferrer">
              GitHub <span className="arrow">↗</span>
            </a>
            <a className="arrow-link" href={site.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span className="arrow">↗</span>
            </a>
            <a className="arrow-link" href={`mailto:${site.email}`}>
              {t('hero.email')} <span className="arrow">→</span>
            </a>
          </p>
        </div>
        {portrait && (
          <div className={styles.portrait}>
            <Photo photo={{ ...portrait, alt: t('hero.portraitAlt') }} sizes="(min-width: 48rem) 16rem, 40vw" eager />
          </div>
        )}
      </section>

      <section id="work" className={`page ${styles.section}`} aria-labelledby="work-title">
        <SectionHead num="01" title={<span id="work-title">{t('work.title')}</span>}>
          <a className="arrow-link" href={site.links.github} target="_blank" rel="noreferrer">
            {t('work.more')} <span className="arrow">↗</span>
          </a>
        </SectionHead>
        <Reveal as="ol" className={styles.projects}>
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} number={i + 1} />
          ))}
        </Reveal>
      </section>

      <section id="plog" className={`page ${styles.section}`} aria-labelledby="plog-title">
        <SectionHead num="02" title={<span id="plog-title">{t('plog.title')}</span>}>
          <Link className="arrow-link" to="/plog">
            {t('plog.allTrips')} <span className="arrow">→</span>
          </Link>
        </SectionHead>
        <p className={styles.lead}>{t('plog.lead')}</p>

        <div className={styles.trips}>
          {latestTrips.map((trip, i) => (
            <Reveal key={trip.id} delay={i * 80}>
              <TripCard trip={trip} />
            </Reveal>
          ))}
        </div>

        {recent.length > 0 && (
          <Reveal className={styles.recent}>
            <h3 className={styles.subhead}>{t('plog.recent')}</h3>
            <PhotoGrid photos={recent} layout="strip" showTripLinks label={t('plog.recent')} />
          </Reveal>
        )}
      </section>

      <section id="about" className={`page ${styles.section}`} aria-labelledby="about-title">
        <SectionHead num="03" title={<span id="about-title">{t('about.title')}</span>} />
        <Reveal className={styles.about}>
          <p className={`display ${styles.aboutBody}`}>{t('about.body')}</p>
          <div className={styles.aboutActions}>
            <a className={styles.button} href={`mailto:${site.email}`}>
              {t('about.email')}
            </a>
            <a className="arrow-link" href={t('about.cvFile')} target="_blank" rel="noreferrer">
              {t('about.cv')} <span className="arrow">↓</span>
            </a>
            <a className="arrow-link" href={t('about.cvAltFile')} target="_blank" rel="noreferrer">
              {t('about.cvAlt')} <span className="arrow">↓</span>
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
