import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/hooks/use-theme';

/** Header buttons of the main tabs: info + light/dark theme. */
export function HeaderActions() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="À propos de l'application"
        hitSlop={8}
        onPress={() => router.push('/info')}
        style={{ paddingHorizontal: 4 }}>
        <Ionicons name="information-circle-outline" size={26} color={theme.text} />
      </Pressable>
      <ThemeToggle />
    </View>
  );
}
