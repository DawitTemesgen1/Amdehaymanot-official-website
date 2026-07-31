import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, CircularProgress, Button,
} from '@mui/material';
import { styled, alpha } from '@mui/system';
import { CalendarToday, Person, ArrowBack } from '@mui/icons-material';
import { motion, useReducedMotion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Helmet } from 'react-helmet-async';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import crestLogo from '../assets/logo.png';
import { PageSection, GoldDivider, MediaGallery, contentImageList } from '../components/ui';
import { brand } from '../brand';
import { localizePost } from '../utils/localizePost';

const translations = {
  en: {
    appName: 'Amde Haymanot',
    notFoundTitle: 'Article Not Found',
    notFoundMessage: "Sorry, we couldn't find the article you were looking for. It may have been moved or deleted.",
    backToNews: 'Back to News & Events',
    moreNews: 'More from our community',
    moreNewsSub: 'Stay connected with the latest announcements, activities, and stories.',
    viewAll: 'View all news & events',
    photos: 'Photos',
  },
  am: {
    appName: 'ዓምደ ሃይማኖት',
    notFoundTitle: 'ጽሑፉ አልተገኘም',
    notFoundMessage: 'ይቅርታ፣ የሚፈልጉትን ጽሑፍ ማግኘት አልቻልንም። ተንቀሳቅሶ ወይም ተሰርዞ ሊሆን ይችላል።',
    backToNews: 'ወደ ዜና እና ክስተቶች ተመለስ',
    moreNews: 'ከማህበረሰባችን ተጨማሪ',
    moreNewsSub: 'ከቅርብ ጊዜ ማስታወቂያዎች፣ እንቅስቃሴዎች እና ታሪኮች ጋር እንደተገናኙ ይቆዩ።',
    viewAll: 'ሁሉንም ዜና እና ክስተቶች ይመልከቱ',
    photos: 'ፎቶዎች',
  },
  om: {
    appName: 'Amde Haymanot',
    notFoundTitle: 'Barruun Hin Argamne',
    notFoundMessage: "Dhiifama, barruu barbaaddan argachuu hin dandeenye. Tarii ni socho'e ykn ni haqame ta'a.",
    backToNews: "Gara Oduu fi Taateewwanitti Deebi'i",
    moreNews: 'Hawaasa keenya irraa dabalata',
    moreNewsSub: 'Beeksisa, gochaawwan, fi seenaawwan yeroo ammaa waliin wal qunnamaa.',
    viewAll: 'Oduu fi taateewwan hunda ilaali',
    photos: 'Suuraalee',
  },
  ti: {
    appName: 'ኣምደ ሃይማኖት',
    notFoundTitle: 'ጽሑፍ ኣይተረኽበን',
    notFoundMessage: 'ይቕሬታ፡ ነቲ ዝደለኹሞ ጽሑፍ ክንረኽቦ ኣይከኣልናን። ተንቀሳቒሱ ወይ ተሰሪዙ ክኸውን ይኽእል እዩ።',
    backToNews: 'ናብ ዜናን ፍጻመታትን ተመለስ',
    moreNews: 'ካብ ማሕበረሰብና ተወሳኺ',
    moreNewsSub: 'ምስ ሓደስቲ ምልክታታት፣ ንጥፈታትን ዛንታታትን ተራኸቡ።',
    viewAll: 'ኩሉ ዜናን ፍጻመታትን ርአ',
    photos: 'ስእልታት',
  },
  ge: {
    appName: 'አምደ ፡ ሃይማኖት',
    notFoundTitle: 'ጽሑፍ ፡ አልቦ',
    notFoundMessage: 'ይቅርታ ፡ ዝንቱ ፡ ጽሑፍ ፡ ዘይትረክብዎ ፡ አልቦ። ተንቀሳቀሰ ፡ ወይስ ፡ ተደምሰሰ።',
    backToNews: 'ንዜና ፡ ወፍጻሜ ፡ ተመለስ',
    moreNews: 'ካብ ፡ ማሕበረሰብነ ፡ ተወሳኺ',
    moreNewsSub: 'ምስ ሓደስቲ ምልክታት፣ ንጥፈታት፣ ወዛንታ ተራኸቡ።',
    viewAll: 'ኵሉ ዜና ወፍጻሜ ርአ',
    photos: 'ስእላት',
  },
  es: {
    appName: 'Amde Haymanot',
    notFoundTitle: 'Artículo No Encontrado',
    notFoundMessage: 'Lo sentimos, no pudimos encontrar el artículo que buscabas. Puede que haya sido movido o eliminado.',
    backToNews: 'Volver a Noticias y Eventos',
    moreNews: 'Más de nuestra comunidad',
    moreNewsSub: 'Manténgase conectado con los últimos anuncios, actividades e historias.',
    viewAll: 'Ver todas las noticias y eventos',
    photos: 'Fotos',
  },
  fr: {
    appName: 'Amde Haymanot',
    notFoundTitle: 'Article Introuvable',
    notFoundMessage: "Désolé, nous n'avons pas pu trouver l'article que vous cherchiez. Il a peut-être été déplacé ou supprimé.",
    backToNews: 'Retour aux Actualités et Événements',
    moreNews: 'Plus de notre communauté',
    moreNewsSub: 'Restez connecté avec les dernières annonces, activités et histoires.',
    viewAll: 'Voir toutes les actualités et événements',
    photos: 'Photos',
  },
  ar: {
    appName: 'عماد الإيمان',
    notFoundTitle: 'المقال غير موجود',
    notFoundMessage: 'عذرًا، لم نتمكن من العثور على المقال الذي تبحث عنه. ربما تم نقله أو حذفه.',
    backToNews: 'العودة إلى الأخبار والأحداث',
    moreNews: 'المزيد من مجتمعنا',
    moreNewsSub: 'ابق على تواصل مع أحدث الإعلانات والأنشطة والقصص.',
    viewAll: 'عرض كل الأخبار والأحداث',
    photos: 'صور',
  },
};

