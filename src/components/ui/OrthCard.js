import React from 'react';
import { Box, Card } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { brand } from '../../brand';

const Frame = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 2,
  backgroundColor: brand.surfaceElevated,
  border: `1px solid ${brand.borderSubtle}`,
  boxShadow: 'none',
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(90deg, ${brand.navyDark}, ${brand.gold}, ${brand.navyDark})`,
    zIndex: 2,
  },
  '&:hover': {
    transform: 'translateY(-6px)',
    borderColor: alpha(brand.gold, 0.55),
  },
}));

const OrthCard = ({ children, sx, ...props }) => (
  <Frame sx={sx} elevation={0} {...props}>
    {children}
  </Frame>
);

export default OrthCard;
