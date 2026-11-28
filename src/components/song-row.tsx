import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { Song } from '@/data/songs';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

type Props = {
  song: Song;
  onPress: (songId: string) => void;
  /** Optional action shown on the right (e.g. remove from playlist). */
  onRemove?: (songId: string) => void;
};

/** One line per song: its number and its name (one single title, normal case). */
export const SongRow = memo(function SongRow({ song, onPress, onRemove }: Props) {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => onPress(song.id)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}>
        <View style={styles.number}>
          <Text style={[styles.numberText, { color: theme.accent }]} numberOfLines={1} adjustsFontSizeToFit>
            {song.number}
          </Text>
        </View>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {song.name}
        </Text>
      </Pressable>
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('playlists.removeSong', { name: song.name })}
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
    minHeight: 60,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
  },
  pressed: { opacity: 0.6 },
  number: { width: 44, alignItems: 'flex-start' },
  numberText: { fontSize: 17, fontWeight: '800' },
  title: { flex: 1, fontSize: 17, lineHeight: 23, fontWeight: '500' },
  remove: { paddingRight: Spacing.three },
});
