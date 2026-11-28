import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ContactButtons } from '@/components/contact-buttons';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { allSongs } from '@/data/collections';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

const APP_VERSION = Constants.expoConfig?.version ?? '—';

export default function InfoScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { replayOnboarding } = useApp();
  const { t } = useI18n();

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Recueil CMI</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>{t('info.subtitle')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Row label={t('info.version')} value={APP_VERSION} />
        <Row label={t('info.songs')} value={String(allSongs.length)} last />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('info.contactTitle')}</Text>
        <Text style={[styles.body, { color: theme.muted }]}>
          {t('info.contactText')}
        </Text>
        <View style={styles.contact}>
          <ContactButtons />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={replayOnboarding}
        style={({ pressed }) => [
          styles.card,
          styles.replay,
          { backgroundColor: theme.surface, borderColor: theme.border },
          pressed && { opacity: 0.7 },
        ]}>
        <Ionicons name="play-circle-outline" size={22} color={theme.accent} />
        <Text style={[styles.replayText, { color: theme.text }]}>{t('info.replay')}</Text>
      </Pressable>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('info.copyright')}</Text>
        <Text style={[styles.body, { color: theme.muted }]}>
          {t('info.copyrightText', { year: new Date().getFullYear() })}
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
  contact: { paddingBottom: Spacing.three },
  replay: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.three },
  replayText: { fontSize: 16, fontWeight: '600' },
});
