import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';

import { Background, H, W, clamp } from './components';
import {
  AndroidScene, ContactScene, DemoScene, IntroScene, IphoneScene, LanguagesScene, OfflineScene, OutroScene,
} from './scenes';
import { SCENES, TOTAL } from './theme';
import voice from './voice.json';

const ORDER = [
  ['intro', IntroScene],
  ['languages', LanguagesScene],
  ['demo', DemoScene],
  ['offline', OfflineScene],
  ['iphone', IphoneScene],
  ['android', AndroidScene],
  ['contact', ContactScene],
  ['outro', OutroScene],
] as const;

type SceneKey = keyof typeof SCENES;

/** Absolute start frame of each scene. */
const SCENE_START = (() => {
  const starts = {} as Record<SceneKey, number>;
  let t = 0;
  for (const [key] of ORDER) {
    starts[key] = t;
    t += SCENES[key];
  }
  return starts;
})();

/** Voice-over clips placed on the global timeline. */
const CLIPS = voice.map((v) => ({ ...v, start: SCENE_START[v.scene as SceneKey] + v.from }));

/** Music volume: full between sentences, lowered while the voice speaks. */
function musicVolume(f: number) {
  const base = interpolate(f, [0, 20, TOTAL - 45, TOTAL], [0, 0.85, 0.85, 0], clamp);
  let duck = 0;
  for (const c of CLIPS) {
    const d = interpolate(f, [c.start - 8, c.start, c.start + c.frames, c.start + c.frames + 12], [0, 1, 1, 0], clamp);
    duck = Math.max(duck, d);
  }
  return base * (1 - 0.68 * duck);
}

export function Presentation() {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [TOTAL - 24, TOTAL], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Everything is designed on a 1920×1080 canvas and scaled ×2 for 4K. */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: 'scale(2)', transformOrigin: '0 0', overflow: 'hidden' }}>
        <Background />
        {ORDER.map(([key, Component]) => (
          <Sequence key={key} from={SCENE_START[key]} durationInFrames={SCENES[key]} name={key}>
            <Component />
          </Sequence>
        ))}
        <AbsoluteFill style={{ background: '#000', opacity: fadeOut }} />
      </div>
      <Audio src={staticFile('music.wav')} volume={(f) => musicVolume(f)} />
      {CLIPS.map((c) => (
        <Sequence key={c.id} from={c.start} durationInFrames={c.frames + 6} name={`voix ${c.id}`}>
          <Audio src={staticFile(`voice/${c.id}.wav`)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
