import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ContactButtons } from '@/components/contact-buttons';
import { InstallHint } from '@/components/install-hint';
import { SongRow } from '@/components/song-row';
import { Spacing } from '@/constants/theme';
import { getCollection } from '@/data/collections';
import { searchSongs, type Song } from '@/data/songs';
import { useTheme } from '@/hooks/use-theme';

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const collection = getCollection(id);
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const deferredQuery = useDeferredValue(query);
  const songs = collection?.songs;
  const results = useMemo(() => searchSongs(deferredQuery, songs ?? []), [deferredQuery, songs]);

  const openSong = useCallback(
    (songId: string) => router.push({ pathname: '/song/[id]', params: { id: songId } }),
    [router],
  );
  const renderItem = useCallback(
    ({ item }: { item: Song }) => <SongRow song={item} onPress={openSong} />,
    [openSong],
  );

  if (!collection) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.muted }}>Recueil introuvable.</Text>
      </View>
    );
  }

  if (collection.comingSoon) {
    return (
      <>
        <Stack.Screen options={{ title: collection.title }} />
        <View style={styles.soon}>
          <View style={[styles.soonIcon, { backgroundColor: theme.chorusBackground }]}>
            <Ionicons name="musical-notes" size={44} color={theme.accent} />
          </View>
          <Text style={[styles.soonTitle, { color: theme.text }]}>Bientôt disponible</Text>
          <Text style={[styles.soonText, { color: theme.muted }]}>
            Les chants du « {collection.title} » seront ajoutés prochainement. Une question ou une suggestion ?
          </Text>
          <ContactButtons />
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: collection.title }} />
      <InstallHint />
      <View style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.muted} />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Titre, numéro ou paroles"
          placeholderTextColor={theme.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={[styles.input, { color: theme.text }]}
        />
        {query.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Effacer la recherche"
            hitSlop={10}
            onPress={() => {
              setQuery('');
              inputRef.current?.focus();
            }}>
            <Ionicons name="close-circle" size={22} color={theme.muted} />
          </Pressable>
        )}
      </View>
      <Text style={[styles.count, { color: theme.muted }]}>
        {results.length} chant{results.length > 1 ? 's' : ''}
      </Text>
      <FlatList
        data={results}
        keyExtractor={(song) => song.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={20}
        windowSize={9}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>Aucun résultat. Modifie ta recherche.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    margin: Spacing.three,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: { flex: 1, paddingVertical: Spacing.two + 4, fontSize: 16 },
  count: { marginHorizontal: Spacing.three, marginBottom: Spacing.one, fontSize: 13 },
  empty: { textAlign: 'center', padding: Spacing.five },
  soon: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
  soonIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  soonTitle: { fontSize: 26, fontWeight: '800' },
  soonText: { fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 420 },
});
