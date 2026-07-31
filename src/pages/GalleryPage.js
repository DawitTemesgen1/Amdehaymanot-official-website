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
import { Helmet } from 'react-helmet-async';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import gallerySubject from '../assets/img 6970.jpg';
import heroBackground from '../assets/gallery.jpg';
import crestLogo from '../assets/logo.png';
import { brand } from '../brand';
import { AboutHero, PageSection, GoldDivider } from '../components/ui';

const brandTitles = {
  en: 'Amde Haymanot',
  am: 'ዓምደ ሃይማኖት',
  om: 'Amdehaayimaanot',
  ti: 'ዓምደሃይማኖት',
  ge: 'ዓምደ ሃይማኖት',
  es: 'Amde Haymanot',
  fr: 'Amde Haymanot',
  ar: 'عمود الإيمان',
};

const placeLabels = {
  en: 'Jimma · Debre Ephrata St. Mary',
  am: 'ጅማ · ደብረ ኤፍራታ ቅድስት ማርያም',
  om: 'Jimmaa · Dabra Efraataa',
  ti: 'ጅማ · ደብረ ኤፍራታ ቅድስት ማርያም',
  ge: 'ጅማ · ደብረ ኤፍራታ ቅድስት ማርያም',
  es: 'Jimma · Debre Ephrata Santa María',
  fr: 'Jimma · Debre Ephrata Sainte-Marie',
  ar: 'جيما · دير إفراتا السيدة مريم',
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
    appName: 'Amde Haymanot',
    pageTitle: 'Photo Gallery',
    pageDescription: 'Explore photo albums from Amdehaymanot Sunday School events, services, and community gatherings in Jimma. A visual journey of our faith and fellowship.',
    galleryAlbumsTitle: 'Gallery Albums',
    pageSubtitle: 'Explore Moments in Service',
    all: 'All Categories',
    photos: 'photos',
    emptyTitle: 'No albums found',
    emptyMessage: 'No albums match this category yet. Try another filter or check back soon.',
    ctaTitle: 'Be part of the story',
    ctaSubtitle: 'Join our Sunday School community and share in the life of faith, worship, and fellowship.',
    ctaButton: 'Contact us',
  },
  am: {
    appName: 'ዓምደ ሃይማኖት',
    pageTitle: 'የፎቶ ማዕከለ-ስዕላት',
    pageDescription: 'የጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት ዝግጅቶችን፣ አገልግሎቶችን እና የማህበረሰብ ስብሰባዎችን የሚያሳዩ የፎቶ አልበሞችን ያስሱ። የእምነታችን እና የኅብረታችን ምስላዊ ጉዞ።',
    galleryAlbumsTitle: 'የጋለሪ አልበሞች',
    pageSubtitle: 'የአገልግሎት ቅጽበታትን ያስሱ',
    all: 'ሁሉም ምድቦች',
    photos: 'ፎቶዎች',
    emptyTitle: 'ምንም አልበም አልተገኘም',
    emptyMessage: 'ከዚህ ምድብ ጋር የሚዛመድ አልበም የለም። ሌላ ማጣሪያ ይሞክሩ ወይም በቅርቡ ተመልሰው ይመልከቱ።',
    ctaTitle: 'ከታሪኩ አካል ይሁኑ',
    ctaSubtitle: 'የሰንበት ትምህርት ቤታችንን ይቀላቀሉ እና በእምነት፣ በአምልኮ እና በኅብረት ሕይወት ይሳተፉ።',
    ctaButton: 'ያግኙን',
  },
  om: {
    appName: 'Amde Haymanot',
    pageTitle: 'Kuusaa Suuraa',
    pageDescription: "Albamoota suuraa ayyaanota, tajaajila, fi walga'ii hawaasaa Mana Barumsaa Dilbataa Amdehayimanot Jimmaatti qophaa'an ilaalaa. Imala amantii fi tokkummaa keenyaa suuraan deeggarame.",
    galleryAlbumsTitle: 'Albamoota Gaalarii',
    pageSubtitle: "Yeroowwan Tajaajilaa Sakatta'aa",
    all: 'Garee Hundaa',
    photos: 'suuraalee',
    emptyTitle: 'Albamoon hin argamne',
    emptyMessage: 'Albamoon garee kana waliin walsiman hin jiran. Filter biraa yaalaa ykn dhiyootti deebi\'aa.',
    ctaTitle: 'Seenaa keessatti hirmaadhaa',
    ctaSubtitle: 'Hawaasa Mana Barumsaa Dilbataa keenyaatti makamaa; amantii, waaqeffannaa, fi tokkummaa keessatti hirmaadhaa.',
    ctaButton: 'Nu qunnamaa',
  },
  ti: {
    appName: 'ኣምደ ሃይማኖት',
    pageTitle: 'ጋለሪ ስእሊ',
    pageDescription: 'ኣልበማት ስእሊ ናይ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ፍጻመታት፡ ኣገልግሎታትን ማሕበራዊ ኣኼባታትን ኣብ ጅማ ዳህሰሱ። ናይ እምነትናን ሕብረትናን ምርኢታዊ ጉዕዞ።',
    galleryAlbumsTitle: 'ኣልበማት ጋለሪ',
    pageSubtitle: 'ኣገልግሎታዊ ህሞታት ዳህስስ',
    all: 'ኩሉ ምድባት',
    photos: 'ስእልታት',
    emptyTitle: 'ኣልበም ኣይተረኽበን',
    emptyMessage: 'ምስዚ ምድብ ዝሳነ ኣልበም የለን። ካልእ መጽረዪ ፈትኑ ወይ ቀልጢፍኩም ተመለሱ።',
    ctaTitle: 'ካብቲ ዛንታ ክፍሊ ኩኑ',
    ctaSubtitle: 'ናብ ማሕበረሰብ ቤት ትምህርቲ ሰንበትና ተጸንበሩ፡ ኣብ እምነት፡ ኣምልኾን ሕብረትን ተሳተፉ።',
    ctaButton: 'ርከቡና',
  },
  ge: {
    appName: 'አምደ ፡ ሃይማኖት',
    pageTitle: 'መዝገበ ፡ ስእል',
    pageDescription: 'አልበማተ ፡ ስእል ፡ ዘቤተ ፡ ትምህርት ፡ ሰንበት ፡ ዓምደሃይማኖት ፡ በዓላት ፡ አገልግሎታት ፡ ወማኅበራዊ ፡ አኼባታት ፡ በጅማ ፡ ርአዩ። ራእያዊ ፡ ጉዞ ፡ ዘእምነትነ ፡ ወኅብረትነ።',
    galleryAlbumsTitle: 'መዝገበ ፡ ስእል',
    pageSubtitle: 'ጊዜያተ ፡ አገልግሎት ፡ ርአዩ',
    all: 'ኵሉ ፡ ክፍላተ',
    photos: 'ስእላት',
    emptyTitle: 'አልበም ፡ አልቦ',
    emptyMessage: 'ምስ ፡ ዝንቱ ፡ ክፍል ፡ ዝሳነ ፡ አልበም ፡ አልቦ። ካልእ ፡ መጽረዪ ፡ ፈትኑ።',
    ctaTitle: 'ካብ ፡ ዛንታ ፡ ክፍል ፡ ኩኑ',
    ctaSubtitle: 'ተጸንበሩ ፡ ማሕበረሰብ ፡ ቤተ ፡ ትምህርት ፡ ሰንበትነ።',
    ctaButton: 'ርከቡነ',
  },
  es: {
    appName: 'Amde Haymanot',
    pageTitle: 'Galería de Fotos',
    pageDescription: 'Explora álbumes de fotos de eventos, servicios y reuniones comunitarias de la Escuela Dominical Amdehayimanot en Jimma. Un viaje visual de nuestra fe y compañerismo.',
    galleryAlbumsTitle: 'Álbumes de Galería',
    pageSubtitle: 'Explora Momentos en Servicio',
    all: 'Todas las Categorías',
    photos: 'fotos',
    emptyTitle: 'No se encontraron álbumes',
    emptyMessage: 'Ningún álbum coincide con esta categoría. Pruebe otro filtro o vuelva pronto.',
    ctaTitle: 'Sea parte de la historia',
    ctaSubtitle: 'Únase a nuestra comunidad de Escuela Dominical y comparta la vida de fe, culto y compañerismo.',
    ctaButton: 'Contáctenos',
  },
  fr: {
    appName: 'Amde Haymanot',
    pageTitle: 'Galerie de Photos',
    pageDescription: "Explorez les albums photo des événements, des services et des rassemblements communautaires de l'école du dimanche Amdehayimanot à Jimma. Un voyage visuel de notre foi et de notre fraternité.",
    galleryAlbumsTitle: 'Albums de la Galerie',
    pageSubtitle: 'Explorez les Moments de Service',
    all: 'Toutes les Catégories',
    photos: 'photos',
    emptyTitle: 'Aucun album trouvé',
    emptyMessage: 'Aucun album ne correspond à cette catégorie. Essayez un autre filtre ou revenez bientôt.',
    ctaTitle: 'Faites partie de l’histoire',
    ctaSubtitle: 'Rejoignez notre communauté d’école du dimanche et partagez la vie de foi, de culte et de fraternité.',
    ctaButton: 'Contactez-nous',
  },
  ar: {
    appName: 'عماد الإيمان',
    pageTitle: 'معرض الصور',
    pageDescription: 'استكشف ألبومات الصور من فعاليات وخدمات وتجمعات مجتمع مدرسة الأحد عماد الإيمان في جيما. رحلة بصرية لإيماننا وشركتنا.',
    galleryAlbumsTitle: 'ألبومات المعرض',
    pageSubtitle: 'اكتشف لحظات في الخدمة',
    all: 'كل الفئات',
    photos: 'صور',
    emptyTitle: 'لم يتم العثور على ألبومات',
    emptyMessage: 'لا توجد ألبومات تطابق هذه الفئة. جرّب مرشحًا آخر أو عد قريبًا.',
    ctaTitle: 'كن جزءًا من القصة',
    ctaSubtitle: 'انضم إلى مجتمع مدرسة الأحد وشارك في حياة الإيمان والعبادة والشركة.',
    ctaButton: 'اتصل بنا',
  },
};

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
  transition: 'border-color 0.2s ease',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.45s ease',
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
    return albums.filter((album) => album.category === filter);
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
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | ${brandName}`}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>

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
                              </CoverFrame>
                              <Box sx={{ pt: 1.75 }}>
                                {album.category && album.category !== 'all' && (
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
                                    {album.category}
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
                                <Typography
                                  sx={{
                                    fontFamily: '"Source Sans 3", sans-serif',
                                    fontSize: '0.75rem',
                                    color: alpha(brand.ink, 0.5),
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                  }}
                                >
                                  <PhotoLibraryIcon sx={{ fontSize: 14 }} />
                                  {album.image_count || 0} {t.photos}
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
