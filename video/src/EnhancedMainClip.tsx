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

export const EnhancedMainClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleEnter = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const titleFade = interpolate(frame, [fps * 2.5, fps * 3.5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const badgeEnter = spring({
    frame: Math.max(0, frame - fps * 0.8),
    fps,
    config: { damping: 200 },
  });

  const shimmer = interpolate(frame, [0, durationInFrames], [0, 1]);
  const breathe = 1 + 0.02 * Math.sin((frame / fps) * Math.PI * 0.8);

  return (
    <AbsoluteFill style={{ background: brand.navyInk }}>
      <OffthreadVideo
        src={staticFile('yes_go_ahead_clean.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${breathe})`,
          filter: 'brightness(1.08) contrast(1.12) saturate(1.18)',
        }}
      />

      {/* Cinematic color wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 40%, rgba(0, 120, 200, 0.12) 0%, transparent 60%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 75% 80% at 50% 45%, transparent 35%, rgba(0, 6, 18, 0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom gradient — covers TikTok watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 280,
          background:
            'linear-gradient(to top, rgba(0, 8, 24, 0.98) 0%, rgba(0, 8, 24, 0.75) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Solid watermark mask — bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 340,
          height: 88,
          background: '#010a18',
          pointerEvents: 'none',
        }}
      />

      {/* Top title — fades after opening */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleEnter * titleFade,
          transform: `translateY(${interpolate(titleEnter, [0, 1], [-16, 0])}px)`,
          fontFamily: '"Inter", "Segoe UI", "Noto Sans Ethiopic", system-ui, sans-serif',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: brand.white,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textShadow: '0 2px 20px rgba(0, 180, 255, 0.5)',
          }}
        >
          Amde Haymanot
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: brand.gold,
            marginTop: 6,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          Sunday School
        </div>
      </div>

      {/* Branded badge — replaces TikTok watermark area */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: `translateX(-50%) translateY(${interpolate(badgeEnter, [0, 1], [20, 0])}px)`,
          opacity: badgeEnter,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            padding: '10px 28px',
            borderRadius: 999,
            background: `linear-gradient(135deg, ${brand.navy} 0%, #003060 100%)`,
            border: `2px solid ${brand.gold}`,
            boxShadow: `0 4px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 207, 0, ${0.15 + shimmer * 0.1})`,
            fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
            fontSize: 20,
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
            color: 'rgba(200, 215, 230, 0.75)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Jimma · Ethiopia
        </div>
      </div>

      {/* Gold accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 130,
          left: '50%',
          transform: 'translateX(-50%)',
          width: interpolate(frame, [fps * 0.5, fps * 2], [0, 180], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
