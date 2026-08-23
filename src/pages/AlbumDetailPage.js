import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Container, Skeleton, Breadcrumbs, Link as MuiLink,
  IconButton, Stack, Tooltip, Dialog,
} from '@mui/material';
import { alpha } from '@mui/system';
import { Masonry } from '@mui/lab';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import SEO from '../components/layout/SEO';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import { brand } from '../brand';
import { PageSection } from '../components/ui';

const translations = {
  en: {
    appName: 'Amdehaymanot',
    pageTitle: 'Photo album',
    pageDescription: 'Browse photos from this Sunday School album.',
    galleryAlbums: 'Photo albums',
    photos: 'Photos',
    loadError: 'Could not load album details.',
    likeError: "Couldn't like the picture.",
    downloadError: 'Download failed.',
    downloadStarted: 'Download started…',
    linkCopied: 'Album link copied to clipboard!',
    likeTooltip: 'Love it',
    downloadTooltip: 'Download',
    shareTooltip: 'Share',
    shareText: 'Check out this image from the Amde Haymanot Gallery:',
    emptyAlbum: 'This album has no photos yet.',
  },
  om: {
    appName: 'Amdehaymanot',
    pageTitle: 'Albamii suuraa',
    pageDescription: 'Suuraalee albama Mana Barumsaa Sanbataa kanaa daawwadhaa.',
    galleryAlbums: 'Albamii suuraa',
    photos: 'Suuraalee',
    loadError: "Bal'ina albama fe'uu hin dandeenye.",
    likeError: 'Suuraa jaallachuu hin dandeenye.',
    downloadError: 'Download gochuun hin milkoofne.',
    downloadStarted: 'Download eegaleera…',
    linkCopied: 'Linkiin albama gara clipboard waraabame!',
    likeTooltip: 'Jaaladhu',
    downloadTooltip: 'Buusi',
    shareTooltip: 'Qooduu',
    shareText: 'Suuraa kana Galma Amdehaymanot irraa ilaalaa:',
    emptyAlbum: 'Albamni kun ammaaf suuraa hin qabu.',
  },
  ti: {
    appName: 'ዓምደሃይማኖት',
    pageTitle: 'ናይ ስእሊ ኣልበም',
    pageDescription: 'ካብዚ ናይ ቤት ትምህርቲ ሰንበት ኣልበም ስእልታት ድህሰሱ።',
    galleryAlbums: 'ናይ ስእሊ ኣልበማት',
    photos: 'ፎቶዎች',
    loadError: 'ዝርዝር ኣልበም ክጽዕን ኣይከኣለን።',
    likeError: 'ስእሊ ክፈትዎ ኣይከኣለን።',
    downloadError: 'ምውራድ ኣይተዓወተን።',
    downloadStarted: 'ምውራድ ጀሚሩ…',
    linkCopied: 'ናይ ኣልበም ሊንክ ናብ ቅንጥብጣብ ሰሌዳ ተቐዲሑ!',
    likeTooltip: 'ኣፍቅሮ',
    downloadTooltip: 'ኣውርድ',
    shareTooltip: 'ናይ ሓባር',
    shareText: 'ነዚ ምስሊ ካብ ዓምደ ሃይማኖት ጋለሪ ርኣይዎ፤',
    emptyAlbum: 'እዚ ኣልበም ክሳብ ሕጂ ስእሊ የብሉን።',
  },
  es: {
    appName: 'Amdehaymanot',
    pageTitle: 'Álbum de fotos',
    pageDescription: 'Explore las fotos de este álbum de la Escuela Dominical.',
    galleryAlbums: 'Álbumes de fotos',
    photos: 'Fotos',
    loadError: 'No se pudieron cargar los detalles del álbum.',
    likeError: 'No se pudo marcar la imagen.',
    downloadError: 'La descarga falló.',
    downloadStarted: 'Descarga iniciada…',
    linkCopied: '¡Enlace del álbum copiado al portapapeles!',
    likeTooltip: 'Me gusta',
    downloadTooltip: 'Descargar',
    shareTooltip: 'Compartir',
    shareText: 'Echa un vistazo a esta imagen de la galería Amde Haymanot:',
    emptyAlbum: 'Este álbum aún no tiene fotos.',
  },
  fr: {
    appName: 'Amdehaymanot',
    pageTitle: 'Album photos',
    pageDescription: 'Parcourez les photos de cet album de l’école du dimanche.',
    galleryAlbums: 'Albums photos',
    photos: 'Photos',
    loadError: 'Impossible de charger les détails de l’album.',
    likeError: 'Impossible d’aimer la photo.',
    downloadError: 'Le téléchargement a échoué.',
    downloadStarted: 'Téléchargement démarré…',
    linkCopied: 'Lien de l’album copié dans le presse-papier !',
    likeTooltip: 'Aimer',
    downloadTooltip: 'Télécharger',
    shareTooltip: 'Partager',
    shareText: 'Regardez cette image de la galerie Amde Haymanot :',
    emptyAlbum: 'Cet album n’a pas encore de photos.',
  },
  ar: {
    appName: 'آمدهيمانوت',
    pageTitle: 'ألبوم الصور',
    pageDescription: 'تصفح صور هذا الألبوم من مدرسة الأحد.',
    galleryAlbums: 'ألبومات الصور',
    photos: 'صور',
    loadError: 'تعذر تحميل تفاصيل الألبوم.',
    likeError: 'تعذر الإعجاب بالصورة.',
    downloadError: 'فشل التنزيل.',
    downloadStarted: 'بدأ التنزيل…',
    linkCopied: 'تم نسخ رابط الألبوم إلى الحافظة!',
    likeTooltip: 'أعجبني',
    downloadTooltip: 'تنزيل',
    shareTooltip: 'مشاركة',
    shareText: 'تحقق من هذه الصورة من معرض عمود الإيمان:',
    emptyAlbum: 'لا توجد صور في هذا الألبوم بعد.',
  },
  am: {
    appName: 'ዓምደሃይማኖት',
    pageTitle: 'የፎቶ አልበም',
    pageDescription: 'ከዚህ የሰንበት ትምህርት ቤት አልበም ፎቶዎችን ይመልከቱ።',
    galleryAlbums: 'የፎቶ አልበሞች',
    photos: 'ፎቶዎች',
    loadError: 'የአልበሙን ዝርዝሮች መጫን አልተቻለም።',
    likeError: 'ምስሉን መውደድ አልተቻለም።',
    downloadError: 'ማውረድ አልተሳካም።',
    downloadStarted: 'ማውረድ ተጀምሯል…',
    linkCopied: 'የአልበም ሊንክ ወደ ቅንጥብ ሰሌዳ ተቀድቷል!',
    likeTooltip: 'ይውደዱ',
    downloadTooltip: 'አውርድ',
    shareTooltip: 'አጋራ',
    shareText: 'ይህን ምስል ከአምደ ሃይማኖት ጋለሪ ይመልከቱ፡',
    emptyAlbum: 'ይህ አልበም እስካሁን ፎቶ የለውም።',
  },
  ge: {
    appName: 'ዓምደሃይማኖት',
    pageTitle: 'የፎቶ አልበም',
    pageDescription: 'ካብዚ ናይ ሰንበት ትምህርቲ ቤት ኣልበም ስእልታት ርአዩ።',
    galleryAlbums: 'የፎቶ አልበሞች',
    photos: 'ፎቶዎች',
    loadError: 'የአልበሙን ዝርዝሮች መጫን አልተቻለም።',
    likeError: 'ምስሉን መውደድ አልተቻለም።',
    downloadError: 'ማውረድ አልተሳካም።',
    downloadStarted: 'ማውረድ ተጀምሯል…',
    linkCopied: 'የአልበም ሊንክ ወደ ቅንጥብ ሰሌዳ ተቀድቷል!',
    likeTooltip: 'ይውደዱ',
    downloadTooltip: 'አውርድ',
    shareTooltip: 'አጋራ',
    shareText: 'ይህን ምስል ከአምደ ሃይማኖት ጋለሪ ይመልከቱ፡',
    emptyAlbum: 'እዚ አልበም ክሳብ ሕጂ ስእሊ የብሉን።',
  },
};

