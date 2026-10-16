import { useCallback, useEffect, useMemo, useState } from 'react';
import { LOCALES, STORAGE_KEY, detectLang, translate } from './translate.js';
import { I18nContext } from './useI18n.js';

export function I18nProvider({ children, initialLang }) {
  const [lang, setLang] = useState(() => initialLang ?? detectLang());

  useEffect(() => {
    document.documentElement.lang = lang === 'no' ? 'nb' : 'en';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);
  const toggleLang = useCallback(() => setLang((l) => (l === 'en' ? 'no' : 'en')), []);

  const value = useMemo(
    () => ({ lang, locale: LOCALES[lang], setLang, toggleLang, t }),
    [lang, t, toggleLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
