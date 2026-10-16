import { useI18n } from '../i18n/useI18n.js';
import styles from './ProjectRow.module.css';

export default function ProjectRow({ project, number }) {
  const { lang } = useI18n();
  return (
    <li>
      <a className={styles.row} href={project.url} target="_blank" rel="noreferrer">
        <span className={styles.num}>{String(number).padStart(2, '0')}</span>
        <span className={styles.main}>
          <span className={`display ${styles.title}`}>{project.title[lang]}</span>
          <span className={styles.desc}>{project.description[lang]}</span>
        </span>
        <span className={styles.tech}>{project.tech.join(' · ')}</span>
        <span className={styles.arrow} aria-hidden="true">
          ↗
        </span>
      </a>
    </li>
  );
}
