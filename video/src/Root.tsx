import React from 'react';
import { Composition } from 'remotion';
import { YesGoAheadIntro } from './YesGoAheadIntro';
import { YesGoAheadOutro } from './YesGoAheadOutro';
import { VERTICAL_VIDEO } from './brand';

const DURATION = VERTICAL_VIDEO.fps * 10;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Intro"
      component={YesGoAheadIntro}
      durationInFrames={DURATION}
      fps={VERTICAL_VIDEO.fps}
      width={VERTICAL_VIDEO.width}
      height={VERTICAL_VIDEO.height}
    />
    <Composition
      id="Outro"
      component={YesGoAheadOutro}
      durationInFrames={DURATION}
      fps={VERTICAL_VIDEO.fps}
      width={VERTICAL_VIDEO.width}
      height={VERTICAL_VIDEO.height}
    />
  </>
);
