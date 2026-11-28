import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';
import { LANGUAGES, useI18n } from '@/i18n';

/** Bottom sheet to pick the interface language. */
export function LanguageSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const { t, language } = useI18n();
  const { setLanguage } = useApp();

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.flex}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('common.close')} />
        <View style={[styles.sheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{t('language.title')}</Text>
            <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel={t('common.close')}>
              <Ionicons name="close" size={26} color={theme.text} />
            </Pressable>
          </View>

          {LANGUAGES.map((l) => {
            const selected = l.code === language;
            return (
              <Pressable
                key={l.code}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  setLanguage(l.code);
                  onClose();
                }}
                style={[styles.row, { borderBottomColor: theme.border }]}>
                <Text style={[styles.rowText, { color: theme.text, fontWeight: selected ? '800' : '500' }]}>{l.label}</Text>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={24}
                  color={selected ? theme.accent : theme.muted}
                />
              </Pressable>
            );
          })}
          <Text style={[styles.note, { color: theme.muted }]}>{t('language.note')}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    paddingBottom: Spacing.five,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.two },
  title: { fontSize: 18, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: { fontSize: 17 },
  note: { fontSize: 13, marginTop: Spacing.three, lineHeight: 18 },
});
