import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AppProvider, useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { ready, onboardingDone } = useApp();
  const theme = useTheme();
  const { t } = useI18n();
  const isLight = useColorScheme() === 'light';

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Paint the native window / page behind the screens with the app theme, so no white shows
  // through while screens slide in or out (the cause of the white flashes in dark mode).
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background).catch(() => {});
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.style.backgroundColor = theme.background;
      document.body.style.backgroundColor = theme.background;
    }
  }, [theme.background]);

  if (!ready) return null;

  const base = isLight ? DefaultTheme : DarkTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.accent,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isLight ? 'dark' : 'light'} />
      <Stack screenOptions={{ contentStyle: { backgroundColor: theme.background } }}>
        {/* First launch: only the welcome screens are reachable until they are completed or skipped. */}
        <Stack.Protected guard={!onboardingDone} redirectTo="/">
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        </Stack.Protected>
        <Stack.Protected guard={onboardingDone} redirectTo="/onboarding">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="collection/[id]" options={{ title: '', headerBackTitle: t('common.back') }} />
          <Stack.Screen name="numbers/[id]" options={{ title: t('numbers.title'), headerBackTitle: t('common.back') }} />
          <Stack.Screen name="song/[id]" options={{ title: '', headerBackTitle: t('common.back') }} />
          <Stack.Screen name="playlist/[id]" options={{ title: t('playlists.title'), headerBackTitle: t('common.back') }} />
          <Stack.Screen name="favorites" options={{ title: t('favorites.title'), headerBackTitle: t('common.back') }} />
          <Stack.Screen name="info" options={{ title: t('info.title'), headerBackTitle: t('common.back') }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <Navigator />
    </AppProvider>
  );
}
