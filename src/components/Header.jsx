import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { useTheme } from '../theme/useTheme.js';
import { site } from '../data/site.js';
import styles from './Header.module.css';

function ThemeIcon({ theme }) {
  // Half-filled circle; the filled half flips with the theme.
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d={theme === 'dark' ? 'M8 1.5a6.5 6.5 0 0 1 0 13z' : 'M8 1.5a6.5 6.5 0 0 0 0 13z'} fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`page ${styles.inner}`}>
        <Link to="/" className={styles.name}>
          {site.name}
        </Link>

        <nav aria-label={t('nav.label')} className={styles.nav}>
          <Link to="/#work" className={styles.navLink}>
            {t('nav.work')}
          </Link>
          <NavLink to="/plog" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            {t('nav.plog')}
          </NavLink>
          <Link to="/#about" className={styles.navLink}>
            {t('nav.about')}
          </Link>
        </nav>

        <div className={styles.controls}>
          <button type="button" className={styles.control} onClick={toggleLang} aria-label={t('controls.languageLabel')}>
            {lang === 'en' ? 'NO' : 'EN'}
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('controls.toLight') : t('controls.toDark')}
          >
            <ThemeIcon theme={theme} />
          </button>
        </div>
      </div>
    </header>
  );
}
