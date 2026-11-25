import { Ionicons } from '@expo/vector-icons';
import { Pressable, useColorScheme } from 'react-native';

import { useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';

export function ThemeToggle() {
  const { toggleTheme } = useApp();
  const theme = useTheme();
  const isLight = useColorScheme() === 'light';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isLight ? 'Passer au thème sombre' : 'Passer au thème clair'}
      hitSlop={8}
      onPress={toggleTheme}
      style={{ paddingHorizontal: 12 }}>
      <Ionicons name={isLight ? 'moon-outline' : 'sunny-outline'} size={24} color={theme.text} />
    </Pressable>
  );
}
