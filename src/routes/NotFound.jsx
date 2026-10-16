import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { usePageTitle } from '../usePageTitle.js';

export default function NotFound() {
  const { t } = useI18n();
  usePageTitle('404');
  return (
    <div className="page" style={{ paddingBlock: 'var(--space-2xl)' }}>
      <p className="eyebrow">404</p>
      <h1 className="display" style={{ fontSize: 'var(--step-4)', marginBlock: 'var(--space-m)' }}>
        {t('notFound.title')}
      </h1>
      <p className="muted" style={{ marginBottom: 'var(--space-l)' }}>
        {t('notFound.body')}
      </p>
      <Link to="/" className="arrow-link">
        <span className="arrow">←</span> {t('notFound.home')}
      </Link>
    </div>
  );
}
