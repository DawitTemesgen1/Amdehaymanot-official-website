import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Container, Skeleton, Grid, Breadcrumbs, Link as MuiLink, Chip,
  styled, Modal, Backdrop, Fade, IconButton, Stack, alpha, Tooltip
} from '@mui/material';
import { Masonry } from '@mui/lab';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Helmet } from 'react-helmet-async';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';

import api, { API_ROOT_URL } from '../api/axiosConfig';

const translations = {
    en: { appName: "Amde Haymanot", galleryAlbums: 'Gallery Albums', loadError: 'Failed to load album details.', likeError: 'Failed to like image.', downloadError: 'Download failed.', linkCopied: 'Album link copied to clipboard!', likeTooltip: 'Like', downloadTooltip: 'Download', shareTooltip: 'Share', shareText: 'Check out this image from the Amde Haymanot Gallery:' },
    am: { appName: "ዓምደ ሃይማኖት", galleryAlbums: 'የፎቶ አልበሞች', loadError: 'የአልበሙን ዝርዝሮች መጫን አልተቻለም።', likeError: 'ምስሉን መውደድ አልተቻለም።', downloadError: 'ማውረድ አልተሳካም።', linkCopied: 'የአልበም ሊንክ ወደ ቅንጥብ ሰሌዳ ተቀድቷል!', likeTooltip: 'ይውደዱ', downloadTooltip: 'አውርድ', shareTooltip: 'አጋራ', shareText: 'ይህን ምስል ከአምደ ሃይማኖት ጋለሪ ይመልከቱ፡' },
    om: { appName: "Amde Haymanot", galleryAlbums: 'Albamoota Suuraa', loadError: 'Bal\'ina albamii fe\'uu dadhabe.', likeError: 'Suura jaallachuu dadhabe.', downloadError: 'Buufachuun hin milkoofne.', linkCopied: 'Hidhaan albamii gara boordii qabduutti waraabameera!', likeTooltip: 'Jaaladhu', downloadTooltip: 'Buufadhu', shareTooltip: 'Qoodi', shareText: 'Suuraa kana Galarii Amde Haymanot irraa ilaali:' },
    ti: { appName: "ኣምደ ሃይማኖት", galleryAlbums: 'ኣልበማት ስእሊ', loadError: 'ዝርዝር ኣልበም ምጽዓን ኣይተኻእለን።', likeError: 'ምስሊ ላይክ ምግባር ኣይተኻእለን።', downloadError: 'ምውራድ ኣይተዓወተን።', linkCopied: 'ናይ ኣልበም ሊንክ ናብ ክሊፕቦርድ ተቐዲሑ!', likeTooltip: 'ፈተው', downloadTooltip: 'ኣውርድ', shareTooltip: 'ኣካፍል', shareText: 'ነዛ ስእሊ እዚኣ ካብ ኣምደ ሃይማኖት ጋለሪ ርኣይዋ፡' },
    ge: { appName: "አምደ ፡ ሃይማኖት", galleryAlbums: 'ማዕከለ ፡ ስእል ፡ አልበማት', loadError: 'ዝርዝረ ፡ አልበም ፡ ለጽዒኖት ፡ አልቦ።', likeError: 'ስእል ፡ ንምፍቃድ ፡ አልቦ።', downloadError: 'ንውርድ ፡ አልቦ።', linkCopied: 'መጠቆሚ ፡ አልበም ፡ ውስተ ፡ ሰሌዳ ፡ ቅንጣብ ፡ ተቀድሐ።', likeTooltip: 'ፍቀድ', downloadTooltip: 'አውርድ', shareTooltip: 'አከፍል', shareText: 'ዝንቱ ፡ ስእል ፡ እም ፡ ማዕከለ ፡ ስእል ፡ አምደ ፡ ሃይማኖት ፡ ርአይዎ፡' },
    es: { appName: "Amde Haymanot", galleryAlbums: 'Álbumes de la galería', loadError: 'No se pudieron cargar los detalles del álbum.', likeError: 'No se pudo dar "Me gusta" a la imagen.', downloadError: 'La descarga falló.', linkCopied: '¡Enlace del álbum copiado al portapapeles!', likeTooltip: 'Me gusta', downloadTooltip: 'Descargar', shareTooltip: 'Compartir', shareText: 'Echa un vistazo a esta imagen de la Galería Amde Haymanot:' },
    fr: { appName: "Amde Haymanot", galleryAlbums: 'Albums de la galerie', loadError: 'Échec du chargement des détails de l\'album.', likeError: 'Échec du "J\'aime" de l\'image.', downloadError: 'Le téléchargement a échoué.', linkCopied: 'Lien de l\'album copié dans le presse-papiers !', likeTooltip: 'J\'aime', downloadTooltip: 'Télécharger', shareTooltip: 'Partager', shareText: 'Découvrez cette image de la galerie Amde Haymanot :' },
    ar: { appName: "عماد الإيمان", galleryAlbums: 'ألبومات المعرض', loadError: 'فشل تحميل تفاصيل الألبوم.', likeError: 'فشل الإعجاب بالصورة.', downloadError: 'فشل التنزيل.', linkCopied: 'تم نسخ رابط الألبوم إلى الحافظة!', likeTooltip: 'إعجاب', downloadTooltip: 'تنزيل', shareTooltip: 'مشاركة', shareText: 'شاهد هذه الصورة من معرض عماد الإيمان:' }
};

