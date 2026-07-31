import React, { useMemo } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { brand } from '../../brand';

/** Same viewport contract as HomeHero */
const DESKTOP_NAV = '96px';
const MOBILE_NAV = '72px';
const easeOut = [0.16, 1, 0.3, 1];

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
  '@supports (height: 100dvh)': {
    height: `calc(100dvh - ${DESKTOP_NAV})`,
    maxHeight: `calc(100dvh - ${DESKTOP_NAV})`,
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(0.2rem, 0.9vh, 0.5rem)',
    height: `calc(100vh - ${MOBILE_NAV})`,
    maxHeight: `calc(100vh - ${MOBILE_NAV})`,
    overflow: 'hidden',
    padding: 'clamp(0.4rem, 1.4vh, 0.85rem) clamp(0.75rem, 3vw, 1.25rem)',
    '@supports (height: 100dvh)': {
      height: `calc(100dvh - ${MOBILE_NAV})`,
      maxHeight: `calc(100dvh - ${MOBILE_NAV})`,
    },
  },
}));

const BgPhoto = styled(motion.div)({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  backgroundPosition: 'center 35%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
});

const BgVeil = styled(motion.div)({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background: `linear-gradient(180deg, ${alpha(brand.white, 0.86)} 0%, ${alpha('#F7FAFC', 0.82)} 45%, ${alpha(brand.stone, 0.9)} 100%)`,
});

const RevealCurtain = styled(motion.div)({
  position: 'absolute',
  inset: 0,
  zIndex: 8,
  pointerEvents: 'none',
  background: `linear-gradient(180deg, ${brand.white} 0%, ${brand.stone} 100%)`,
});

const SplitWord = styled(motion.p)(({ theme }) => ({
  margin: 0,
  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
  fontWeight: 700,
  fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
  lineHeight: 0.95,
  letterSpacing: '-0.025em',
  color: brand.navy,
  [theme.breakpoints.down('md')]: {
    fontSize: 'clamp(1.75rem, 6.5vh, 2.4rem)',
    lineHeight: 1,
  },
}));

const Meta = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  zIndex: 3,
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

const LeftCrest = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0,
});

const CrestOrnament = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  marginBottom: 10,
  [theme.breakpoints.down('md')]: { display: 'none' },
}));

const CrestHairline = styled(Box)({
  width: 28,
  height: 1,
  background: `linear-gradient(90deg, transparent, ${alpha(brand.gold, 0.85)}, transparent)`,
});

const DiamondRule = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  marginTop: 10,
  marginBottom: 4,
  [theme.breakpoints.down('md')]: { display: 'none' },
}));

const YearPlate = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 6,
  padding: '10px 18px 8px',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    background: `linear-gradient(180deg, transparent, ${alpha(brand.gold, 0.75)}, transparent)`,
  },
  '&::before': { left: 0 },
  '&::after': { right: 0 },
  [theme.breakpoints.down('md')]: {
    marginTop: 2,
    padding: 0,
    '&::before, &::after': { display: 'none' },
  },
}));

const YearMark = styled(motion.p)(({ theme }) => ({
  margin: 0,
  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
  fontWeight: 600,
  fontSize: 'clamp(1.85rem, 3.4vw, 2.9rem)',
  lineHeight: 1,
  letterSpacing: '0.12em',
  color: alpha(brand.navy, 0.55),
  userSelect: 'none',
  [theme.breakpoints.down('md')]: {
    marginTop: 3,
    fontSize: 'clamp(1.05rem, 3.6vh, 1.4rem)',
    letterSpacing: '0.1em',
    color: alpha(brand.navy, 0.4),
  },
}));

const YearCaption = styled(motion.p)(({ theme }) => ({
  margin: '6px 0 0',
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  fontSize: '0.62rem',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: brand.goldDark,
  [theme.breakpoints.down('md')]: {
    marginTop: 1,
    fontSize: '0.52rem',
    letterSpacing: '0.18em',
  },
}));

