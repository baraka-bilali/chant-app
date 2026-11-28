import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Spacing } from '@/constants/theme';
import { getCollection } from '@/data/collections';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

type Cell = { number: number; label: string; songId: string; count: number } | null;

/** Grid of every song number of a collection (001, 002, ...): tap a number to open the song. */
export default function NumbersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useI18n();
  const { width } = useWindowDimensions();

  const columns = width >= 900 ? 8 : width >= 640 ? 6 : 4;

  const cells = useMemo<Cell[]>(() => {
    const songs = getCollection(id)?.songs ?? [];
    const byNumber = new Map<number, { songId: string; count: number }>();
    for (const s of songs) {
      const entry = byNumber.get(s.number);
      if (entry) entry.count += 1;
      else byNumber.set(s.number, { songId: s.id, count: 1 });
    }
    const numbers = [...byNumber.keys()].sort((a, b) => a - b);
    const digits = Math.max(3, String(numbers[numbers.length - 1] ?? 0).length);
    const list: Cell[] = numbers.map((n) => ({
      number: n,
      label: String(n).padStart(digits, '0'),
      ...(byNumber.get(n) as { songId: string; count: number }),
    }));
    // Pad the last row so every cell keeps the same width.
    while (list.length % columns !== 0) list.push(null);
    return list;
  }, [id, columns]);

  const open = useCallback(
    (cell: NonNullable<Cell>) => {
      if (cell.count === 1) {
        router.push({ pathname: '/song/[id]', params: { id: cell.songId } });
      } else {
        // Several songs share this number: list them in the collection screen.
        router.push({ pathname: '/collection/[id]', params: { id, q: String(cell.number) } });
      }
    },
    [router, id],
  );

  return (
    <>
      <Stack.Screen options={{ title: t('numbers.title') }} />
      <FlatList
        key={columns}
        data={cells}
        numColumns={columns}
        keyExtractor={(cell, index) => (cell ? String(cell.number) : `pad-${index}`)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={[styles.hint, { color: theme.muted }]}>{t('numbers.hint')}</Text>}
        initialNumToRender={48}
        renderItem={({ item }) =>
          item ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={String(item.number)}
              onPress={() => open(item)}
              style={({ pressed }) => [
                styles.cell,
                { backgroundColor: theme.surface, borderColor: theme.border },
                pressed && { backgroundColor: theme.chorusBackground },
              ]}>
              <Text style={[styles.number, { color: theme.text }]}>{item.label}</Text>
              {item.count > 1 ? <View style={[styles.dot, { backgroundColor: theme.accent }]} /> : null}
            </Pressable>
          ) : (
            <View style={styles.cell} />
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.two + 4, paddingBottom: Spacing.five },
  hint: { fontSize: 14, marginHorizontal: Spacing.one, marginBottom: Spacing.three },
  cell: {
    flex: 1,
    height: 56,
    margin: 4,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: { fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  dot: { position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 4 },
});
