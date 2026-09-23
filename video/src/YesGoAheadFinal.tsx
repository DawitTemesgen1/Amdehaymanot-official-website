import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { EnhancedMainClip } from './EnhancedMainClip';
import { LogoSceneVertical } from './LogoSceneVertical';
import { VERTICAL_VIDEO } from './brand';

const INTRO_DURATION = VERTICAL_VIDEO.fps * 4;
const MAIN_DURATION = VERTICAL_VIDEO.fps * 10;
const OUTRO_DURATION = VERTICAL_VIDEO.fps * 4;
const CROSSFADE = 12;

const Crossfade: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ children, durationInFrames, fadeIn = false, fadeOut = false }) => {
  const frame = useCurrentFrame();
  let opacity = 1;

  if (fadeIn) {
    opacity = interpolate(frame, [0, CROSSFADE], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  if (fadeOut) {
    const fadeOutOpacity = interpolate(
      frame,
      [durationInFrames - CROSSFADE, durationInFrames],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    opacity = fadeIn ? Math.min(opacity, fadeOutOpacity) : fadeOutOpacity;
  }

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const YesGoAheadFinal: React.FC = () => (
  <AbsoluteFill style={{ background: '#000810' }}>
    <Sequence durationInFrames={INTRO_DURATION} name="Intro">
      <Crossfade durationInFrames={INTRO_DURATION} fadeOut>
        <LogoSceneVertical mode="intro" />
      </Crossfade>
    </Sequence>

    <Sequence from={INTRO_DURATION - CROSSFADE} durationInFrames={MAIN_DURATION} name="Main">
      <Crossfade durationInFrames={MAIN_DURATION} fadeIn fadeOut>
        <EnhancedMainClip />
      </Crossfade>
    </Sequence>

    <Sequence
      from={INTRO_DURATION + MAIN_DURATION - CROSSFADE * 2}
      durationInFrames={OUTRO_DURATION}
      name="Outro"
    >
      <Crossfade durationInFrames={OUTRO_DURATION} fadeIn>
        <LogoSceneVertical mode="outro" />
      </Crossfade>
    </Sequence>
  </AbsoluteFill>
);

export const YES_GO_AHEAD_DURATION =
  INTRO_DURATION + MAIN_DURATION + OUTRO_DURATION - CROSSFADE * 2;
