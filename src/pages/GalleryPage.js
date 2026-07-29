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
import { PageHero, PageSection } from '../components/ui';

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

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': { backgroundColor: brand.gold, height: 3 },
  '& .MuiTabs-scroller': { padding: theme.spacing(0, 2) },
}));
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0, 0.5),
  borderRadius: '25px',
  transition: 'all 0.3s ease',
  color: theme.palette.text.secondary,
  '&.Mui-selected': { color: brand.navy, backgroundColor: alpha(brand.gold, 0.12) },
  '&:hover': { backgroundColor: alpha(brand.navy, 0.05) },
}));
const AlbumCard = styled(motion.div)({
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: brand.shadowCard,
  border: `1px solid ${brand.borderSubtle}`,
  transition: 'all 0.3s ease',
  '&:hover': { boxShadow: brand.shadowHero, transform: 'translateY(-4px)' },
});
const CategoryChip = styled(Chip)({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: brand.navy,
  color: brand.white,
  fontWeight: 600,
});
const GradientOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '60%',
  background: `linear-gradient(to top, ${alpha(brand.navy, 0.9)} 0%, transparent 100%)`,
  display: 'flex',
  alignItems: 'flex-end',
});
const ImageCountBadge = styled(Box)({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: alpha(brand.gold, 0.95),
  color: brand.navy,
  padding: '4px 12px',
  borderRadius: 12,
  fontSize: '0.75rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

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
          api.get('/gallery/categories'),
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

  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {Array.from(new Array(8)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ borderRadius: 3 }}><Skeleton variant="rectangular" height={200} /><CardContent><Skeleton width="80%" /><Skeleton width="60%" /></CardContent></Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | ${t.appName}`}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>
      <PageHero
        backgroundImage={galleryHeroImage}
        brandName={t.galleryAlbumsTitle}
        headline={t.pageSubtitle}
        minHeight="70vh"
      />
      <PageSection sx={{ pt: 4 }}>
        <Container maxWidth="xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6, background: brand.surfaceElevated, borderRadius: 4, p: 2, boxShadow: brand.shadowSoft, border: `1px solid ${brand.borderSubtle}`, mx: 'auto', maxWidth: 'fit-content' }}>
              <StyledTabs value={filter} onChange={handleFilterChange} variant="scrollable" scrollButtons="auto">
                <StyledTab icon={<AppsIcon />} iconPosition="start" label={t.all} value="all" />
                {categories.map(cat => (<StyledTab key={cat.id} label={cat.name} value={cat.name} />))}
              </StyledTabs>
            </Box>
          </motion.div>
          {loading ? renderSkeletons() : (
            <AnimatePresence mode="wait">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Grid container spacing={3}>
                  {filteredAlbums.map((album, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
                      <AlbumCard initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                        <Card sx={{ height: '100%', border: 'none', borderRadius: 3, boxShadow: 'none' }}>
                          <CardActionArea component={RouterLink} to={`/gallery/album/${album.id}`} sx={{ height: '100%' }}>
                            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                              <CardMedia component="img" height="240" image={album.cover_image_url ? `${API_ROOT_URL}${album.cover_image_url}` : 'https://via.placeholder.com/400x250?text=No+Cover'} alt={album.title} sx={{ transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.08)' } }} />
                              <GradientOverlay><Typography variant="h6" sx={{ color: 'white', fontWeight: 600, p: 2 }}>{album.title}</Typography></GradientOverlay>
                              {album.category && album.category !== 'all' && (<CategoryChip label={album.category} size="small" />)}
                              <ImageCountBadge><PhotoLibraryIcon sx={{ fontSize: 14 }} />{album.image_count || 0}</ImageCountBadge>
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {album.description || 'Explore the beautiful moments captured in this album.'}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </AlbumCard>
                    </Grid>
                  ))}
                </Grid>
                {filteredAlbums.length === 0 && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <PhotoLibraryIcon sx={{ fontSize: 72, color: 'text.secondary', mb: 2, opacity: 0.4 }} />
                    <Typography variant="h6" color="text.secondary">No albums found</Typography>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </Container>
      </PageSection>
    </>
  );
};

export default GalleryPage;
