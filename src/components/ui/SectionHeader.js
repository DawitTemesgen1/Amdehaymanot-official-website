import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { brand } from '../../brand';
import GoldDivider from './GoldDivider';

const Eyebrow = styled(Typography)({
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 600,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontSize: '0.72rem',
  color: brand.navy,
  marginBottom: 12,
});

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
  fontWeight: 600,
  color: brand.navyDark,
  lineHeight: 1.15,
}));

const SectionHeader = ({
  title,
  subtitle,
  eyebrow,
  variant = 'h2',
  align = 'center',
  light = false,
  animated = true,
  sx,
}) => {
  const content = (
    <Box sx={{ textAlign: align, mb: { xs: 5, md: 7 }, ...sx }}>
      {eyebrow && (
        <Eyebrow sx={{ color: light ? brand.gold : brand.navy }}>
          {eyebrow}
        </Eyebrow>
      )}
      <Title
        variant={variant}
        component="h2"
        sx={{ color: light ? brand.white : brand.navyDark }}
      >
        {title}
      </Title>
      <GoldDivider sx={{ my: 2.5, ...(align === 'left' && { mx: 0 }) }} />
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            mt: 1,
            maxWidth: 560,
            mx: align === 'center' ? 'auto' : 0,
            color: light ? 'rgba(255,255,255,0.78)' : 'text.secondary',
            lineHeight: 1.8,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  );
};

export default SectionHeader;
