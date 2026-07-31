import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, CircularProgress, Button, Alert, AlertTitle,
} from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { format, parseISO, isPast } from 'date-fns';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import newsSubject from '../assets/news-and-events.JPG';
import heroBackground from '../assets/community.jpg';
import crestLogo from '../assets/logo.png';
import { brand } from '../brand';
import { AboutHero, PageSection, GoldDivider } from '../components/ui';
import { localizePosts } from '../utils/localizePost';
import { localizeEvents } from '../utils/localizeEvent';

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
  en: { appName: "Amde Haymanot", pageTitle: "News & Events", pageDescription: "Stay up-to-date with the latest news, announcements, and event schedules for the Amdehaymanot Sunday School in Jimma. Find information on upcoming and past events.", heroPageTitle: "News & Events", pageSubtitle: "Stay connected with the latest announcements, activities, and stories from our community.", newsTab: "Latest News", eventsTab: "Events", upcomingEvents: "Upcoming", pastEvents: "Past Events", allEvents: "All Events", noEventsFound: "No events found", noEventsUpcoming: "Check back soon for upcoming events!", noEventsFilter: "No events match your current filter.", eventDetails: "Event Details", dateAndTime: "Date & Time", location: "Location", registerForEvent: "Register for Event", registerDescription: "Sign up to attend this event and receive updates.", registerNow: "Register Now", close: "Close", addToCalendar: "Add to Calendar", noNewsFound: "No news found", photos: "Photos", readStory: "Read story", moreStories: "More stories", ctaTitle: "Walk with our community", ctaSubtitle: "Join Sunday School life in Jimma — worship, learning, and fellowship.", ctaButton: "Register today" },
  am: { appName: "ዓምደ ሃይማኖት", pageTitle: "ዜና እና ክስተቶች", pageDescription: "ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት የቅርብ ጊዜ ዜናዎች፣ ማስታወቂያዎች እና የክስተት መርሃ ግብሮች ጋር እንደተዘመኑ ይቆዩ። ስለ መጪ እና ያለፉ ክስተቶች መረጃ ያግኙ።", heroPageTitle: "ዜና እና ክስተቶች", pageSubtitle: "ከማህበረሰባችን የቅርብ ጊዜ ማስታወቂያዎች፣ እንቅስቃሴዎች እና ታሪኮች ጋር እንደተገናኙ ይቆዩ።", newsTab: "የቅርብ ጊዜ ዜና", eventsTab: "ክስተቶች", upcomingEvents: "መጪ", pastEvents: "ያለፉ ክስተቶች", allEvents: "ሁሉም ክስተቶች", noEventsFound: "ምንም ክስተቶች አልተገኙም", noEventsUpcoming: "ለሚመጡ ክስተቶች በቅርቡ ተመልሰው ይመልከቱ!", noEventsFilter: "ከአሁኑ ማጣሪያዎ ጋር የሚዛመዱ ምንም ክስተቶች የሉም።", eventDetails: "የክስተት ዝርዝሮች", dateAndTime: "ቀን እና ሰዓት", location: "ቦታ", registerForEvent: "ለክስተቱ ይመዝገቡ", registerDescription: "በዚህ ክስተት ላይ ለመገኘት እና ዝመናዎችን ለመቀበል ይመዝገቡ።", registerNow: "አሁን ይመዝገቡ", close: "ዝጋ", addToCalendar: "ወደ ቀን መቁጠሪያ አክል", noNewsFound: "ምንም ዜና አልተገኘም", photos: "ፎቶዎች", readStory: "ታሪኩን ያንቡ", moreStories: "ተጨማሪ ታሪኮች", ctaTitle: "ከማህበረሰባችን ጋር ይሂዱ", ctaSubtitle: "በጅማ የሰንበት ትምህርት ቤት ሕይወትን ይቀላቀሉ — አምልኮ፣ ትምህርት እና ኅብረት።", ctaButton: "ዛሬ ይመዝገቡ" },
  ar: { appName: "عماد الإيمان", pageTitle: "الأخبار والأحداث", pageDescription: "ابق على اطلاع بآخر الأخبار والإعلانات وجداول الفعاليات لمدرسة الأحد عماد الإيمان في جيما. اعثر على معلومات حول الأحداث القادمة والسابقة.", heroPageTitle: "الأخبار والأحداث", pageSubtitle: "ابق على تواصل مع أحدث الإعلانات والأنشطة والقصص من مجتمعنا.", newsTab: "أحدث الأخبار", eventsTab: "الأحداث", upcomingEvents: "القادمة", pastEvents: "الأحداث الماضية", allEvents: "كل الأحداث", noEventsFound: "لم يتم العثور على أحداث", noEventsUpcoming: "تحقق مرة أخرى قريبًا من الأحداث القادمة!", noEventsFilter: "لا توجد أحداث تطابق المرشح الحالي.", eventDetails: "تفاصيل الحدث", dateAndTime: "التاريخ والوقت", location: "الموقع", registerForEvent: "التسجيل في الحدث", registerDescription: "قم بالتسجيل لحضور هذا الحدث وتلقي التحديثات.", registerNow: "سجل الآن", close: "إغلاق", addToCalendar: "أضف إلى التقويم", noNewsFound: "لا توجد أخبار" },
  es: { appName: "Amde Haymanot", pageTitle: "Noticias y Eventos", pageDescription: "Manténgase al día con las últimas noticias, anuncios y horarios de eventos de la Escuela Dominical Amdehayimanot en Jimma. Encuentre información sobre eventos próximos y pasados.", heroPageTitle: "Noticias y Eventos", pageSubtitle: "Manténgase conectado con los últimos anuncios, actividades e historias de nuestra comunidad.", newsTab: "Últimas noticias", eventsTab: "Eventos", upcomingEvents: "Próximos", pastEvents: "Eventos pasados", allEvents: "Todos los eventos", noEventsFound: "No se encontraron eventos", noEventsUpcoming: "¡Vuelva pronto para ver los próximos eventos!", noEventsFilter: "No hay eventos que coincidan con su filtro actual.", eventDetails: "Detalles del evento", dateAndTime: "Fecha y hora", location: "Ubicación", registerForEvent: "Registrarse para el evento", registerDescription: "Regístrese para asistir a este evento y recibir actualizaciones.", registerNow: "Regístrate ahora", close: "Cerrar", addToCalendar: "Añadir al calendario", noNewsFound: "No se encontraron noticias" },
  fr: { appName: "Amde Haymanot", pageTitle: "Actualités et Événements", pageDescription: "Restez à jour avec les dernières actualités, annonces et horaires des événements de l'école du dimanche Amdehayimanot à Jimma. Trouvez des informations sur les événements à venir et passés.", heroPageTitle: "Actualités et événements", pageSubtitle: "Restez connecté avec les dernières annonces, activités et histoires de notre communauté.", newsTab: "Dernières nouvelles", eventsTab: "Événements", upcomingEvents: "À venir", pastEvents: "Événements passés", allEvents: "Tous les évènements", noEventsFound: "Aucun événement trouvé", noEventsUpcoming: "Revenez bientôt pour les événements à venir!", noEventsFilter: "Aucun événement ne correspond à votre filtre actuel.", eventDetails: "Détails de l'événement", dateAndTime: "Date et heure", location: "Lieu", registerForEvent: "S'inscrire à l'événement", registerDescription: "Inscrivez-vous pour assister à cet événement et recevoir des mises à jour.", registerNow: "S'inscrire maintenant", close: "Fermer", addToCalendar: "Ajouter au calendrier", noNewsFound: "Aucune nouvelle trouvée" },
  ti: { appName: "ኣምደ ሃይማኖት", pageTitle: "ዜናን ፍጻመታትን", pageDescription: "ምስ ናይ ጅማ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ሓደስቲ ዜናታት፡ ምልክታታትን መደባት ፍጻመታትን ንተኸታተሉ። ብዛዕባ ዝመጽኡን ዝሓለፉን ፍጻመታት ሓበሬታ ርኸቡ።", heroPageTitle: "ዜናን ፍጻመታትን", pageSubtitle: " ምስ ናይ ማሕበረሰብና ሓደስቲ ምልክታታት፣ ንጥፈታትን ዛንታታትን ተራኸቡ።", newsTab: "ሓደስቲ ዜና", eventsTab: "ፍጻመታት", upcomingEvents: "ዝመጽእ", pastEvents: "ዝሓለፉ ፍጻመታት", allEvents: "ኩሉ ፍጻመታት", noEventsFound: "ዝኾነ ፍጻመታት ኣይተረኽበን", noEventsUpcoming: "ንዝመጽእ ፍጻመታት ቀልጢፍኩም ተመለሱ!", noEventsFilter: "ምስ ናይ ሕጂ መጽረዪኹም ዝሳነ ፍጻመታት የለን።", eventDetails: "ዝርዝር ፍጻመ", dateAndTime: "ዕለትን ግዜን", location: "ቦታ", registerForEvent: "ንፍጻመ መዝገብ", registerDescription: " ኣብዚ ፍጻመ ንምስታፍን ሓበሬታ ንምርካብን ተመዝገቡ።", registerNow: "ሕጂ ተመዝገብ", close: "ዕጸው", addToCalendar: "ናብ መደብ ኣእትው", noNewsFound: "ዜና ኣይተረኽበን" },
  om: { appName: "Amde Haymanot", pageTitle: "Oduu fi Taateewwan", pageDescription: "Oduuwwan, beeksisoota, fi sagantaawwan taateewwan Mana Barumsaa Dilbataa Amdehayimanot Jimmaatti argamu hordofaa. Taateewwan dhufanii fi darbaniif odeeffannoo argadhaa.", heroPageTitle: "Oduu fi Taateewwan", pageSubtitle: "Beeksisa, gochaawwan, fi seenaawwan hawaasa keenyaa yeroo ammaa waliin wal qunnamaa.", newsTab: "Oduu Haaraa", eventsTab: "Taateewwan", upcomingEvents: "Kan Dhufu", pastEvents: "Taateewwan Darban", allEvents: "Taateewwan Hundaa", noEventsFound: "Taateewwan hin argamne", noEventsUpcoming: "Taateewwan dhufaniif dhiyootti deebi'aa ilaalaa!", noEventsFilter: "Taateewwan filter keessan ammaa wajjin walsiman hin jiran.", eventDetails: "Ibsa Taatee", dateAndTime: "Guyyaa fi Sa'aatii", location: "Iddoo", registerForEvent: "Taateef Galmaa'i", registerDescription: "Taatee kanarratti hirmaachuuf fi odeeffannoo argachuuf galmaa'aa.", registerNow: "Amma Galmaa'i", close: "Cufi", addToCalendar: "Ajandaatti Dabali", noNewsFound: "Oduun hin argamne" },
  ge: { appName: "አምደ ፡ ሃይማኖት", pageTitle: "ዜና ወፍጻሜ", pageDescription: "ምስ ሓደስቲ ዜና፣ ምልክታት፣ ወመደባት ፍጻሜ ዘቤተ ትምህርት ሰንበት ዓምደሃይማኖት በጅማ ተከታተሉ። ዜና ስለ ዘይመጽኡ ወዘሐለፉ ፍጻሜያት ርከቡ።", heroPageTitle: "ዜና ወፍጻሜ", pageSubtitle: "ምስ ሓደስቲ ምልክታት፣ ንጥፈታት፣ ወዛንታ ማሕበረሰብና ተራኸቡ።", newsTab: "ሓዲስ ዜና", eventsTab: "ፍጻሜ", upcomingEvents: "ዘይመጽእ", pastEvents: "ዘሐለፈ ፍጻሜ", allEvents: "ኵሉ ፍጻሜ", noEventsFound: "ኢ-ረክበ ፍጻሜ", noEventsUpcoming: "ንዘይመጽእ ፍጻሜ ቀልጢፍክሙ ተመለሱ!", noEventsFilter: "ምስ ናይ ሕጂ መጽረዪክሙ ዝሳነ ፍጻሜ ኢ-ሀሎ።", eventDetails: "ዝርዝር ፍጻሜ", dateAndTime: "ዕለት ወሰዓት", location: "ቦታ", registerForEvent: "ንፍጻሜ መዝገብ", registerDescription: "በዝንቱ ፍጻሜ ንምስታፍ ወሓበሬታ ንምርካብ ተመዝገቡ።", registerNow: "ይመዝገብ ሕጂ", close: "ዕጸው", addToCalendar: "ውስተ መደብ አእትው", noNewsFound: "ዜና ኢ-ረክበ" },
};


