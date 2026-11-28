import type { Song } from '@/data/songs';

/**
 * Search key: lower case, no accents, apostrophes removed ("I'll" -> "ill"), every other symbol becomes a
 * space. A leading and a trailing space let us test "a word starts with X" with a plain `includes(' X')`.
 */
export function searchKey(value: string): string {
  const cleaned = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/[’'`´]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return ` ${cleaned} `;
}

function queryWords(query: string): string[] {
  return searchKey(query).trim().split(' ').filter(Boolean);
}

/** True when every typed word is the beginning of a word of the text (VideoPsalm behaviour). */
function matchesAllWords(key: string, words: string[]): boolean {
  return words.every((w) => key.includes(` ${w}`));
}

export type SearchResult = {
  /** Main results: songs whose title matches, otherwise songs whose lyrics match. */
  songs: Song[];
  /** Songs that only match in their lyrics, offered on demand when the title matched. */
  moreInLyrics: Song[];
  /** True when no title matched and `songs` come from the lyrics. */
  fromLyrics: boolean;
};

const all = (songs: Song[]): SearchResult => ({ songs, moreInLyrics: [], fromLyrics: false });

/**
 * "Title, then lyrics" search, like VideoPsalm:
 * - digits only: songs by number;
 * - otherwise every typed word must begin a word of the title;
 * - only when no title matches, the lyrics are searched.
 */
export function searchSongs(query: string, list: Song[]): SearchResult {
  const q = query.trim();
  if (!q) return all(list);

  if (/^\d+$/.test(q)) {
    const byNumber = list.filter((s) => String(s.number).startsWith(q));
    byNumber.sort((a, b) => Number(String(b.number) === q) - Number(String(a.number) === q) || a.number - b.number);
    return all(byNumber);
  }

  const words = queryWords(q);
  if (words.length === 0) return all(list);
  const phrase = ` ${words.join(' ')}`;

  const titleMatches = list
    .filter((s) => matchesAllWords(s.nameKey, words))
    .map((s) => ({ s, rank: s.nameKey.startsWith(phrase) ? 0 : s.nameKey.includes(phrase) ? 1 : 2 }))
    .sort((a, b) => a.rank - b.rank || a.s.number - b.s.number)
    .map((m) => m.s);

  const lyricsMatches = list.filter((s) => matchesAllWords(s.lyricsKey, words));

  if (titleMatches.length > 0) {
    const inTitle = new Set(titleMatches.map((s) => s.id));
    return {
      songs: titleMatches,
      moreInLyrics: lyricsMatches.filter((s) => !inTitle.has(s.id)),
      fromLyrics: false,
    };
  }
  return { songs: lyricsMatches, moreInLyrics: [], fromLyrics: lyricsMatches.length > 0 };
}
