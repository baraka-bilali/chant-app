import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CONTACT, hasContact } from '@/constants/contact';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';


/** Buttons to email or WhatsApp the team; renders a short note when no contact is configured. */
export function ContactButtons() {
  const theme = useTheme();
  const { t } = useI18n();
  const subject = `Recueil CMI ${Constants.expoConfig?.version ?? ''} — ${t('contact.subject')}`.trim();

  if (!hasContact) {
    return (
      <Text style={[styles.note, { color: theme.muted }]}>
        {t('contact.soon')}
      </Text>
    );
  }

  return (
    <View style={styles.row}>
      {CONTACT.whatsapp ? (
        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(subject)}`)}
          style={({ pressed }) => [styles.button, { backgroundColor: '#16a34a' }, pressed && styles.pressed]}>
          <Ionicons name="logo-whatsapp" size={20} color="#ffffff" />
          <Text style={styles.label}>{t('contact.whatsapp')}</Text>
        </Pressable>
      ) : null}
      {CONTACT.email ? (
        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(`mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`)}
          style={({ pressed }) => [styles.button, { backgroundColor: theme.accent }, pressed && styles.pressed]}>
          <Ionicons name="mail-outline" size={20} color={theme.onAccent} />
          <Text style={[styles.label, { color: theme.onAccent }]}>{t('contact.email')}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, justifyContent: 'center' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 999,
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.four,
    minHeight: 44,
  },
  pressed: { opacity: 0.7 },
  label: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  note: { fontSize: 14, textAlign: 'center' },
});
