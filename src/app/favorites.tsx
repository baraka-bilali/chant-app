import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { SongRow } from '@/components/song-row';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { songsById } from '@/data/collections';
import type { Song } from '@/data/songs';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

/** The songs marked with the bookmark, most recent first. */
export default function FavoritesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useI18n();
  const { favorites, toggleFavorite } = useApp();

  const songs = [...favorites].reverse().flatMap((id): Song[] => {
    const song = songsById.get(id);
    return song ? [song] : [];
  });

  const openSong = useCallback(
    (songId: string) => router.push({ pathname: '/song/[id]', params: { id: songId } }),
    [router],
  );

  return (
    <>
      <Stack.Screen options={{ title: t('favorites.title') }} />
      <FlatList
        data={songs}
        keyExtractor={(song) => song.id}
        renderItem={({ item }) => <SongRow song={item} onPress={openSong} onRemove={toggleFavorite} />}
        contentContainerStyle={songs.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.icon, { backgroundColor: theme.chorusBackground }]}>
              <Ionicons name="bookmark-outline" size={40} color={theme.accent} />
            </View>
            <Text style={[styles.emptyText, { color: theme.muted }]}>{t('favorites.empty')}</Text>
          </View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
  empty: { alignItems: 'center', gap: Spacing.three, padding: Spacing.four },
  icon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 380 },
});
