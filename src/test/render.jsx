import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../i18n/I18nProvider.jsx';
import App from '../App.jsx';

export function renderApp(path = '/', { lang = 'en' } = {}) {
  return render(
    <I18nProvider initialLang={lang}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </I18nProvider>,
  );
}
