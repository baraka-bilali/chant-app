import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Modal, Platform, Pressable, Share, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LanguageSheet } from '@/components/language-sheet';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';
import { LANGUAGES, useI18n } from '@/i18n';

const WEB_URL = 'https://chant-app.vercel.app';

type IconName = ComponentProps<typeof Ionicons>['name'];
type Item = { key: string; icon: IconName; label: string; value?: string; onPress: () => void; separatorBefore?: boolean };

/** "⋮" button opening a dropdown list: language, theme, share, help, contact, about. */
export function HeaderMenu() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, language } = useI18n();
  const { toggleTheme, replayOnboarding } = useApp();
  const isLight = useColorScheme() === 'light';
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const close = () => setOpen(false);

  const shareApp = async () => {
    close();
    try {
      await Share.share({ message: `${t('share.message')} ${WEB_URL}`, url: WEB_URL });
    } catch {
      // Sharing cancelled or unavailable.
    }
  };

  const items: Item[] = [
    {
      key: 'language',
      icon: 'language',
      label: t('menu.language'),
      value: LANGUAGES.find((l) => l.code === language)?.label,
      onPress: () => {
        close();
        setLanguageOpen(true);
      },
    },
    {
      key: 'theme',
      icon: isLight ? 'moon-outline' : 'sunny-outline',
      label: isLight ? t('menu.themeLight') : t('menu.themeDark'),
      onPress: () => {
        toggleTheme();
        close();
      },
    },
    { key: 'share', icon: 'share-social-outline', label: t('menu.share'), onPress: shareApp },
    {
      key: 'help',
      icon: 'help-circle-outline',
      label: t('menu.help'),
      separatorBefore: true,
      onPress: () => {
        close();
        replayOnboarding();
      },
    },
    {
      key: 'contact',
      icon: 'call-outline',
      label: t('menu.contact'),
      onPress: () => {
        close();
        router.push('/info');
      },
    },
    {
      key: 'about',
      icon: 'information-circle-outline',
      label: t('menu.about'),
      onPress: () => {
        close();
        router.push('/info');
      },
    },
  ];

  const top = (Platform.OS === 'web' ? 0 : insets.top) + 52;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('header.menu')}
        accessibilityState={{ expanded: open }}
        hitSlop={8}
        onPress={() => setOpen(true)}
        style={styles.trigger}>
        <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel={t('common.close')} />
        <View style={[styles.menu, { top, backgroundColor: theme.surface, borderColor: theme.border }]}>
          {items.map((item) => (
            <View key={item.key}>
              {item.separatorBefore ? <View style={[styles.separator, { backgroundColor: theme.border }]} /> : null}
              <Pressable
                accessibilityRole="menuitem"
                onPress={item.onPress}
                style={({ pressed }) => [styles.item, pressed && { backgroundColor: theme.chorusBackground }]}>
                <Ionicons name={item.icon} size={24} color={theme.text} />
                <Text style={[styles.label, { color: theme.text }]} numberOfLines={1}>
                  {item.label}
                </Text>
                {item.value ? <Text style={[styles.value, { color: theme.muted }]}>{item.value}</Text> : null}
              </Pressable>
            </View>
          ))}
        </View>
      </Modal>

      <LanguageSheet visible={languageOpen} onClose={() => setLanguageOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { paddingHorizontal: 12, paddingVertical: 4 },
  menu: {
    position: 'absolute',
    right: 10,
    minWidth: 250,
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.one,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingHorizontal: Spacing.three, paddingVertical: 14 },
  label: { flex: 1, fontSize: 16, fontWeight: '600' },
  value: { fontSize: 13, fontWeight: '600' },
  separator: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.one },
});
