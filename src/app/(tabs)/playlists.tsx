import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';

export default function PlaylistsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { playlists, createPlaylist, deletePlaylist } = useApp();
  const [name, setName] = useState('');

  const create = () => {
    if (createPlaylist(name)) setName('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.createRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nom de la playlist"
          placeholderTextColor={theme.muted}
          onSubmitEditing={create}
          returnKeyType="done"
          style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
        />
        <Pressable
          accessibilityRole="button"
          onPress={create}
          disabled={!name.trim()}
          style={[styles.button, { backgroundColor: theme.accent, opacity: name.trim() ? 1 : 0.4 }]}>
          <Text style={[styles.buttonText, { color: theme.onAccent }]}>Créer</Text>
        </Pressable>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(p) => p.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.muted }]}>Aucune playlist</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/playlist/[id]', params: { id: item.id } })}
              style={({ pressed }) => [styles.cardMain, pressed && { opacity: 0.6 }]}>
              <View style={styles.flex}>
                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.cardSub, { color: theme.muted }]}>
                  {item.songIds.length} chant{item.songIds.length > 1 ? 's' : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.muted} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Supprimer la playlist ${item.name}`}
              hitSlop={8}
              onPress={() =>
                confirmAction('Supprimer la playlist', `Supprimer « ${item.name} » ?`, 'Supprimer', () =>
                  deletePlaylist(item.id),
                )
              }
              style={styles.delete}>
              <Ionicons name="trash-outline" size={22} color={theme.danger} />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  createRow: { flexDirection: 'row', gap: Spacing.two, padding: Spacing.three },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 4,
    fontSize: 16,
  },
  button: { borderRadius: 12, paddingHorizontal: Spacing.four, justifyContent: 'center' },
  buttonText: { fontWeight: '700', fontSize: 16 },
  list: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.four, gap: Spacing.two },
  empty: { textAlign: 'center', padding: Spacing.five },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
  cardMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.three },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { fontSize: 13, marginTop: 2 },
  delete: { paddingRight: Spacing.three },
});
