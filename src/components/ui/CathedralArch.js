import React from 'react';
import { Box } from '@mui/material';
import { brand } from '../../brand';

/** Full-width cathedral arch silhouette */
const CathedralArch = ({ sx, color = brand.gold }) => (
  <Box
    component="svg"
    viewBox="0 0 1440 180"
    preserveAspectRatio="none"
    aria-hidden="true"
    sx={{ width: '100%', height: { xs: 56, md: 100 }, display: 'block', ...sx }}
  >
    <defs>
      <linearGradient id="cathGold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={color} stopOpacity="0" />
        <stop offset="35%" stopColor={color} stopOpacity="0.85" />
        <stop offset="65%" stopColor={color} stopOpacity="0.85" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 180 V90 Q720 -20 1440 90 V180 Z"
      fill="none"
      stroke="url(#cathGold)"
      strokeWidth="1.5"
    />
    <path
      d="M180 180 V110 Q720 20 1260 110 V180 Z"
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      opacity="0.45"
    />
    <g transform="translate(720, 58)" opacity="0.9">
      <line x1="0" y1="-14" x2="0" y2="14" stroke={color} strokeWidth="1.8" />
      <line x1="-10" y1="-4" x2="10" y2="-4" stroke={color} strokeWidth="1.8" />
      <line x1="-6" y1="4" x2="6" y2="4" stroke={color} strokeWidth="1.2" />
    </g>
  </Box>
);

export default CathedralArch;
