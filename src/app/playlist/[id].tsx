import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { SongRow } from '@/components/song-row';
import { Spacing } from '@/constants/theme';
import { songsById } from '@/data/collections';
import type { Song } from '@/data/songs';
import { useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { confirmAction } from '@/lib/confirm';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useI18n();
  const { playlists, removeSong, deletePlaylist } = useApp();
  const playlist = playlists.find((p) => p.id === id);

  const openSong = useCallback(
    (songId: string) => router.push({ pathname: '/song/[id]', params: { id: songId } }),
    [router],
  );
  const onRemove = useCallback((songId: string) => removeSong(id, songId), [removeSong, id]);

  if (!playlist) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.muted }}>{t('playlists.notFound')}</Text>
      </View>
    );
  }

  const songs = playlist.songIds.flatMap((songId): Song[] => {
    const song = songsById.get(songId);
    return song ? [song] : [];
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: playlist.name,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('playlists.deleteTitle')}
              hitSlop={8}
              onPress={() =>
                confirmAction(
                  t('playlists.deleteTitle'),
                  t('playlists.deleteText', { name: playlist.name }),
                  t('common.delete'),
                  t('common.cancel'),
                  () => {
                    router.back();
                    deletePlaylist(playlist.id);
                  },
                )
              }>
              <Ionicons name="trash-outline" size={22} color={theme.danger} />
            </Pressable>
          ),
        }}
      />
      <FlatList
        data={songs}
        keyExtractor={(song) => song.id}
        renderItem={({ item }) => <SongRow song={item} onPress={openSong} onRemove={onRemove} />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            {t('playlists.empty')}
          </Text>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', padding: Spacing.five },
});