const BrandTag = styled(motion.p)(({ theme }) => ({
  margin: '6px 0 0',
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(0.65rem, 0.95vw, 0.8rem)',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: brand.goldDark,
  [theme.breakpoints.down('md')]: {
    marginTop: 2,
    fontSize: '0.58rem',
    letterSpacing: '0.2em',
  },
}));

const GoldRule = styled(motion.div)(({ theme }) => ({
  width: 52,
  height: 2.5,
  marginTop: 8,
  borderRadius: 2,
  background: brand.gold,
  boxShadow: `0 0 12px ${alpha(brand.gold, 0.4)}`,
  transformOrigin: 'center',
  [theme.breakpoints.down('md')]: {
    width: 36,
    height: 2,
    marginTop: 3,
    boxShadow: 'none',
  },
}));

const MobileGoldRule = styled(GoldRule)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: { display: 'block' },
}));

const CenterCol = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  gap: 10,
  maxWidth: 'min(42vw, 440px)',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    gap: 6,
    flex: '0 1 auto',
    minHeight: 0,
  },
}));

const LogoMark = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: -18,
  marginBottom: 2,
  [theme.breakpoints.down('md')]: {
    marginTop: -4,
    marginBottom: 0,
  },
}));

const SubjectWrap = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: 'min(32vw, 52vh, 400px)',
  height: 'min(32vw, 52vh, 400px)',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: 'min(50vw, 32vh, 240px)',
    height: 'min(50vw, 32vh, 240px)',
  },
}));

