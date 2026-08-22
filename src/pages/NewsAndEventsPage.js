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
    "pageTitle": "News and events",
    "pageDescription": "The latest news, announcements, and dates of upcoming and past events for Jimma Pillar Religion Sunday School.",
    "heroPageTitle": "News and events",
    "pageSubtitle": "Here you will find the latest news from our Sunday School and the dates and locations of upcoming and past events.",
    "newsTab": "Latest news",
    "eventsTab": "Events",
    "upcomingEvents": "coming",
    "pastEvents": "Past events",
    "allEvents": "All events",
    "noEventsFound": "No events were found",
    "noEventsUpcoming": "There are no upcoming events yet. Please check back later.",
    "noEventsFilter": "There are no events matching your current filter.",
    "eventDetails": "Event details",
    "dateAndTime": "Date and time",
    "location": "Place",
    "registerForEvent": "Register for the event",
    "registerDescription": "Sign up to attend this event and receive updates.",
    "registerNow": "Register now",
    "close": "Close",
    "addToCalendar": "Add to calendar",
    "noNewsFound": "No news yet.",
    "photos": "Photos",
    "readStory": "Read the story",
    "moreStories": "More stories",
    "ctaTitle": "Go with our community",
    "ctaSubtitle": "Join life at Jimma Sunday School — worship, education and fellowship.",
    "ctaButton": "Register today"
},
  om: {
    "appName": "Amdehaymanot",
    "pageTitle": "Oduu fi taateewwan",
    "pageDescription": "Oduu, beeksisa, fi guyyoota taateewwan dhufanii fi darban Mana Barumsa Sanbataa Amantii Utubaa Jimmaa.",
    "heroPageTitle": "Oduu fi taateewwan",
    "pageSubtitle": "Oduu haaraa Mana Barumsaa Sanbataa keenyaa fi guyyootaa fi bakka taateewwan dhufanii fi darban asitti ni argattu.",
    "newsTab": "Oduu haaraa",
    "eventsTab": "Taateewwan",
    "upcomingEvents": "dhufuu",
    "pastEvents": "Taateewwan darban",
    "allEvents": "Taateewwan hunda",
    "noEventsFound": "Taateewwan tokkollee hin argamne",
    "noEventsUpcoming": "Hanga ammaatti taateewwan dhufan hin jiran. Mee booda deebi'aa ilaalaa.",
    "noEventsFilter": "Taateewwan calaqqee kee ammaa wajjin walsimu hin jiran.",
    "eventDetails": "Bal'ina taatee",
    "dateAndTime": "Guyyaa fi sa'aatii",
    "location": "Iddoo",
    "registerForEvent": "Sagantaa kanaaf galmaa'aa",
    "registerDescription": "Sagantaa kana irratti argamuuf galmaa'aa, odeeffannoo haaraa argachuuf.",
    "registerNow": "Amma galmaa'aa",
    "close": "Cufuu",
    "addToCalendar": "Kaalaandarii irratti dabali",
    "noNewsFound": "Hanga ammaatti oduu hin jiru.",
    "photos": "Suuraalee",
    "readStory": "Seenaa dubbisaa",
    "moreStories": "Seenaa dabalataa",
    "ctaTitle": "Hawaasa keenya waliin deemi",
    "ctaSubtitle": "Jireenya Mana Barumsaa Sanbataa Jimmaa — waaqeffannaa, barnootaa fi waldaa keessatti hirmaadhaa.",
    "ctaButton": "Har'a galmaa'aa"
},
  ti: {
    "appName": "ዓምደሃይማኖት",
    "pageTitle": "ዜናን ፍጻሜታትን",
    "pageDescription": "እዋናዊ ዜናታትን ኣዋጃትን ዕለታትን ዝመጽእን ዝሓለፉን ፍጻመታት ንቤት ትምህርቲ ሰንበት ሃይማኖት ዓንዲ ጅማ።",
    "heroPageTitle": "ዜናን ፍጻሜታትን",
    "pageSubtitle": "ኣብዚ እዋናዊ ዜናታት ቤት ትምህርቲ ሰንበትናን ዕለታትን ቦታታትን ዝመጽእን ዝሓለፉን ፍጻመታትን ክትረኽቡ ኢኹም።",
    "newsTab": "እዋናዊ ዜና",
    "eventsTab": "ፍጻመታት",
    "upcomingEvents": "ዝመጽእ",
    "pastEvents": "ሕሉፍ ፍጻመታት",
    "allEvents": "ኩሉ ፍጻመታት",
    "noEventsFound": "ዝኾነ ፍጻመ ኣይተረኽበን።",
    "noEventsUpcoming": "ዛጊት ዝመጽእ ፍጻመታት የለን። በጃኹም ድሒርኩም ተመለሱ።",
    "noEventsFilter": "ምስቲ ሕጂ ዘለኻዮ ፍልተር ዝሰማማዕ ፍጻመ የለን።",
    "eventDetails": "ዝርዝር ፍጻመታት",
    "dateAndTime": "ዕለትን ሰዓትን",
    "location": "ቦታ",
    "registerForEvent": "ኣብቲ መደብ ተመዝገቡ።",
    "registerDescription": "ኣብዚ መደብ ንምስታፍን ሓድሽ ሓበሬታ ንምርካብን ተመዝገቡ።",
    "registerNow": "ሕጂ ተመዝገቡ።",
    "close": "ዕፁው",
    "addToCalendar": "ኣብ ካላንደር ወስኹ",
    "noNewsFound": "ዛጊት ዜና የለን።",
    "photos": "ስእልታት",
    "readStory": "ነቲ ዛንታ ኣንብብ",
    "moreStories": "ተወሳኺ ዛንታታት",
    "ctaTitle": "ምስ ሕብረተሰብና ኪድ",
    "ctaSubtitle": "ኣብ ቤት ትምህርቲ ሰንበት ጅማ ናብ ህይወት ተጸንበሩ — ኣምልኾ፣ ትምህርትን ሕብረትን።",
    "ctaButton": "ሎሚ ተመዝገቡ።"
},
  es: {
    "appName": "Amdehaymanot",
    "pageTitle": "Noticias y eventos",
    "pageDescription": "Las últimas noticias, anuncios y fechas de eventos pasados ​​y próximos de la Escuela Dominical de Jimma Pillar Religion.",
    "heroPageTitle": "Noticias y eventos",
    "pageSubtitle": "Aquí encontrará las últimas noticias de nuestra Escuela Dominical y las fechas y ubicaciones de eventos pasados ​​y futuros.",
    "newsTab": "Últimas noticias",
    "eventsTab": "Eventos",
    "upcomingEvents": "próximo",
    "pastEvents": "Eventos pasados",
    "allEvents": "Todos los eventos",
    "noEventsFound": "No se encontraron eventos",
    "noEventsUpcoming": "Aún no hay eventos próximos. Vuelve a consultar más tarde.",
    "noEventsFilter": "No hay eventos que coincidan con su filtro actual.",
    "eventDetails": "Detalles del evento",
    "dateAndTime": "Fecha y hora",
    "location": "Lugar",
    "registerForEvent": "Regístrese para el evento",
    "registerDescription": "Regístrese para asistir a este evento y recibir actualizaciones.",
    "registerNow": "Regístrate ahora",
    "close": "Cerca",
    "addToCalendar": "Añadir al calendario",
    "noNewsFound": "Aún no hay noticias.",
    "photos": "Fotos",
    "readStory": "Lee la historia",
    "moreStories": "Más historias",
    "ctaTitle": "Ve con nuestra comunidad",
    "ctaSubtitle": "Únase a la vida en Jimma Sunday School: adoración, educación y compañerismo.",
    "ctaButton": "Regístrese hoy"
},
  fr: {
    "appName": "Amdehaymanot",
    "pageTitle": "Actualités et événements",
    "pageDescription": "Les dernières nouvelles, annonces et dates des événements à venir et passés pour l'école du dimanche Jimma Pillar Religion.",
    "heroPageTitle": "Actualités et événements",
    "pageSubtitle": "Vous trouverez ici les dernières nouvelles de notre École du Dimanche ainsi que les dates et lieux des événements à venir et passés.",
    "newsTab": "Dernières nouvelles",
    "eventsTab": "Événements",
    "upcomingEvents": "à venir",
    "pastEvents": "Événements passés",
    "allEvents": "Tous les événements",
    "noEventsFound": "Aucun événement n'a été trouvé",
    "noEventsUpcoming": "Il n'y a pas encore d'événements à venir. Veuillez revenir plus tard.",
    "noEventsFilter": "Il n'y a aucun événement correspondant à votre filtre actuel.",
    "eventDetails": "Détails de l'événement",
    "dateAndTime": "Date et heure",
    "location": "Lieu",
    "registerForEvent": "Inscrivez-vous à l'événement",
    "registerDescription": "Inscrivez-vous pour assister à cet événement et recevoir des mises à jour.",
    "registerNow": "Inscrivez-vous maintenant",
    "close": "Fermer",
    "addToCalendar": "Ajouter au calendrier",
    "noNewsFound": "Pas de nouvelles pour l'instant.",
    "photos": "Photos",
    "readStory": "Lire l'histoire",
    "moreStories": "Plus d'histoires",
    "ctaTitle": "Partez avec notre communauté",
    "ctaSubtitle": "Rejoignez la vie à l'école du dimanche Jimma - culte, éducation et camaraderie.",
    "ctaButton": "Inscrivez-vous aujourd'hui"
},
  ar: {
    "appName": "آمدهيمانوت",
    "pageTitle": "الأخبار والأحداث",
    "pageDescription": "آخر الأخبار والإعلانات وتواريخ الأحداث القادمة والسابقة لمدرسة الأحد الدينية في جيما بيلار.",
    "heroPageTitle": "الأخبار والأحداث",
    "pageSubtitle": "ستجد هنا آخر الأخبار من مدرسة الأحد لدينا وتواريخ ومواقع الأحداث القادمة والماضية.",
    "newsTab": "آخر الأخبار",
    "eventsTab": "الأحداث",
    "upcomingEvents": "آت",
    "pastEvents": "الأحداث الماضية",
    "allEvents": "جميع الأحداث",
    "noEventsFound": "لم يتم العثور على أي أحداث",
    "noEventsUpcoming": "لا توجد أحداث قادمة حتى الآن. يرجى التحقق مرة أخرى في وقت لاحق.",
    "noEventsFilter": "لا توجد أحداث تطابق الفلتر الحالي الخاص بك.",
    "eventDetails": "تفاصيل الحدث",
    "dateAndTime": "التاريخ والوقت",
    "location": "مكان",
    "registerForEvent": "سجل لهذا الحدث",
    "registerDescription": "قم بالتسجيل لحضور هذا الحدث وتلقي التحديثات.",
    "registerNow": "سجل الآن",
    "close": "يغلق",
    "addToCalendar": "أضف إلى التقويم",
    "noNewsFound": "لا أخبار بعد.",
    "photos": "صور",
    "readStory": "اقرأ القصة",
    "moreStories": "المزيد من القصص",
    "ctaTitle": "الذهاب مع مجتمعنا",
    "ctaSubtitle": "انضم إلى الحياة في مدرسة Jimma Sunday School - العبادة والتعليم والزمالة.",
    "ctaButton": "سجل اليوم"
},
  am: {
    "appName": "ዓምደሃይማኖት",
    "pageTitle": "ዜና እና ክስተቶች",
    "pageDescription": "ለጅማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት አዳዲስ ዜናዎች፣ ማስታወቂያዎች እና የመጪና ያለፉ ክስተቶች ቀናት።",
    "heroPageTitle": "ዜና እና ክስተቶች",
    "pageSubtitle": "የሰንበት ትምህርት ቤታችን አዳዲስ ዜናዎችን እና የመጪና ያለፉ ክስተቶች ቀንና ቦታ እዚህ ያገኛሉ።",
    "newsTab": "የቅርብ ጊዜ ዜና",
    "eventsTab": "ክስተቶች",
    "upcomingEvents": "መጪ",
    "pastEvents": "ያለፉ ክስተቶች",
    "allEvents": "ሁሉም ክስተቶች",
    "noEventsFound": "ምንም ክስተቶች አልተገኙም",
    "noEventsUpcoming": "እስካሁን መጪ ክስተት የለም። እባክዎ ቆይተው ተመልሰው ይመልከቱ።",
    "noEventsFilter": "ከአሁኑ ማጣሪያዎ ጋር የሚዛመዱ ምንም ክስተቶች የሉም።",
    "eventDetails": "የክስተት ዝርዝሮች",
    "dateAndTime": "ቀን እና ሰዓት",
    "location": "ቦታ",
    "registerForEvent": "ለክስተቱ ይመዝገቡ",
    "registerDescription": "በዚህ ክስተት ላይ ለመገኘት እና ዝመናዎችን ለመቀበል ይመዝገቡ።",
    "registerNow": "አሁን ይመዝገቡ",
    "close": "ዝጋ",
    "addToCalendar": "ወደ ቀን መቁጠሪያ አክል",
    "noNewsFound": "እስካሁን ዜና የለም።",
    "photos": "ፎቶዎች",
    "readStory": "ታሪኩን ያንቡ",
    "moreStories": "ተጨማሪ ታሪኮች",
    "ctaTitle": "ከማህበረሰባችን ጋር ይሂዱ",
    "ctaSubtitle": "በጅማ የሰንበት ትምህርት ቤት ሕይወትን ይቀላቀሉ — አምልኮ፣ ትምህርት እና ኅብረት።",
    "ctaButton": "ዛሬ ይመዝገቡ"
},
  ge: {
    "appName": "ዓምደሃይማኖት",
    "pageTitle": "ዜና እና ክስተቶች",
    "pageDescription": "ለጅማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት አዳዲስ ዜናዎች፣ ማስታወቂያዎች እና የመጪና ያለፉ ክስተቶች ቀናት።",
    "heroPageTitle": "ዜና እና ክስተቶች",
    "pageSubtitle": "የሰንበት ትምህርት ቤታችን አዳዲስ ዜናዎችን እና የመጪና ያለፉ ክስተቶች ቀንና ቦታ እዚህ ያገኛሉ።",
    "newsTab": "የቅርብ ጊዜ ዜና",
    "eventsTab": "ክስተቶች",
    "upcomingEvents": "መጪ",
    "pastEvents": "ያለፉ ክስተቶች",
    "allEvents": "ሁሉም ክስተቶች",
    "noEventsFound": "ምንም ክስተቶች አልተገኙም",
    "noEventsUpcoming": "እስካሁን መጪ ክስተት የለም። እባክዎ ቆይተው ተመልሰው ይመልከቱ።",
    "noEventsFilter": "ከአሁኑ ማጣሪያዎ ጋር የሚዛመዱ ምንም ክስተቶች የሉም።",
    "eventDetails": "የክስተት ዝርዝሮች",
    "dateAndTime": "ቀን እና ሰዓት",
    "location": "ቦታ",
    "registerForEvent": "ለክስተቱ ይመዝገቡ",
    "registerDescription": "በዚህ ክስተት ላይ ለመገኘት እና ዝመናዎችን ለመቀበል ይመዝገቡ።",
    "registerNow": "አሁን ይመዝገቡ",
    "close": "ዝጋ",
    "addToCalendar": "ወደ ቀን መቁጠሪያ አክል",
    "noNewsFound": "እስካሁን ዜና የለም።",
    "photos": "ፎቶዎች",
    "readStory": "ታሪኩን ያንቡ",
    "moreStories": "ተጨማሪ ታሪኮች",
    "ctaTitle": "ከማህበረሰባችን ጋር ይሂዱ",
    "ctaSubtitle": "በጅማ የሰንበት ትምህርት ቤት ሕይወትን ይቀላቀሉ — አምልኮ፣ ትምህርት እና ኅብረት።",
    "ctaButton": "ዛሬ ይመዝገቡ"
},
};;


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
