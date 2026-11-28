import { Composition } from 'remotion';

import { Presentation } from './Presentation';
import { FPS, TOTAL } from './theme';

export const RemotionRoot = () => (
  <Composition
    id="Presentation"
    component={Presentation}
    durationInFrames={TOTAL}
    fps={FPS}
    width={3840}
    height={2160}
  />
);
