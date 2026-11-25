import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState, type ComponentProps, type ComponentRef, type ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ContactButtons } from '@/components/contact-buttons';
import { FAMILY_SVG, OFFLINE_SVG } from '@/constants/illustrations';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { songs } from '@/data/songs';
import { useTheme } from '@/hooks/use-theme';

const LANGUAGES = ['Français', 'English', 'Kiswahili', 'Lingala', 'Tshiluba', 'Kikongo'];

const TIPS: { icon: ComponentProps<typeof Ionicons>['name']; text: string }[] = [
  { icon: 'search', text: 'Cherchez un chant par numéro, titre ou paroles.' },
  { icon: 'text', text: 'A- / A+ : agrandissez le texte pour bien lire.' },
  { icon: 'list', text: 'Créez des playlists pour vos cultes et veillées.' },
  { icon: 'moon-outline', text: 'Passez en thème clair ou sombre en un geste.' },
  { icon: 'information-circle-outline', text: '« À propos » : version de l’app et contact.' },
];

type Slide = { key: string; kicker: string; title: string; body: string; art: ReactNode; extra?: ReactNode };

export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { completeOnboarding } = useApp();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [index, setIndex] = useState(0);

  const artWidth = Math.min(width - Spacing.four * 2, 420);
  const artHeight = Math.round((artWidth * 260) / 360);

  const illustration = (xml: string) => (
    <View style={[styles.art, { width: artWidth, height: artHeight }]}>
      <SvgXml xml={xml} width="100%" height="100%" />
    </View>
  );

  const badge = (icon: ComponentProps<typeof Ionicons>['name']) => (
    <View style={[styles.art, styles.badgeArt, { width: artWidth, height: artHeight, backgroundColor: '#eef4ff' }]}>
      <View style={styles.badge}>
        <Ionicons name={icon} size={64} color="#ffffff" />
      </View>
    </View>
  );

  const slides: Slide[] = [
    {
      key: 'welcome',
      kicker: 'Bienvenue',
      title: 'Louons le Seigneur ensemble',
      body: 'Le Recueil CMI est fait pour toute personne qui désire louer le Seigneur et apprendre les chants de notre communauté.',
      art: (
        <View style={[styles.art, styles.badgeArt, { width: artWidth, height: artHeight, backgroundColor: '#1d4ed8' }]}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={{ width: artHeight * 0.82, height: artHeight * 0.82, borderRadius: 32 }}
            accessibilityLabel="Logo du Recueil CMI"
          />
        </View>
      ),
    },
    {
      key: 'languages',
      kicker: `${songs.length} chants`,
      title: 'Un recueil, plusieurs langues',
      body: 'Chantez dans la langue de votre cœur : le recueil rassemble des cantiques de toutes nos assemblées.',
      art: badge('globe-outline'),
      extra: (
        <View style={styles.chips}>
          {LANGUAGES.map((lang) => (
            <View key={lang} style={[styles.chip, { backgroundColor: theme.chorusBackground }]}>
              <Text style={[styles.chipText, { color: theme.accent }]}>{lang}</Text>
            </View>
          ))}
        </View>
      ),
    },
    {
      key: 'offline',
      kicker: 'Hors ligne',
      title: 'Pas besoin d’internet',
      body: 'Tous les chants sont déjà dans l’application. Lisez-les partout : à l’église, en voyage ou à la maison.',
      art: illustration(OFFLINE_SVG),
    },
    {
      key: 'family',
      kicker: 'En famille',
      title: 'Chantez en famille et en communauté',
      body: 'Préparez vos cultes, vos veillées de prière et vos moments en famille grâce aux playlists.',
      art: illustration(FAMILY_SVG),
    },
    {
      key: 'tips',
      kicker: 'Astuces',
      title: 'Quelques conseils',
      body: '',
      art: null,
      extra: (
        <View style={styles.tips}>
          {TIPS.map((tip) => (
            <View key={tip.icon} style={[styles.tip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.tipIcon, { backgroundColor: theme.chorusBackground }]}>
                <Ionicons name={tip.icon} size={22} color={theme.accent} />
              </View>
              <Text style={[styles.tipText, { color: theme.text }]}>{tip.text}</Text>
            </View>
          ))}
        </View>
      ),
    },
    {
      key: 'contact',
      kicker: 'Contact',
      title: 'Un souci ? Écrivez-nous',
      body: 'Une faute dans un chant ou un problème dans l’application ? Dites-le-nous et nous corrigerons au plus vite. Vous nous retrouverez aussi dans « À propos ».',
      art: badge('chatbubbles-outline'),
      extra: (
        <View style={styles.contact}>
          <ContactButtons />
          <Text style={[styles.blessing, { color: theme.accent }]}>Que le Seigneur vous bénisse !</Text>
        </View>
      ),
    },
  ];

  const last = slides.length - 1;

  const goTo = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
    setIndex(i);
  };

  const finish = () => {
    completeOnboarding();
    router.replace('/');
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        {index < last ? (
          <Pressable accessibilityRole="button" onPress={finish} hitSlop={12} style={styles.skip}>
            <Text style={[styles.skipText, { color: theme.muted }]}>Passer</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}>
        {slides.map((slide) => (
          <ScrollView key={slide.key} style={{ width }} contentContainerStyle={styles.slide}>
            {slide.art}
            <Text style={[styles.kicker, { color: theme.accent }]}>{slide.kicker}</Text>
            <Text style={[styles.title, { color: theme.text }]}>{slide.title}</Text>
            {slide.body ? <Text style={[styles.body, { color: theme.muted }]}>{slide.body}</Text> : null}
            {slide.extra}
          </ScrollView>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.three }]}>
        <View style={styles.dots}>
          {slides.map((slide, i) => (
            <Pressable
              key={slide.key}
              accessibilityRole="button"
              accessibilityLabel={`Aller à l'écran ${i + 1}`}
              onPress={() => goTo(i)}
              hitSlop={6}
              style={[
                styles.dot,
                { backgroundColor: i === index ? theme.accent : theme.border, width: i === index ? 24 : 8 },
              ]}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => (index < last ? goTo(index + 1) : finish())}
          style={({ pressed }) => [styles.primary, { backgroundColor: theme.accent }, pressed && { opacity: 0.8 }]}>
          <Text style={[styles.primaryText, { color: theme.onAccent }]}>
            {index < last ? 'Suivant' : 'Commencer'}
          </Text>
          <Ionicons name={index < last ? 'arrow-forward' : 'checkmark'} size={20} color={theme.onAccent} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: { height: 48, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: Spacing.three },
  skip: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.two },
  skipText: { fontSize: 16, fontWeight: '600' },
  slide: { alignItems: 'center', paddingHorizontal: Spacing.four, paddingBottom: Spacing.four, gap: Spacing.three },
  art: { borderRadius: 28, overflow: 'hidden' },
  badgeArt: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: { fontSize: 13, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: Spacing.two },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', lineHeight: 32 },
  body: { fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 460 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.two, maxWidth: 460 },
  chip: { borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  chipText: { fontWeight: '700', fontSize: 14 },
  tips: { gap: Spacing.two, width: '100%', maxWidth: 460 },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
  },
  tipIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  tipText: { flex: 1, fontSize: 15, lineHeight: 21 },
  contact: { gap: Spacing.three, alignItems: 'center' },
  blessing: { fontSize: 18, fontWeight: '800', fontStyle: 'italic', textAlign: 'center' },
  footer: { paddingHorizontal: Spacing.four, paddingTop: Spacing.two, gap: Spacing.three },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: 16,
    minHeight: 54,
  },
  primaryText: { fontSize: 17, fontWeight: '800' },
});
