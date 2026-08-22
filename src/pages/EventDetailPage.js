import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, CircularProgress, Button,
} from '@mui/material';
import { styled, alpha } from '@mui/system';
import { CalendarToday, LocationOn, Person, ArrowBack } from '@mui/icons-material';
import { motion, useReducedMotion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Helmet } from 'react-helmet-async';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import crestLogo from '../assets/logo.png';
import { PageSection, GoldDivider, MediaGallery, contentImageList } from '../components/ui';
import { brand } from '../brand';
import { localizeEvent } from '../utils/localizeEvent';

const translations = {
  en: {
    "appName": "Amdehaymanot",
    "notFoundTitle": "The event was not found",
    "notFoundMessage": "Sorry, we couldn't find the event you're looking for.",
    "backToNews": "Back to news and events",
    "eventDetails": "Event details",
    "dateAndTime": "Date and time",
    "location": "Place",
    "organizer": "Organizer",
    "photos": "Photos",
    "registerForEvent": "Register for the event",
    "registerDescription": "Sign up to attend this event and receive updates.",
    "registerNow": "Register now",
    "addToCalendar": "Add to calendar",
    "moreNews": "More from our community",
    "moreNewsSub": "Stay connected with the latest announcements, activities and stories.",
    "viewAll": "See all news and events"
},
  om: {
    "appName": "Amdehaymanot",
    "notFoundTitle": "Taatee kun hin argamne",
    "notFoundMessage": "Dhiifama, taatee isin barbaaddan argachuu hin dandeenye.",
    "backToNews": "Gara oduu fi taateewwanitti deebi'a",
    "eventDetails": "Bal'ina taatee",
    "dateAndTime": "Guyyaa fi sa'aatii",
    "location": "Iddoo",
    "organizer": "Qindeessaa",
    "photos": "Suuraalee",
    "registerForEvent": "Sagantaa kanaaf galmaa'aa",
    "registerDescription": "Sagantaa kana irratti argamuuf galmaa'aa, odeeffannoo haaraa argachuuf.",
    "registerNow": "Amma galmaa'aa",
    "addToCalendar": "Kaalaandarii irratti dabali",
    "moreNews": "Hawaasa keenya irraa kan caalu",
    "moreNewsSub": "Beeksisa, sochiiwwanii fi seenaa haaraa waliin wal qunnamaa.",
    "viewAll": "Oduu fi taateewwan hunda ilaalaa"
},
  ti: {
    "appName": "ዓምደሃይማኖት",
    "notFoundTitle": "እቲ ፍጻመ ኣይተረኽበን።",
    "notFoundMessage": "ይቕሬታ፡ እቲ ትደልይዎ ዘለኹም ፍጻመ ክንረኽቦ ኣይከኣልናን።",
    "backToNews": "ናብ ዜናን ፍጻሜታትን ንመለስ",
    "eventDetails": "ዝርዝር ፍጻመታት",
    "dateAndTime": "ዕለትን ሰዓትን",
    "location": "ቦታ",
    "organizer": "ኣዳላዊ",
    "photos": "ስእልታት",
    "registerForEvent": "ኣብቲ መደብ ተመዝገቡ።",
    "registerDescription": "ኣብዚ መደብ ንምስታፍን ሓድሽ ሓበሬታ ንምርካብን ተመዝገቡ።",
    "registerNow": "ሕጂ ተመዝገቡ።",
    "addToCalendar": "ኣብ ካላንደር ወስኹ",
    "moreNews": "ካብ ሕብረተሰብና ተወሳኺ",
    "moreNewsSub": "ምስ እዋናዊ ምልክታታት፡ ንጥፈታትን ዛንታታትን ርክብ ይሃልኹም።",
    "viewAll": "ኩሉ ዜናን ፍጻሜታትን ርአ"
},
  es: {
    "appName": "Amdehaymanot",
    "notFoundTitle": "El evento no fue encontrado.",
    "notFoundMessage": "Lo sentimos, no pudimos encontrar el evento que estás buscando.",
    "backToNews": "Volver a noticias y eventos",
    "eventDetails": "Detalles del evento",
    "dateAndTime": "Fecha y hora",
    "location": "Lugar",
    "organizer": "Organizador",
    "photos": "Fotos",
    "registerForEvent": "Regístrese para el evento",
    "registerDescription": "Regístrese para asistir a este evento y recibir actualizaciones.",
    "registerNow": "Regístrate ahora",
    "addToCalendar": "Añadir al calendario",
    "moreNews": "Más de nuestra comunidad",
    "moreNewsSub": "Manténgase conectado con los últimos anuncios, actividades e historias.",
    "viewAll": "Ver todas las noticias y eventos"
},
  fr: {
    "appName": "Amdehaymanot",
    "notFoundTitle": "L'événement n'a pas été trouvé",
    "notFoundMessage": "Désolé, nous n'avons pas trouvé l'événement que vous recherchez.",
    "backToNews": "Retour aux actualités et événements",
    "eventDetails": "Détails de l'événement",
    "dateAndTime": "Date et heure",
    "location": "Lieu",
    "organizer": "Organisateur",
    "photos": "Photos",
    "registerForEvent": "Inscrivez-vous à l'événement",
    "registerDescription": "Inscrivez-vous pour assister à cet événement et recevoir des mises à jour.",
    "registerNow": "Inscrivez-vous maintenant",
    "addToCalendar": "Ajouter au calendrier",
    "moreNews": "Plus de notre communauté",
    "moreNewsSub": "Restez connecté avec les dernières annonces, activités et histoires.",
    "viewAll": "Voir toutes les actualités et événements"
},
  ar: {
    "appName": "آمدهيمانوت",
    "notFoundTitle": "لم يتم العثور على الحدث",
    "notFoundMessage": "عذرًا، لم نتمكن من العثور على الحدث الذي تبحث عنه.",
    "backToNews": "العودة إلى الأخبار والأحداث",
    "eventDetails": "تفاصيل الحدث",
    "dateAndTime": "التاريخ والوقت",
    "location": "مكان",
    "organizer": "منظم",
    "photos": "صور",
    "registerForEvent": "سجل لهذا الحدث",
    "registerDescription": "قم بالتسجيل لحضور هذا الحدث وتلقي التحديثات.",
    "registerNow": "سجل الآن",
    "addToCalendar": "أضف إلى التقويم",
    "moreNews": "المزيد من مجتمعنا",
    "moreNewsSub": "ابق على اتصال بأحدث الإعلانات والأنشطة والقصص.",
    "viewAll": "رؤية جميع الأخبار والأحداث"
},
  am: {
    "appName": "ዓምደሃይማኖት",
    "notFoundTitle": "ክስተቱ አልተገኘም",
    "notFoundMessage": "ይቅርታ፣ የሚፈልጉትን ክስተት ማግኘት አልቻልንም።",
    "backToNews": "Back to News and Events",
    "eventDetails": "የክስተት ዝርዝሮች",
    "dateAndTime": "ቀን እና ሰዓት",
    "location": "ቦታ",
    "organizer": "አደራጅ",
    "photos": "ፎቶዎች",
    "registerForEvent": "ለክስተቱ ይመዝገቡ",
    "registerDescription": "በዚህ ክስተት ላይ ለመገኘት እና ዝመናዎችን ለመቀበል ይመዝገቡ።",
    "registerNow": "አሁን ይመዝገቡ",
    "addToCalendar": "ወደ ቀን መቁጠሪያ አክል",
    "moreNews": "ከማህበረሰባችን ተጨማሪ",
    "moreNewsSub": "ከቅርብ ጊዜ ማስታወቂያዎች፣ እንቅስቃሴዎች እና ታሪኮች ጋር እንደተገናኙ ይቆዩ።",
    "viewAll": "ሁሉንም ዜና እና ክስተቶች ይመልከቱ"
},
  ge: {
    "appName": "ዓምደሃይማኖት",
    "notFoundTitle": "ክስተቱ አልተገኘም",
    "notFoundMessage": "ይቅርታ፣ የሚፈልጉትን ክስተት ማግኘት አልቻልንም።",
    "backToNews": "Back to News and Events",
    "eventDetails": "የክስተት ዝርዝሮች",
    "dateAndTime": "ቀን እና ሰዓት",
    "location": "ቦታ",
    "organizer": "አደራጅ",
    "photos": "ፎቶዎች",
    "registerForEvent": "ለክስተቱ ይመዝገቡ",
    "registerDescription": "በዚህ ክስተት ላይ ለመገኘት እና ዝመናዎችን ለመቀበል ይመዝገቡ።",
    "registerNow": "አሁን ይመዝገቡ",
    "addToCalendar": "ወደ ቀን መቁጠሪያ አክል",
    "moreNews": "ከማህበረሰባችን ተጨማሪ",
    "moreNewsSub": "ከቅርብ ጊዜ ማስታወቂያዎች፣ እንቅስቃሴዎች እና ታሪኮች ጋር እንደተገናኙ ይቆዩ።",
    "viewAll": "ሁሉንም ዜና እና ክስተቶች ይመልከቱ"
},
};;

