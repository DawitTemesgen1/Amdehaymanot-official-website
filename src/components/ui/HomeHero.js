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
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(1rem, 3vw, 2.75rem)',
  padding: 'clamp(0.75rem, 2vh, 1.5rem) clamp(1rem, 3vw, 2.5rem)',
  background: `linear-gradient(180deg, ${brand.white} 0%, #F7FAFC 55%, ${brand.stone} 100%)`,
  color: brand.ink,
  textAlign: 'center',
  // Soft continuity with the light desktop navbar above
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '0 0 auto 0',
    height: 48,
    pointerEvents: 'none',
    zIndex: 0,
    background: `linear-gradient(180deg, ${alpha(brand.white, 0.9)} 0%, transparent 100%)`,
  },
  '@supports (height: 100dvh)': {
    height: `calc(100dvh - ${DESKTOP_NAV})`,
    maxHeight: `calc(100dvh - ${DESKTOP_NAV})`,
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: 'clamp(0.35rem, 1.2vh, 0.85rem)',
    height: `calc(100vh - ${MOBILE_NAV})`,
    maxHeight: `calc(100vh - ${MOBILE_NAV})`,
    '&::before': { display: 'none' },
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
  fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
  lineHeight: 0.95,
  letterSpacing: '-0.025em',
  color: brand.navy,
  [theme.breakpoints.down('md')]: {
    fontSize: 'clamp(2rem, 10vw, 3rem)',
  },
}));

const Meta = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '1 1 0',
  minWidth: 0,
  maxWidth: 360,
  [theme.breakpoints.down('md')]: {
    flex: '0 0 auto',
    maxWidth: 520,
  },
}));

const Quote = styled(Typography)(({ theme }) => ({
  margin: 0,
  maxWidth: 360,
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 600,
  fontSize: 'clamp(0.68rem, 0.9vw, 0.85rem)',
  lineHeight: 1.4,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  textAlign: 'center',
  color: alpha(brand.ink, 0.68),
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    maxWidth: 420,
    WebkitLineClamp: 2,
    fontSize: '0.7rem',
  },
}));

const BrandTag = styled(Typography)({
  margin: '6px 0 0',
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(0.65rem, 0.95vw, 0.8rem)',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: brand.goldDark,
});

const GoldRule = styled(Box)({
  width: 52,
  height: 2.5,
  marginTop: 8,
  borderRadius: 2,
  background: brand.gold,
  boxShadow: `0 0 12px ${alpha(brand.gold, 0.4)}`,
});

const SubjectWrap = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: 'min(32vw, 52vh, 400px)',
  height: 'min(32vw, 52vh, 400px)',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: 'min(52vw, 38vh, 280px)',
    height: 'min(52vw, 38vh, 280px)',
  },
}));

const CenterCol = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  gap: 10,
  maxWidth: 'min(42vw, 440px)',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    gap: 8,
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

const LogoMark = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: -18,
  marginBottom: 2,
  [theme.breakpoints.down('md')]: {
    marginTop: -10,
  },
}));

const ease = [0.22, 1, 0.36, 1];

function splitBrandName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' ')];
  }
  return [parts[0] || name, ''];
}

/**
 * Desktop landscape: Amde | circular portrait | Haymanot
 * Mobile: vertical stack (unchanged)
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

      <Meta
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, ease }}
      >
        <SplitWord aria-hidden="true">{firstName}</SplitWord>
        <GoldRule aria-hidden="true" />
      </Meta>

      <CenterCol>
        {logoSrc && (
          <LogoMark>
            <Box
              component="img"
              src={logoSrc}
              alt=""
              sx={{
                width: { xs: 64, md: 88 },
                height: { xs: 64, md: 88 },
                objectFit: 'contain',
                bgcolor: brand.white,
                borderRadius: '50%',
                border: `1.5px solid ${alpha(brand.navy, 0.15)}`,
                p: 0.55,
              }}
            />
          </LogoMark>
        )}
        <SubjectWrap
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.06 }}
        >
          <SubjectBackdrop aria-hidden="true" />
          <SubjectImg src={subjectImage} alt="" />
        </SubjectWrap>
        {(headline || scriptureRef) && (
          <Quote>
            {headline}
            {scriptureRef && (
              <Box
                component="span"
                sx={{
                  display: 'block',
                  mt: 0.5,
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
        )}
      </CenterCol>

      <Meta
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, ease, delay: 0.1 }}
      >
        {secondName ? (
          <SplitWord aria-hidden="true">{secondName}</SplitWord>
        ) : null}
        {secondName && <GoldRule aria-hidden="true" />}
        {tagline && <BrandTag>{tagline}</BrandTag>}
      </Meta>
    </Root>
  );
};

export default HomeHero;
