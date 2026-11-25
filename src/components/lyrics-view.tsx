import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseLyrics } from '@/lib/lyrics';

export function LyricsView({ lyrics }: { lyrics: string }) {
  const theme = useTheme();
  const blocks = parseLyrics(lyrics);

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        if (block.kind === 'chorus') {
          return (
            <View
              key={index}
              style={[styles.chorus, { backgroundColor: theme.chorusBackground, borderLeftColor: theme.accent }]}>
              <Text style={[styles.chorusLabel, { color: theme.accent }]}>Refrain</Text>
              <Text style={[styles.text, styles.chorusText, { color: theme.text }]}>{block.text}</Text>
            </View>
          );
        }
        if (block.kind === 'verse') {
          return (
            <View key={index} style={styles.verse}>
              <Text style={[styles.verseNumber, { color: theme.accent }]}>{block.number}</Text>
              <Text style={[styles.text, styles.verseText, { color: theme.text }]}>{block.text}</Text>
            </View>
          );
        }
        return (
          <Text key={index} style={[styles.text, { color: theme.text }]}>
            {block.text}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  verse: { flexDirection: 'row', gap: Spacing.three },
  verseNumber: { width: 24, fontSize: 18, fontWeight: '800', lineHeight: 28 },
  verseText: { flex: 1 },
  text: { fontSize: 18, lineHeight: 28 },
  chorus: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  chorusLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  chorusText: { fontStyle: 'italic', fontWeight: '600' },
});
