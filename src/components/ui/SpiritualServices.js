import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { brand } from '../../brand';
import { WbSunny, NightsStay, Phone, SmartToy, InstallMobile, InfoOutlined } from '@mui/icons-material';

const easeOut = [0.16, 1, 0.3, 1];

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

function Filigree({ compact = false }) {
  return (
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.25,
        my: compact ? 1.5 : 2.5,
      }}
    >
      <Box sx={{ flex: 1, maxWidth: 120, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(brand.gold, 0.65)})` }} />
      <EthiopicCross size={compact ? 11 : 14} color={brand.goldDark} />
      <Box sx={{ flex: 1, maxWidth: 120, height: 1, background: `linear-gradient(90deg, ${alpha(brand.gold, 0.65)}, transparent)` }} />
    </Box>
  );
}

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  padding: theme.spacing(10, 2, 12),
  background: `linear-gradient(180deg, ${brand.stone} 0%, ${brand.white} 28%, #F7FAFC 70%, ${brand.stone} 100%)`,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(7, 2, 9),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.45,
    backgroundImage: `
      radial-gradient(ellipse 70% 40% at 50% 0%, ${alpha(brand.gold, 0.12)} 0%, transparent 55%),
      repeating-linear-gradient(60deg, transparent 0 18px, ${alpha(brand.navy, 0.03)} 18px 19px),
      repeating-linear-gradient(-60deg, transparent 0 18px, ${alpha(brand.navy, 0.02)} 18px 19px)
    `,
  },
}));

const HeaderBlock = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  maxWidth: 720,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(6),
  },
}));

const FeatureRow = styled(Box, {
  shouldForwardProp: (p) => p !== 'reverse',
})(({ theme, reverse }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 'clamp(1.5rem, 4vw, 4rem)',
  alignItems: 'center',
  marginBottom: 'clamp(3.5rem, 8vh, 6.5rem)',
  direction: reverse ? 'rtl' : 'ltr',
  '& > *': { direction: 'ltr' },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    marginBottom: '3.25rem',
    direction: 'ltr',
    textAlign: 'center',
  },
}));

const MediaStage = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 520,
  margin: '0 auto',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    maxWidth: 340,
  },
}));

const ArchFrame = styled(Box)({
  position: 'absolute',
  inset: 0,
  borderRadius: brand.archRadius,
  border: `1.5px solid ${alpha(brand.gold, 0.55)}`,
  background: `linear-gradient(180deg, ${alpha(brand.gold, 0.12)} 0%, transparent 50%)`,
  pointerEvents: 'none',
  zIndex: 0,
});

const CirclePlate = styled(motion.div)({
  position: 'relative',
  zIndex: 1,
  width: '86%',
  height: '86%',
  borderRadius: '50%',
  overflow: 'hidden',
  border: `2px solid ${alpha(brand.gold, 0.7)}`,
  boxShadow: `
    0 0 0 8px ${alpha(brand.gold, 0.12)},
    0 22px 56px ${alpha(brand.navyInk, 0.16)}
  `,
  background: brand.stone,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
});

const IndexMark = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: -8,
  left: -4,
  zIndex: 2,
  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
  fontWeight: 600,
  fontSize: 'clamp(3.5rem, 8vw, 6rem)',
  lineHeight: 0.85,
  color: alpha(brand.navy, 0.08),
  pointerEvents: 'none',
  userSelect: 'none',
  [theme.breakpoints.down('md')]: {
    left: '50%',
    transform: 'translateX(-50%)',
    top: -18,
  },
}));

