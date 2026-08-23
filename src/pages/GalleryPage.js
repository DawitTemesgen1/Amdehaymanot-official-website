import React, { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Tabs, Tab, Skeleton, Grid, Button,
} from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AppsIcon from '@mui/icons-material/Apps';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useSnackbar } from 'notistack';
import SEO from '../components/layout/SEO';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import gallerySubject from '../assets/img 6970.jpg';
import heroBackground from '../assets/gallery.jpg';
import crestLogo from '../assets/logo.png';
import { brand } from '../brand';
import { AboutHero, PageSection, GoldDivider } from '../components/ui';

const brandTitles = {
  en: 'Amde Haymanot',
  am: 'ዓምደ ሃይማኖት',
  om: 'Amdehaymanot',
  ti: 'ዓምደሃይማኖት',
  ge: 'ዓምደ ሃይማኖት',
  es: 'Amde Haymanot',
  fr: 'Amdehaymanot',
  ar: 'عمود الإيمان',
};

const placeLabels = {
  en: 'Jimma · Debre Ephrata St. Virgin Mary Cathedral',
  am: 'ጅማ · ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል',
  om: 'Jimmaa · Debre Efraataa',
  ti: 'ጅማ · ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል',
  ge: 'ጅማ · ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል',
  es: 'Jimma · Debre Ephrata Santa Virgen María Catedral',
  fr: 'Jimma · Debre Ephrata Sainte Vierge Marie Cathédrale',
  ar: 'جيما · دير إفراتا القديسة العذراء مريم كاتدرائية',
};

const yearCaptions = {
  en: 'Founded',
  am: 'ተመሠረተ',
  om: 'Kan hundeeffame',
  ti: 'ተመስሪቱ',
  ge: 'ተመሥረተ',
  es: 'Fundada',
  fr: 'Fondée',
  ar: 'تأسست',
};

