import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSizeControls } from '@/components/font-size-controls';
import { LyricsView } from '@/components/lyrics-view';
import { PlaylistPicker } from '@/components/playlist-picker';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { songsById } from '@/data/collections';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

export default function SongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { isFavorite, toggleFavorite } = useApp();
  const [pickerOpen, setPickerOpen] = useState(false);
  const song = songsById.get(id);

  if (!song) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.muted }}>{t('song.notFound')}</Text>
      </View>
    );
  }

  const favorite = isFavorite(song.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: String(song.number),
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={favorite ? t('song.favoriteRemove') : t('song.favoriteAdd')}
              accessibilityState={{ selected: favorite }}
              hitSlop={10}
              onPress={() => toggleFavorite(song.id)}
              style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
              <Ionicons name={favorite ? 'bookmark' : 'bookmark-outline'} size={24} color={favorite ? theme.accent : theme.text} />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}>
        <Text style={[styles.title, { color: theme.text }]}>{song.name}</Text>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPickerOpen(true)}
            style={[styles.button, { backgroundColor: theme.accent }]}>
            <Ionicons name="add-circle-outline" size={20} color={theme.onAccent} />
            <Text style={[styles.buttonText, { color: theme.onAccent }]}>{t('song.addToPlaylist')}</Text>
          </Pressable>
          <FontSizeControls />
        </View>

        <LyricsView lyrics={song.lyrics} />
      </ScrollView>
      <PlaylistPicker visible={pickerOpen} songId={song.id} onClose={() => setPickerOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.three, gap: Spacing.three },
  title: { fontSize: 24, fontWeight: '800', lineHeight: 30 },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 999,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
  },
  buttonText: { fontWeight: '700' },
});
