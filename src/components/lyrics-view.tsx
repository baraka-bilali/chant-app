import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { parseLyrics } from '@/lib/lyrics';

export function LyricsView({ lyrics }: { lyrics: string }) {
  const theme = useTheme();
  const { t } = useI18n();
  const { fontSize } = useApp();
  const blocks = parseLyrics(lyrics);
  const text = { fontSize, lineHeight: Math.round(fontSize * 1.55) };

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        if (block.kind === 'chorus') {
          return (
            <View
              key={index}
              style={[styles.chorus, { backgroundColor: theme.chorusBackground, borderLeftColor: theme.accent }]}>
              <Text style={[styles.chorusLabel, { color: theme.accent }]}>{t('song.chorus')}</Text>
              <Text style={[text, styles.chorusText, { color: theme.text }]}>{block.text}</Text>
            </View>
          );
        }
        if (block.kind === 'verse') {
          return (
            <View key={index} style={styles.verse}>
              <Text style={[styles.verseNumber, text, { width: Math.round(fontSize * 1.5), color: theme.accent }]}>
                {block.number}
              </Text>
              <Text style={[text, styles.verseText, { color: theme.text }]}>{block.text}</Text>
            </View>
          );
        }
        return (
          <Text key={index} style={[text, { color: theme.text }]}>
            {block.text}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  verse: { flexDirection: 'row', gap: Spacing.two },
  verseNumber: { fontWeight: '800' },
  verseText: { flex: 1 },
  chorus: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  chorusLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  chorusText: { fontStyle: 'italic', fontWeight: '600' },
});