const navBtnSx = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  color: brand.white,
  bgcolor: alpha(brand.navyInk, 0.55),
  '&:hover': { bgcolor: alpha(brand.navyInk, 0.8) },
};

const AlbumDetailPage = ({ language = 'en' }) => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const t = translations[language] || translations.en;

  const fetchAlbum = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/gallery/albums/${albumId}`);
      setAlbum(response.data);
    } catch (error) {
      console.error('Fetch Album Detail Error:', error.response || error);
      enqueueSnackbar(t.loadError, { variant: 'error' });
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  }, [albumId, navigate, enqueueSnackbar, t.loadError]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const images = album?.images || [];
  const currentImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;
  const open = selectedImageIndex !== null;

  const handleLike = async (imageId) => {
    const originalAlbum = album;
    const updatedImages = images.map((img) =>
      img.id === imageId ? { ...img, likes: (img.likes || 0) + 1 } : img,
    );
    setAlbum({ ...album, images: updatedImages });
    try {
      await api.post(`/gallery/images/${imageId}/like`);
    } catch (error) {
      setAlbum(originalAlbum);
      enqueueSnackbar(t.likeError, { variant: 'error' });
      console.error('Like failed:', error.response || error);
    }
  };

  const handleDownload = async (imageId, title, originalFormat) => {
    try {
      enqueueSnackbar(t.downloadStarted, { variant: 'info' });
      const response = await api.get(`/gallery/images/${imageId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileExtension = originalFormat || 'webp';
      const filename = `${(title || `image-${imageId}`).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExtension}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      enqueueSnackbar(t.downloadError, { variant: 'error' });
    }
  };

  const handleShare = async (title) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `${t.shareText} ${title}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        enqueueSnackbar(t.linkCopied, { variant: 'info' });
      }
    } catch (e) {
      console.error('Sharing failed', e);
    }
  };

  const handleOpen = (index) => setSelectedImageIndex(index);
  const handleClose = () => setSelectedImageIndex(null);
  const handleNext = useCallback(() => {
    setSelectedImageIndex((prev) => (prev !== null && images.length ? (prev + 1) % images.length : null));
  }, [images.length]);
  const handlePrev = useCallback(() => {
    setSelectedImageIndex((prev) =>
      (prev !== null && images.length ? (prev - 1 + images.length) % images.length : null),
    );
  }, [images.length]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleNext, handlePrev]);

  if (loading || !album) {
    return (
      <Box sx={{ bgcolor: brand.stone, minHeight: '60vh' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Skeleton variant="text" width="40%" height={48} sx={{ bgcolor: brand.stoneDeep }} />
          <Skeleton variant="text" width="60%" height={28} sx={{ bgcolor: brand.stoneDeep }} />
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2} sx={{ mt: 4 }}>
            {Array.from(new Array(8)).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={180 + (index % 3) * 40}
                sx={{ bgcolor: brand.stoneDeep }}
              />
            ))}
          </Masonry>
        </Container>
      </Box>
    );
  }

  const seoTitle = `${album.title} · ${t.pageTitle}`;
  const seoDescription = album.description || t.pageDescription;
  const photoCount = images.length;

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} language={language} />

      <Box sx={{ bgcolor: brand.stone }}>
        <Box
          sx={{
            py: { xs: 3, md: 4 },
            borderBottom: `1px solid ${alpha(brand.navy, 0.1)}`,
            background: `linear-gradient(180deg, ${brand.white} 0%, ${brand.stone} 100%)`,
          }}
        >
          <Container maxWidth="lg">
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                mb: 2,
                '& .MuiBreadcrumbs-separator': { color: alpha(brand.ink, 0.35) },
              }}
            >
              <MuiLink
                underline="hover"
                component="button"
                onClick={() => navigate('/gallery')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: '"Source Sans 3", sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: brand.navy,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  p: 0,
                }}
              >
                <ArrowBackIcon sx={{ mr: 0.5, fontSize: 18 }} />
                {t.galleryAlbums}
              </MuiLink>
              <Typography
                sx={{
                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                  fontSize: '0.85rem',
                  color: alpha(brand.ink, 0.55),
                }}
              >
                {album.title}
              </Typography>
            </Breadcrumbs>

            {album.categoryName && (
              <Typography
                sx={{
                  m: 0,
                  mb: 1,
                  fontFamily: '"Source Sans 3", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: brand.goldDark,
                }}
              >
                {album.categoryName}
              </Typography>
            )}

            <Typography
              component="h1"
              sx={{
                m: 0,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                lineHeight: 1.15,
                color: brand.navy,
              }}
            >
              {album.title}
            </Typography>

            <Box aria-hidden sx={{ width: 48, height: 2, my: 2, bgcolor: brand.gold }} />

            {album.description && (
              <Typography
                sx={{
                  m: 0,
                  mb: 2,
                  maxWidth: 640,
                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: alpha(brand.ink, 0.65),
                }}
              >
                {album.description}
              </Typography>
            )}

            <Stack direction="row" alignItems="center" spacing={1}>
              <PhotoLibraryIcon sx={{ fontSize: 16, color: brand.goldDark }} />
              <Typography
                sx={{
                  m: 0,
                  fontFamily: '"Source Sans 3", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: alpha(brand.ink, 0.55),
                }}
              >
                {photoCount} {t.photos}
              </Typography>
            </Stack>
          </Container>
        </Box>

        <PageSection variant="white">
          <Container maxWidth="lg">
            {photoCount === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <PhotoLibraryIcon sx={{ fontSize: 48, color: alpha(brand.navy, 0.22), mb: 2 }} />
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 600,
                    fontSize: '1.35rem',
                    color: brand.navy,
                  }}
                >
                  {t.emptyAlbum}
                </Typography>
              </Box>
            ) : (
              <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                {images.map((image, index) => (
                  <Box
                    key={image.id}
                    component={motion.div}
                    layout
                    onClick={() => handleOpen(index)}
                    sx={{
                      position: 'relative',
                      display: 'block',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: `1px solid ${alpha(brand.navy, 0.1)}`,
                      bgcolor: brand.stone,
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': {
                        borderColor: alpha(brand.goldDark, 0.55),
                        boxShadow: brand.shadowSoft,
                      },
                      '&:hover img': { transform: 'scale(1.04)' },
                      '& img': {
                        width: '100%',
                        display: 'block',
                        transition: 'transform 0.4s ease',
                      },
                    }}
                  >
                    <LazyLoadImage
                      alt={image.title || album.title}
                      src={`${API_ROOT_URL}${image.thumbnail_url || image.image_url}`}
                      effect="blur"
                      style={{ width: '100%', display: 'block' }}
                    />
                  </Box>
                ))}
              </Masonry>
            )}
          </Container>
        </PageSection>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
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
            onClick={handleClose}
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
            <CloseIcon />
          </IconButton>

          {photoCount > 1 && (
            <>
              <IconButton onClick={handlePrev} aria-label="Previous" sx={{ ...navBtnSx, left: 8 }}>
                <ChevronLeft />
              </IconButton>
              <IconButton onClick={handleNext} aria-label="Next" sx={{ ...navBtnSx, right: 8 }}>
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
            {currentImage && (
              <Box
                component="img"
                src={`${API_ROOT_URL}${currentImage.image_url}`}
                alt={currentImage.title || ''}
                sx={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '72vh',
                  display: 'block',
                }}
              />
            )}
          </Box>

          {currentImage && (
            <Stack spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
              {currentImage.title && (
                <Typography
                  sx={{
                    m: 0,
                    color: brand.white,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 600,
                    fontSize: '1.15rem',
                    textAlign: 'center',
                  }}
                >
                  {currentImage.title}
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box aria-hidden sx={{ width: 24, height: 1, bgcolor: alpha(brand.gold, 0.7) }} />
                <Typography
                  sx={{
                    m: 0,
                    color: alpha(brand.white, 0.8),
                    fontFamily: '"Source Sans 3", sans-serif',
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedImageIndex + 1} / {photoCount}
                </Typography>
                <Box aria-hidden sx={{ width: 24, height: 1, bgcolor: alpha(brand.gold, 0.7) }} />
              </Box>

              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  bgcolor: alpha(brand.navyInk, 0.55),
                  border: `1px solid ${alpha(brand.gold, 0.35)}`,
                }}
              >
                <Tooltip title={t.likeTooltip}>
                  <IconButton
                    size="small"
                    sx={{ color: brand.white }}
                    onClick={() => handleLike(currentImage.id)}
                  >
                    <FavoriteIcon fontSize="small" sx={{ color: brand.gold }} />
                  </IconButton>
                </Tooltip>
                <Typography
                  sx={{
                    m: 0,
                    minWidth: '2ch',
                    color: alpha(brand.white, 0.85),
                    fontFamily: '"Source Sans 3", sans-serif',
                    fontSize: '0.85rem',
                  }}
                >
                  {currentImage.likes || 0}
                </Typography>
                <Tooltip title={t.downloadTooltip}>
                  <IconButton
                    size="small"
                    sx={{ color: brand.white }}
                    onClick={() =>
                      handleDownload(
                        currentImage.id,
                        currentImage.title,
                        currentImage.original_format,
                      )
                    }
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t.shareTooltip}>
                  <IconButton
                    size="small"
                    sx={{ color: brand.white }}
                    onClick={() => handleShare(currentImage.title)}
                  >
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default AlbumDetailPage;
