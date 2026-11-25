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
};

const PLAYLISTS_KEY = 'chant_playlists_v2';
const THEME_KEY = 'theme_pref';

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
        const [storedPlaylists, storedTheme] = await Promise.all([
          AsyncStorage.getItem(PLAYLISTS_KEY),
          AsyncStorage.getItem(THEME_KEY),
        ]);
        if (cancelled) return;
        if (storedPlaylists) update(() => sanitizePlaylists(JSON.parse(storedPlaylists)));
        if (storedTheme === 'light' || storedTheme === 'dark') Appearance.setColorScheme(storedTheme);
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

  const value = useMemo(
    () => ({ ready, playlists, createPlaylist, deletePlaylist, addSong, removeSong, toggleTheme }),
    [ready, playlists, createPlaylist, deletePlaylist, addSong, removeSong, toggleTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
