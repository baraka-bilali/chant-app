import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

const DISMISSED_KEY = 'install_hint_dismissed';

/** True on iPhone/iPad Safari when the app has not been added to the home screen yet. */
function shouldShow(): boolean {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const standalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches);
  return isIOS && !standalone;
}

/** Explains how to install the web app on an iPhone (Safari has no install button). */
export function InstallHint() {
  const theme = useTheme();
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShow()) return;
    AsyncStorage.getItem(DISMISSED_KEY)
      .then((value) => setVisible(value !== '1'))
      .catch(() => setVisible(true));
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    AsyncStorage.setItem(DISMISSED_KEY, '1').catch(() => {});
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.chorusBackground, borderColor: theme.accent }]}>
      <Ionicons name="phone-portrait-outline" size={26} color={theme.accent} />
      <View style={styles.texts}>
        <Text style={[styles.title, { color: theme.text }]}>{t('install.title')}</Text>
        <Text style={[styles.body, { color: theme.muted }]}>
          {t('install.text').split('{icon}')[0]}
          <Ionicons name="share-outline" size={14} color={theme.accent} />
          {t('install.text').split('{icon}')[1]}
        </Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} hitSlop={10} onPress={dismiss}>
        <Ionicons name="close" size={22} color={theme.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
  },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '800' },
  body: { fontSize: 13, lineHeight: 19 },
});
