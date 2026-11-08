import { registerLocaleData } from '@angular/common';

// localStorage keys
export const STORAGE_LANGUAGE = 'language';        // the language the user chose
export const STORAGE_DIRECTION = 'language-dir';   // the direction of the language in use, read by the script in index.html before the first paint

// Angular's own number / date formats per language. Languages not listed here use the English formats.
// (Texts, plurals and numbers inside translations are formatted by i18next, from the browser's Intl.)
export const ANGULAR_LOCALES: Record<string, () => Promise<{ default: any }>> = {
  he: () => import('@angular/common/locales/he'),
  yi: () => import('@angular/common/locales/yi'),
};

export const BOOTSTRAP_CSS = {
  ltr: 'assets/bootstrap/bootstrap.min.css',
  rtl: 'assets/bootstrap/bootstrap.rtl.min.css'
};

/** The languages to try, best first: the saved choice, then the browser's. */
export function preferredLanguages(): string[] {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_LANGUAGE);
  }
  catch { /* storage blocked */ }
  return [saved, ...(navigator.languages ?? [navigator.language])].filter((l): l is string => !!l);
}

/**
 * The LOCALE_ID, known before anything is loaded: the first preferred language Angular has formats for.
 * Pipes need it when they are created, so it is not waiting for the server's list of languages.
 */
export function initialLocaleId(): string {
  for (const tag of preferredLanguages()) {
    const base = tag.split('-')[0].toLowerCase();
    if (base in ANGULAR_LOCALES) return base;
    if (base === 'en') return 'en-US';
  }
  return 'en-US';
}

/** Registers Angular's formats for the LOCALE_ID, before the first page is shown. */
export async function registerInitialLocale(): Promise<void> {
  const loader = ANGULAR_LOCALES[initialLocaleId()];
  if (loader) {
    registerLocaleData((await loader()).default);
  }
}
