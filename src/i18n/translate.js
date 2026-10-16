import en from './en.js';
import no from './no.js';

export const DICTIONARIES = { en, no };
export const LANGS = ['en', 'no'];
export const LOCALES = { en: 'en-GB', no: 'nb-NO' };
export const STORAGE_KEY = 'lang';

/** Saved choice, else the browser language. Mirrors the inline script in index.html. */
export function detectLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // storage unavailable (private mode etc.)
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return /^(nb|nn|no)\b/i.test(nav) ? 'no' : 'en';
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => node?.[part], dict);
}

/** Resolves `key` in `lang`, falling back to English, then to the key itself. */
export function translate(lang, key, vars) {
  let value = lookup(DICTIONARIES[lang], key);
  if (typeof value !== 'string') {
    if (import.meta.env.DEV) console.warn(`[i18n] missing "${key}" for "${lang}"`);
    value = lookup(DICTIONARIES.en, key);
  }
  if (typeof value !== 'string') return key;
  return vars ? value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`)) : value;
}