const translations = {
  en: {
    "appName": "Amdehaymanot",
    "pageTitle": "Photo gallery",
    "pageDescription": "Browse photo albums featuring Jemaah Sunday School events, services, and community gatherings. A visual journey of our faith and fellowship.",
    "galleryAlbumsTitle": "Gallery albums",
    "pageSubtitle": "Explore moments of service",
    "all": "All categories",
    "photos": "Photos",
    "emptyTitle": "No album found",
    "emptyMessage": "There are no albums matching this category. Try another filter or check back soon.",
    "ctaTitle": "Be part of the story",
    "ctaSubtitle": "Join our Sunday School and engage in a life of faith, worship and fellowship.",
    "ctaButton": "Contact us"
},
  om: {
    "appName": "Amdehaymanot",
    "pageTitle": "Galmee suuraa",
    "pageDescription": "Albamoota suuraa taateewwan Mana Barumsaa Sanbataa Jimmaa, tajaajila, fi walga’ii hawaasaa agarsiisan daawwadhaa. Imala mul'ataa amantii fi waldaa keenyaa.",
    "galleryAlbumsTitle": "Albamoota galmee",
    "pageSubtitle": "Explore Moments of Service",
    "all": "Gosoota hunda",
    "photos": "Suuraalee",
    "emptyTitle": "Albamii hin argamne",
    "emptyMessage": "Albamii gosa kanaan walsimu hin jiru. Filtara biraa yaali ykn yeroo dhiyootti deebi'ii ilaali.",
    "ctaTitle": "Qaama seenaa sanaa ta'i",
    "ctaSubtitle": "Mana Barumsaa Sanbataa keenyatti makamaatii jireenya amantii, waaqeffannaa fi waldaa irratti bobba'aa.",
    "ctaButton": "Nu qunnamaa"
},
  ti: {
    "appName": "ዓምደሃይማኖት",
    "pageTitle": "ፎቶ ጋለሪ",
    "pageDescription": "ፍጻሜታት ቤት ትምህርቲ ሰንበት ጀማህ፡ ኣገልግሎታትን ማሕበረሰባዊ ምትእኽኻባትን ዝሓዘ ኣልበማት ስእሊ ድህሰሱ። ናይ እምነትናን ሕብረትናን ስእላዊ ጉዕዞ።",
    "galleryAlbumsTitle": "ናይ ጋለሪ ኣልበማት",
    "pageSubtitle": "Explore Moments of Service",
    "all": "ሁሉም ምድቦች",
    "photos": "ፎቶዎች",
    "emptyTitle": "ዝኾነ ኣልበም ኣይተረኽበን።",
    "emptyMessage": "ምስዚ ምድብ ዝሰማማዕ ኣልበም የለን። ካልእ ፍልተር ፈትኑ ወይ ኣብ ቀረባ እዋን ተመሊስኩም ርኣይዎ።",
    "ctaTitle": "ኣካል ናይቲ ዛንታ ኩን።",
    "ctaSubtitle": "ኣብ ቤት ትምህርቲ ሰንበትና ተጸንበሩ እሞ ኣብ ናይ እምነትን ኣምልኾን ሕብረትን ህይወት ተጸምዱ።",
    "ctaButton": "ያግኙን"
},
  es: {
    "appName": "Amdehaymanot",
    "pageTitle": "Galería de fotos",
    "pageDescription": "Explore álbumes de fotos que presentan eventos, servicios y reuniones comunitarias de la Escuela Dominical Jemaah. Un viaje visual de nuestra fe y compañerismo.",
    "galleryAlbumsTitle": "Álbumes de la galería",
    "pageSubtitle": "Explora momentos de servicio",
    "all": "Todas las categorias",
    "photos": "Fotos",
    "emptyTitle": "No se encontró ningún álbum",
    "emptyMessage": "No hay álbumes que coincidan con esta categoría. Pruebe con otro filtro o vuelva a consultar pronto.",
    "ctaTitle": "Se parte de la historia",
    "ctaSubtitle": "Únase a nuestra Escuela Dominical y participe en una vida de fe, adoración y compañerismo.",
    "ctaButton": "Contáctenos"
},
  fr: {
    "appName": "Amdehaymanot",
    "pageTitle": "Galerie de photos",
    "pageDescription": "Parcourez les albums photos présentant les événements, les services et les rassemblements communautaires de l'école du dimanche Jemaah. Un voyage visuel de notre foi et de notre camaraderie.",
    "galleryAlbumsTitle": "Albums de la galerie",
    "pageSubtitle": "Explorez les moments de service",
    "all": "Toutes les catégories",
    "photos": "Photos",
    "emptyTitle": "Aucun album trouvé",
    "emptyMessage": "Il n'y a aucun album correspondant à cette catégorie. Essayez un autre filtre ou revenez bientôt.",
    "ctaTitle": "Faites partie de l'histoire",
    "ctaSubtitle": "Rejoignez notre école du dimanche et engagez-vous dans une vie de foi, d'adoration et de camaraderie.",
    "ctaButton": "Contactez-nous"
},
  ar: {
    "appName": "آمدهيمانوت",
    "pageTitle": "معرض الصور",
    "pageDescription": "تصفح ألبومات الصور التي تحتوي على أحداث وخدمات وتجمعات مجتمع Jemaah Sunday School. رحلة بصرية لإيماننا وزمالتنا.",
    "galleryAlbumsTitle": "ألبومات المعرض",
    "pageSubtitle": "اكتشف لحظات الخدمة",
    "all": "جميع الفئات",
    "photos": "صور",
    "emptyTitle": "لم يتم العثور على أي ألبوم",
    "emptyMessage": "لا توجد ألبومات مطابقة لهذه الفئة. جرب مرشحًا آخر أو تحقق مرة أخرى قريبًا.",
    "ctaTitle": "كن جزءاً من القصة",
    "ctaSubtitle": "انضم إلى مدرسة الأحد لدينا وانخرط في حياة الإيمان والعبادة والشركة.",
    "ctaButton": "اتصل بنا"
},
  am: {
    "appName": "ዓምደሃይማኖት",
    "pageTitle": "የፎቶ ማዕከለ-ስዕላት",
    "pageDescription": "የጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት ዝግጅቶችን፣ አገልግሎቶችን እና የማህበረሰብ ስብሰባዎችን የሚያሳዩ የፎቶ አልበሞችን ያስሱ። የእምነታችን እና የኅብረታችን ምስላዊ ጉዞ።",
    "galleryAlbumsTitle": "የጋለሪ አልበሞች",
    "pageSubtitle": "Explore Moments of Service",
    "all": "ሁሉም ምድቦች",
    "photos": "ፎቶዎች",
    "emptyTitle": "ምንም አልበም አልተገኘም",
    "emptyMessage": "ከዚህ ምድብ ጋር የሚዛመድ አልበም የለም። ሌላ ማጣሪያ ይሞክሩ ወይም በቅርቡ ተመልሰው ይመልከቱ።",
    "ctaTitle": "ከታሪኩ አካል ይሁኑ",
    "ctaSubtitle": "የሰንበት ትምህርት ቤታችንን ይቀላቀሉ እና በእምነት፣ በአምልኮ እና በኅብረት ሕይወት ይሳተፉ።",
    "ctaButton": "ያግኙን"
},
  ge: {
    "appName": "ዓምደሃይማኖት",
    "pageTitle": "የፎቶ ማዕከለ-ስዕላት",
    "pageDescription": "የጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት ዝግጅቶችን፣ አገልግሎቶችን እና የማህበረሰብ ስብሰባዎችን የሚያሳዩ የፎቶ አልበሞችን ያስሱ። የእምነታችን እና የኅብረታችን ምስላዊ ጉዞ።",
    "galleryAlbumsTitle": "የጋለሪ አልበሞች",
    "pageSubtitle": "Explore Moments of Service",
    "all": "ሁሉም ምድቦች",
    "photos": "ፎቶዎች",
    "emptyTitle": "ምንም አልበም አልተገኘም",
    "emptyMessage": "ከዚህ ምድብ ጋር የሚዛመድ አልበም የለም። ሌላ ማጣሪያ ይሞክሩ ወይም በቅርቡ ተመልሰው ይመልከቱ።",
    "ctaTitle": "ከታሪኩ አካል ይሁኑ",
    "ctaSubtitle": "የሰንበት ትምህርት ቤታችንን ይቀላቀሉ እና በእምነት፣ በአምልኮ እና በኅብረት ሕይወት ይሳተፉ።",
    "ctaButton": "ያግኙን"
},
};;

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.12 };

