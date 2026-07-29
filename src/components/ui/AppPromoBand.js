import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { brand } from '../../brand';
import { PLAY_STORE_URL } from '../../config/links';

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.3 };

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  padding: theme.spacing(8, 2, 9),
  background: brand.navyInk,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2, 7),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    background: `
      radial-gradient(ellipse 70% 80% at 50% 120%, ${alpha(brand.navyLight, 0.35)} 0%, transparent 55%),
      linear-gradient(180deg, ${brand.navyDark} 0%, ${brand.navyInk} 100%)
    `,
  },
}));

function PlayBadge({ label }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box
        component="svg"
        width={28}
        height={28}
        viewBox="0 0 24 24"
        aria-hidden
        sx={{ display: 'block', flexShrink: 0 }}
      >
        <path
          fill="currentColor"
          d="M3.18 2.55a1.1 1.1 0 0 0-.43.9v16.9c0 .38.17.72.43.9l9.52-9.35L3.18 2.55Zm1.4-.55 9.85 9.66 2.66-2.61L6.3 1.4A1.5 1.5 0 0 0 4.58 2Zm14.1 7.08-2.55-1.48-2.86 2.8 2.86 2.8 2.6-1.5a1.55 1.55 0 0 0-.05-2.62ZM4.58 22a1.5 1.5 0 0 0 1.72-.03l10.8-6.24-2.66-2.61L4.58 22.55Z"
        />
      </Box>
      <Box sx={{ textAlign: 'left', lineHeight: 1.15 }}>
        <Typography
          component="span"
          sx={{
            display: 'block',
            fontFamily: '"Source Sans 3", sans-serif',
            fontSize: '0.62rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}
        >
          Google Play
        </Typography>
        <Typography
          component="span"
          sx={{
            display: 'block',
            fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
            fontSize: '1.05rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * App promo — opens the Google Play listing.
 */
const AppPromoBand = ({ title, subtitle, ctaLabel, href = PLAY_STORE_URL }) => {
  const reduceMotion = useReducedMotion();

  return (
    <Root component="section" aria-labelledby="app-promo-title">
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 2,
          zIndex: 2,
          background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
          opacity: 0.85,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          zIndex: 2,
          background: `linear-gradient(90deg, transparent, ${alpha(brand.gold, 0.7)}, transparent)`,
          opacity: 0.7,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOpts}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <Typography
            id="app-promo-title"
            component="h2"
            sx={{
              m: 0,
              fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
              fontWeight: 700,
              fontSize: 'clamp(1.85rem, 3.5vw, 2.6rem)',
              lineHeight: 1.15,
              color: brand.white,
            }}
          >
            {title}
          </Typography>

          <Box
            aria-hidden
            sx={{
              width: 48,
              height: 2,
              mx: 'auto',
              my: 2.25,
              bgcolor: brand.gold,
            }}
          />

          <Typography
            sx={{
              m: 0,
              mb: 4,
              mx: 'auto',
              maxWidth: 480,
              fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
              fontSize: '1.02rem',
              lineHeight: 1.75,
              color: alpha(brand.white, 0.72),
            }}
          >
            {subtitle}
          </Typography>

          <Button
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              boxShadow: 'none',
              bgcolor: brand.gold,
              color: brand.navyInk,
              '&:hover': {
                bgcolor: brand.goldLight,
                boxShadow: `0 10px 28px ${alpha(brand.gold, 0.28)}`,
              },
            }}
          >
            <PlayBadge label={ctaLabel} />
          </Button>
        </motion.div>
      </Container>
    </Root>
  );
};

export default AppPromoBand;
