import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { AnimatedLogoDraw } from './AnimatedLogoDraw';
import { brand } from './brand';

type LogoSceneProps = {
  mode: 'intro' | 'outro';
};

export const LogoScene: React.FC<LogoSceneProps> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const drawEnd = fps * 2.0;
  const logoReveal = interpolate(frame, [drawEnd - 8, drawEnd + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const drawOpacity = interpolate(frame, [drawEnd, drawEnd + 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardEnter = spring({
    frame: Math.max(0, frame - fps * 0.1),
    fps,
    config: { damping: 200 },
  });

  const textEnter = spring({
    frame: Math.max(0, frame - drawEnd),
    fps,
    config: { damping: 200 },
  });

  const exitStart = durationInFrames - fps * 0.7;
  const fadeOut = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lineWidth = interpolate(
    frame,
    [drawEnd + fps * 0.2, drawEnd + fps * 0.8],
    [0, 300],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const topBarW = interpolate(frame, [0, fps * 0.5], [0, 100], {
    extrapolateRight: 'clamp',
  });
  const bottomBarW = interpolate(
    frame,
    [fps * 0.2, fps * 0.7],
    [0, 100],
    { extrapolateRight: 'clamp' }
  );

  const logoSize = mode === 'intro' ? 360 : 280;
  const textY = interpolate(textEnter, [0, 1], [24, 0]);

  return (
    <AbsoluteFill
      style={{
        background: brand.bg,
        fontFamily: '"Inter", "Segoe UI", "Noto Sans Ethiopic", system-ui, sans-serif',
        color: brand.navy,
        overflow: 'hidden',
        opacity: fadeOut,
      }}
    >
      {/* Animated top bars — wipe in */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${topBarW}%`,
          height: 10,
          background: brand.navy,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${topBarW * 0.85}%`,
          height: 4,
          background: brand.gold,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${bottomBarW}%`,
          height: 10,
          background: brand.navy,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${bottomBarW * 0.85}%`,
          height: 4,
          background: brand.gold,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '72px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `scale(${interpolate(cardEnter, [0, 1], [0.96, 1])})`,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: logoSize,
              height: logoSize,
              borderRadius: 28,
              background: brand.white,
              border: `3px solid ${brand.navy}`,
              boxShadow: '0 20px 56px rgba(0, 65, 121, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Phase 1: line-draw emblem */}
            <div
              style={{
                position: 'absolute',
                inset: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: drawOpacity,
              }}
            >
              <AnimatedLogoDraw size={logoSize - 48} />
            </div>

            {/* Phase 2: full logo reveals after draw */}
            <Img
              src={staticFile('logo-navy.png')}
              style={{
                width: '78%',
                height: '78%',
                objectFit: 'contain',
                opacity: logoReveal,
                transform: `scale(${interpolate(logoReveal, [0, 1], [0.94, 1])})`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: 36,
            transform: `translateY(${textY}px)`,
            opacity: textEnter,
          }}
        >
          <div
            style={{
              fontSize: mode === 'intro' ? 62 : 50,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: brand.navy,
            }}
          >
            Amde Haymanot
          </div>

          <div
            style={{
              fontSize: mode === 'intro' ? 38 : 32,
              fontWeight: 700,
              marginTop: 8,
              color: brand.navy,
            }}
          >
            ዓምደ ሃይማኖት
          </div>

          <div
            style={{
              width: lineWidth,
              height: 5,
              margin: '20px auto',
              background: brand.gold,
              borderRadius: 3,
            }}
          />

          {mode === 'intro' && (
            <div
              style={{
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: brand.inkMuted,
              }}
            >
              Sunday School · Jimma
            </div>
          )}

          {mode === 'outro' && (
            <>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: brand.navy,
                }}
              >
                amdehaymanot.com
              </div>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 500,
                  marginTop: 10,
                  color: brand.inkMuted,
                }}
              >
                Debre Ephrata St. Mary Cathedral
              </div>
            </>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