const easeOut = [0.16, 1, 0.3, 1];

const MetaItem = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontSize: '0.84rem',
  color: alpha(brand.ink, 0.55),
});

const DetailRow = styled(Box)({
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
  padding: '14px 0',
  borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
  '&:last-of-type': { borderBottom: 'none' },
});

const DetailMark = styled(Box)({
  width: 42,
  height: 42,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: `1px solid ${alpha(brand.gold, 0.65)}`,
  bgcolor: brand.stone,
  color: brand.goldDark,
});

const EventDetailPage = ({ language = 'en' }) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = { ...translations.en, ...(translations[language] || {}) };
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', bgcolor: brand.stone }}>
        <CircularProgress size={36} sx={{ color: brand.navy }} />
      </Box>
    );
  }

  if (!event) {
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

  const localized = localizeEvent(event, language);
  const galleryImages = contentImageList(event);
  const coverPath = galleryImages[0]?.image_url || event.image_url;
  const imageUrl = coverPath
    ? (String(coverPath).startsWith('http') ? coverPath : `${API_ROOT_URL}${coverPath}`)
    : 'https://via.placeholder.com/1200x630?text=Amde+Haymanot';
  const isAlbum = galleryImages.length > 1;
  const paragraphs = String(localized.description || '')
    .split('\n')
    .filter((p) => p.trim());

  const calendarUrl = (() => {
    try {
      const start = parseISO(event.event_date);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const fmt = (d) => format(d, "yyyyMMdd'T'HHmmss");
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: localized.title || '',
        dates: `${fmt(start)}/${fmt(end)}`,
        details: localized.description || '',
        location: localized.location || '',
      });
      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    } catch {
      return null;
    }
  })();

  const metaDescription = String(localized.description || '')
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .substring(0, 160);

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${localized.title} | ${t.appName}`}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={localized.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={imageUrl} />
      </Helmet>

      <Box sx={{ bgcolor: brand.stone }}>
        <PageSection variant="white" sx={{ py: { xs: 4, md: 6 } }}>
          <Container maxWidth="md">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <Box sx={{ maxWidth: 700, mx: 'auto' }}>
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
                  {t.eventDetails}
                </Typography>

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
                    {format(parseISO(event.event_date), 'EEEE, MMMM d, yyyy · h:mm a')}
                  </MetaItem>
                  {localized.location && (
                    <MetaItem>
                      <LocationOn sx={{ fontSize: 16, color: brand.goldDark }} />
                      {localized.location}
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

                <DetailRow>
                  <DetailMark>
                    <CalendarToday sx={{ fontSize: 20 }} />
                  </DetailMark>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', color: alpha(brand.ink, 0.5), mb: 0.35 }}>
                      {t.dateAndTime}
                    </Typography>
                    <Typography sx={{ color: brand.navy, fontWeight: 600, fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif' }}>
                      {format(parseISO(event.event_date), 'EEEE, MMMM d, yyyy - h:mm a')}
                    </Typography>
                  </Box>
                </DetailRow>

                {localized.location && (
                  <DetailRow>
                    <DetailMark>
                      <LocationOn sx={{ fontSize: 20 }} />
                    </DetailMark>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: alpha(brand.ink, 0.5), mb: 0.35 }}>
                        {t.location}
                      </Typography>
                      <Typography sx={{ color: brand.navy, fontWeight: 600, fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif' }}>
                        {localized.location}
                      </Typography>
                    </Box>
                  </DetailRow>
                )}

                {event.organizer && (
                  <DetailRow>
                    <DetailMark>
                      <Person sx={{ fontSize: 20 }} />
                    </DetailMark>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', color: alpha(brand.ink, 0.5), mb: 0.35 }}>
                        {t.organizer}
                      </Typography>
                      <Typography sx={{ color: brand.navy, fontWeight: 600, fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif' }}>
                        {event.organizer}
                      </Typography>
                    </Box>
                  </DetailRow>
                )}

                <Box sx={{ mt: 4 }}>
                  {paragraphs.map((paragraph, index) => (
                    <Typography
                      key={index}
                      sx={{
                        m: 0,
                        mb: 2.5,
                        fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                        fontSize: { xs: '1.05rem', md: '1.1rem' },
                        lineHeight: 1.85,
                        color: alpha(brand.ink, 0.78),
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                </Box>

                <MediaGallery
                  images={isAlbum ? galleryImages : []}
                  apiRoot={API_ROOT_URL}
                  title={t.photos}
                />

                <Box
                  sx={{
                    mt: 5,
                    p: { xs: 2.5, sm: 3.5 },
                    bgcolor: brand.stone,
                    borderTop: `2px solid ${brand.gold}`,
                  }}
                >
                  <Typography
                    sx={{
                      m: 0,
                      mb: 1,
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 700,
                      fontSize: '1.35rem',
                      color: brand.navy,
                    }}
                  >
                    {t.registerForEvent}
                  </Typography>
                  <Typography sx={{ m: 0, mb: 2.5, color: alpha(brand.ink, 0.6), lineHeight: 1.65 }}>
                    {t.registerDescription}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 700, boxShadow: 'none', px: 3 }}
                    >
                      {t.registerNow}
                    </Button>
                    {calendarUrl && (
                      <Button
                        component="a"
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        color="primary"
                        size="large"
                        startIcon={<CalendarToday sx={{ fontSize: 16 }} />}
                        sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 700, px: 2.5 }}
                      >
                        {t.addToCalendar}
                      </Button>
                    )}
                  </Box>
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    color="primary"
                    component={RouterLink}
                    to="/news-and-events"
                    startIcon={<ArrowBack />}
                    sx={{ textTransform: 'none', fontWeight: 700 }}
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

export default EventDetailPage;
