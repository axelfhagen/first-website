import { useI18n } from '../i18n/useI18n.js';
import { site } from '../data/site.js';
import SocialIcon from './SocialIcon.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className={`wrap ${styles.footer}`}>
      <span>
        © {new Date().getFullYear()} {site.name}
      </span>
      <span className={styles.links}>
        <a href={`mailto:${site.email}`} aria-label="Email">
          <SocialIcon name="email" />
        </a>
        <a href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <SocialIcon name="github" />
        </a>
        <a href={site.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <SocialIcon name="linkedin" />
        </a>
        <a href={site.links.source} target="_blank" rel="noreferrer">
          {t('footer.source')}
        </a>
      </span>
    </footer>
  );
}