const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.15 };

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

const Board = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.05fr 0.95fr',
  gap: 0,
  alignItems: 'start',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const BoardColumn = styled(Box)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(0, 4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0),
    '& + &': {
      marginTop: theme.spacing(5),
      paddingTop: theme.spacing(4),
      borderTop: `1px solid ${alpha(brand.navy, 0.1)}`,
    },
  },
  [theme.breakpoints.up('md')]: {
    '&:first-of-type': {
      paddingLeft: 0,
      paddingRight: theme.spacing(5),
      borderRight: `1px solid ${alpha(brand.navy, 0.12)}`,
    },
    '&:last-of-type': {
      paddingRight: 0,
      paddingLeft: theme.spacing(5),
    },
  },
}));

const ColLabel = styled(Typography)({
  margin: 0,
  marginBottom: 18,
  paddingBottom: 12,
  borderBottom: `2px solid ${brand.gold}`,
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  fontSize: '0.72rem',
  color: brand.navy,
});

const NewsRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '92px 1fr',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1.75, 0),
  textDecoration: 'none',
  color: 'inherit',
  borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
  transition: 'background-color 0.2s ease',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': {
    backgroundColor: alpha(brand.stone, 0.7),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '76px 1fr',
    gap: theme.spacing(1.5),
  },
}));

const EventRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '76px 1fr',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1.75, 0),
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
  borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
  transition: 'background-color 0.2s ease',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': {
    backgroundColor: alpha(brand.stone, 0.7),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '68px 1fr',
    gap: theme.spacing(1.5),
  },
}));

const FilterLink = styled(Box, {
  shouldForwardProp: (p) => p !== 'active',
})(({ active }) => ({
  cursor: 'pointer',
  padding: '4px 0',
  marginRight: 16,
  borderBottom: `2px solid ${active ? brand.gold : 'transparent'}`,
  color: active ? brand.navy : alpha(brand.navy, 0.42),
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  fontSize: '0.65rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  display: 'inline-block',
  transition: 'color 0.2s ease',
  '&:hover': { color: brand.navy },
}));

const NewsAndEventsPage = ({ language = 'en' }) => {
  const t = translations[language] || translations.en;
  const brandName = brandTitles[language] || brandTitles.en;
  const reduceMotion = useReducedMotion();
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventFilter, setEventFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [newsResponse, eventsResponse] = await Promise.all([
          api.get('/posts'),
          api.get('/events'),
        ]);
        setNews(newsResponse.data);
        setEvents(eventsResponse.data);
      } catch (err) {
        console.error('===== DATA FETCHING FAILED =====', err);
        setError('An error occurred while fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const localizedNews = localizePosts(news, language);
  const localizedEvents = localizeEvents(events, language);

  const filteredEvents = [...localizedEvents]
    .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
    .filter((event) => {
      try {
        if (eventFilter === 'upcoming') return !isPast(parseISO(event.event_date));
        if (eventFilter === 'past') return isPast(parseISO(event.event_date));
        return true;
      } catch {
        return false;
      }
    });

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | ${brandName}`}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>

      <Box sx={{ bgcolor: brand.stone }}>
        <AboutHero
          subjectImage={newsSubject}
          subjectFit="cover"
          backgroundImage={heroBackground}
          brandName={brandName}
          tagline={t.heroPageTitle}
          storyTitle={t.newsTab}
          storyLead={t.pageSubtitle}
          placeLabel={placeLabels[language] || placeLabels.en}
          yearCaption={yearCaptions[language] || yearCaptions.en}
          foundedYear="1964"
          lineClamp={3}
          mobileLineClamp={2}
        />

        <PageSection variant="white" sx={{ py: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 520, mx: 'auto' }}>
              <Box
                aria-hidden
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.25,
                  mb: 2,
                }}
              >
                <Box sx={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(brand.goldDark, 0.7)})` }} />
                <EthiopicCross size={11} />
                <Box sx={{ width: 36, height: 1, background: `linear-gradient(90deg, ${alpha(brand.goldDark, 0.7)}, transparent)` }} />
              </Box>
              <Typography
                component="h2"
                sx={{
                  m: 0,
                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                  lineHeight: 1.15,
                  color: brand.navy,
                }}
              >
                {t.heroPageTitle}
              </Typography>
              <Box aria-hidden sx={{ width: 44, height: 2, mx: 'auto', my: 1.75, bgcolor: brand.gold }} />
              <Typography
                sx={{
                  m: 0,
                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: alpha(brand.ink, 0.58),
                }}
              >
                {t.pageSubtitle}
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={34} sx={{ color: brand.navy }} />
              </Box>
            ) : error ? (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            ) : (
              <Board>
                <BoardColumn>
                  <ColLabel>{t.newsTab}</ColLabel>
                  {localizedNews.length > 0 ? (
                    localizedNews.map((item, i) => {
                      const imageUrl = item.image_url
                        ? `${API_ROOT_URL}${item.image_url}`
                        : null;
                      return (
                        <motion.div
                          key={item.id}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={viewOpts}
                          transition={{ duration: 0.4, ease: easeOut, delay: i * 0.03 }}
                        >
                          <NewsRow component={Link} to={`/news-and-events/${item.id}`}>
                            <Box
                              sx={{
                                width: '100%',
                                aspectRatio: '1 / 1',
                                overflow: 'hidden',
                                bgcolor: brand.stone,
                                border: `1px solid ${alpha(brand.navy, 0.08)}`,
                              }}
                            >
                              {imageUrl ? (
                                <Box
                                  component="img"
                                  src={imageUrl}
                                  alt=""
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                  }}
                                />
                              ) : null}
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                                  fontWeight: 600,
                                  fontSize: '1.18rem',
                                  lineHeight: 1.25,
                                  color: brand.navy,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Typography
                                sx={{
                                  mt: 0.7,
                                  fontSize: '0.66rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase',
                                  color: alpha(brand.ink, 0.45),
                                }}
                              >
                                {format(parseISO(item.created_at), 'MMM d, yyyy')}
                              </Typography>
                            </Box>
                          </NewsRow>
                        </motion.div>
                      );
                    })
                  ) : (
                    <Typography sx={{ color: alpha(brand.ink, 0.5), py: 2 }}>
                      {t.noNewsFound}
                    </Typography>
                  )}
                </BoardColumn>

                <BoardColumn>
                  <ColLabel>{t.eventsTab}</ColLabel>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1.5, mt: -0.5 }}>
                    {[
                      { value: 'all', label: t.allEvents },
                      { value: 'upcoming', label: t.upcomingEvents },
                      { value: 'past', label: t.pastEvents },
                    ].map((f) => (
                      <FilterLink
                        key={f.value}
                        active={eventFilter === f.value}
                        onClick={() => setEventFilter(f.value)}
                      >
                        {f.label}
                      </FilterLink>
                    ))}
                  </Box>

                  {localizedEvents.length === 0 ? (
                    <Box sx={{ py: 2 }}>
                      <Typography sx={{ color: brand.navy, fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}>
                        {t.noEventsFound}
                      </Typography>
                      <Typography sx={{ color: alpha(brand.ink, 0.55), fontSize: '0.88rem' }}>
                        {t.noEventsUpcoming}
                      </Typography>
                    </Box>
                  ) : filteredEvents.length === 0 ? (
                    <Box sx={{ py: 2 }}>
                      <Typography sx={{ color: brand.navy, fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}>
                        {t.noEventsFound}
                      </Typography>
                      <Typography sx={{ color: alpha(brand.ink, 0.55), fontSize: '0.88rem' }}>
                        {t.noEventsFilter}
                      </Typography>
                    </Box>
                  ) : (
                    filteredEvents.map((event, i) => {
                      let time = '';
                      let dateLabel = '';
                      try {
                        const d = parseISO(event.event_date);
                        time = format(d, 'h:mm a');
                        dateLabel = format(d, 'MMM d, yyyy');
                      } catch {
                        /* keep defaults */
                      }
                      const imageUrl = event.image_url
                        ? `${API_ROOT_URL}${event.image_url}`
                        : null;
                      return (
                        <motion.div
                          key={event.id}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={viewOpts}
                          transition={{ duration: 0.4, ease: easeOut, delay: i * 0.03 }}
                        >
                          <EventRow component={Link} to={`/news-and-events/event/${event.id}`}>
                            <Box
                              sx={{
                                width: '100%',
                                aspectRatio: '1 / 1',
                                overflow: 'hidden',
                                bgcolor: brand.stone,
                                border: `1px solid ${alpha(brand.navy, 0.08)}`,
                              }}
                            >
                              {imageUrl ? (
                                <Box
                                  component="img"
                                  src={imageUrl}
                                  alt=""
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                  }}
                                />
                              ) : null}
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                                  fontWeight: 600,
                                  fontSize: '1.18rem',
                                  lineHeight: 1.25,
                                  color: brand.navy,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {event.title}
                              </Typography>
                              <Typography
                                sx={{
                                  mt: 0.7,
                                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                                  fontSize: '0.82rem',
                                  color: alpha(brand.ink, 0.55),
                                }}
                              >
                                {[dateLabel, event.location, time].filter(Boolean).join(' · ')}
                              </Typography>
                            </Box>
                          </EventRow>
                        </motion.div>
                      );
                    })
                  )}
                </BoardColumn>
              </Board>
            )}
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
              {t.ctaTitle || t.heroPageTitle}
            </Typography>
            <GoldDivider />
            <Typography
              sx={{
                m: 0,
                mt: 1.75,
                mb: 3,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: alpha(brand.white, 0.75),
              }}
            >
              {t.ctaSubtitle || t.pageSubtitle}
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: 1,
                px: 4.5,
                py: 1.1,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: 'none',
              }}
            >
              {t.ctaButton || t.registerNow}
            </Button>
          </Container>
        </PageSection>
      </Box>

    </>
  );
};

export default NewsAndEventsPage;
