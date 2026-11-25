import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { SongRow } from '@/components/song-row';
import { Spacing } from '@/constants/theme';
import { searchSongs, type Song } from '@/data/songs';
import { useTheme } from '@/hooks/use-theme';

export default function SongsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => searchSongs(deferredQuery), [deferredQuery]);

  const openSong = useCallback(
    (id: string) => router.push({ pathname: '/song/[id]', params: { id } }),
    [router],
  );
  const renderItem = useCallback(
    ({ item }: { item: Song }) => <SongRow song={item} onPress={openSong} />,
    [openSong],
  );

  return (
    <View style={styles.container}>
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
});
