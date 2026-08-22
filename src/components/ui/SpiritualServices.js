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
  width: '100%',
  maxWidth: '100%',
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
  width: '100%',
  maxWidth: '100%',
  marginBottom: 'clamp(3.5rem, 8vh, 6.5rem)',
  '& > *': { minWidth: 0, maxWidth: '100%' },
  ...(reverse
    ? {
        '& > *:first-of-type': { order: 2 },
        '& > *:last-of-type': { order: 1 },
      }
    : {}),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    marginBottom: '3.25rem',
    textAlign: 'center',
    '& > *:first-of-type': { order: 0 },
    '& > *:last-of-type': { order: 0 },
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
    0 0 0 6px ${alpha(brand.gold, 0.12)},
    0 18px 40px ${alpha(brand.navyInk, 0.14)}
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
  left: 8,
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
  width: '100%',
  minWidth: 0,
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

const viewOpts = { once: true, amount: 0.05 };

function stripLeadMarker(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith('•')) return { kind: 'bullet', text: trimmed.replace(/^•\s*/, '') };
  const emojiMatch = trimmed.match(/^(\p{Extended_Pictographic})\uFE0F?\s*/u);
  if (emojiMatch) return { kind: 'emoji', text: trimmed.slice(emojiMatch[0].length) };
  return null;
}

function detailStyleFor(text, kind) {
  const lower = text.toLowerCase();
  const iconSx = { fontSize: 20 };

  if (
    lower.includes('morning')
    || text.includes('ጠዋት')
    || (lower.includes('day') && !text.includes('ቀናት'))
  ) {
    return {
      icon: <WbSunny sx={iconSx} />,
      color: '#d97706',
      bgcolor: alpha('#f59e0b', 0.1),
      borderColor: alpha('#f59e0b', 0.35),
      hoverBg: alpha('#f59e0b', 0.16),
      hoverBorder: alpha('#f59e0b', 0.5),
    };
  }
  if (
    lower.includes('evening')
    || lower.includes('afternoon')
    || text.includes('ምሽት')
    || text.includes('ማታ')
    || text.includes('ከሰዓት')
    || lower.includes('night')
  ) {
    return {
      icon: <NightsStay sx={iconSx} />,
      color: '#4f46e5',
      bgcolor: alpha('#6366f1', 0.1),
      borderColor: alpha('#6366f1', 0.35),
      hoverBg: alpha('#6366f1', 0.16),
      hoverBorder: alpha('#6366f1', 0.5),
    };
  }
  if (
    lower.includes('contact')
    || lower.includes('call')
    || text.includes('መረጃ')
    || text.includes('ስልክ')
    || text.includes('ይደውሉ')
    || /\d{9,}/.test(text)
  ) {
    return {
      icon: <Phone sx={iconSx} />,
      color: '#059669',
      bgcolor: alpha('#10b981', 0.1),
      borderColor: alpha('#10b981', 0.35),
      hoverBg: alpha('#10b981', 0.16),
      hoverBorder: alpha('#10b981', 0.5),
    };
  }
  if (kind === 'emoji' && (lower.includes('bot') || text.includes('ቦት') || text.includes('ድጋፍ'))) {
    return {
      icon: <SmartToy sx={iconSx} />,
      color: '#0284c7',
      bgcolor: alpha('#0ea5e9', 0.1),
      borderColor: alpha('#0ea5e9', 0.35),
      hoverBg: alpha('#0ea5e9', 0.16),
      hoverBorder: alpha('#0ea5e9', 0.5),
    };
  }
  if (kind === 'emoji' && (lower.includes('app') || text.includes('መተግበሪያ') || text.includes('ዝማሬ'))) {
    return {
      icon: <InstallMobile sx={iconSx} />,
      color: '#db2777',
      bgcolor: alpha('#ec4899', 0.1),
      borderColor: alpha('#ec4899', 0.35),
      hoverBg: alpha('#ec4899', 0.16),
      hoverBorder: alpha('#ec4899', 0.5),
    };
  }

  return {
    icon: <InfoOutlined sx={iconSx} />,
    color: brand.goldDark,
    bgcolor: alpha(brand.gold, 0.1),
    borderColor: alpha(brand.gold, 0.4),
    hoverBg: alpha(brand.gold, 0.16),
    hoverBorder: alpha(brand.gold, 0.55),
  };
}

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
                  <Box sx={{ color: brand.navy, mb: 1.25, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    {React.cloneElement(feature.icon, {
                      sx: { fontSize: 34, color: brand.navy },
                    })}
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
                    width: '100%',
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  {feature.description.split('\n').map((line, i) => {
                    const trimmedLine = line.trim();
                    const marker = stripLeadMarker(trimmedLine);

                    if (marker) {
                      const styleConfig = detailStyleFor(marker.text, marker.kind);

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
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            '&:hover': {
                              bgcolor: styleConfig.hoverBg,
                              borderColor: styleConfig.hoverBorder,
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              color: styleConfig.color,
                              mt: 0.1,
                              display: 'inline-flex',
                              flexShrink: 0,
                              '& .MuiSvgIcon-root': { color: 'inherit', display: 'block' },
                            }}
                          >
                            {styleConfig.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                              fontSize: '0.98rem',
                              fontWeight: 600,
                              color: brand.navy,
                              overflowWrap: 'anywhere',
                              wordBreak: 'break-word',
                              minWidth: 0,
                            }}
                          >
                            {marker.text}
                          </Typography>
                        </Box>
                      );
                    }

                    if (trimmedLine === '') {
                      return <Box key={i} sx={{ height: 8 }} />;
                    }

                    return (
                      <Typography
                        key={i}
                        sx={{
                          mb: 0.5,
                          fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                          lineHeight: 1.85,
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                        }}
                      >
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
                      {...(String(feature.link.url).startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
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
