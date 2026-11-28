import { searchKey } from '@/lib/search';

import raw from './A-S.json';

export type Song = {
  /** Stable URL-safe id (from the VideoPsalm Guid) — used by playlists and routes. */
  id: string;
  number: number;
  /** Song name as written in VideoPsalm (normal case), e.g. "Dans mon âme". */
  name: string;
  lyrics: string;
  /** Normalized name and lyrics used by the search (see lib/search.ts). */
  nameKey: string;
  lyricsKey: string;
};

/** Songs of the "Chants d'ensemble" collection (generated from VideoPsalm, see scripts/). */
export const ensembleSongs: Song[] = raw.Songs.map((s) => ({
  // Guid is base64 ("+" and "/" are unsafe in URLs): convert to base64url.
  id: s.Guid.replace(/\+/g, '-').replace(/\//g, '_'),
  number: s.Number,
  name: s.Name,
  lyrics: s.Lyrics,
  nameKey: searchKey(s.Name),
  lyricsKey: searchKey(s.Lyrics),
}));
