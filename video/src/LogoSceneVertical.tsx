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

type LogoSceneVerticalProps = {
  mode: 'intro' | 'outro';
};

export const LogoSceneVertical: React.FC<LogoSceneVerticalProps> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const drawEnd = fps * 1.6;
  const logoReveal = interpolate(frame, [drawEnd - 6, drawEnd + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const drawOpacity = interpolate(frame, [drawEnd, drawEnd + 16], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enter = spring({
    frame: Math.max(0, frame - fps * 0.15),
    fps,
    config: { damping: 200 },
  });

  const textEnter = spring({
    frame: Math.max(0, frame - drawEnd + fps * 0.1),
    fps,
    config: { damping: 200 },
  });

  const exitStart = durationInFrames - fps * 0.6;
  const fadeOut =
    mode === 'outro'
      ? interpolate(frame, [exitStart, durationInFrames], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  const lineWidth = interpolate(
    frame,
    [drawEnd + fps * 0.15, drawEnd + fps * 0.65],
    [0, 220],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const rayRotate = interpolate(frame, [0, durationInFrames], [0, 8]);
  const particleDrift = interpolate(frame, [0, durationInFrames], [0, 40]);

  const logoSize = mode === 'intro' ? 300 : 260;
  const glowPulse = 0.55 + 0.15 * Math.sin((frame / fps) * Math.PI * 1.2);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 42%, #0a2848 0%, ${brand.navyInk} 55%, #000810 100%)`,
        fontFamily: '"Inter", "Segoe UI", "Noto Sans Ethiopic", system-ui, sans-serif',
        color: brand.white,
        overflow: 'hidden',
        opacity: fadeOut,
      }}
    >
      {/* Light rays */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: `conic-gradient(from ${180 + rayRotate}deg at 50% 45%, transparent 0deg, rgba(0, 180, 255, 0.07) 30deg, transparent 60deg, rgba(255, 207, 0, 0.05) 90deg, transparent 120deg, rgba(0, 180, 255, 0.06) 150deg, transparent 180deg)`,
          opacity: enter,
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(i * 17 + 8) % 100}%`,
            top: `${((i * 23 + particleDrift) % 100)}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            borderRadius: '50%',
            background: i % 3 === 0 ? brand.gold : 'rgba(120, 210, 255, 0.9)',
            opacity: 0.15 + (i % 5) * 0.08,
            boxShadow: `0 0 ${6 + (i % 4) * 2}px currentColor`,
          }}
        />
      ))}

      {/* Brand bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${interpolate(frame, [0, fps * 0.45], [0, 100], { extrapolateRight: 'clamp' })}%`,
          height: 6,
          background: brand.navy,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${interpolate(frame, [fps * 0.1, fps * 0.55], [0, 85], { extrapolateRight: 'clamp' })}%`,
          height: 3,
          background: brand.gold,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${interpolate(frame, [fps * 0.05, fps * 0.5], [0, 100], { extrapolateRight: 'clamp' })}%`,
          height: 6,
          background: brand.navy,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${interpolate(frame, [fps * 0.15, fps * 0.6], [0, 85], { extrapolateRight: 'clamp' })}%`,
          height: 3,
          background: brand.gold,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '120px 48px 160px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: logoSize,
              height: logoSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(0, 180, 255, ${glowPulse * 0.35}) 0%, transparent 70%)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: drawOpacity,
                filter: 'drop-shadow(0 0 12px rgba(0, 200, 255, 0.6))',
              }}
            >
              <AnimatedLogoDraw size={logoSize - 20} strokeColor="#5ec8ff" />
            </div>
            <Img
              src={staticFile('logo.png')}
              style={{
                width: '88%',
                height: '88%',
                objectFit: 'contain',
                opacity: logoReveal,
                filter: `drop-shadow(0 0 ${18 * logoReveal}px rgba(0, 200, 255, 0.5))`,
                transform: `scale(${interpolate(logoReveal, [0, 1], [0.9, 1])})`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: 40,
            opacity: textEnter,
            transform: `translateY(${interpolate(textEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: mode === 'intro' ? 52 : 44,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: brand.white,
              textShadow: '0 2px 24px rgba(0, 180, 255, 0.4)',
            }}
          >
            Amde Haymanot
          </div>
          <div
            style={{
              fontSize: mode === 'intro' ? 36 : 30,
              fontWeight: 700,
              marginTop: 10,
              color: brand.gold,
            }}
          >
            ዓምደ ሃይማኖት
          </div>
          <div
            style={{
              width: lineWidth,
              height: 4,
              margin: '18px auto',
              background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
              borderRadius: 2,
            }}
          />
          {mode === 'intro' && (
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(200, 220, 240, 0.85)',
              }}
            >
              Sunday School · Jimma
            </div>
          )}
          {mode === 'outro' && (
            <>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: brand.white,
                  marginTop: 4,
                }}
              >
                amdehaymanot.com
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  marginTop: 12,
                  color: 'rgba(180, 200, 220, 0.8)',
                  letterSpacing: '0.04em',
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
