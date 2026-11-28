import { ensembleSongs, type Song } from './songs';

export type Collection = {
  /** Used in the route: /collection/<id>. */
  id: string;
  title: string;
  songs: Song[];
  /** Cover colours (gradient from → to) and the colour of the frame. */
  cover: { from: string; to: string; frame: string };
  /** True while the collection has no songs yet. */
  comingSoon: boolean;
};

/**
 * The songbooks shown on the home screen, in display order.
 * To add songs to "Recueil Chorale Tome 1", fill `songs` and set `comingSoon` to false.
 */
export const collections: Collection[] = [
  {
    id: 'chants-ensemble',
    title: 'Chants d’ensemble',
    songs: ensembleSongs,
    cover: { from: '#2563eb', to: '#0b1e5c', frame: '#bfdbfe' },
    comingSoon: false,
  },
  {
    id: 'chorale-tome-1',
    title: 'Recueil Chorale Tome 1',
    songs: [],
    cover: { from: '#0d9488', to: '#0b3b36', frame: '#fde68a' },
    comingSoon: true,
  },
];

export function getCollection(id: string | undefined): Collection | undefined {
  return collections.find((c) => c.id === id);
}

/** Every song of every collection (used by playlists, deep links and the totals). */
export const allSongs: Song[] = collections.flatMap((c) => c.songs);
export const songsById = new Map(allSongs.map((s) => [s.id, s]));
