import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion } from 'framer-motion';
import { brand } from '../../brand';

/** Matches App.js desktop AppBar offset */
const DESKTOP_NAV = '82px';
const MOBILE_NAV = '64px';

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  isolation: 'isolate',
  height: `calc(100vh - ${DESKTOP_NAV})`,
  maxHeight: `calc(100vh - ${DESKTOP_NAV})`,
  overflow: 'hidden',
  background: `linear-gradient(180deg, ${brand.white} 0%, #F7FAFC 55%, ${brand.stone} 100%)`,
  color: brand.ink,
  '@supports (height: 100dvh)': {
    height: `calc(100dvh - ${DESKTOP_NAV})`,
    maxHeight: `calc(100dvh - ${DESKTOP_NAV})`,
  },
  [theme.breakpoints.down('md')]: {
    height: `calc(100vh - ${MOBILE_NAV})`,
    maxHeight: `calc(100vh - ${MOBILE_NAV})`,
    '@supports (height: 100dvh)': {
      height: `calc(100dvh - ${MOBILE_NAV})`,
      maxHeight: `calc(100dvh - ${MOBILE_NAV})`,
    },
  },
}));

const SplitWord = styled(motion.p)(({ theme }) => ({
  margin: 0,
  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
  fontWeight: 700,
  fontSize: 'clamp(2.6rem, 6.5vw, 5.75rem)',
  lineHeight: 0.95,
  letterSpacing: '-0.025em',
  color: brand.navyInk,
  [theme.breakpoints.down('md')]: {
    fontSize: 'clamp(2rem, 9vw, 2.8rem)',
  },
}));

/** Top-left — Amde */
const NameTop = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '6%',
  left: '3.5%',
  zIndex: 5,
  maxWidth: '38%',
  pointerEvents: 'none',
  userSelect: 'none',
  [theme.breakpoints.down('md')]: {
    top: '3%',
    left: '4%',
    right: '4%',
    maxWidth: 'none',
    textAlign: 'left',
  },
}));

/** Bottom-right — Haymanot */
const NameBottom = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '3.5%',
  bottom: '5%',
  zIndex: 5,
  maxWidth: '42%',
  textAlign: 'right',
  pointerEvents: 'none',
  userSelect: 'none',
  [theme.breakpoints.down('md')]: {
    right: '4%',
    bottom: '4%',
    maxWidth: '55%',
  },
}));

const Quote = styled(motion.p)(({ theme }) => ({
  margin: '10px 0 0',
  maxWidth: 260,
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(0.72rem, 0.95vw, 0.9rem)',
  lineHeight: 1.4,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  color: alpha(brand.ink, 0.72),
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    maxWidth: '70%',
    WebkitLineClamp: 3,
    fontSize: '0.72rem',
  },
}));

const BrandTag = styled(Typography)(({ theme }) => ({
  margin: '8px 0 0',
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(0.65rem, 0.95vw, 0.8rem)',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: brand.goldDark,
  [theme.breakpoints.down('md')]: {
    letterSpacing: '0.16em',
    fontSize: '0.65rem',
  },
}));

const GoldRule = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})(({ align = 'left' }) => ({
  width: 52,
  height: 2.5,
  marginTop: 8,
  marginLeft: align === 'right' ? 'auto' : 0,
  borderRadius: 2,
  background: brand.gold,
  boxShadow: `0 0 12px ${alpha(brand.gold, 0.4)}`,
}));

const HatchYear = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '8%',
  right: '3.5%',
  zIndex: 1,
  fontFamily: '"Source Sans 3", sans-serif',
  fontWeight: 800,
  fontSize: 'clamp(2.8rem, 8vw, 6rem)',
  lineHeight: 1,
  letterSpacing: '-0.06em',
  color: 'transparent',
  WebkitTextStroke: `1.5px ${alpha(brand.navy, 0.18)}`,
  backgroundImage: `repeating-linear-gradient(
    -45deg,
    ${alpha(brand.navy, 0.08)} 0 2px,
    transparent 2px 8px
  )`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  userSelect: 'none',
  pointerEvents: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SubjectStage = styled(Box)({
  position: 'absolute',
  inset: 0,
  zIndex: 3,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
});

