import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { brand } from '../../brand';

const Root = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(3, 0),
  borderLeft: `3px solid ${brand.gold}`,
  paddingLeft: theme.spacing(3),
}));

const StatBlock = ({ value, label, sx, light = false }) => (
  <Root sx={sx}>
    <Typography
      sx={{
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 600,
        fontSize: { xs: '2.5rem', md: '3.25rem' },
        lineHeight: 1,
        color: light ? brand.gold : brand.navyDark,
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        mt: 1,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontSize: '0.72rem',
        color: light ? 'rgba(255,255,255,0.7)' : 'text.secondary',
      }}
    >
      {label}
    </Typography>
  </Root>
);

export default StatBlock;
