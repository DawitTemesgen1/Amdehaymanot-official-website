import React, { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Tabs, Tab, styled, Skeleton, alpha, Grid, Card, CardActionArea, CardMedia, CardContent, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AppsIcon from '@mui/icons-material/Apps';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';

import api, { API_ROOT_URL } from '../api/axiosConfig'; 
import galleryHeroImage from '../assets/gallery.jpg';

import brand from '../brand';

const kBrandedPrimary = brand.navy;
const kBrandedAccent = brand.gold;

const translations = {
  "en": { "appName": "Amde Haymanot", "pageTitle": "Photo Gallery", "pageDescription": "Explore photo albums from Amdehaymanot Sunday School events, services, and community gatherings in Jimma. A visual journey of our faith and fellowship.", "galleryAlbumsTitle": "Gallery Albums", "pageSubtitle": "Explore Moments in Service", "all": "All Categories" },
  "am": { "appName": "ዓምደ ሃይማኖት", "pageTitle": "የፎቶ ማዕከለ-ስዕላት", "pageDescription": "የጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት ዝግጅቶችን፣ አገልግሎቶችን እና የማህበረሰብ ስብሰባዎችን የሚያሳዩ የፎቶ አልበሞችን ያስሱ። የእምነታችን እና የኅብረታችን ምስላዊ ጉዞ።", "galleryAlbumsTitle": "የጋለሪ አልበሞች", "pageSubtitle": "የአገልግሎት ቅጽበታትን ያስሱ", "all": "ሁሉም ምድቦች" },
  "om": { "appName": "Amde Haymanot", "pageTitle": "Kuusaa Suuraa", "pageDescription": "Albamoota suuraa ayyaanota, tajaajila, fi walga'ii hawaasaa Mana Barumsaa Dilbataa Amdehayimanot Jimmaatti qophaa'an ilaalaa. Imala amantii fi tokkummaa keenyaa suuraan deeggarame.", "galleryAlbumsTitle": "Albamoota Gaalarii", "pageSubtitle": "Yeroowwan Tajaajilaa Sakatta'aa", "all": "Garee Hundaa" },
  "ti": { "appName": "ኣምደ ሃይማኖት", "pageTitle": "ጋለሪ ስእሊ", "pageDescription": "ኣልበማት ስእሊ ናይ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ፍጻመታት፡ ኣገልግሎታትን ማሕበራዊ ኣኼባታትን ኣብ ጅማ ዳህሰሱ። ናይ እምነትናን ሕብረትናን ምርኢታዊ ጉዕዞ።", "galleryAlbumsTitle": "ኣልበማት ጋለሪ", "pageSubtitle": "ኣገልግሎታዊ ህሞታት ዳህስስ", "all": "ኩሉ ምድባት" },
  "ge": { "appName": "አምደ ፡ ሃይማኖት", "pageTitle": "መዝገበ ፡ ስእል", "pageDescription": "አልበማተ ፡ ስእል ፡ ዘቤተ ፡ ትምህርት ፡ ሰንበት ፡ ዓምደሃይማኖት ፡ በዓላት ፡ አገልግሎታት ፡ ወማኅበራዊ ፡ አኼባታት ፡ በጅማ ፡ ርአዩ። ራእያዊ ፡ ጉዞ ፡ ዘእምነትነ ፡ ወኅብረትነ።", "galleryAlbumsTitle": "መዝገበ ፡ ስእል", "pageSubtitle": "ጊዜያተ ፡ አገልግሎት ፡ ርአዩ", "all": "ኵሉ ፡ ክፍላተ" },
  "es": { "appName": "Amde Haymanot", "pageTitle": "Galería de Fotos", "pageDescription": "Explora álbumes de fotos de eventos, servicios y reuniones comunitarias de la Escuela Dominical Amdehayimanot en Jimma. Un viaje visual de nuestra fe y compañerismo.", "galleryAlbumsTitle": "Álbumes de Galería", "pageSubtitle": "Explora Momentos en Servicio", "all": "Todas las Categorías" },
  "fr": { "appName": "Amde Haymanot", "pageTitle": "Galerie de Photos", "pageDescription": "Explorez les albums photo des événements, des services et des rassemblements communautaires de l'école du dimanche Amdehayimanot à Jimma. Un voyage visuel de notre foi et de notre fraternité.", "galleryAlbumsTitle": "Albums de la Galerie", "pageSubtitle": "Explorez les Moments de Service", "all": "Toutes les Catégories" },
  "ar": { "appName": "عماد الإيمان", "pageTitle": "معرض الصور", "pageDescription": "استكشف ألبومات الصور من فعاليات وخدمات وتجمعات مجتمع مدرسة الأحد عماد الإيمان في جيما. رحلة بصرية لإيماننا وشركتنا.", "galleryAlbumsTitle": "ألبومات المعرض", "pageSubtitle": "اكتشف لحظات في الخدمة", "all": "كل الفئات" }
};

const HeroSection = styled(Box)(({ theme }) => ({ background: `linear-gradient(135deg, ${alpha(kBrandedPrimary, 0.85)} 0%, ${alpha(kBrandedPrimary, 0.65)} 100%), url(${galleryHeroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: theme.palette.common.white, textAlign: 'center', padding: theme.spacing(3) }));
const StyledTabs = styled(Tabs)(({ theme }) => ({ '& .MuiTabs-indicator': { backgroundColor: kBrandedAccent, height: 3 }, '& .MuiTabs-scroller': { padding: theme.spacing(0, 2) } }));
const StyledTab = styled(Tab)(({ theme }) => ({ textTransform: 'none', fontWeight: 600, minWidth: 'auto', padding: theme.spacing(1, 2), margin: theme.spacing(0, 0.5), borderRadius: '25px', transition: 'all 0.3s ease', color: theme.palette.text.secondary, '&.Mui-selected': { color: kBrandedPrimary, backgroundColor: alpha(kBrandedAccent, 0.1) }, '&:hover': { backgroundColor: alpha(kBrandedPrimary, 0.05) } }));
const AlbumCard = styled(motion.div)(({ theme }) => ({ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', background: theme.palette.background.paper, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 40px rgba(0,0,0,0.15)' } }));
const CategoryChip = styled(Chip)(({ theme }) => ({ position: 'absolute', top: theme.spacing(2), right: theme.spacing(2), backgroundColor: kBrandedPrimary, color: 'white', fontWeight: '600' }));
const GradientOverlay = styled(Box)(() => ({ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: `linear-gradient(to top, ${alpha(kBrandedPrimary, 0.9)} 0%, transparent 100%)`, display: 'flex', alignItems: 'flex-end' }));
const ImageCountBadge = styled(Box)(({ theme }) => ({ position: 'absolute', top: theme.spacing(2), left: theme.spacing(2), backgroundColor: alpha(kBrandedAccent, 0.95), color: kBrandedPrimary, padding: theme.spacing(0.5, 1.5), borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: theme.spacing(0.5) }));

const GalleryPage = ({ language = 'en' }) => {
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const t = translations[language] || translations.en;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [albumsRes, categoriesRes] = await Promise.all([
          api.get('/gallery/albums'),
          api.get('/gallery/categories') // You'll need to create this backend endpoint
        ]);
        setAlbums(albumsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        enqueueSnackbar('Could not load gallery albums.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [enqueueSnackbar]);

  const filteredAlbums = useMemo(() => {
    if (filter === 'all') return albums;
    return albums.filter((album) => album.category === filter);
  }, [filter, albums]);

  const handleFilterChange = (event, newValue) => setFilter(newValue);

  const renderSkeletons = () => ( <Grid container spacing={3}>{Array.from(new Array(8)).map((_, index) => ( <Grid item xs={12} sm={6} md={4} lg={3} key={index}><Card sx={{ borderRadius: 3 }}><Skeleton variant="rectangular" height={200} /><CardContent><Skeleton width="80%" /><Skeleton width="60%" /></CardContent></Card></Grid> ))}</Grid> );

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | ${t.appName}`}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>
      <HeroSection>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <PhotoLibraryIcon sx={{ fontSize: 60, mb: 2, color: kBrandedAccent }} />
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 700, mb: 2, background: `linear-gradient(135deg, ${kBrandedAccent} 0%, #fff 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.galleryAlbumsTitle}</Typography>
          <Typography variant="h5" sx={{ opacity: 0.95, maxWidth: '600px', margin: '0 auto' }}>{t.pageSubtitle}</Typography>
        </motion.div>
      </HeroSection>
      <Container maxWidth="xl" sx={{ py: 8, mt: -5 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6, background: 'white', borderRadius: 4, p: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', mx: 'auto', maxWidth: 'fit-content' }}>
            <StyledTabs value={filter} onChange={handleFilterChange} variant="scrollable" scrollButtons="auto">
              <StyledTab icon={<AppsIcon />} iconPosition="start" label={t.all} value="all" />
              {categories.map(cat => (<StyledTab key={cat.id} label={cat.name} value={cat.name} />))}
            </StyledTabs>
          </Box>
        </motion.div>
        {loading ? ( renderSkeletons() ) : (
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Grid container spacing={3}>
                {filteredAlbums.map((album, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
                    <AlbumCard initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }} whileHover={{ y: -8, scale: 1.02 }}>
                      <Card sx={{ height: '100%', border: 'none', borderRadius: 3 }}>
                        <CardActionArea component={RouterLink} to={`/gallery/album/${album.id}`} sx={{ height: '100%' }}>
                          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                            <CardMedia component="img" height="240" image={album.cover_image_url ? `${API_ROOT_URL}${album.cover_image_url}` : 'https://via.placeholder.com/400x250?text=No+Cover'} alt={album.title} sx={{ transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.1)' } }} />
                            <GradientOverlay><Typography variant="h6" sx={{ color: 'white', fontWeight: 600, p: 2 }}>{album.title}</Typography></GradientOverlay>
                            {album.category && album.category !== 'all' && (<CategoryChip label={album.category} size="small" />)}
                            <ImageCountBadge><PhotoLibraryIcon sx={{ fontSize: 14 }} />{album.image_count || 0}</ImageCountBadge>
                          </Box>
                          <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{album.description || 'Explore the beautiful moments captured in this album.'}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </AlbumCard>
                  </Grid>
                ))}
              </Grid>
              {filteredAlbums.length === 0 && !loading && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}><PhotoLibraryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} /><Typography variant="h6" color="text.secondary">No albums found</Typography></motion.div> )}
            </motion.div>
          </AnimatePresence>
        )}
      </Container>
    </>
  );
};

export default GalleryPage;