const SubjectWrap = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  // vmin keeps portrait inside short viewports
  width: 'min(42vw, 52vh, 420px)',
  height: 'min(42vw, 52vh, 420px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: 'min(58vw, 42vh, 300px)',
    height: 'min(58vw, 42vh, 300px)',
  },
}));

const SubjectBackdrop = styled(Box)({
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  zIndex: 0,
  background: `
    radial-gradient(circle at 50% 42%, ${brand.white} 0%, ${brand.stone} 55%, ${alpha(brand.navy, 0.08)} 100%)
  `,
  border: `2px solid ${alpha(brand.gold, 0.55)}`,
  boxShadow: `
    0 0 0 8px ${alpha(brand.gold, 0.12)},
    0 18px 48px ${alpha(brand.navyInk, 0.14)}
  `,
  pointerEvents: 'none',
});

const SubjectImg = styled('img')({
  position: 'relative',
  zIndex: 1,
  width: '88%',
  height: '88%',
  objectFit: 'contain',
  objectPosition: 'center center',
  filter: 'drop-shadow(0 14px 28px rgba(0, 14, 31, 0.16))',
});

const LogoMark = styled(Box)({
  display: 'inline-flex',
  marginBottom: 8,
});

const ease = [0.22, 1, 0.36, 1];

function splitBrandName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' ')];
  }
  return [parts[0] || name, ''];
}

/**
 * Single-viewport hero (fits under the navbar with no scroll).
 * Desktop: Amde top-left, Haymanot bottom-right, portrait centered.
 */
const HomeHero = ({
  subjectImage,
  logoSrc,
  brandName,
  tagline,
  scriptureRef,
  headline,
}) => {
  const [firstName, secondName] = useMemo(() => splitBrandName(brandName), [brandName]);

  return (
    <Root>
      <Typography component="h1" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        {brandName}
        {tagline ? ` — ${tagline}` : ''}
      </Typography>

      <NameTop>
        {logoSrc && (
          <LogoMark>
            <Box
              component="img"
              src={logoSrc}
              alt=""
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                objectFit: 'contain',
                bgcolor: brand.white,
                borderRadius: '50%',
                border: `1.5px solid ${alpha(brand.navy, 0.15)}`,
                p: 0.4,
              }}
            />
          </LogoMark>
        )}
        <SplitWord
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease }}
          aria-hidden="true"
        >
          {firstName}
        </SplitWord>
        <GoldRule align="left" aria-hidden="true" />
        <Quote
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.12 }}
        >
          {headline}
          {scriptureRef && (
            <Box
              component="span"
              sx={{
                display: 'block',
                mt: 0.75,
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                color: brand.navy,
                fontWeight: 700,
              }}
            >
              — {scriptureRef}
            </Box>
          )}
        </Quote>
      </NameTop>

      <HatchYear aria-hidden="true">1964</HatchYear>

      <SubjectStage>
        <SubjectWrap
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.06 }}
        >
          <SubjectBackdrop aria-hidden="true" />
          <SubjectImg src={subjectImage} alt="" />
        </SubjectWrap>
      </SubjectStage>

      {secondName ? (
        <NameBottom>
          <SplitWord
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.1 }}
            aria-hidden="true"
            sx={{ textAlign: 'right' }}
          >
            {secondName}
          </SplitWord>
          <GoldRule align="right" aria-hidden="true" />
          {tagline && <BrandTag>{tagline}</BrandTag>}
        </NameBottom>
      ) : (
        tagline && (
          <NameBottom>
            <BrandTag>{tagline}</BrandTag>
          </NameBottom>
        )
      )}
    </Root>
  );
};

export default HomeHero;
