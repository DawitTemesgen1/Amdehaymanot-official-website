import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { brand } from '../../brand';

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.25 };

function EthiopicCross({ size = 12, color = brand.gold }) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      sx={{ display: 'block', flexShrink: 0 }}
    >
      <path
        fill={color}
        d="M15.2 2.2h1.6v5.4h5.4v1.6h-5.4v5.4h5.4v1.6h-5.4v8.2h-1.6v-8.2H9.8v-1.6h5.4V9.2H9.8V7.6h5.4V2.2zm-3.8 8.8h1.4v1.4h-1.4v-1.4zm7.8 0h1.4v1.4h-1.4v-1.4zM9.2 20.4h1.4v1.4H9.2v-1.4zm12.2 0h1.4v1.4h-1.4v-1.4z"
      />
      <circle cx="16" cy="10.4" r="1.15" fill={color} />
    </Box>
  );
}

function FiligreeLight() {
  return (
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        mb: 2.5,
      }}
    >
      <Box sx={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(brand.gold, 0.7)})` }} />
      <EthiopicCross size={12} color={brand.gold} />
      <Box sx={{ flex: 1, maxWidth: 160, height: 1, background: `linear-gradient(90deg, ${alpha(brand.gold, 0.7)}, transparent)` }} />
    </Box>
  );
}

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  padding: theme.spacing(10, 2, 11),
  background: `linear-gradient(165deg, ${brand.navyInk} 0%, ${brand.navyDark} 42%, ${brand.navy} 100%)`,
  color: brand.white,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 2, 9),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.55,
    backgroundImage: `
      radial-gradient(ellipse 80% 50% at 85% 20%, ${alpha(brand.gold, 0.14)} 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 10% 90%, ${alpha(brand.gold, 0.08)} 0%, transparent 50%),
      repeating-linear-gradient(60deg, transparent 0 16px, ${alpha(brand.gold, 0.04)} 16px 17px),
      repeating-linear-gradient(-60deg, transparent 0 16px, ${alpha(brand.gold, 0.03)} 16px 17px)
    `,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 2,
    zIndex: 2,
    background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
    opacity: 0.85,
    pointerEvents: 'none',
  },
}));

const Layout = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: '1.15fr 0.85fr',
  gap: 'clamp(2rem, 5vw, 4.5rem)',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: '2.75rem',
  },
}));

const StatCard = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2.5, 2.5, 2.5, 3),
  borderLeft: `2px solid ${brand.gold}`,
  background: alpha(brand.white, 0.04),
  borderTop: `1px solid ${alpha(brand.gold, 0.18)}`,
  borderRight: `1px solid ${alpha(brand.gold, 0.1)}`,
  borderBottom: `1px solid ${alpha(brand.gold, 0.1)}`,
}));

function parseStatValue(raw) {
  const str = String(raw || '');
  const match = str.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: str, animate: false };
  return { num: Number(match[1]), suffix: match[2] || '', animate: true };
}

function AnimatedStatValue({ value, reduceMotion, active }) {
  const { num, suffix, animate } = parseStatValue(value);
  const [display, setDisplay] = useState(reduceMotion || !animate ? num : 0);

  useEffect(() => {
    if (!active || reduceMotion || !animate) {
      setDisplay(num);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(num * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, num, animate, reduceMotion]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

/**
 * Ink commitment band with cathedral lattice + animated stats
 * (or numbered aims when `aims` is provided).
 */
const CommitmentBand = ({
  title,
  subtitle,
  text,
  aimsLabel,
  aims = [],
  stats = [],
}) => {
  const reduceMotion = useReducedMotion();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });
  const useAims = aims.length > 0;

  return (
    <Root component="section" aria-labelledby="commitment-title">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Layout>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOpts}
            transition={{ duration: 0.75, ease: easeOut }}
          >
            <FiligreeLight />
            <Typography
              id="commitment-title"
              component="h2"
              sx={{
                m: 0,
                mb: 2.5,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.85rem, 4vw, 2.85rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: brand.white,
                maxWidth: 520,
              }}
            >
              {title}
            </Typography>
            <Box
              aria-hidden
              sx={{
                width: 52,
                height: 2.5,
                mb: 2.5,
                borderRadius: 1,
                background: brand.gold,
                boxShadow: `0 0 14px ${alpha(brand.gold, 0.4)}`,
              }}
            />
            {subtitle && (
              <Typography
                sx={{
                  m: 0,
                  mb: 2.5,
                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                  lineHeight: 1.5,
                  color: alpha(brand.gold, 0.95),
                  maxWidth: 480,
                }}
              >
                {subtitle}
              </Typography>
            )}
            {text && (
              <Typography
                sx={{
                  m: 0,
                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                  fontSize: '1.05rem',
                  lineHeight: 1.85,
                  color: alpha(brand.white, 0.78),
                  maxWidth: 480,
                }}
              >
                {text}
              </Typography>
            )}
          </motion.div>

          <Box
            ref={statsRef}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: useAims ? 0 : 1.75,
            }}
          >
            {useAims && aimsLabel && (
              <Typography
                sx={{
                  m: 0,
                  mb: 1.5,
                  fontFamily: '"Source Sans 3", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: brand.gold,
                }}
              >
                {aimsLabel}
              </Typography>
            )}
            {useAims
              ? aims.map((aim, i) => (
                  <Box
                    key={aim}
                    component={motion.div}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewOpts}
                    transition={{ duration: 0.55, ease: easeOut, delay: 0.06 + i * 0.08 }}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr',
                      gap: 1.75,
                      py: 1.75,
                      borderBottom: `1px solid ${alpha(brand.gold, 0.2)}`,
                      '&:last-of-type': { borderBottom: 'none' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        color: brand.gold,
                        lineHeight: 1.4,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                        fontSize: '0.98rem',
                        lineHeight: 1.6,
                        color: alpha(brand.white, 0.88),
                      }}
                    >
                      {aim}
                    </Typography>
                  </Box>
                ))
              : stats.map((stat, i) => (
                  <StatCard
                    key={stat.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewOpts}
                    transition={{ duration: 0.65, ease: easeOut, delay: 0.08 + i * 0.1 }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                        fontWeight: 600,
                        fontSize: { xs: '2.4rem', md: '3rem' },
                        lineHeight: 1,
                        color: brand.gold,
                      }}
                    >
                      <AnimatedStatValue
                        value={stat.value}
                        reduceMotion={reduceMotion}
                        active={statsInView}
                      />
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        fontSize: '0.68rem',
                        color: alpha(brand.white, 0.7),
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </StatCard>
                ))}
          </Box>
        </Layout>

        <Box
          aria-hidden
          sx={{
            mt: { xs: 5, md: 7 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.25,
            opacity: 0.85,
          }}
        >
          <Box sx={{ flex: 1, maxWidth: 140, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(brand.gold, 0.55)})` }} />
          <EthiopicCross size={11} color={brand.gold} />
          <Box sx={{ flex: 1, maxWidth: 140, height: 1, background: `linear-gradient(90deg, ${alpha(brand.gold, 0.55)}, transparent)` }} />
        </Box>
      </Container>
    </Root>
  );
};

export default CommitmentBand;
