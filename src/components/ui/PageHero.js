import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled, alpha, keyframes } from '@mui/system';
import { motion } from 'framer-motion';
import { brand } from '../../brand';
import CathedralArch from './CathedralArch';
import OrthodoxPattern from './OrthodoxPattern';

const drift = keyframes`
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.1) translate(-1.5%, 1%); }
`;

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'flex-end',
  color: brand.white,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    minHeight: '92vh',
    alignItems: 'center',
  },
}));

const Media = styled(Box)({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  '& img, & .bg': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    animation: `${drift} 28s ease-in-out infinite alternate`,
  },
});

const Veil = styled(Box)({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  background: `
    linear-gradient(105deg, ${alpha(brand.navyInk, 0.92)} 0%, ${alpha(brand.navyDark, 0.72)} 48%, ${alpha(brand.navyDark, 0.45)} 100%),
    linear-gradient(0deg, ${alpha(brand.navyInk, 0.85)} 0%, transparent 45%)
  `,
});

const Glow = styled(Box)({
  position: 'absolute',
  top: '8%',
  left: '12%',
  width: 420,
  height: 420,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${alpha(brand.gold, 0.22)} 0%, transparent 70%)`,
  zIndex: 1,
  pointerEvents: 'none',
  filter: 'blur(8px)',
});

const Frame = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: theme.spacing(2.5),
  border: `1px solid ${alpha(brand.gold, 0.28)}`,
  zIndex: 2,
  pointerEvents: 'none',
  [theme.breakpoints.up('md')]: {
    inset: theme.spacing(4),
  },
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: brand.gold,
    borderStyle: 'solid',
  },
  '&::before': {
    top: -1,
    left: -1,
    borderWidth: '2px 0 0 2px',
  },
  '&::after': {
    bottom: -1,
    right: -1,
    borderWidth: '0 2px 2px 0',
  },
}));

const Content = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  zIndex: 3,
  width: '100%',
  paddingBottom: theme.spacing(10),
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(14),
    maxWidth: 720,
  },
}));

const BrandMark = styled(Typography)(({ theme }) => ({
  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
  fontWeight: 600,
  fontSize: 'clamp(2.4rem, 7vw, 5.2rem)',
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
  color: brand.white,
  textShadow: `0 4px 40px ${alpha(brand.navyInk, 0.5)}`,
  marginBottom: theme.spacing(2),
}));

const GoldRule = styled(Box)({
  width: 72,
  height: 2,
  background: brand.gold,
  marginBottom: 20,
});

/**
 * Full-bleed cathedral hero.
 * Brand-first: brandName is the dominant signal; headline supports it.
 */
const PageHero = ({
  backgroundImage,
  brandName,
  headline,
  support,
  actions,
  minHeight,
  children,
  sx,
}) => {
  // Legacy children mode (secondary pages)
  const hasStructured = brandName || headline;

  return (
    <Root sx={{ minHeight: minHeight || undefined, ...sx }}>
      {backgroundImage && (
        <Media>
          <Box
            className="bg"
            sx={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
          />
        </Media>
      )}
      <Veil />
      <Glow />
      <OrthodoxPattern opacity={0.07} color={brand.gold} sx={{ zIndex: 1 }} />
      <Frame />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          opacity: 0.7,
          transform: 'scaleY(-1)',
        }}
      >
        <CathedralArch />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        {hasStructured ? (
          <Content
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {brandName && <BrandMark component="h1">{brandName}</BrandMark>}
            <GoldRule />
            {headline && (
              <Typography
                component={brandName ? 'p' : 'h1'}
                sx={{
                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                  fontWeight: 500,
                  fontSize: { xs: '1.35rem', md: '1.65rem' },
                  lineHeight: 1.45,
                  color: alpha(brand.white, 0.92),
                  maxWidth: 540,
                  mb: 2,
                }}
              >
                {headline}
              </Typography>
            )}
            {support && (
              <Typography
                sx={{
                  color: alpha(brand.white, 0.72),
                  maxWidth: 480,
                  mb: 4,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  lineHeight: 1.75,
                }}
              >
                {support}
              </Typography>
            )}
            {actions}
          </Content>
        ) : (
          <Content
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', maxWidth: '100%', margin: '0 auto' }}
          >
            {children}
          </Content>
        )}
      </Container>

      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}>
        <CathedralArch />
      </Box>
    </Root>
  );
};

export default PageHero;
