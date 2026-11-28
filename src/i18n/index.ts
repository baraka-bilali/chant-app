import { useApp } from '@/context/app-context';

import { en, fr, ln, type Dictionary, type TranslationKey } from './dictionaries';
import type { Language } from './language';

export { LANGUAGES, detectLanguage, isLanguage, type Language } from './language';

const dictionaries: Record<Language, Dictionary> = { fr, en, ln };

export type TFunction = (key: TranslationKey, params?: Record<string, string | number>) => string;

export function makeT(language: Language): TFunction {
  const dict = dictionaries[language];
  return (key, params) => {
    let text: string = dict[key] ?? fr[key];
    if (params) {
      for (const [name, value] of Object.entries(params)) text = text.split(`{${name}}`).join(String(value));
    }
    return text;
  };
}

type PluralBase = 'collections.songs' | 'playlists.songs';

/** Plural helper: uses "<base>.one" or "<base>.other" depending on the language rules. */
function pluralKey(language: Language, base: PluralBase, n: number): TranslationKey {
  const one = language === 'en' ? n === 1 : n <= 1;
  return `${base}.${one ? 'one' : 'other'}`;
}

/** Translation hook: returns t(), a plural helper and the current language. */
export function useI18n() {
  const { language } = useApp();
  const t = makeT(language);
  return {
    t,
    language,
    plural: (base: PluralBase, n: number) => t(pluralKey(language, base, n), { n }),
  };
}
