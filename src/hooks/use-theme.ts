import { useColorScheme } from 'react-native';

import { Colors, type ThemeColors } from '@/constants/theme';

export function useTheme(): ThemeColors {
  return useColorScheme() === 'light' ? Colors.light : Colors.dark;
}
