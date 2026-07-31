import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { brand } from '../../brand';
import { DESKTOP_NAV, MOBILE_NAV } from './viewportSection';

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

const Root = styled(Box, {
  shouldForwardProp: (p) => p !== 'fillViewport',
})(({ theme, fillViewport }) => ({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  minHeight: 560,
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    minHeight: 480,
  },
  ...(fillViewport && {
    height: `calc(100vh - ${DESKTOP_NAV})`,
    maxHeight: `calc(100vh - ${DESKTOP_NAV})`,
    minHeight: `calc(100vh - ${DESKTOP_NAV})`,
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    boxSizing: 'border-box',
    '@supports (height: 100dvh)': {
      height: `calc(100dvh - ${DESKTOP_NAV})`,
      maxHeight: `calc(100dvh - ${DESKTOP_NAV})`,
      minHeight: `calc(100dvh - ${DESKTOP_NAV})`,
    },
    [theme.breakpoints.down('md')]: {
      height: `calc(100vh - ${MOBILE_NAV})`,
      maxHeight: `calc(100vh - ${MOBILE_NAV})`,
      minHeight: `calc(100vh - ${MOBILE_NAV})`,
      overflowY: 'auto',
      '@supports (height: 100dvh)': {
        height: `calc(100dvh - ${MOBILE_NAV})`,
        maxHeight: `calc(100dvh - ${MOBILE_NAV})`,
        minHeight: `calc(100dvh - ${MOBILE_NAV})`,
      },
    },
  }),
}));

const BgPhoto = styled(motion.div)({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
});

const Veil = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background: `
    linear-gradient(105deg, ${alpha(brand.navyInk, 0.94)} 0%, ${alpha(brand.navyDark, 0.78)} 42%, ${alpha(brand.navyDark, 0.35)} 72%, ${alpha(brand.navyInk, 0.2)} 100%),
    linear-gradient(180deg, ${alpha(brand.navyInk, 0.25)} 0%, transparent 30%, ${alpha(brand.navyInk, 0.45)} 100%)
  `,
  [theme.breakpoints.down('md')]: {
    background: `
      linear-gradient(180deg, ${alpha(brand.navyInk, 0.72)} 0%, ${alpha(brand.navyDark, 0.88)} 45%, ${alpha(brand.navyInk, 0.94)} 100%)
    `,
  },
}));

const TopRail = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: 2,
  zIndex: 3,
  pointerEvents: 'none',
  background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
  opacity: 0.8,
});

const BottomRail = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 2,
  zIndex: 3,
  pointerEvents: 'none',
  background: `linear-gradient(90deg, transparent, ${alpha(brand.gold, 0.7)}, transparent)`,
  opacity: 0.7,
});

const ArchAccent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '8%',
  top: '12%',
  width: 'min(38vw, 340px)',
  height: 'min(48vw, 420px)',
  zIndex: 2,
  pointerEvents: 'none',
  borderRadius: brand.archRadius,
  border: `1.5px solid ${alpha(brand.gold, 0.35)}`,
  boxShadow: `inset 0 0 0 1px ${alpha(brand.gold, 0.12)}`,
  opacity: 0.9,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const YearGhost = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  right: '6%',
  bottom: '10%',
  zIndex: 2,
  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
  fontWeight: 600,
  fontSize: 'clamp(4rem, 12vw, 9rem)',
  lineHeight: 0.85,
  letterSpacing: '0.04em',
  color: alpha(brand.gold, 0.12),
  pointerEvents: 'none',
  userSelect: 'none',
  [theme.breakpoints.down('md')]: {
    right: 16,
    bottom: 24,
    fontSize: '4.5rem',
    color: alpha(brand.gold, 0.14),
  },
}));

const QuoteBlock = styled(Box)({
  position: 'relative',
  marginTop: 28,
  paddingLeft: 22,
  borderLeft: `2.5px solid ${brand.gold}`,
});

/**
 * Full-bleed living-generation story — cathedral overlay on photo.
 */
const LivingGeneration = ({
  backgroundImage,
  title,
  historyText,
  quote,
  foundedYear = '1964',
  fillViewport = false,
  children,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <Root
      component="section"
      aria-labelledby="living-generation-title"
      fillViewport={fillViewport}
    >
      <BgPhoto
        aria-hidden
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={reduceMotion ? false : { scale: 1.08, opacity: 0.85 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={viewOpts}
        transition={{ duration: 1.4, ease: easeOut }}
      />
      <Veil aria-hidden />
      <TopRail aria-hidden />
      <BottomRail aria-hidden />
      <ArchAccent aria-hidden />
      <YearGhost aria-hidden>{foundedYear}</YearGhost>

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 4,
          py: fillViewport ? { xs: 3, md: 4 } : { xs: 8, md: 12 },
          width: '100%',
        }}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOpts}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <Box sx={{ maxWidth: 540, color: brand.white }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                mb: fillViewport ? 1.75 : 2.5,
              }}
            >
              <Box sx={{ width: 36, height: 1, bgcolor: alpha(brand.gold, 0.7) }} />
              <EthiopicCross size={12} color={brand.gold} />
              <Box
                sx={{
                  flex: 1,
                  maxWidth: 120,
                  height: 1,
                  background: `linear-gradient(90deg, ${alpha(brand.gold, 0.7)}, transparent)`,
                }}
              />
            </Box>

            <Typography
              id="living-generation-title"
              component="h2"
              sx={{
                m: 0,
                mb: fillViewport ? 1.75 : 2.5,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: fillViewport
                  ? 'clamp(1.7rem, 3.6vw, 2.6rem)'
                  : 'clamp(1.9rem, 4.2vw, 3rem)',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                color: brand.white,
              }}
            >
              {title}
            </Typography>

            <Box
              aria-hidden
              sx={{
                width: 52,
                height: 2.5,
                mb: fillViewport ? 2 : 3,
                borderRadius: 1,
                background: brand.gold,
                boxShadow: `0 0 14px ${alpha(brand.gold, 0.4)}`,
              }}
            />

            <Typography
              sx={{
                m: 0,
                mb: children ? 2 : 0,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: fillViewport ? '0.98rem' : '1.05rem',
                lineHeight: fillViewport ? 1.7 : 1.85,
                color: alpha(brand.white, 0.82),
              }}
            >
              {historyText}
            </Typography>

            {quote && (
              <QuoteBlock>
                <Typography
                  component="blockquote"
                  sx={{
                    m: 0,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
                    lineHeight: 1.55,
                    color: brand.gold,
                  }}
                >
                  {quote}
                </Typography>
              </QuoteBlock>
            )}

            {children}
          </Box>
        </motion.div>
      </Container>
    </Root>
  );
};

export default LivingGeneration;
