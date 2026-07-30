import React, { useState } from 'react';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import { alpha } from '@mui/system';
import { brand } from '../../brand';

function resolveImages(images = [], apiRoot = '') {
  return images
    .map((img) => {
      const path = typeof img === 'string' ? img : img?.image_url;
      if (!path) return null;
      if (path.startsWith('http')) return path;
      return `${apiRoot}${path}`;
    })
    .filter(Boolean);
}

export default function MediaGallery({ images = [], apiRoot = '', title = '' }) {
  const urls = resolveImages(images, apiRoot);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (urls.length <= 1) return null;

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };

  const prev = () => setIndex((i) => (i - 1 + urls.length) % urls.length);
  const next = () => setIndex((i) => (i + 1) % urls.length);

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Typography
          sx={{
            mb: 1.5,
            fontFamily: '"Source Sans 3", sans-serif',
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: brand.navy,
          }}
        >
          {title || 'Photos'}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1.5,
          }}
        >
          {urls.map((url, i) => (
            <Box
              key={`${url}-${i}`}
              component="button"
              type="button"
              onClick={() => openAt(i)}
              sx={{
                border: `1px solid ${alpha(brand.navy, 0.1)}`,
                p: 0,
                cursor: 'pointer',
                bgcolor: brand.stone,
                overflow: 'hidden',
                aspectRatio: '4 / 3',
              }}
            >
              <Box
                component="img"
                src={url}
                alt=""
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: alpha(brand.navyInk, 0.96),
            boxShadow: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', p: { xs: 1, sm: 2 } }}>
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              color: brand.white,
              bgcolor: alpha(brand.navyInk, 0.55),
            }}
          >
            <Close />
          </IconButton>
          {urls.length > 1 && (
            <>
              <IconButton
                onClick={prev}
                aria-label="Previous"
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  color: brand.white,
                  bgcolor: alpha(brand.navyInk, 0.55),
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={next}
                aria-label="Next"
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  color: brand.white,
                  bgcolor: alpha(brand.navyInk, 0.55),
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
          <Box
            component="img"
            src={urls[index]}
            alt=""
            sx={{
              width: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              display: 'block',
              mx: 'auto',
            }}
          />
          <Typography
            sx={{
              mt: 1.5,
              textAlign: 'center',
              color: alpha(brand.white, 0.75),
              fontSize: '0.85rem',
            }}
          >
            {index + 1} / {urls.length}
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}

export function contentImageList(item) {
  if (Array.isArray(item?.images) && item.images.length) return item.images;
  if (item?.image_url) return [{ image_url: item.image_url }];
  return [];
}
