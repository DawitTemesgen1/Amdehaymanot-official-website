import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Paper, Chip, Button, styled, alpha } from '@mui/material';
import { CalendarToday, Person, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Helmet } from 'react-helmet-async';

import api, { API_ROOT_URL } from '../api/axiosConfig';

const translations = {
  en: { appName: "Amde Haymanot", notFoundTitle: "Article Not Found", notFoundMessage: "Sorry, we couldn't find the article you were looking for. It may have been moved or deleted.", backToNews: "Back to News & Events" },
  am: { appName: "ዓምደ ሃይማኖት", notFoundTitle: "ጽሑፉ አልተገኘም", notFoundMessage: "ይቅርታ፣ የሚፈልጉትን ጽሑፍ ማግኘት አልቻልንም። ተንቀሳቅሶ ወይም ተሰርዞ ሊሆን ይችላል።", backToNews: "ወደ ዜና እና ክስተቶች ተመለስ" },
  om: { appName: "Amde Haymanot", notFoundTitle: "Barruun Hin Argamne", notFoundMessage: "Dhiifama, barruu barbaaddan argachuu hin dandeenye. Tarii ni socho'e ykn ni haqame ta'a.", backToNews: "Gara Oduu fi Taateewwanitti Deebi'i" },
  ti: { appName: "ኣምደ ሃይማኖት", notFoundTitle: "ጽሑፍ ኣይተረኽበን", notFoundMessage: "ይቕሬታ፡ ነቲ ዝደለኹሞ ጽሑፍ ክንረኽቦ ኣይከኣልናን። ተንቀሳቒሱ ወይ ተሰሪዙ ክኸውን ይኽእል እዩ።", backToNews: "ናብ ዜናን ፍጻመታትን ተመለስ" },
  ge: { appName: "አምደ ፡ ሃይማኖት", notFoundTitle: "ጽሑፍ ፡ አልቦ", notFoundMessage: "ይቅርታ ፡ ዝንቱ ፡ ጽሑፍ ፡ ዘይትረክብዎ ፡ አልቦ። ተንቀሳቀሰ ፡ ወይስ ፡ ተደምሰሰ።", backToNews: "ንዜና ፡ ወፍጻሜ ፡ ተመለስ" },
  es: { appName: "Amde Haymanot", notFoundTitle: "Artículo No Encontrado", notFoundMessage: "Lo sentimos, no pudimos encontrar el artículo que buscabas. Puede que haya sido movido o eliminado.", backToNews: "Volver a Noticias y Eventos" },
  fr: { appName: "Amde Haymanot", notFoundTitle: "Article Introuvable", notFoundMessage: "Désolé, nous n'avons pas pu trouver l'article que vous cherchiez. Il a peut-être été déplacé ou supprimé.", backToNews: "Retour aux Actualités et Événements" },
  ar: { appName: "عماد الإيمان", notFoundTitle: "المقال غير موجود", notFoundMessage: "عذرًا، لم نتمكن من العثور على المقال الذي تبحث عنه. ربما تم نقله أو حذفه.", backToNews: "العودة إلى الأخبار والأحداث" }
};

const ArticleHeader = styled(Box)(({ theme, image }) => ({ height: '40vh', minHeight: '350px', backgroundImage: `linear-gradient(${alpha(theme.palette.primary.dark, 0.6)}, ${alpha(theme.palette.primary.dark, 0.7)}), url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', color: theme.palette.common.white, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: theme.spacing(2) }));

const ArticleDetailPage = ({ language = 'en' }) => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${articleId}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId]);

  if (loading) return ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress size={60} /></Box> );
  if (!article) return (
    <>
      <Helmet><title>{t.notFoundTitle} | {t.appName}</title></Helmet>
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom>{t.notFoundTitle}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>{t.notFoundMessage}</Typography>
        <Button variant="contained" component={RouterLink} to="/news-and-events" startIcon={<ArrowBack />}>{t.backToNews}</Button>
      </Container>
    </>
  );
  
  const metaDescription = article.content.replace(/(\r\n|\n|\r)/gm, " ").substring(0, 160);
  const imageUrl = article.image_url ? `${API_ROOT_URL}${article.image_url}` : 'https://via.placeholder.com/1200x630?text=Amde+Haymanot';

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${article.title} | ${t.appName}`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="author" content={article.author} />
      </Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <ArticleHeader image={imageUrl}>
          <Container maxWidth="md">
            <Chip label={article.category} color="secondary" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }} />
            <Typography variant="h2" component="h1" fontWeight={700}>{article.title}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><CalendarToday sx={{ mr: 1 }} /><Typography>{format(parseISO(article.created_at), 'MMMM d, yyyy')}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Person sx={{ mr: 1 }} /><Typography>{article.author}</Typography></Box>
            </Box>
          </Container>
        </ArticleHeader>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, bgcolor: 'transparent' }}>
            {article.content.split('\n').map((paragraph, index) => (
              <Typography key={index} paragraph sx={{ fontSize: '1.2rem', lineHeight: 1.8 }}>{paragraph}</Typography>
            ))}
            <Button variant="outlined" component={RouterLink} to="/news-and-events" startIcon={<ArrowBack />} sx={{ mt: 4 }}>{t.backToNews}</Button>
          </Paper>
        </Container>
      </motion.div>
    </>
  );
};

export default ArticleDetailPage;