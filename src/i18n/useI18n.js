import { createContext, useContext } from 'react';

export const I18nContext = createContext(null);

/** { lang, locale, setLang, toggleLang, t } from the nearest <I18nProvider>. */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
