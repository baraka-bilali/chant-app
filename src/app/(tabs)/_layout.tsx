import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        headerRight: () => <ThemeToggle />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chants',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="musical-notes" size={size} color={focused ? theme.accent : theme.muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="playlists"
        options={{
          title: 'Playlists',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="list" size={size} color={focused ? theme.accent : theme.muted} />
          ),
        }}
      />
    </Tabs>
  );
}
