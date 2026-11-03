import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { usePageTitle } from '../usePageTitle.js';

export default function NotFound() {
  const { t } = useI18n();
  usePageTitle('404');
  return (
    <div className="wrap" style={{ paddingTop: '3rem' }}>
      <p className="meta muted">404</p>
      <h1 style={{ fontSize: 'var(--text-xl)', margin: '0.25rem 0 0.5rem' }}>{t('notFound.title')}</h1>
      <p>{t('notFound.body')}</p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/">{t('notFound.home')}</Link>
      </p>
    </div>
  );
}
