import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { brand } from '../../brand';
import { PLAY_STORE_URL } from '../../config/links';
import crestLogo from '../../assets/logo.png';

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.28 };

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

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  padding: theme.spacing(9, 2, 10),
  background: `linear-gradient(155deg, ${brand.navyInk} 0%, ${brand.navyDark} 48%, ${brand.navy} 100%)`,
  color: brand.white,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(7, 2, 8),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.5,
    backgroundImage: `
      radial-gradient(ellipse 55% 70% at 88% 30%, ${alpha(brand.gold, 0.14)} 0%, transparent 58%),
      radial-gradient(ellipse 50% 45% at 8% 90%, ${alpha(brand.gold, 0.07)} 0%, transparent 55%),
      repeating-linear-gradient(60deg, transparent 0 18px, ${alpha(brand.gold, 0.035)} 18px 19px)
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
        width={26}
        height={26}
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
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.8,
          }}
        >
          GET IT ON
        </Typography>
        <Typography
          component="span"
          sx={{
            display: 'block',
            fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
            fontSize: '1.12rem',
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
 * Homepage app promo — opens the Google Play listing.
 */
const AppPromoBand = ({
  title,
  subtitle,
  ctaLabel,
  eyebrow,
  features = [],
  href = PLAY_STORE_URL,
  markImage = crestLogo,
}) => {
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.15fr) minmax(0, 0.85fr)' },
            gap: { xs: 4.5, md: 6 },
            alignItems: 'center',
          }}
        >
          <Box
            component={motion.div}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOpts}
            transition={{ duration: 0.65, ease: easeOut }}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: 1.2,
                mb: 2.25,
              }}
            >
              <Box sx={{ width: 28, height: 1, bgcolor: alpha(brand.gold, 0.75) }} />
              <EthiopicCross size={12} />
              <Typography
                sx={{
                  m: 0,
                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: brand.gold,
                }}
              >
                {eyebrow}
              </Typography>
            </Box>

            <Typography
              id="app-promo-title"
              component="h2"
              sx={{
                m: 0,
                mb: 2,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.9rem, 3.8vw, 2.85rem)',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                color: brand.white,
                maxWidth: 520,
                mx: { xs: 'auto', md: 0 },
              }}
            >
              {title}
            </Typography>

            <Box
              aria-hidden
              sx={{
                width: 48,
                height: 2,
                mb: 2.5,
                bgcolor: brand.gold,
                mx: { xs: 'auto', md: 0 },
              }}
            />

            <Typography
              sx={{
                m: 0,
                mb: features.length ? 3 : 4,
                maxWidth: 480,
                mx: { xs: 'auto', md: 0 },
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: '1.02rem',
                lineHeight: 1.75,
                color: alpha(brand.white, 0.76),
              }}
            >
              {subtitle}
            </Typography>

            {features.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.35,
                  mb: 4,
                  maxWidth: 420,
                  mx: { xs: 'auto', md: 0 },
                  textAlign: 'left',
                }}
              >
                {features.map((feature) => (
                  <Box
                    key={feature}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 1.25,
                      alignItems: 'start',
                    }}
                  >
                    <EthiopicCross size={11} color={alpha(brand.gold, 0.9)} />
                    <Typography
                      sx={{
                        m: 0,
                        fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        color: alpha(brand.white, 0.88),
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Button
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              sx={{
                borderRadius: 1,
                px: 2.75,
                py: 1.45,
                textTransform: 'none',
                boxShadow: 'none',
                bgcolor: brand.gold,
                color: brand.navyInk,
                '&:hover': {
                  bgcolor: brand.goldLight,
                  boxShadow: `0 12px 32px ${alpha(brand.gold, 0.28)}`,
                },
              }}
            >
              <PlayBadge label={ctaLabel} />
            </Button>
          </Box>

          <Box
            component={motion.div}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewOpts}
            transition={{ duration: 0.75, ease: easeOut, delay: 0.08 }}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: { xs: 1, md: 2 },
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                width: { xs: 220, md: 280 },
                height: { xs: 220, md: 280 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(brand.gold, 0.22)} 0%, transparent 68%)`,
                filter: 'blur(6px)',
              }}
            />
            <Box
              sx={{
                position: 'relative',
                width: { xs: 168, md: 210 },
                height: { xs: 168, md: 210 },
                borderRadius: '50%',
                p: '4px',
                background: `linear-gradient(145deg, ${brand.goldLight}, ${brand.gold} 45%, ${brand.goldDark})`,
                boxShadow: `0 24px 60px ${alpha(brand.navyInk, 0.45)}`,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  bgcolor: brand.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2.5,
                }}
              >
                <Box
                  component="img"
                  src={markImage}
                  alt=""
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Root>
  );
};

export default AppPromoBand;
