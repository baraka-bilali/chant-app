import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { HeaderActions } from '@/components/header-actions';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

export default function TabLayout() {
  const theme = useTheme();
  const { t } = useI18n();

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
          title: t('tabs.collections'),
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="library" size={size} color={focused ? theme.accent : theme.muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="playlists"
        options={{
          title: t('tabs.playlists'),
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="list" size={size} color={focused ? theme.accent : theme.muted} />
          ),
        }}
      />
    </Tabs>
  );
}
