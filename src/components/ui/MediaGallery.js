import React, { useEffect, useState } from 'react';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, Close, Collections } from '@mui/icons-material';
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

function FrameButton({ onClick, children, sx = {} }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        border: `1px solid ${alpha(brand.navy, 0.1)}`,
        p: 0,
        m: 0,
        cursor: 'pointer',
        bgcolor: brand.stone,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          borderColor: alpha(brand.goldDark, 0.55),
          boxShadow: `inset 0 0 0 1px ${alpha(brand.gold, 0.35)}`,
        },
        '&:hover .gallery-veil': { opacity: 1 },
        ...sx,
      }}
    >
      {children}
      <Box
        className="gallery-veil"
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          transition: 'opacity 0.25s ease',
          background: `linear-gradient(180deg, transparent 55%, ${alpha(brand.navyInk, 0.45)} 100%)`,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}

export default function MediaGallery({ images = [], apiRoot = '', title = '', lead = false }) {
  const urls = resolveImages(images, apiRoot);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + urls.length) % urls.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % urls.length);
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, urls.length]);

  if (urls.length === 0) return null;

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };

  const prev = () => setIndex((i) => (i - 1 + urls.length) % urls.length);
  const next = () => setIndex((i) => (i + 1) % urls.length);

  const featured = urls[0];
  const rest = urls.slice(1);
  const countLabel = `${urls.length} ${urls.length === 1 ? 'photo' : 'photos'}`;

  return (
    <>
      <Box
        sx={{
          mt: lead ? 0 : 5,
          mb: lead ? 4 : 0,
          pt: lead ? 0 : 4,
          borderTop: lead ? 'none' : `1px solid ${alpha(brand.navy, 0.1)}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Collections sx={{ fontSize: 18, color: brand.goldDark }} />
            <Typography
              sx={{
                m: 0,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: '1.35rem',
                lineHeight: 1.2,
                color: brand.navy,
              }}
            >
              {title || 'Photos'}
            </Typography>
          </Box>
          <Typography
            sx={{
              m: 0,
              fontFamily: '"Source Sans 3", sans-serif',
              fontWeight: 600,
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: alpha(brand.ink, 0.45),
            }}
          >
            {countLabel}
          </Typography>
        </Box>
        <Box aria-hidden sx={{ width: 40, height: 2, mb: 2.5, bgcolor: brand.gold }} />

        <FrameButton
          onClick={() => openAt(0)}
          sx={{
            width: '100%',
            mb: rest.length ? 1.5 : 0,
            p: { xs: 1, sm: 1.5 },
            minHeight: { xs: 200, sm: 260 },
          }}
        >
          <Box
            component="img"
            src={featured}
            alt=""
            sx={{
              display: 'block',
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: { xs: 280, sm: 360, md: 400 },
            }}
          />
          {urls.length > 1 && (
            <Typography
              sx={{
                position: 'absolute',
                right: 12,
                bottom: 10,
                zIndex: 1,
                m: 0,
                px: 1,
                py: 0.35,
                fontFamily: '"Source Sans 3", sans-serif',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: brand.white,
                bgcolor: alpha(brand.navyInk, 0.72),
              }}
            >
              View gallery
            </Typography>
          )}
        </FrameButton>

        {rest.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: rest.length === 1 ? '1fr' : 'repeat(3, minmax(0, 1fr))',
              },
              gap: 1.5,
            }}
          >
            {rest.map((url, i) => {
              const photoIndex = i + 1;
              const isOverflow = i === 5 && rest.length > 6;
              if (i > 5) return null;
              return (
                <FrameButton
                  key={`${url}-${photoIndex}`}
                  onClick={() => openAt(photoIndex)}
                  sx={{
                    aspectRatio: '4 / 3',
                    p: 0.75,
                  }}
                >
                  <Box
                    component="img"
                    src={url}
                    alt=""
                    sx={{
                      display: 'block',
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                  />
                  {isOverflow && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(brand.navyInk, 0.62),
                      }}
                    >
                      <Typography
                        sx={{
                          m: 0,
                          fontFamily: '"Cormorant Garamond", serif',
                          fontWeight: 700,
                          fontSize: '1.5rem',
                          color: brand.white,
                        }}
                      >
                        +{rest.length - 5}
                      </Typography>
                    </Box>
                  )}
                </FrameButton>
              );
            })}
          </Box>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: alpha(brand.navyInk, 0.97),
            boxShadow: 'none',
            borderRadius: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', p: { xs: 1.5, sm: 3 } }}>
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
            sx={{
              minHeight: { xs: 240, sm: 420 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={urls[index]}
              alt=""
              sx={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '78vh',
                display: 'block',
              }}
            />
          </Box>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
            }}
          >
            <Box aria-hidden sx={{ width: 24, height: 1, bgcolor: alpha(brand.gold, 0.7) }} />
            <Typography
              sx={{
                m: 0,
                textAlign: 'center',
                color: alpha(brand.white, 0.8),
                fontFamily: '"Source Sans 3", sans-serif',
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {index + 1} / {urls.length}
            </Typography>
            <Box aria-hidden sx={{ width: 24, height: 1, bgcolor: alpha(brand.gold, 0.7) }} />
          </Box>
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
