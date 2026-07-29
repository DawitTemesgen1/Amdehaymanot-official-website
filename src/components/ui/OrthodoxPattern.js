import React from 'react';
import { Box } from '@mui/material';
import { brand } from '../../brand';

/** Subtle Ethiopian cross lattice — used as atmospheric texture */
const OrthodoxPattern = ({ opacity = 0.05, color = brand.navy, sx }) => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity,
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'>
          <g fill='none' stroke='${color}' stroke-width='0.75'>
            <path d='M36 10v52M10 36h52'/>
            <path d='M36 22v28M22 36h28' stroke-width='1.25'/>
            <circle cx='36' cy='36' r='18' opacity='0.5'/>
          </g>
        </svg>
      `)}")`,
      backgroundSize: '72px 72px',
      ...sx,
    }}
  />
);

export default OrthodoxPattern;
