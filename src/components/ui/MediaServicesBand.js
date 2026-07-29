import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';
import { brand } from '../../brand';

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.2 };

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  padding: theme.spacing(8, 2, 9),
  background: brand.white,
  borderTop: `1px solid ${alpha(brand.navy, 0.08)}`,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2, 7),
  },
}));

const Layout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1.05fr',
  gap: 'clamp(2rem, 5vw, 4rem)',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(4),
  },
}));

const CopyCol = styled(motion.div)(({ theme }) => ({
  order: 1,
  [theme.breakpoints.down('md')]: {
    order: 2,
  },
}));

const MediaCol = styled(motion.div)(({ theme }) => ({
  order: 2,
  [theme.breakpoints.down('md')]: {
    order: 1,
  },
}));

const ServiceRow = styled(motion.div)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '40px 1fr',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
  transition: 'background-color 0.2s ease',
  '&:last-of-type': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: alpha(brand.stone, 0.65),
  },
}));

const IndexMark = styled(Box)({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: `1px solid ${alpha(brand.gold, 0.65)}`,
  background: brand.stone,
  color: brand.navy,
});

/**
 * Structured media-services band — clean list + framed photograph.
 */
const MediaServicesBand = ({
  title,
  text,
  services = [],
  ctaLabel,
  image,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <Root component="section" aria-labelledby="media-services-title">
      <Container maxWidth="lg">
        <Layout>
          <CopyCol
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOpts}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Typography
              id="media-services-title"
              component="h2"
              sx={{
                m: 0,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.85rem, 3.5vw, 2.6rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: brand.navy,
                maxWidth: 400,
              }}
            >
              {title}
            </Typography>

            <Box
              aria-hidden
              sx={{
                width: 48,
                height: 2,
                my: 2,
                bgcolor: brand.gold,
              }}
            />

            <Typography
              sx={{
                m: 0,
                mb: 3,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: '0.98rem',
                lineHeight: 1.75,
                color: alpha(brand.ink, 0.62),
                maxWidth: 420,
              }}
            >
              {text}
            </Typography>

            <Box sx={{ mb: 3.5 }}>
              {services.map((service, i) => (
                <ServiceRow
                  key={service.text}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewOpts}
                  transition={{ duration: 0.4, ease: easeOut, delay: 0.06 + i * 0.05 }}
                >
                  <IndexMark>
                    {service.icon
                      ? React.cloneElement(service.icon, {
                        sx: { fontSize: 20, color: brand.navy },
                      })
                      : (
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: brand.goldDark,
                            lineHeight: 1,
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </Typography>
                      )}
                  </IndexMark>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                      fontWeight: 600,
                      fontSize: '1.25rem',
                      lineHeight: 1.25,
                      color: brand.navy,
                    }}
                  >
                    {service.text}
                  </Typography>
                </ServiceRow>
              ))}
            </Box>

            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: 1,
                px: 3.25,
                py: 1.25,
                textTransform: 'none',
                fontWeight: 700,
                letterSpacing: '0.03em',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: `0 8px 24px ${alpha(brand.navy, 0.2)}`,
                },
              }}
            >
              {ctaLabel}
            </Button>
          </CopyCol>

          <MediaCol
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOpts}
            transition={{ duration: 0.65, ease: easeOut, delay: 0.08 }}
          >
            <Box
              sx={{
                position: 'relative',
                maxWidth: 560,
                ml: { md: 'auto' },
              }}
            >
              {/* Gold offset rail — single, quiet */}
              <Box
                aria-hidden
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: -10,
                  bottom: -10,
                  border: `1.5px solid ${alpha(brand.gold, 0.7)}`,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />

              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  overflow: 'hidden',
                  border: `1px solid ${alpha(brand.navy, 0.1)}`,
                }}
              >
                <Box
                  component={motion.img}
                  src={image}
                  alt=""
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                  sx={{
                    width: '100%',
                    height: { xs: 260, sm: 320, md: 420 },
                    objectFit: 'cover',
                    display: 'block',
                    verticalAlign: 'middle',
                  }}
                />

                {/* Soft bottom veil + gold diamond */}
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '28%',
                    background: `linear-gradient(180deg, transparent, ${alpha(brand.navyInk, 0.45)})`,
                    pointerEvents: 'none',
                  }}
                />
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    left: 18,
                    bottom: 16,
                    width: 8,
                    height: 8,
                    bgcolor: brand.gold,
                    transform: 'rotate(45deg)',
                  }}
                />
              </Box>
            </Box>
          </MediaCol>
        </Layout>
      </Container>
    </Root>
  );
};

export default MediaServicesBand;