const GalleryItem = styled(motion.div)(({ theme }) => ({ position: 'relative', display: 'block', overflow: 'hidden', cursor: 'pointer', borderRadius: theme.shape.borderRadius, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', '& .lazy-load-image-background': { width: '100%', display: 'block' }, '&:hover .lazy-load-image-background': { transform: 'scale(1.05)', transition: 'transform 0.4s ease' }, }));
const LightboxNavButton = styled(IconButton)(({ theme }) => ({ position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.4)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }));
const LightboxContentWrapper = styled(Box)({ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', outline: 'none' });

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
      console.error("Fetch Album Detail Error:", error.response || error);
      enqueueSnackbar(t.loadError, { variant: 'error' }); 
      navigate('/gallery'); 
    } finally { 
      setLoading(false); 
    } 
  }, [albumId, navigate, enqueueSnackbar, t]);

  useEffect(() => { fetchAlbum(); }, [fetchAlbum]);

  const currentImage = selectedImageIndex !== null && album ? album.images[selectedImageIndex] : null;

  const handleLike = async (imageId) => {
    const originalAlbum = { ...album };
    const updatedImages = album.images.map(img => img.id === imageId ? { ...img, likes: (img.likes || 0) + 1 } : img );
    setAlbum({ ...album, images: updatedImages });
    try {
      await api.post(`/gallery/images/${imageId}/like`);
    } catch (error) {
      setAlbum(originalAlbum);
      enqueueSnackbar(t.likeError, { variant: 'error' });
      console.error("Like failed:", error.response || error);
    }
  };

  const handleDownload = async (imageId, title, originalFormat) => {
    try {
        enqueueSnackbar(t.downloadStarted, { variant: 'info' });
        const response = await api.get(`/gallery/images/${imageId}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const fileExtension = originalFormat || 'jpg';
        const filename = `${(title || `image-${imageId}`).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExtension}`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed:", error);
        enqueueSnackbar(t.downloadError, { variant: 'error' });
    }
  };

  const handleShare = async (title) => { try { if (navigator.share) { await navigator.share({ title, text: `${t.shareText} ${title}`, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); enqueueSnackbar(t.linkCopied, { variant: 'info' }); } } catch (e) { console.error('Sharing failed', e); } };
  
  const handleOpen = (index) => setSelectedImageIndex(index);
  const handleClose = () => setSelectedImageIndex(null);
  const handleNext = () => setSelectedImageIndex((prev) => (prev !== null && album?.images) ? (prev + 1) % album.images.length : null);
  const handlePrev = () => setSelectedImageIndex((prev) => (prev !== null && album?.images) ? (prev - 1 + album.images.length) % album.images.length : null);
  
  useEffect(() => { const handleKeyDown = (e) => { if (selectedImageIndex === null) return; if (e.key === 'ArrowRight') handleNext(); if (e.key === 'ArrowLeft') handlePrev(); if (e.key === 'Escape') handleClose(); }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [selectedImageIndex, album, handleNext, handlePrev, handleClose]);

  if (loading || !album) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="rectangular" width={100} height={24} sx={{ mt: 2 }} />
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2} sx={{ mt: 4 }}>
          {Array.from(new Array(12)).map((_, index) => (<Skeleton key={index} variant="rectangular" height={Math.random() * 200 + 200} sx={{ borderRadius: 2 }} />))}
        </Masonry>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${album.title} | ${t.galleryAlbums} - ${t.appName}`}</title>
        <meta name="description" content={album.description} />
      </Helmet>
      
      <Box sx={{ bgcolor: alpha('#000', 0.03), py: { xs: 3, md: 4 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <MuiLink underline="hover" color="inherit" component="button" onClick={() => navigate('/gallery')} sx={{ display: 'flex', alignItems: 'center' }}><ArrowBackIcon sx={{ mr: 0.5 }} />{t.galleryAlbums}</MuiLink>
            <Typography color="text.primary">{album.title}</Typography>
          </Breadcrumbs>
          <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 'bold' }}>{album.title}</Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400">{album.description}</Typography>
          {album.category?.name && <Chip label={album.category.name} sx={{ mt: 1 }} />}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {album.images && album.images.map((image, index) => (
            <GalleryItem key={image.id} layout onClick={() => handleOpen(index)}>
              <LazyLoadImage alt={image.title} src={`${API_ROOT_URL}${image.thumbnail_url}`} effect="blur" style={{ width: '100%', display: 'block' }} />
            </GalleryItem>
          ))}
        </Masonry>
      </Container>
      
      <Modal open={selectedImageIndex !== null} onClose={handleClose} closeAfterTransition>
        <Fade in={selectedImageIndex !== null}>
          <Box>
            <LightboxNavButton onClick={handlePrev} sx={{ left: { xs: 8, md: 16 } }}><ChevronLeft fontSize='large' /></LightboxNavButton>
            <AnimatePresence mode="wait">
              {currentImage && (
                <LightboxContentWrapper key={selectedImageIndex}>
                  <motion.img key={currentImage.id} src={`${API_ROOT_URL}${currentImage.image_url}`} alt={currentImage.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ maxHeight: '80vh', maxWidth: '85vw', borderRadius: '8px' }} />
                  <Stack mt={1} sx={{ color: 'white', textShadow: '0 1px 4px black', textAlign: 'center' }}>
                    <Typography variant="h6">{currentImage.title}</Typography>
                    <Typography variant="body2">{selectedImageIndex + 1} / {album.images.length}</Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 1, p: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 50 }}>
                      <Tooltip title={t.likeTooltip}><IconButton size="small" sx={{ color: 'white' }} onClick={() => handleLike(currentImage.id)}><FavoriteIcon fontSize="small" /></IconButton></Tooltip>
                      <Typography variant="body2" sx={{minWidth: '2ch'}}>{currentImage.likes || 0}</Typography>
                      <Tooltip title={t.downloadTooltip}><IconButton size="small" sx={{ color: 'white' }} onClick={() => handleDownload(currentImage.id, currentImage.title, currentImage.original_format)}><DownloadIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title={t.shareTooltip}><IconButton size="small" sx={{ color: 'white' }} onClick={() => handleShare(currentImage.title)}><ShareIcon fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </Stack>
                </LightboxContentWrapper>
              )}
            </AnimatePresence>
            <LightboxNavButton onClick={handleNext} sx={{ right: { xs: 8, md: 16 } }}><ChevronRight fontSize='large' /></LightboxNavButton>
            <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}><CloseIcon /></IconButton>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AlbumDetailPage;