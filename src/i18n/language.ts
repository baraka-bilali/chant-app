import { getLocales } from 'expo-localization';

export type Language = 'fr' | 'en' | 'ln';

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ln', label: 'Lingala' },
];

export function isLanguage(value: unknown): value is Language {
  return value === 'fr' || value === 'en' || value === 'ln';
}

/** First launch: follow the phone language when supported, otherwise French. */
export function detectLanguage(): Language {
  try {
    const code = getLocales()[0]?.languageCode;
    if (isLanguage(code)) return code;
  } catch {
    // Locale unavailable: fall back to French.
  }
  return 'fr';
}
