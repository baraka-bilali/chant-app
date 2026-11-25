import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';

export type Playlist = { id: string; name: string; songIds: string[] };

type AppContextValue = {
  ready: boolean;
  playlists: Playlist[];
  /** Creates a playlist (or returns the id of an existing one with the same name). */
  createPlaylist: (name: string) => string | null;
  deletePlaylist: (id: string) => void;
  addSong: (playlistId: string, songId: string) => void;
  removeSong: (playlistId: string, songId: string) => void;
  toggleTheme: () => void;
  /** Lyrics font size in points, adjustable by the user and persisted. */
  fontSize: number;
  increaseFont: () => void;
  decreaseFont: () => void;
};

export const FONT_MIN = 14;
export const FONT_MAX = 34;
const FONT_STEP = 2;
const FONT_DEFAULT = 18;

const PLAYLISTS_KEY = 'chant_playlists_v2';
const THEME_KEY = 'theme_pref';
const FONT_KEY = 'font_size';

const AppContext = createContext<AppContextValue | null>(null);

function sanitizePlaylists(value: unknown): Playlist[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((p): Playlist[] => {
    if (!p || typeof p.id !== 'string' || typeof p.name !== 'string') return [];
    const songIds = Array.isArray(p.songIds) ? p.songIds.filter((s: unknown) => typeof s === 'string') : [];
    return [{ id: p.id, name: p.name, songIds }];
  });
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [fontSize, setFontSize] = useState(FONT_DEFAULT);
  // Source of truth for synchronous reads inside actions; state mirrors it for rendering.
  const playlistsRef = useRef<Playlist[]>([]);
  const scheme = useColorScheme();

  const update = useCallback((fn: (current: Playlist[]) => Playlist[]) => {
    const next = fn(playlistsRef.current);
    playlistsRef.current = next;
    setPlaylists(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storedPlaylists, storedTheme, storedFont] = await Promise.all([
          AsyncStorage.getItem(PLAYLISTS_KEY),
          AsyncStorage.getItem(THEME_KEY),
          AsyncStorage.getItem(FONT_KEY),
        ]);
        if (cancelled) return;
        if (storedPlaylists) update(() => sanitizePlaylists(JSON.parse(storedPlaylists)));
        if (storedTheme === 'light' || storedTheme === 'dark') Appearance.setColorScheme(storedTheme);
        const font = Number(storedFont);
        if (storedFont && font >= FONT_MIN && font <= FONT_MAX) setFontSize(font);
      } catch {
        // Corrupted or unavailable storage: start with an empty state.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [update]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists)).catch(() => {});
  }, [playlists, ready]);

  const createPlaylist = useCallback(
    (rawName: string) => {
      const name = rawName.trim();
      if (!name) return null;
      const existing = playlistsRef.current.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (existing) return existing.id;
      const id = newId();
      update((current) => [...current, { id, name, songIds: [] }]);
      return id;
    },
    [update],
  );

  const deletePlaylist = useCallback(
    (id: string) => update((current) => current.filter((p) => p.id !== id)),
    [update],
  );

  const addSong = useCallback(
    (playlistId: string, songId: string) =>
      update((current) =>
        current.map((p) =>
          p.id === playlistId && !p.songIds.includes(songId) ? { ...p, songIds: [...p.songIds, songId] } : p,
        ),
      ),
    [update],
  );

  const removeSong = useCallback(
    (playlistId: string, songId: string) =>
      update((current) =>
        current.map((p) => (p.id === playlistId ? { ...p, songIds: p.songIds.filter((s) => s !== songId) } : p)),
      ),
    [update],
  );

  const toggleTheme = useCallback(() => {
    const next = scheme === 'light' ? 'dark' : 'light';
    Appearance.setColorScheme(next);
    AsyncStorage.setItem(THEME_KEY, next).catch(() => {});
  }, [scheme]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(FONT_KEY, String(fontSize)).catch(() => {});
  }, [fontSize, ready]);

  const changeFont = useCallback((delta: number) => {
    setFontSize((current) => Math.min(FONT_MAX, Math.max(FONT_MIN, current + delta)));
  }, []);
  const increaseFont = useCallback(() => changeFont(FONT_STEP), [changeFont]);
  const decreaseFont = useCallback(() => changeFont(-FONT_STEP), [changeFont]);

  const value = useMemo(
    () => ({
      ready,
      playlists,
      createPlaylist,
      deletePlaylist,
      addSong,
      removeSong,
      toggleTheme,
      fontSize,
      increaseFont,
      decreaseFont,
    }),
    [ready, playlists, createPlaylist, deletePlaylist, addSong, removeSong, toggleTheme, fontSize, increaseFont, decreaseFont],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
