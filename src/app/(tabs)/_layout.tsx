import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { HeaderActions } from '@/components/header-actions';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        headerRight: () => <HeaderActions />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recueils',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="library" size={size} color={focused ? theme.accent : theme.muted} />
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
