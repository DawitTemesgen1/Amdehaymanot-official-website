import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { brand } from '../../brand';

const ArchRoot = styled(Box)(({ theme, flip }) => ({
  position: 'relative',
  width: '100%',
  height: 40,
  overflow: 'hidden',
  lineHeight: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '140%',
    height: 80,
    backgroundColor: flip ? brand.stone : brand.navyDark,
    ...(flip
      ? { bottom: 0, borderRadius: '0 0 50% 50% / 0 0 40px 40px' }
      : { top: 0, borderRadius: brand.archRadius }),
  },
}));

const ArchAccent = ({ flip = false, sx }) => (
  <ArchRoot flip={flip ? 1 : 0} sx={sx} aria-hidden="true" />
);

export default ArchAccent;
