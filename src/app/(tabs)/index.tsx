import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { CollectionCover } from '@/components/collection-cover';
import { Spacing } from '@/constants/theme';
import { collections } from '@/data/collections';
import { useTheme } from '@/hooks/use-theme';

const GAP = Spacing.four;
const PADDING = Spacing.three + 4;

/** Home screen: the songbooks, shown as book covers. */
export default function CollectionsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const columns = width >= 900 ? 4 : width >= 640 ? 3 : 2;
  const available = Math.min(width, 1100) - PADDING * 2;
  const coverWidth = Math.floor((available - GAP * (columns - 1)) / columns);

  const open = useCallback(
    (id: string) => router.push({ pathname: '/collection/[id]', params: { id } }),
    [router],
  );

  return (
    <ScrollView contentContainerStyle={[styles.content, { padding: PADDING }]}>
      <Text style={[styles.intro, { color: theme.muted }]}>Choisissez un recueil</Text>
      <View style={[styles.grid, { gap: GAP, maxWidth: 1100 }]}>
        {collections.map((c) => (
          <View key={c.id} style={{ width: coverWidth }}>
            <CollectionCover collection={c} width={coverWidth} onPress={open} />
            <Text style={[styles.count, { color: c.comingSoon ? theme.muted : theme.text }]}>
              {c.comingSoon ? 'Bientôt disponible' : `${c.songs.length} chants`}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', paddingBottom: Spacing.five },
  intro: { alignSelf: 'flex-start', fontSize: 14, marginBottom: Spacing.three, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  count: { marginTop: Spacing.three, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