function EthiopicCross({ size = 12, color = brand.goldDark }) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      sx={{ display: 'block', flexShrink: 0 }}
    >
      <path
        fill={color}
        d="M15.2 2.2h1.6v5.4h5.4v1.6h-5.4v5.4h5.4v1.6h-5.4v8.2h-1.6v-8.2H9.8v-1.6h5.4V9.2H9.8V7.6h5.4V2.2zm-3.8 8.8h1.4v1.4h-1.4v-1.4zm7.8 0h1.4v1.4h-1.4v-1.4zM9.2 20.4h1.4v1.4H9.2v-1.4zm12.2 0h1.4v1.4h-1.4v-1.4z"
      />
      <circle cx="16" cy="10.4" r="1.15" fill={color} />
    </Box>
  );
}

const FilterTabs = styled(Tabs)({
  minHeight: 48,
  '& .MuiTabs-indicator': {
    backgroundColor: brand.gold,
    height: 2,
  },
  '& .MuiTabs-flexContainer': {
    gap: 4,
  },
});

const FilterTab = styled(Tab)({
  textTransform: 'uppercase',
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  minWidth: 'auto',
  minHeight: 48,
  padding: '12px 16px',
  color: alpha(brand.navy, 0.5),
  '&.Mui-selected': {
    color: brand.navy,
    backgroundColor: 'transparent',
  },
  '&:hover': {
    color: brand.navy,
    backgroundColor: 'transparent',
  },
  '& .MuiTab-iconWrapper': {
    marginRight: 6,
    marginBottom: '0 !important',
  },
});

