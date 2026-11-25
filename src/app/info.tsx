import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { songs } from '@/data/songs';
import { useTheme } from '@/hooks/use-theme';

const APP_VERSION = Constants.expoConfig?.version ?? '—';

export default function InfoScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Recueil CMI</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Centre Missionnaire de Pascal</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Row label="Version" value={APP_VERSION} />
        <Row label="Chants" value={String(songs.length)} last />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Copyright</Text>
        <Text style={[styles.body, { color: theme.muted }]}>
          © {new Date().getFullYear()} Centre Missionnaire de Pascal. Tous droits réservés.
        </Text>
      </View>
    </ScrollView>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.row, !last && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.body, { color: theme.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.three },
  header: { alignItems: 'center', paddingVertical: Spacing.four, gap: Spacing.one },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 15 },
  card: { borderWidth: 1, borderRadius: 14, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.three - 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', paddingTop: Spacing.two },
  body: { fontSize: 15, lineHeight: 22, paddingVertical: Spacing.two },
  value: { fontSize: 15, fontWeight: '600' },
});
