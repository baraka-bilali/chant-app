import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';

export const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
});

export const C = {
  bg: '#070d1f',
  bg2: '#0b1430',
  surface: '#0f1a3a',
  surface2: '#14224a',
  border: 'rgba(148,170,220,0.18)',
  text: '#eef2ff',
  muted: '#9fb0d4',
  accent: '#6fb0ff',
  blue: '#1d4ed8',
  blue2: '#3b82f6',
  green: '#16a34a',
  gold: '#fbbf24',
};

/** Texts shown in the video — change them here, then re-render. */
export const INFO = {
  webUrl: 'chant-app.vercel.app',
  phone: '+243 980 139 630',
  email: 'techcmk11@gmail.com',
  /** Address of the download site (APK). Leave empty if not online yet. */
  siteUrl: '',
};

export const FPS = 30;

/** Scene lengths in frames (30 fps). */
export const SCENES = {
  intro: 180,
  languages: 225,
  demo: 495,
  offline: 156,
  iphone: 615,
  android: 198,
  contact: 350,
  outro: 150,
};

/** Step starts inside the demo and iPhone scenes (frames), aligned with the voice-over. */
export const DEMO_AT = [0, 144, 270, 369];
export const IOS_AT = [0, 222, 306, 444];

export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