const CopyCol = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: 460,
  [theme.breakpoints.down('md')]: {
    maxWidth: 520,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const GoldRule = styled(motion.div)(({ theme }) => ({
  width: 52,
  height: 2.5,
  marginTop: 14,
  marginBottom: 18,
  borderRadius: 2,
  background: brand.gold,
  boxShadow: `0 0 12px ${alpha(brand.gold, 0.35)}`,
  [theme.breakpoints.down('md')]: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const viewOpts = { once: true, amount: 0.2, margin: '0px 0px -40px 0px' };

/**
 * Cathedral-style services band — matches HomeHero visual language.
 */
const SpiritualServices = ({ eyebrow, title, features = [] }) => {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: viewOpts,
          transition: { duration: 0.7, ease: easeOut, delay },
        };

  return (
    <Root component="section" aria-labelledby="spiritual-services-title">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <HeaderBlock>
          <motion.div {...fadeUp(0)}>
            <Filigree />
            {eyebrow && (
              <Typography
                sx={{
                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                  color: brand.goldDark,
                  mb: 1.5,
                }}
              >
                {eyebrow}
              </Typography>
            )}
            <Typography
              component="h2"
              id="spiritual-services-title"
              sx={{
                m: 0,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 4.5vw, 3.35rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: brand.navy,
              }}
            >
              {title}
            </Typography>
            <Filigree compact />
          </motion.div>
        </HeaderBlock>

        {features.map((feature, index) => {
          const reverse = index % 2 === 1;
          const num = String(index + 1).padStart(2, '0');
          const isLast = index === features.length - 1;
          return (
            <FeatureRow
              key={feature.title}
              reverse={reverse ? 1 : 0}
              sx={isLast ? { mb: 0 } : undefined}
            >
              <MediaStage
                initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewOpts}
                transition={{ duration: 0.85, ease: easeOut }}
              >
                <ArchFrame aria-hidden />
                <IndexMark aria-hidden>{num}</IndexMark>
                <CirclePlate
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  transition={{ duration: 0.45, ease: easeOut }}
                >
                  <Box
                    component="img"
                    src={feature.image}
                    alt={feature.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </CirclePlate>
              </MediaStage>

              <CopyCol
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewOpts}
                transition={{ duration: 0.75, ease: easeOut, delay: 0.1 }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    gap: 1,
                    color: brand.goldDark,
                    mb: 1.5,
                  }}
                >
                  <EthiopicCross size={11} color={brand.goldDark} />
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      fontSize: '0.68rem',
                      color: brand.goldDark,
                    }}
                  >
                    {num}
                  </Typography>
                </Box>

                {feature.icon && (
                  <Box sx={{ color: brand.navy, mb: 1.25, opacity: 0.85 }}>
                    {React.cloneElement(feature.icon, { sx: { fontSize: 34 } })}
                  </Box>
                )}

                <Typography
                  component="h3"
                  sx={{
                    m: 0,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.65rem, 3vw, 2.45rem)',
                    lineHeight: 1.15,
                    letterSpacing: '-0.015em',
                    color: brand.navy,
                  }}
                >
                  {feature.title}
                </Typography>

                <GoldRule
                  initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={viewOpts}
                  transition={{ duration: 0.55, ease: easeOut, delay: 0.15 }}
                  style={{ transformOrigin: 'center' }}
                />

                <Box
                  sx={{
                    m: 0,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontSize: '1.02rem',
                    lineHeight: 1.85,
                    color: alpha(brand.ink, 0.72),
                    maxWidth: 440,
                  }}
                >
                  {feature.description.split('\n').map((line, i) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('📚') || trimmedLine.startsWith('📱')) {
                      const isEmoji = trimmedLine.startsWith('📚') || trimmedLine.startsWith('📱');
                      const textContent = isEmoji ? trimmedLine.substring(1).trim() : trimmedLine.replace('•', '').trim();
                      const lowerText = textContent.toLowerCase();

                      // Determine styling based on content
                      let styleConfig = {
                        icon: <InfoOutlined fontSize="small" />,
                        color: brand.goldDark,
                        bgcolor: alpha(brand.gold, 0.04),
                        borderColor: alpha(brand.gold, 0.15),
                        hoverBg: alpha(brand.gold, 0.08),
                        hoverBorder: alpha(brand.gold, 0.25)
                      };

                      if (lowerText.includes('morning') || lowerText.includes('ጠዋት') || lowerText.includes('day')) {
                        styleConfig = {
                          icon: <WbSunny fontSize="small" />,
                          color: '#f59e0b', // Amber
                          bgcolor: alpha('#f59e0b', 0.08),
                          borderColor: alpha('#f59e0b', 0.2),
                          hoverBg: alpha('#f59e0b', 0.12),
                          hoverBorder: alpha('#f59e0b', 0.35)
                        };
                      } else if (lowerText.includes('evening') || lowerText.includes('ምሽት') || lowerText.includes('night')) {
                        styleConfig = {
                          icon: <NightsStay fontSize="small" />,
                          color: '#6366f1', // Indigo
                          bgcolor: alpha('#6366f1', 0.08),
                          borderColor: alpha('#6366f1', 0.2),
                          hoverBg: alpha('#6366f1', 0.12),
                          hoverBorder: alpha('#6366f1', 0.35)
                        };
                      } else if (lowerText.includes('contact') || lowerText.includes('መረጃ') || lowerText.includes('ስልክ')) {
                        styleConfig = {
                          icon: <Phone fontSize="small" />,
                          color: '#10b981', // Emerald
                          bgcolor: alpha('#10b981', 0.08),
                          borderColor: alpha('#10b981', 0.2),
                          hoverBg: alpha('#10b981', 0.12),
                          hoverBorder: alpha('#10b981', 0.35)
                        };
                      } else if (isEmoji && (lowerText.includes('bot') || lowerText.includes('ቦት'))) {
                        styleConfig = {
                          icon: <SmartToy fontSize="small" />,
                          color: '#0ea5e9', // Light Blue
                          bgcolor: alpha('#0ea5e9', 0.08),
                          borderColor: alpha('#0ea5e9', 0.2),
                          hoverBg: alpha('#0ea5e9', 0.12),
                          hoverBorder: alpha('#0ea5e9', 0.35)
                        };
                      } else if (isEmoji && (lowerText.includes('app') || lowerText.includes('መተግበሪያ'))) {
                        styleConfig = {
                          icon: <InstallMobile fontSize="small" />,
                          color: '#ec4899', // Pink
                          bgcolor: alpha('#ec4899', 0.08),
                          borderColor: alpha('#ec4899', 0.2),
                          hoverBg: alpha('#ec4899', 0.12),
                          hoverBorder: alpha('#ec4899', 0.35)
                        };
                      }
                      
                      return (
                        <Box 
                          key={i} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            mt: 1.5, 
                            gap: 1.5, 
                            p: 1.5, 
                            bgcolor: styleConfig.bgcolor, 
                            borderRadius: 2, 
                            border: `1px solid ${styleConfig.borderColor}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: styleConfig.hoverBg,
                              borderColor: styleConfig.hoverBorder,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Box sx={{ color: styleConfig.color, mt: 0.1, display: 'flex' }}>
                            {styleConfig.icon}
                          </Box>
                          <Typography sx={{ fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif', fontSize: '0.98rem', fontWeight: 600, color: brand.navy }}>
                            {textContent}
                          </Typography>
                        </Box>
                      );
                    } else if (trimmedLine === '') {
                      return <Box key={i} sx={{ height: 8 }} />;
                    }
                    return (
                      <Typography key={i} sx={{ mb: 0.5, fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif', lineHeight: 1.85 }}>
                        {line}
                      </Typography>
                    );
                  })}
                </Box>
                {feature.link && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      href={feature.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                        borderColor: alpha(brand.navy, 0.3),
                        color: brand.navy,
                        '&:hover': {
                          borderColor: brand.navy,
                          backgroundColor: alpha(brand.navy, 0.04),
                        }
                      }}
                    >
                      {feature.link.text}
                    </Button>
                  </Box>
                )}
              </CopyCol>
            </FeatureRow>
          );
        })}
      </Container>
    </Root>
  );
};

export default SpiritualServices;
