import React from 'react';
import { evolvePath } from '@remotion/paths';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand } from './brand';

const VB = 400;

/** Simplified line-art emblem inspired by the Amde Haymanot seal */
const PATHS = {
  frame: `M 200 24 A 176 176 0 1 1 199.5 24`,
  leftDome: `M 108 210 Q 118 155 138 198`,
  rightDome: `M 292 210 Q 282 155 262 198`,
  centerDome: `M 152 188 Q 200 108 248 188`,
  body: `M 118 188 L 118 278 L 282 278 L 282 188`,
  door: `M 178 278 L 178 220 Q 200 200 222 220 L 222 278`,
  crossV: `M 200 82 L 200 108`,
  crossH: `M 186 92 L 214 92`,
  bookLeft: `M 138 292 L 200 268 L 200 318 Q 170 332 138 318`,
  bookRight: `M 262 292 L 200 268 L 200 318 Q 230 332 262 318`,
  leftDrum: `M 128 250 Q 108 258 128 266`,
  rightDrum: `M 272 250 Q 292 258 272 266`,
  goldArc: `M 72 248 Q 200 320 328 248`,
};

type DrawProps = {
  size: number;
  startFrame?: number;
  strokeWidth?: number;
  strokeColor?: string;
  accentColor?: string;
};

export const AnimatedLogoDraw: React.FC<DrawProps> = ({
  size,
  startFrame = 0,
  strokeWidth = 2.8,
  strokeColor = brand.navy,
  accentColor = brand.gold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - startFrame);

  const drawDuration = fps * 1.8;
  const pathCount = Object.keys(PATHS).length;

  const renderPath = (key: keyof typeof PATHS, index: number) => {
    const pathStart = (drawDuration / pathCount) * index;
    const pathEnd = pathStart + drawDuration / pathCount + fps * 0.15;
    const progress = interpolate(local, [pathStart, pathEnd], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const evolved = evolvePath(progress, PATHS[key]);
    const isGold = key === 'goldArc' || key === 'crossH' || key === 'crossV';

    return (
      <path
        key={key}
        d={evolved}
        fill="none"
        stroke={isGold ? accentColor : strokeColor}
        strokeWidth={isGold ? strokeWidth + 0.8 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isGold ? 1 : 0.92}
      />
    );
  };

  const overallOpacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VB} ${VB}`}
      style={{ opacity: overallOpacity }}
    >
      {Object.keys(PATHS).map((key, i) =>
        renderPath(key as keyof typeof PATHS, i)
      )}
    </svg>
  );
};
