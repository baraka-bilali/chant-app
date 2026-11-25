import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { Song } from '@/data/songs';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  song: Song;
  onPress: (songId: string) => void;
  /** Optional action shown on the right (e.g. remove from playlist). */
  onRemove?: (songId: string) => void;
};

export const SongRow = memo(function SongRow({ song, onPress, onRemove }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => onPress(song.id)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}>
        <View style={[styles.badge, { backgroundColor: theme.chorusBackground }]}>
          <Text style={[styles.badgeText, { color: theme.accent }]} numberOfLines={1} adjustsFontSizeToFit>
            {song.number}
          </Text>
        </View>
        <View style={styles.texts}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {song.name}
          </Text>
          <Text style={[styles.preview, { color: theme.muted }]} numberOfLines={1}>
            {song.preview}
          </Text>
        </View>
      </Pressable>
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Retirer ${song.name} de la playlist`}
          hitSlop={8}
          onPress={() => onRemove(song.id)}
          style={styles.remove}>
          <Ionicons name="close-circle-outline" size={24} color={theme.danger} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.three,
  },
  pressed: { opacity: 0.6 },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 15, fontWeight: '700' },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: '600' },
  preview: { fontSize: 13 },
  remove: { paddingRight: Spacing.three },
});