const easeOut = [0.16, 1, 0.3, 1];

const MetaItem = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontSize: '0.84rem',
  color: alpha(brand.ink, 0.55),
});

const ArticleDetailPage = ({ language = 'en' }) => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = translations[language] || translations.en;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${articleId}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', bgcolor: brand.stone }}>
        <CircularProgress size={36} sx={{ color: brand.navy }} />
      </Box>
    );
  }

  if (!article) {
    return (
      <>
        <Helmet>
          <title>{`${t.notFoundTitle} | ${t.appName}`}</title>
        </Helmet>
        <PageSection variant="white">
          <Container maxWidth="sm" sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
            <Typography
              sx={{
                m: 0,
                mb: 2,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                color: brand.navy,
              }}
            >
              {t.notFoundTitle}
            </Typography>
            <Box aria-hidden sx={{ width: 48, height: 2, mx: 'auto', my: 2, bgcolor: brand.gold }} />
            <Typography sx={{ m: 0, mb: 3.5, color: alpha(brand.ink, 0.62), lineHeight: 1.7 }}>
              {t.notFoundMessage}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/news-and-events"
              startIcon={<ArrowBack />}
              sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
            >
              {t.backToNews}
            </Button>
          </Container>
        </PageSection>
      </>
    );
  }

  const localized = localizePost(article, language);
  const metaDescription = localized.content.replace(/(\r\n|\n|\r)/gm, ' ').substring(0, 160);
  const galleryImages = contentImageList(article);
  const coverPath = galleryImages[0]?.image_url || article.image_url;
  const imageUrl = coverPath
    ? (String(coverPath).startsWith('http') ? coverPath : `${API_ROOT_URL}${coverPath}`)
    : 'https://via.placeholder.com/1200x630?text=Amde+Haymanot';
  const isAlbum = galleryImages.length > 1;
  const paragraphs = localized.content.split('\n').filter((p) => p.trim());

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${localized.title} | ${t.appName}`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="author" content={article.author || t.appName} />
        <meta property="og:title" content={localized.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Box sx={{ bgcolor: brand.stone }}>
        <PageSection variant="white" sx={{ py: { xs: 4, md: 6 } }}>
          <Container maxWidth="md">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <Box sx={{ maxWidth: 680, mx: 'auto' }}>
                <Box
                  component={RouterLink}
                  to="/news-and-events"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    mb: 2.5,
                    textDecoration: 'none',
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: alpha(brand.navy, 0.55),
                    '&:hover': { color: brand.navy },
                  }}
                >
                  <ArrowBack sx={{ fontSize: 16 }} />
                  {t.backToNews}
                </Box>

                {article.category && (
                  <Typography
                    sx={{
                      m: 0,
                      mb: 1.5,
                      fontFamily: '"Source Sans 3", sans-serif',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: brand.goldDark,
                    }}
                  >
                    {article.category}
                  </Typography>
                )}

                <Typography
                  component="h1"
                  sx={{
                    m: 0,
                    mb: 2,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                    lineHeight: 1.18,
                    letterSpacing: '-0.015em',
                    color: brand.navy,
                  }}
                >
                  {localized.title}
                </Typography>
                <Box aria-hidden sx={{ width: 48, height: 2, mb: 2, bgcolor: brand.gold }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.75, sm: 3 }, mb: (!isAlbum && coverPath) ? 3 : 3.5 }}>
                  <MetaItem>
                    <CalendarToday sx={{ fontSize: 16, color: brand.goldDark }} />
                    {format(parseISO(article.created_at), 'MMMM d, yyyy')}
                  </MetaItem>
                  {article.author && (
                    <MetaItem>
                      <Person sx={{ fontSize: 16, color: brand.goldDark }} />
                      {article.author}
                    </MetaItem>
                  )}
                </Box>

                {!isAlbum && coverPath && (
                  <Box
                    sx={{
                      mb: 3.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${alpha(brand.navy, 0.1)}`,
                      bgcolor: brand.stone,
                      p: { xs: 1, sm: 1.5 },
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      alt=""
                      sx={{
                        display: 'block',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '100%',
                        maxHeight: { xs: 260, sm: 320, md: 360 },
                      }}
                    />
                  </Box>
                )}

                {isAlbum && (
                  <MediaGallery
                    images={galleryImages}
                    apiRoot={API_ROOT_URL}
                    title={t.photos}
                    lead
                  />
                )}

                {paragraphs.map((paragraph, index) => (
                  <Typography
                    key={index}
                    sx={{
                      m: 0,
                      mb: 2.5,
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontSize: { xs: '1.05rem', md: '1.1rem' },
                      lineHeight: 1.85,
                      color: alpha(brand.ink, 0.8),
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}

                <Box
                  sx={{
                    mt: 5,
                    pt: 3,
                    borderTop: `1px solid ${alpha(brand.navy, 0.1)}`,
                    textAlign: 'center',
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/news-and-events"
                    startIcon={<ArrowBack />}
                    sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 700, px: 2.5 }}
                  >
                    {t.backToNews}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Container>
        </PageSection>

        <PageSection variant="ink" pattern sx={{ textAlign: 'center', py: { xs: 6, md: 7 } }}>
          <Container maxWidth="sm">
            <Box
              component="img"
              src={crestLogo}
              alt=""
              sx={{
                width: 56,
                height: 56,
                objectFit: 'contain',
                bgcolor: '#fff',
                borderRadius: '50%',
                border: `2px solid ${brand.gold}`,
                p: 0.55,
                mb: 2,
                mx: 'auto',
                display: 'block',
              }}
            />
            <Typography
              component="h2"
              sx={{
                m: 0,
                mb: 1,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
                color: brand.white,
              }}
            >
              {t.moreNews}
            </Typography>
            <GoldDivider />
            <Typography sx={{ m: 0, mt: 1.75, mb: 3, color: alpha(brand.white, 0.75), lineHeight: 1.65 }}>
              {t.moreNewsSub}
            </Typography>
            <Button
              component={RouterLink}
              to="/news-and-events"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ borderRadius: 1, px: 4.5, textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
            >
              {t.viewAll}
            </Button>
          </Container>
        </PageSection>
      </Box>
    </>
  );
};

export default ArticleDetailPage;
