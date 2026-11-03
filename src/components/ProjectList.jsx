import { useI18n } from '../i18n/useI18n.js';
import ProjectFigure from './ProjectFigure.jsx';
import styles from './ProjectList.module.css';

export default function ProjectList({ projects }) {
  const { lang } = useI18n();
  return (
    <ul className={styles.grid}>
      {projects.map((p) => (
        <li key={p.id} className={styles.card}>
          <div className={styles.sketch}>
            <ProjectFigure id={p.id} />
          </div>
          <h3 className={styles.title}>
            {/* The link is stretched over the whole card (see .title a::after). */}
            <a href={p.url} target="_blank" rel="noreferrer">
              {p.title}
            </a>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </h3>
          <p className={styles.description}>{p.description[lang]}</p>
          {p.stat && (
            <p className={styles.stat}>
              <span className={styles.value}>{p.stat.value}</span> <span className="meta muted">{p.stat.label[lang]}</span>
            </p>
          )}
          <p className={`meta muted ${styles.footer}`}>
            <span>{p.context[lang]}</span>
            <span>{p.tech}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