const AlbumTile = styled(Box)({
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
  height: '100%',
  transition: 'border-color 0.2s ease',
  '&:hover .cover-frame': {
    borderColor: alpha(brand.gold, 0.65),
    boxShadow: brand.shadowCard,
  },
  '&:hover .cover-frame img': {
    transform: 'scale(1.04)',
  },
});

const CoverFrame = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  aspectRatio: '4 / 3',
  backgroundColor: brand.stone,
  transition: 'border-color 0.2s ease, box-shadow 0.3s ease',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.45s ease',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(180deg, transparent 55%, ${alpha(brand.navyInk, 0.55)} 100%)`,
    pointerEvents: 'none',
  },
});

const GalleryPage = ({ language = 'en' }) => {
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const t = translations[language] || translations.en;
  const brandName = brandTitles[language] || brandTitles.en;
  const reduceMotion = useReducedMotion();
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
        console.error('Error fetching gallery data:', error);
        enqueueSnackbar('Could not load gallery albums.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [enqueueSnackbar]);

  const filteredAlbums = useMemo(() => {
    if (filter === 'all') return albums;
    return albums.filter((album) => album.categoryName === filter);
  }, [filter, albums]);

  const handleFilterChange = (_event, newValue) => setFilter(newValue);

  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {Array.from(new Array(8)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Skeleton
            variant="rectangular"
            sx={{
              aspectRatio: '4 / 3',
              width: '100%',
              bgcolor: brand.stone,
              borderRadius: 0,
            }}
          />
          <Skeleton width="70%" sx={{ mt: 1.5, bgcolor: brand.stoneDeep }} />
          <Skeleton width="40%" sx={{ mt: 0.75, bgcolor: brand.stoneDeep }} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <SEO title={t.pageTitle} description={t.pageDescription} language={language} />

      <Box sx={{ bgcolor: brand.stone }}>
        <AboutHero
          subjectImage={gallerySubject}
          subjectFit="cover"
          backgroundImage={heroBackground}
          brandName={brandName}
          tagline={t.pageTitle}
          storyTitle={t.galleryAlbumsTitle}
          storyLead={t.pageSubtitle}
          placeLabel={placeLabels[language] || placeLabels.en}
          yearCaption={yearCaptions[language] || yearCaptions.en}
          foundedYear="1964"
          lineClamp={3}
          mobileLineClamp={2}
        />

        <PageSection variant="white">
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 560, mx: 'auto' }}>
              <Box
                aria-hidden
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.25,
                  mb: 2.5,
                }}
              >
                <Box sx={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(brand.goldDark, 0.7)})` }} />
                <EthiopicCross size={12} />
                <Box sx={{ width: 40, height: 1, background: `linear-gradient(90deg, ${alpha(brand.goldDark, 0.7)}, transparent)` }} />
              </Box>
              <Typography
                component="h2"
                sx={{
                  m: 0,
                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.85rem, 3.5vw, 2.6rem)',
                  lineHeight: 1.15,
                  color: brand.navy,
                }}
              >
                {t.galleryAlbumsTitle}
              </Typography>
              <Box aria-hidden sx={{ width: 48, height: 2, mx: 'auto', my: 2, bgcolor: brand.gold }} />
              <Typography
                sx={{
                  m: 0,
                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: alpha(brand.ink, 0.62),
                }}
              >
                {t.pageSubtitle}
              </Typography>
            </Box>

            <Box
              sx={{
                borderBottom: `1px solid ${alpha(brand.navy, 0.1)}`,
                mb: 5,
              }}
            >
              <FilterTabs
                value={filter}
                onChange={handleFilterChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <FilterTab
                  icon={<AppsIcon sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label={t.all}
                  value="all"
                />
                {categories.map((cat) => (
                  <FilterTab key={cat.id} label={cat.name} value={cat.name} />
                ))}
              </FilterTabs>
            </Box>

            {loading ? (
              renderSkeletons()
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={filter}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                >
                  <Grid container spacing={3}>
                    {filteredAlbums.map((album, index) => {
                      const cover = album.cover_image_url
                        ? `${API_ROOT_URL}${album.cover_image_url}`
                        : 'https://via.placeholder.com/400x300?text=No+Cover';
                      return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={viewOpts}
                            transition={{ duration: 0.45, ease: easeOut, delay: index * 0.04 }}
                          >
                            <AlbumTile
                              component={RouterLink}
                              to={`/gallery/album/${album.id}`}
                            >
                              <CoverFrame className="cover-frame">
                                <Box component="img" src={cover} alt="" />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    right: 10,
                                    bottom: 10,
                                    zIndex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1,
                                    py: 0.4,
                                    bgcolor: alpha(brand.navyInk, 0.78),
                                    border: `1px solid ${alpha(brand.gold, 0.45)}`,
                                  }}
                                >
                                  <PhotoLibraryIcon sx={{ fontSize: 13, color: brand.gold }} />
                                  <Typography
                                    sx={{
                                      m: 0,
                                      fontFamily: '"Source Sans 3", sans-serif',
                                      fontWeight: 700,
                                      fontSize: '0.68rem',
                                      letterSpacing: '0.08em',
                                      textTransform: 'uppercase',
                                      color: brand.white,
                                    }}
                                  >
                                    {album.imageCount || 0} {t.photos}
                                  </Typography>
                                </Box>
                              </CoverFrame>
                              <Box sx={{ pt: 1.75 }}>
                                {album.categoryName && (
                                  <Typography
                                    sx={{
                                      fontFamily: '"Source Sans 3", sans-serif',
                                      fontWeight: 700,
                                      fontSize: '0.62rem',
                                      letterSpacing: '0.14em',
                                      textTransform: 'uppercase',
                                      color: brand.goldDark,
                                      mb: 0.75,
                                    }}
                                  >
                                    {album.categoryName}
                                  </Typography>
                                )}
                                <Typography
                                  sx={{
                                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                                    fontWeight: 600,
                                    fontSize: '1.2rem',
                                    lineHeight: 1.25,
                                    color: brand.navy,
                                    mb: 0.5,
                                  }}
                                >
                                  {album.title}
                                </Typography>
                              </Box>
                            </AlbumTile>
                          </motion.div>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {filteredAlbums.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <PhotoLibraryIcon
                        sx={{ fontSize: 48, color: alpha(brand.navy, 0.22), mb: 2 }}
                      />
                      <Typography
                        sx={{
                          fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                          fontWeight: 600,
                          fontSize: '1.35rem',
                          color: brand.navy,
                          mb: 1,
                        }}
                      >
                        {t.emptyTitle}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                          color: alpha(brand.ink, 0.55),
                          maxWidth: 360,
                          mx: 'auto',
                          lineHeight: 1.65,
                        }}
                      >
                        {t.emptyMessage}
                      </Typography>
                    </Box>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </Container>
        </PageSection>

        <PageSection variant="ink" pattern sx={{ textAlign: 'center' }}>
          <Container maxWidth="sm">
            <Box
              component="img"
              src={crestLogo}
              alt=""
              sx={{
                width: 72,
                height: 72,
                objectFit: 'contain',
                bgcolor: '#fff',
                borderRadius: '50%',
                border: `2px solid ${brand.gold}`,
                p: 0.75,
                mb: 3,
                mx: 'auto',
                display: 'block',
              }}
            />
            <Typography
              component="h2"
              sx={{
                m: 0,
                mb: 2,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                color: brand.white,
              }}
            >
              {t.ctaTitle}
            </Typography>
            <GoldDivider />
            <Typography
              sx={{
                m: 0,
                mt: 2,
                mb: 4,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: '1.02rem',
                lineHeight: 1.7,
                color: alpha(brand.white, 0.75),
              }}
            >
              {t.ctaSubtitle}
            </Typography>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: 1,
                px: 6,
                py: 1.35,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: 'none',
              }}
            >
              {t.ctaButton}
            </Button>
          </Container>
        </PageSection>
      </Box>
    </>
  );
};

export default GalleryPage;
