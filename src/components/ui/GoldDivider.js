import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { brand } from '../../brand';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  width: '100%',
  maxWidth: 280,
  margin: `${theme.spacing(2)} auto`,
}));

const Line = styled(Box)({
  flex: 1,
  height: 1,
  background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
});

const Cross = styled(Box)({
  width: 12,
  height: 12,
  position: 'relative',
  flexShrink: 0,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    backgroundColor: brand.gold,
  },
  '&::before': { width: 12, height: 1.5, top: 5, left: 0 },
  '&::after': { width: 1.5, height: 12, top: 0, left: 5 },
});

const GoldDivider = ({ sx }) => (
  <Root sx={sx} aria-hidden="true">
    <Line />
    <Cross />
    <Line />
  </Root>
);

export default GoldDivider;
