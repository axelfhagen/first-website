import { useI18n } from '../i18n/useI18n.js';
import styles from './ProjectList.module.css';

export default function ProjectList({ projects }) {
  const { lang } = useI18n();
  return (
    <ul className={styles.list}>
      {projects.map((p) => (
        <li key={p.id}>
          <p>
            <a href={p.url} target="_blank" rel="noreferrer" className={styles.title}>
              {p.title}
            </a>
            {' — '}
            {p.description[lang]}
          </p>
          <p className="meta muted">{p.tech}</p>
        </li>
      ))}
    </ul>
  );
}
