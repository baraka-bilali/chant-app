import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AppProvider, useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { ready, onboardingDone } = useApp();
  const theme = useTheme();
  const isLight = useColorScheme() === 'light';

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

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
      <Stack>
        {/* First launch: only the welcome screens are reachable until they are completed or skipped. */}
        <Stack.Protected guard={!onboardingDone} redirectTo="/">
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        </Stack.Protected>
        <Stack.Protected guard={onboardingDone} redirectTo="/onboarding">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="collection/[id]" options={{ title: '', headerBackTitle: 'Retour' }} />
          <Stack.Screen name="song/[id]" options={{ title: '', headerBackTitle: 'Retour' }} />
          <Stack.Screen name="playlist/[id]" options={{ title: 'Playlist', headerBackTitle: 'Retour' }} />
          <Stack.Screen name="info" options={{ title: 'À propos', headerBackTitle: 'Retour' }} />
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
