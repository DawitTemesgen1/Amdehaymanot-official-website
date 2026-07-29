import React from 'react';
import { Box, Typography } from '@mui/material';
import { brand } from '../../brand';

const ScriptureChip = ({ label, sx, ...props }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      mb: 2,
      px: 1.5,
      py: 0.5,
      fontFamily: '"Source Sans 3", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      fontSize: '0.7rem',
      color: brand.navyInk,
      backgroundColor: brand.gold,
      border: `1px solid ${brand.goldDark}`,
      ...sx,
    }}
    {...props}
  >
    {label}
  </Box>
);

export default ScriptureChip;
