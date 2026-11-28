import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { logoSvg } from '@/constants/logo';
import type { Collection } from '@/data/collections';
import { useI18n } from '@/i18n';

type Props = {
  collection: Collection;
  width: number;
  onPress: (id: string) => void;
};

/** Book-like cover: gradient, double frame, logo and title, drawn in code (no image file). */
export const CollectionCover = memo(function CollectionCover({ collection, width, onPress }: Props) {
  const { t, plural } = useI18n();
  const { from, to, frame } = collection.cover;
  const height = Math.round((width * 7) / 5);
  // The gradient id must be unique: on web every inline SVG shares the same document ids.
  const gid = `cover-${collection.id}`;
  const background = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" preserveAspectRatio="none"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="300" height="420" fill="url(#${gid})"/><rect x="14" y="14" width="272" height="392" rx="10" fill="none" stroke="${frame}" stroke-width="3" opacity="0.75"/><rect x="24" y="24" width="252" height="372" rx="6" fill="none" stroke="${frame}" stroke-width="1.4" opacity="0.4"/></svg>`;
  const count = collection.songs.length;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${collection.title}, ${collection.comingSoon ? t('collections.soon') : plural('collections.songs', count)}`}
      onPress={() => onPress(collection.id)}
      style={({ pressed }) => [styles.wrap, { width }, pressed && styles.pressed]}>
      <View style={[styles.cover, { width, height }]}>
        <SvgXml xml={background} width="100%" height="100%" style={StyleSheet.absoluteFill} />
        <View style={[styles.logo, { top: height * 0.1, width: width * 0.62, height: width * 0.62 }]}>
          <SvgXml xml={logoSvg(from)} width="100%" height="100%" />
        </View>
        <Text
          numberOfLines={3}
          style={[styles.coverTitle, { fontSize: Math.max(13, width * 0.092), bottom: height * 0.12, paddingHorizontal: width * 0.12 }]}>
          {collection.title}
        </Text>
        {collection.comingSoon ? (
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>{t('collections.soonRibbon')}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  cover: {
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: { position: 'absolute' },
  coverTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ribbon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fbbf24',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  ribbonText: { color: '#3b2a00', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
});
