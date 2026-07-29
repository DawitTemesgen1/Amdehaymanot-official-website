import React from 'react';
import { Box } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { brand } from '../../brand';
import OrthodoxPattern from './OrthodoxPattern';

const Root = styled(Box, {
  shouldForwardProp: (p) => p !== 'variant',
})(({ theme, variant }) => {
  const base = {
    padding: theme.spacing(11, 2),
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: { padding: theme.spacing(8, 2) },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(6, 2) },
  };

  if (variant === 'ink') {
    return {
      ...base,
      background: `linear-gradient(165deg, ${brand.navyInk} 0%, ${brand.navyDark} 45%, ${brand.navy} 100%)`,
      color: brand.white,
    };
  }
  if (variant === 'navy') {
    return {
      ...base,
      background: brand.navyDark,
      color: brand.white,
    };
  }
  if (variant === 'stone') {
    return { ...base, backgroundColor: brand.stone };
  }
  if (variant === 'white') {
    return { ...base, backgroundColor: brand.white };
  }
  if (variant === 'goldRail') {
    return {
      ...base,
      backgroundColor: brand.white,
      borderTop: `3px solid ${brand.gold}`,
      borderBottom: `1px solid ${alpha(brand.gold, 0.35)}`,
    };
  }
  return { ...base, backgroundColor: 'transparent' };
});

const PageSection = ({
  children,
  variant = 'default',
  pattern = false,
  sx,
  ...props
}) => (
  <Root variant={variant} sx={sx} component="section" {...props}>
    {pattern && (
      <OrthodoxPattern
        opacity={variant === 'ink' || variant === 'navy' ? 0.06 : 0.04}
        color={variant === 'ink' || variant === 'navy' ? brand.gold : brand.navy}
      />
    )}
    <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
  </Root>
);

export default PageSection;
