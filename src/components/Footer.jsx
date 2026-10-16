import { useI18n } from '../i18n/useI18n.js';
import { site } from '../data/site.js';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className={styles.links}>
          <a className="link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className="link" href={site.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="link" href={site.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
        <p className="muted">
          {t('footer.built')}{' '}
          <a className="link" href={site.links.source} target="_blank" rel="noreferrer">
            {t('footer.source')}
          </a>
        </p>
      </div>
    </footer>
  );
}
