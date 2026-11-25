import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { FONT_MAX, FONT_MIN, useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';

/** "A-" / "A+" buttons to shrink or enlarge the lyrics text. */
export function FontSizeControls() {
  const theme = useTheme();
  const { fontSize, increaseFont, decreaseFont } = useApp();

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Réduire la taille du texte"
        disabled={fontSize <= FONT_MIN}
        onPress={decreaseFont}
        style={[styles.button, { borderColor: theme.border, backgroundColor: theme.surface }, fontSize <= FONT_MIN && styles.disabled]}>
        <Text style={[styles.small, { color: theme.text }]}>A-</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Agrandir la taille du texte"
        disabled={fontSize >= FONT_MAX}
        onPress={increaseFont}
        style={[styles.button, { borderColor: theme.border, backgroundColor: theme.surface }, fontSize >= FONT_MAX && styles.disabled]}>
        <Text style={[styles.large, { color: theme.text }]}>A+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two },
  button: {
    minWidth: 48,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  disabled: { opacity: 0.35 },
  small: { fontSize: 14, fontWeight: '700' },
  large: { fontSize: 18, fontWeight: '700' },
});
