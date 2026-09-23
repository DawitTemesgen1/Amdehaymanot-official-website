import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { brand } from './brand';

type YesGoAheadSceneProps = {
  mode: 'intro' | 'outro';
};

export const YesGoAheadScene: React.FC<YesGoAheadSceneProps> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const badgeEnter = spring({
    frame: Math.max(0, frame - fps * 0.6),
    fps,
    config: { damping: 200 },
  });

  const outroTextEnter = spring({
    frame: Math.max(0, frame - durationInFrames + fps * 3),
    fps,
    config: { damping: 200 },
  });

  const breathe = 1 + 0.015 * Math.sin((frame / fps) * Math.PI * 0.8);

  return (
    <AbsoluteFill style={{ background: brand.navyInk, opacity: fadeIn * fadeOut }}>
      <OffthreadVideo
        src={staticFile('yes_go_ahead_clean.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${breathe})`,
          filter: 'brightness(1.06) contrast(1.1) saturate(1.14)',
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(0, 120, 200, 0.1) 0%, transparent 60%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 75% 80% at 50% 45%, transparent 35%, rgba(0, 6, 18, 0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Branded footer bar — covers watermark entirely */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          background: 'linear-gradient(to top, #010a18 70%, rgba(1, 10, 24, 0.85) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Branded badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: `translateX(-50%) translateY(${interpolate(badgeEnter, [0, 1], [16, 0])}px)`,
          opacity: badgeEnter,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
          zIndex: 10,
          fontFamily: '"Inter", "Segoe UI", "Noto Sans Ethiopic", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            padding: '10px 32px',
            borderRadius: 999,
            background: `linear-gradient(135deg, ${brand.navy} 0%, #003060 100%)`,
            border: `2px solid ${brand.gold}`,
            boxShadow: '0 4px 28px rgba(0, 0, 0, 0.45)',
            fontSize: 22,
            fontWeight: 700,
            color: brand.white,
            letterSpacing: '0.04em',
          }}
        >
          amdehaymanot.com
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(200, 215, 230, 0.8)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Jimma · Ethiopia
        </div>
      </div>

      {mode === 'outro' && (
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: outroTextEnter,
            transform: `translateY(${interpolate(outroTextEnter, [0, 1], [12, 0])}px)`,
            fontFamily: '"Inter", "Segoe UI", "Noto Sans Ethiopic", system-ui, sans-serif',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: brand.white,
              textShadow: '0 2px 24px rgba(0, 180, 255, 0.45)',
            }}
          >
            Amde Haymanot
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: brand.gold,
              marginTop: 8,
            }}
          >
            ዓምደ ሃይማኖት
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              marginTop: 14,
              color: 'rgba(190, 210, 230, 0.85)',
              letterSpacing: '0.06em',
            }}
          >
            Debre Ephrata St. Mary Cathedral
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
