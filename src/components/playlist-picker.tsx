import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

type Props = { visible: boolean; songId: string; onClose: () => void };

export function PlaylistPicker({ visible, songId, onClose }: Props) {
  const theme = useTheme();
  const { t, plural } = useI18n();
  const { playlists, createPlaylist, addSong, removeSong } = useApp();
  const [name, setName] = useState('');

  const createAndAdd = () => {
    const id = createPlaylist(name);
    if (!id) return;
    addSong(id, songId);
    setName('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('common.close')} />
        <View style={[styles.sheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{t('picker.title')}</Text>
            <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel={t('common.close')}>
              <Ionicons name="close" size={26} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {playlists.length === 0 && (
              <Text style={[styles.empty, { color: theme.muted }]}>{t('picker.none')}</Text>
            )}
            {playlists.map((p) => {
              const included = p.songIds.includes(songId);
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: included }}
                  onPress={() => (included ? removeSong(p.id, songId) : addSong(p.id, songId))}
                  style={[styles.row, { borderBottomColor: theme.border }]}>
                  <View style={styles.flex}>
                    <Text style={[styles.rowTitle, { color: theme.text }]}>{p.name}</Text>
                    <Text style={[styles.rowSub, { color: theme.muted }]}>
                      {plural('playlists.songs', p.songIds.length)}
                    </Text>
                  </View>
                  <Ionicons
                    name={included ? 'checkmark-circle' : 'ellipse-outline'}
                    size={26}
                    color={included ? theme.accent : theme.muted}
                  />
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.createRow}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('picker.new')}
              placeholderTextColor={theme.muted}
              onSubmitEditing={createAndAdd}
              returnKeyType="done"
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
            />
            <Pressable
              accessibilityRole="button"
              onPress={createAndAdd}
              disabled={!name.trim()}
              style={[styles.button, { backgroundColor: theme.accent, opacity: name.trim() ? 1 : 0.4 }]}>
              <Text style={[styles.buttonText, { color: theme.onAccent }]}>{t('picker.createAdd')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    maxHeight: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  list: { flexGrow: 0 },
  empty: { paddingVertical: Spacing.three },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  rowSub: { fontSize: 12 },
  createRow: { flexDirection: 'row', gap: Spacing.two },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
  },
  button: { borderRadius: 10, paddingHorizontal: Spacing.three, justifyContent: 'center' },
  buttonText: { fontWeight: '700' },
});