const SubjectBackdrop = styled(motion.div)({
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

const SubjectImg = styled(motion.img, {
  shouldForwardProp: (p) => p !== 'fit' && p !== 'objectPos',
})(({ fit = 'contain', objectPos }) => ({
  position: 'relative',
  zIndex: 1,
  width: fit === 'cover' ? '100%' : '88%',
  height: fit === 'cover' ? '100%' : '88%',
  objectFit: fit,
  objectPosition: objectPos || (fit === 'cover' ? 'center 28%' : 'center center'),
  borderRadius: fit === 'cover' ? '50%' : 0,
  filter: fit === 'cover' ? 'none' : 'drop-shadow(0 14px 28px rgba(0, 14, 31, 0.16))',
}));

/** About story lead under the subject — not a scripture quote */
const StoryLead = styled(motion.p, {
  shouldForwardProp: (p) => p !== 'lineClamp' && p !== 'mobileLineClamp',
})(({ theme, lineClamp = 4, mobileLineClamp = 3 }) => ({
  margin: '2px 0 0',
  maxWidth: 380,
  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
  fontWeight: 600,
  fontStyle: 'normal',
  fontSize: 'clamp(0.88rem, 1.2vw, 1.05rem)',
  lineHeight: 1.4,
  letterSpacing: '-0.01em',
  textAlign: 'center',
  color: brand.navy,
  display: '-webkit-box',
  WebkitLineClamp: lineClamp,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    maxWidth: 300,
    WebkitLineClamp: mobileLineClamp,
    fontSize: '0.78rem',
    lineHeight: 1.35,
  },
}));

const PlaceLine = styled(motion.p)(({ theme }) => ({
  margin: '8px 0 0',
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 600,
  fontSize: 'clamp(0.68rem, 0.9vw, 0.78rem)',
  letterSpacing: '0.08em',
  color: alpha(brand.ink, 0.55),
  [theme.breakpoints.down('md')]: {
    marginTop: 4,
    fontSize: '0.62rem',
  },
}));

const ChapterMark = styled(motion.p)(({ theme }) => ({
  margin: 0,
  fontFamily: '"Source Sans 3", sans-serif',
  fontWeight: 700,
  fontSize: '0.62rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: brand.goldDark,
  [theme.breakpoints.down('md')]: {
    fontSize: '0.55rem',
    letterSpacing: '0.16em',
  },
}));

const WordMask = styled(motion.span)(({ theme }) => ({
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'bottom',
  lineHeight: 1.15,
  paddingBottom: '0.08em',
  [theme.breakpoints.down('md')]: { overflow: 'visible' },
}));

const WordInner = styled(motion.span)({
  display: 'inline-block',
});

function EthiopicCross({ size = 14, color = brand.goldDark }) {
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

/** One-token brand spellings that still need the Amde | Haymanot split */
const COMPOUND_BRAND_SPLITS = [
  [/^amdehaayimaanot$/i, ['Amde', 'Haayimaanot']],
  [/^amdehayimanot$/i, ['Amde', 'Haymanot']],
  [/^amdehaymanot$/i, ['Amde', 'Haymanot']],
  [/^ዓምደሃይማኖት$/, ['ዓምደ', 'ሃይማኖት']],
  [/^አምደሃይማኖት$/, ['አምደ', 'ሃይማኖት']],
];

function splitBrandName(name) {
  const trimmed = String(name || '').trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')];
  const token = parts[0] || trimmed;
  for (const [pattern, split] of COMPOUND_BRAND_SPLITS) {
    if (pattern.test(token)) return split;
  }
  return [token || name, ''];
}

/**
 * About hero — same paradigm as HomeHero, different content:
 * procession photo in the circle, vision lead, place line, Our Story tag.
 */
export default function AboutHero({
  brandName,
  tagline,
  storyTitle,
  storyLead,
  placeLabel,
  yearCaption = 'Est. E.C.',
  foundedYear = '1964',
  subjectImage,
  subjectFit = 'cover',
  subjectPosition,
  logoSrc,
  backgroundImage,
  lineClamp = 4,
  mobileLineClamp = 3,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const reduceMotion = useReducedMotion();
  const [firstName, secondName] = useMemo(() => splitBrandName(brandName), [brandName]);

  const maskedWord = (delay = 0) =>
    reduceMotion || isMobile
      ? {}
      : {
          initial: { y: '110%' },
          animate: { y: '0%' },
          transition: { duration: 0.9, ease: easeOut, delay },
        };

  const renderSplitWord = (word, delay) => {
    if (!word) return null;
    if (isMobile || reduceMotion) {
      return <SplitWord aria-hidden="true">{word}</SplitWord>;
    }
    return (
      <SplitWord aria-hidden="true">
        <WordMask>
          <WordInner {...maskedWord(delay)}>{word}</WordInner>
        </WordMask>
      </SplitWord>
    );
  };

  return (
    <Root>
      {!reduceMotion && (
        <RevealCurtain
          aria-hidden
          initial={{ y: '0%' }}
          animate={{ y: '-105%' }}
          transition={{ duration: 1.1, ease: easeOut, delay: 0.05 }}
        />
      )}

      {backgroundImage ? (
        <>
          <BgPhoto
            aria-hidden
            style={{ backgroundImage: `url(${backgroundImage})` }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: easeOut, delay: 0.35 }}
          />
          <BgVeil
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: easeOut, delay: 0.4 }}
          />
        </>
      ) : null}

      <Typography component="h1" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        {brandName}
        {tagline ? ` — ${tagline}` : ''}
        {foundedYear ? `, est. ${foundedYear}` : ''}
      </Typography>

      <Meta
        initial={reduceMotion || isMobile ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.5 }}
      >
        <LeftCrest aria-hidden="true">
          <CrestOrnament
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easeOut, delay: 0.7 }}
          >
            <CrestHairline />
            <EthiopicCross size={13} color={brand.goldDark} />
            <CrestHairline />
          </CrestOrnament>

          {renderSplitWord(firstName, 0.65)}

          <DiamondRule
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.65, ease: easeOut, delay: 1.05 }}
          >
            <Box sx={{ width: 36, height: 2, bgcolor: brand.gold, borderRadius: 1, boxShadow: `0 0 10px ${alpha(brand.gold, 0.35)}` }} />
            <Box sx={{ width: 7, height: 7, bgcolor: brand.gold, transform: 'rotate(45deg)', flexShrink: 0 }} />
            <Box sx={{ width: 36, height: 2, bgcolor: brand.gold, borderRadius: 1, boxShadow: `0 0 10px ${alpha(brand.gold, 0.35)}` }} />
          </DiamondRule>

          <MobileGoldRule
            aria-hidden="true"
            initial={reduceMotion || isMobile ? false : { clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 1.05 }}
          />

          {foundedYear && (
            <YearPlate
              initial={reduceMotion || isMobile ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: easeOut, delay: 1.2 }}
            >
              <YearMark>{foundedYear}</YearMark>
              <YearCaption>{yearCaption}</YearCaption>
            </YearPlate>
          )}
        </LeftCrest>
      </Meta>

      <CenterCol>
        {logoSrc && (
          <LogoMark
            initial={reduceMotion ? false : { opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ opacity: 1, clipPath: 'circle(75% at 50% 50%)' }}
            transition={{ duration: 0.85, ease: easeOut, delay: 0.55 }}
          >
            <Box
              component={motion.img}
              src={logoSrc}
              alt=""
              animate={reduceMotion || isMobile ? undefined : { y: [0, -3, 0] }}
              transition={
                reduceMotion || isMobile
                  ? undefined
                  : { y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2.2 } }
              }
              sx={{
                width: { xs: 52, md: 88 },
                height: { xs: 52, md: 88 },
                objectFit: 'contain',
                bgcolor: brand.white,
                borderRadius: '50%',
                border: `1.5px solid ${alpha(brand.navy, 0.15)}`,
                p: 0.5,
              }}
            />
          </LogoMark>
        )}

        <SubjectWrap
          initial={reduceMotion ? false : { clipPath: 'circle(0% at 50% 50%)', opacity: 0.6 }}
          animate={{ clipPath: 'circle(72% at 50% 50%)', opacity: 1 }}
          transition={{ duration: 1.15, ease: easeOut, delay: 0.5 }}
        >
          <motion.div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: '50%',
            }}
            animate={reduceMotion || isMobile ? undefined : { y: [0, -6, 0] }}
            transition={
              reduceMotion || isMobile
                ? undefined
                : { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }
            }
          >
            <SubjectBackdrop
              aria-hidden="true"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      boxShadow: [
                        `0 0 0 8px ${alpha(brand.gold, 0.1)}, 0 18px 48px ${alpha(brand.navyInk, 0.12)}`,
                        `0 0 0 12px ${alpha(brand.gold, 0.18)}, 0 22px 56px ${alpha(brand.navyInk, 0.16)}`,
                        `0 0 0 8px ${alpha(brand.gold, 0.1)}, 0 18px 48px ${alpha(brand.navyInk, 0.12)}`,
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }
              }
            />
            <SubjectImg src={subjectImage} alt="" fit={subjectFit} objectPos={subjectPosition} />
          </motion.div>
        </SubjectWrap>

        {(storyTitle || storyLead) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.85, px: 1 }}>
            {storyTitle && (
              <ChapterMark
                initial={reduceMotion || isMobile ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, ease: easeOut, delay: 1.15 }}
              >
                {storyTitle}
              </ChapterMark>
            )}
            {storyLead && (
              <StoryLead
                lineClamp={lineClamp}
                mobileLineClamp={mobileLineClamp}
                initial={reduceMotion || isMobile ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: easeOut, delay: 1.25 }}
              >
                {storyLead}
              </StoryLead>
            )}
          </Box>
        )}
      </CenterCol>

      <Meta
        initial={reduceMotion || isMobile ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {renderSplitWord(secondName, 0.8)}
        {secondName && (
          <GoldRule
            aria-hidden="true"
            initial={reduceMotion || isMobile ? false : { clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.7, ease: easeOut, delay: 1.15 }}
          />
        )}
        {tagline && (
          <BrandTag
            initial={reduceMotion || isMobile ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 1.35 }}
          >
            {tagline}
          </BrandTag>
        )}
        {placeLabel && (
          <PlaceLine
            initial={reduceMotion || isMobile ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 1.45 }}
          >
            {placeLabel}
          </PlaceLine>
        )}
      </Meta>
    </Root>
  );
}
