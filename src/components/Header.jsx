import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { useTheme } from '../theme/useTheme.js';
import { site } from '../data/site.js';
import styles from './Header.module.css';

export default function Header() {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`wrap ${styles.header}`}>
      <Link to="/" className={styles.name}>
        <img src="/icons/frog/logo192.png" alt="" width="22" height="22" />
        {site.name}
      </Link>
      <nav aria-label={t('nav.label')} className={styles.nav}>
        <Link to="/#projects">{t('nav.projects')}</Link>
        <NavLink to="/plog">{t('nav.plog')}</NavLink>
        <button type="button" onClick={toggleLang} aria-label={t('controls.languageLabel')} className="meta">
          {lang === 'en' ? 'NO' : 'EN'}
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t('controls.toLight') : t('controls.toDark')}
          className={styles.theme}
        >
          <span aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}
