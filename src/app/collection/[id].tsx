import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ContactButtons } from '@/components/contact-buttons';
import { HeaderActions } from '@/components/header-actions';
import { InstallHint } from '@/components/install-hint';
import { SongRow } from '@/components/song-row';
import { Spacing } from '@/constants/theme';
import { getCollection } from '@/data/collections';
import type { Song } from '@/data/songs';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { searchSongs } from '@/lib/search';

const NO_SONGS: Song[] = [];

type Row =
  | { kind: 'song'; song: Song }
  | { kind: 'notice'; text: string }
  | { kind: 'more'; text: string }
  | { kind: 'header'; text: string };

export default function CollectionScreen() {
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  const collection = getCollection(id);
  const theme = useTheme();
  const router = useRouter();
  const { t, plural } = useI18n();
  const [query, setQuery] = useState(q ?? '');
  // The query for which the "also in the lyrics" results were revealed (reset by any new query).
  const [lyricsFor, setLyricsFor] = useState<string | null>(null);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const deferredQuery = useDeferredValue(query);
  const result = useMemo(
    () => searchSongs(deferredQuery, getCollection(id)?.songs ?? NO_SONGS),
    [deferredQuery, id],
  );
  const showLyrics = lyricsFor === deferredQuery && result.moreInLyrics.length > 0;

  const openSong = useCallback(
    (songId: string) => router.push({ pathname: '/song/[id]', params: { id: songId } }),
    [router],
  );

  const rows = useMemo<Row[]>(() => {
    const list: Row[] = [];
    if (result.fromLyrics) list.push({ kind: 'notice', text: t('search.fromLyrics') });
    for (const song of result.songs) list.push({ kind: 'song', song });
    if (result.moreInLyrics.length > 0) {
      if (showLyrics) {
        list.push({ kind: 'header', text: t('search.inLyrics') });
        for (const song of result.moreInLyrics) list.push({ kind: 'song', song });
      } else {
        list.push({ kind: 'more', text: t('search.moreLyrics', { n: result.moreInLyrics.length }) });
      }
    }
    return list;
  }, [result, showLyrics, t]);

  const renderItem = useCallback(
    ({ item }: { item: Row }) => {
      if (item.kind === 'song') return <SongRow song={item.song} onPress={openSong} />;
      if (item.kind === 'more') {
        return (
          <Pressable
            accessibilityRole="button"
            onPress={() => setLyricsFor(deferredQuery)}
            style={({ pressed }) => [styles.more, { borderColor: theme.accent }, pressed && { opacity: 0.6 }]}>
            <Ionicons name="text" size={20} color={theme.accent} />
            <Text style={[styles.moreText, { color: theme.accent }]}>{item.text}</Text>
          </Pressable>
        );
      }
      return (
        <Text style={[item.kind === 'header' ? styles.header : styles.notice, { color: theme.muted }]}>{item.text}</Text>
      );
    },
    [openSong, deferredQuery, theme.accent, theme.muted],
  );

  if (!collection) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.muted }}>{t('collections.notFound')}</Text>
      </View>
    );
  }

  if (collection.comingSoon) {
    return (
      <>
        <Stack.Screen options={{ title: collection.title, headerRight: () => <HeaderActions /> }} />
        <View style={styles.soon}>
          <View style={[styles.soonIcon, { backgroundColor: theme.chorusBackground }]}>
            <Ionicons name="musical-notes" size={44} color={theme.accent} />
          </View>
          <Text style={[styles.soonTitle, { color: theme.text }]}>{t('collections.soon')}</Text>
          <Text style={[styles.soonText, { color: theme.muted }]}>
            {t('collections.soonText', { title: collection.title })}
          </Text>
          <ContactButtons />
        </View>
      </>
    );
  }

  const total = result.songs.length + (showLyrics ? result.moreInLyrics.length : 0);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: collection.title, headerRight: () => <HeaderActions /> }} />
      <InstallHint />
      <View style={styles.searchRow}>
        <View style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.muted} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder={t('search.placeholder')}
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.input, { color: theme.text }]}
          />
          {query.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('search.clear')}
              hitSlop={10}
              onPress={() => {
                setQuery('');
                inputRef.current?.focus();
              }}>
              <Ionicons name="close-circle" size={22} color={theme.muted} />
            </Pressable>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('search.numbers')}
          onPress={() => router.push({ pathname: '/numbers/[id]', params: { id: collection.id } })}
          style={({ pressed }) => [
            styles.numbersButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
            pressed && { opacity: 0.6 },
          ]}>
          <Text style={[styles.numbersText, { color: theme.accent }]}>123</Text>
        </Pressable>
      </View>
      <Text style={[styles.count, { color: theme.muted }]}>{plural('collections.songs', total)}</Text>
      <FlatList
        data={rows}
        keyExtractor={(row, index) => (row.kind === 'song' ? row.song.id : `${row.kind}-${index}`)}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={20}
        windowSize={9}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.muted }]}>{t('search.empty')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.two,
    margin: Spacing.three,
    marginBottom: Spacing.two,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: { flex: 1, paddingVertical: Spacing.two + 4, fontSize: 16 },
  numbersButton: {
    width: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numbersText: { fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  count: { marginHorizontal: Spacing.three, marginBottom: Spacing.one, fontSize: 13 },
  empty: { textAlign: 'center', padding: Spacing.five },
  notice: { marginHorizontal: Spacing.three, marginVertical: Spacing.two, fontSize: 14, fontStyle: 'italic' },
  header: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    margin: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: 14,
    borderStyle: 'dashed',
  },
  moreText: { flex: 1, fontSize: 15, fontWeight: '700' },
  soon: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
  soonIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  soonTitle: { fontSize: 26, fontWeight: '800' },
  soonText: { fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 420 },
});
