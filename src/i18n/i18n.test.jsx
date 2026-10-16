import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { I18nProvider } from './I18nProvider.jsx';
import { DICTIONARIES, detectLang, translate } from './translate.js';
import { useI18n } from './useI18n.js';

function keys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) => (typeof v === 'string' ? [prefix + k] : keys(v, `${prefix}${k}.`)));
}

describe('translate', () => {
  it('looks up nested keys and interpolates', () => {
    expect(translate('en', 'plog.photos', { n: 3 })).toBe('3 photos');
    expect(translate('no', 'plog.photos', { n: 3 })).toBe('3 bilder');
  });

  it('falls back to English, then to the key', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    DICTIONARIES.no.__test = undefined;
    DICTIONARIES.en.__test = 'only english';
    expect(translate('no', '__test')).toBe('only english');
    expect(translate('no', 'does.not.exist')).toBe('does.not.exist');
    delete DICTIONARIES.en.__test;
    delete DICTIONARIES.no.__test;
    warn.mockRestore();
  });

  it('has the same keys in every language', () => {
    expect(keys(DICTIONARIES.no).sort()).toEqual(keys(DICTIONARIES.en).sort());
  });
});

describe('language choice', () => {
  it('prefers a saved choice over the browser language', () => {
    localStorage.setItem('lang', 'no');
    expect(detectLang()).toBe('no');
  });

  it('persists toggles and sets <html lang>', () => {
    let api;
    function Probe() {
      api = useI18n();
      return <span>{api.t('nav.about')}</span>;
    }
    render(
      <I18nProvider initialLang="en">
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByText('About')).toBeInTheDocument();
    act(() => api.toggleLang());
    expect(screen.getByText('Om meg')).toBeInTheDocument();
    expect(localStorage.getItem('lang')).toBe('no');
    expect(document.documentElement.lang).toBe('nb');
  });
});
