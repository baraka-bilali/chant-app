import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { HeaderMenu } from '@/components/header-menu';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

/** Header buttons of the main screens: favorites (bookmark) and the ⋮ menu. */
export function HeaderActions() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useI18n();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('header.favorites')}
        hitSlop={8}
        onPress={() => router.push('/favorites')}
        style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
        <Ionicons name="bookmark-outline" size={24} color={theme.text} />
      </Pressable>
      <HeaderMenu />
    </View>
  );
}
