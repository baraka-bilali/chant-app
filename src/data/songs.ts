import { lyricsPreview } from '@/lib/lyrics';
import { normalizeText } from '@/lib/text';

import raw from './A-S.json';

export type Song = {
  /** Stable URL-safe id (from the VideoPsalm Guid) — used by playlists and routes. */
  id: string;
  number: number;
  /** Full title as in the songbook, e.g. "4. DANS MON AME J'AI L'ASSURANCE". */
  title: string;
  /** Title without the leading number. */
  name: string;
  lyrics: string;
  preview: string;
  /** Normalized title + lyrics, used by the search. */
  search: string;
};

/** Songs of the "Chants d'ensemble" collection (generated from VideoPsalm, see scripts/). */
export const ensembleSongs: Song[] = raw.Songs.map((s) => ({
  // Guid is base64 ("+" and "/" are unsafe in URLs): convert to base64url.
  id: s.Guid.replace(/\+/g, '-').replace(/\//g, '_'),
  number: s.Number,
  title: s.Title,
  name: s.Title.replace(/^\d+\.\s*/, ''),
  lyrics: s.Lyrics,
  preview: lyricsPreview(s.Lyrics),
  search: normalizeText(`${s.Title} ${s.Lyrics}`),
}));

/** Filters a list of songs by number (digits only) or by title and lyrics (accent-insensitive). */
export function searchSongs(query: string, list: Song[]): Song[] {
  const q = query.trim();
  if (!q) return list;
  // Typing a number jumps to that song number instead of matching "1." in every lyrics.
  if (/^\d+$/.test(q)) return list.filter((s) => String(s.number).startsWith(q));
  const needle = normalizeText(q);
  return list.filter((s) => s.search.includes(needle));
}
