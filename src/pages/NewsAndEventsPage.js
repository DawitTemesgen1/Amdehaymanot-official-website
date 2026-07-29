import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Chip, Paper, Tabs, Tab, IconButton, styled, useTheme, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Divider, CardActionArea, alpha, ToggleButtonGroup, ToggleButton, Alert, AlertTitle } from '@mui/material';
import { CalendarToday, LocationOn, Close, Share, BookmarkBorder, Event as EventIcon, Newspaper as NewsIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isPast } from 'date-fns';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import heroImage from '../assets/news-and-events.JPG';

const translations = {
  en: { appName: "Amde Haymanot", pageTitle: "News & Events", pageDescription: "Stay up-to-date with the latest news, announcements, and event schedules for the Amdehaymanot Sunday School in Jimma. Find information on upcoming and past events.", heroPageTitle: "News & Events", pageSubtitle: "Stay connected with the latest announcements, activities, and stories from our community.", newsTab: "Latest News", eventsTab: "Events", upcomingEvents: "Upcoming", pastEvents: "Past Events", allEvents: "All Events", noEventsFound: "No events found", noEventsUpcoming: "Check back soon for upcoming events!", noEventsFilter: "No events match your current filter.", eventDetails: "Event Details", dateAndTime: "Date & Time", location: "Location", registerForEvent: "Register for Event", registerDescription: "Sign up to attend this event and receive updates.", registerNow: "Register Now", close: "Close", addToCalendar: "Add to Calendar" },
  am: { appName: "ዓምደ ሃይማኖት", pageTitle: "ዜና እና ክስተቶች", pageDescription: "ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት የቅርብ ጊዜ ዜናዎች፣ ማስታወቂያዎች እና የክስተት መርሃ ግብሮች ጋር እንደተዘመኑ ይቆዩ። ስለ መጪ እና ያለፉ ክስተቶች መረጃ ያግኙ።", heroPageTitle: "ዜና እና ክስተቶች", pageSubtitle: "ከማህበረሰባችን የቅርብ ጊዜ ማስታወቂያዎች፣ እንቅስቃሴዎች እና ታሪኮች ጋር እንደተገናኙ ይቆዩ።", newsTab: "የቅርብ ጊዜ ዜና", eventsTab: "ክስተቶች", upcomingEvents: "መጪ", pastEvents: "ያለፉ ክስተቶች", allEvents: "ሁሉም ክስተቶች", noEventsFound: "ምንም ክስተቶች አልተገኙም", noEventsUpcoming: "ለሚመጡ ክስተቶች በቅርቡ ተመልሰው ይመልከቱ!", noEventsFilter: "ከአሁኑ ማጣሪያዎ ጋር የሚዛመዱ ምንም ክስተቶች የሉም።", eventDetails: "የክስተት ዝርዝሮች", dateAndTime: "ቀን እና ሰዓት", location: "ቦታ", registerForEvent: "ለክስተቱ ይመዝገቡ", registerDescription: "በዚህ ክስተት ላይ ለመገኘት እና ዝመናዎችን ለመቀበል ይመዝገቡ።", registerNow: "አሁን ይመዝገቡ", close: "ዝጋ", addToCalendar: "ወደ ቀን መቁጠሪያ አክል" },
  ar: { appName: "عماد الإيمان", pageTitle: "الأخبار والأحداث", pageDescription: "ابق على اطلاع بآخر الأخبار والإعلانات وجداول الفعاليات لمدرسة الأحد عماد الإيمان في جيما. اعثر على معلومات حول الأحداث القادمة والسابقة.", heroPageTitle: "الأخبار والأحداث", pageSubtitle: "ابق على تواصل مع أحدث الإعلانات والأنشطة والقصص من مجتمعنا.", newsTab: "أحدث الأخبار", eventsTab: "الأحداث", upcomingEvents: "القادمة", pastEvents: "الأحداث الماضية", allEvents: "كل الأحداث", noEventsFound: "لم يتم العثور على أحداث", noEventsUpcoming: "تحقق مرة أخرى قريبًا من الأحداث القادمة!", noEventsFilter: "لا توجد أحداث تطابق المرشح الحالي.", eventDetails: "تفاصيل الحدث", dateAndTime: "التاريخ والوقت", location: "الموقع", registerForEvent: "التسجيل في الحدث", registerDescription: "قم بالتسجيل لحضور هذا الحدث وتلقي التحديثات.", registerNow: "سجل الآن", close: "إغلاق", addToCalendar: "أضف إلى التقويم" },
  es: { appName: "Amde Haymanot", pageTitle: "Noticias y Eventos", pageDescription: "Manténgase al día con las últimas noticias, anuncios y horarios de eventos de la Escuela Dominical Amdehayimanot en Jimma. Encuentre información sobre eventos próximos y pasados.", heroPageTitle: "Noticias y Eventos", pageSubtitle: "Manténgase conectado con los últimos anuncios, actividades e historias de nuestra comunidad.", newsTab: "Últimas noticias", eventsTab: "Eventos", upcomingEvents: "Próximos", pastEvents: "Eventos pasados", allEvents: "Todos los eventos", noEventsFound: "No se encontraron eventos", noEventsUpcoming: "¡Vuelva pronto para ver los próximos eventos!", noEventsFilter: "No hay eventos que coincidan con su filtro actual.", eventDetails: "Detalles del evento", dateAndTime: "Fecha y hora", location: "Ubicación", registerForEvent: "Registrarse para el evento", registerDescription: "Regístrese para asistir a este evento y recibir actualizaciones.", registerNow: "Regístrate ahora", close: "Cerrar", addToCalendar: "Añadir al calendario" },
  fr: { appName: "Amde Haymanot", pageTitle: "Actualités et Événements", pageDescription: "Restez à jour avec les dernières actualités, annonces et horaires des événements de l'école du dimanche Amdehayimanot à Jimma. Trouvez des informations sur les événements à venir et passés.", heroPageTitle: "Actualités et événements", pageSubtitle: "Restez connecté avec les dernières annonces, activités et histoires de notre communauté.", newsTab: "Dernières nouvelles", eventsTab: "Événements", upcomingEvents: "À venir", pastEvents: "Événements passés", allEvents: "Tous les évènements", noEventsFound: "Aucun événement trouvé", noEventsUpcoming: "Revenez bientôt pour les événements à venir!", noEventsFilter: "Aucun événement ne correspond à votre filtre actuel.", eventDetails: "Détails de l'événement", dateAndTime: "Date et heure", location: "Lieu", registerForEvent: "S'inscrire à l'événement", registerDescription: "Inscrivez-vous pour assister à cet événement et recevoir des mises à jour.", registerNow: "S'inscrire maintenant", close: "Fermer", addToCalendar: "Ajouter au calendrier" },
  ti: { appName: "ኣምደ ሃይማኖት", pageTitle: "ዜናን ፍጻመታትን", pageDescription: "ምስ ናይ ጅማ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ሓደስቲ ዜናታት፡ ምልክታታትን መደባት ፍጻመታትን ንተኸታተሉ። ብዛዕባ ዝመጽኡን ዝሓለፉን ፍጻመታት ሓበሬታ ርኸቡ።", heroPageTitle: "ዜናን ፍጻመታትን", pageSubtitle: " ምስ ናይ ማሕበረሰብና ሓደስቲ ምልክታታት፣ ንጥፈታትን ዛንታታትን ተራኸቡ።", newsTab: "ሓደስቲ ዜና", eventsTab: "ፍጻመታት", upcomingEvents: "ዝመጽእ", pastEvents: "ዝሓለፉ ፍጻመታት", allEvents: "ኩሉ ፍጻመታት", noEventsFound: "ዝኾነ ፍጻመታት ኣይተረኽበን", noEventsUpcoming: "ንዝመጽእ ፍጻመታት ቀልጢፍኩም ተመለሱ!", noEventsFilter: "ምስ ናይ ሕጂ መጽረዪኹም ዝሳነ ፍጻመታት የለን።", eventDetails: "ዝርዝር ፍጻመ", dateAndTime: "ዕለትን ግዜን", location: "ቦታ", registerForEvent: "ንፍጻመ መዝገብ", registerDescription: " ኣብዚ ፍጻመ ንምስታፍን ሓበሬታ ንምርካብን ተመዝገቡ።", registerNow: "ሕጂ ተመዝገብ", close: "ዕጸው", addToCalendar: "ናብ መደብ ኣእትው" },
  om: { appName: "Amde Haymanot", pageTitle: "Oduu fi Taateewwan", pageDescription: "Oduuwwan, beeksisoota, fi sagantaawwan taateewwan Mana Barumsaa Dilbataa Amdehayimanot Jimmaatti argamu hordofaa. Taateewwan dhufanii fi darbaniif odeeffannoo argadhaa.", heroPageTitle: "Oduu fi Taateewwan", pageSubtitle: "Beeksisa, gochaawwan, fi seenaawwan hawaasa keenyaa yeroo ammaa waliin wal qunnamaa.", newsTab: "Oduu Haaraa", eventsTab: "Taateewwan", upcomingEvents: "Kan Dhufu", pastEvents: "Taateewwan Darban", allEvents: "Taateewwan Hundaa", noEventsFound: "Taateewwan hin argamne", noEventsUpcoming: "Taateewwan dhufaniif dhiyootti deebi'aa ilaalaa!", noEventsFilter: "Taateewwan filter keessan ammaa wajjin walsiman hin jiran.", eventDetails: "Ibsa Taatee", dateAndTime: "Guyyaa fi Sa'aatii", location: "Iddoo", registerForEvent: "Taateef Galmaa'i", registerDescription: "Taatee kanarratti hirmaachuuf fi odeeffannoo argachuuf galmaa'aa.", registerNow: "Amma Galmaa'i", close: "Cufi", addToCalendar: "Ajandaatti Dabali" },
  ge: { appName: "አምደ ፡ ሃይማኖት", pageTitle: "ዜና ወፍጻሜ", pageDescription: "ምስ ሓደስቲ ዜና፣ ምልክታት፣ ወመደባት ፍጻሜ ዘቤተ ትምህርት ሰንበት ዓምደሃይማኖት በጅማ ተከታተሉ። ዜና ስለ ዘይመጽኡ ወዘሐለፉ ፍጻሜያት ርከቡ።", heroPageTitle: "ዜና ወፍጻሜ", pageSubtitle: "ምስ ሓደስቲ ምልክታት፣ ንጥፈታት፣ ወዛንታ ማሕበረሰብና ተራኸቡ።", newsTab: "ሓዲስ ዜና", eventsTab: "ፍጻሜ", upcomingEvents: "ዘይመጽእ", pastEvents: "ዘሐለፈ ፍጻሜ", allEvents: "ኵሉ ፍጻሜ", noEventsFound: "ኢ-ረክበ ፍጻሜ", noEventsUpcoming: "ንዘይመጽእ ፍጻሜ ቀልጢፍክሙ ተመለሱ!", noEventsFilter: "ምስ ናይ ሕጂ መጽረዪክሙ ዝሳነ ፍጻሜ ኢ-ሀሎ።", eventDetails: "ዝርዝር ፍጻሜ", dateAndTime: "ዕለት ወሰዓት", location: "ቦታ", registerForEvent: "ንፍጻሜ መዝገብ", registerDescription: "በዝንቱ ፍጻሜ ንምስታፍ ወሓበሬታ ንምርካብ ተመዝገቡ።", registerNow: "ይመዝገብ ሕጂ", close: "ዕጸው", addToCalendar: "ውስተ መደብ አእትው" },
};


const HeroSection = styled(Box)(({ theme }) => ({ backgroundImage: `linear-gradient(${alpha(theme.palette.primary.dark, 0.6)}, ${alpha(theme.palette.primary.dark, 0.7)}), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '50vh', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: theme.palette.common.white, textAlign: 'center', padding: theme.spacing(3), marginBottom: theme.spacing(6) }));
const EventCard = styled(Card)(({ theme }) => ({ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', borderRadius: theme.shape.borderRadius * 2, overflow: 'hidden', '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[8], '& .MuiCardMedia-root': { transform: 'scale(1.05)' } } }));
const EventMedia = styled(CardMedia)(({ theme }) => ({ height: 220, transition: 'transform 0.5s ease' }));
const NoData = styled(Paper)(({ theme }) => ({ padding: theme.spacing(6), textAlign: 'center', marginTop: theme.spacing(4), borderRadius: theme.shape.borderRadius * 2, background: theme.palette.background.paper, boxShadow: theme.shadows[1] }));

const NewsArticleCard = ({ article, isFeatured = false }) => { 
    const imageUrl = article.image_url ? `${API_ROOT_URL}${article.image_url}` : 'https://via.placeholder.com/400x250?text=No+Image'; 
    return ( 
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}> 
            <Card sx={{ display: 'flex', flexDirection: isFeatured ? { xs: 'column', md: 'row' } : 'column', boxShadow: 4, borderRadius: 2, height: '100%', '&:hover': { boxShadow: 8 }, transition: 'box-shadow 0.3s' }}> 
                <CardActionArea component={Link} to={`/news-and-events/${article.id}`}> 
                    <CardMedia component="img" sx={{ width: isFeatured ? { xs: '100%', md: 350 } : '100%', height: isFeatured ? { xs: 250, md: 'auto' } : 180, objectFit: 'cover' }} image={imageUrl} alt={article.title} /> 
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}> 
                        <CardContent sx={{ flex: '1 0 auto' }}> 
                            <Chip label={article.category} color="primary" size="small" sx={{ mb: 1.5, fontWeight: 'bold' }} /> 
                            <Typography component="div" gutterBottom sx={{ fontWeight: 'bold', fontSize: isFeatured ? {xs: '1.8rem', md: '2.5rem'} : {xs: '1.25rem', md: '1.5rem'} }}>{article.title}</Typography> 
                            <Typography variant="body2" color="text.secondary" paragraph>{article.content ? `${article.content.substring(0, 150)}...` : ''}</Typography> 
                        </CardContent> 
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 0 }}> 
                            <CalendarToday sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} /> 
                            <Typography variant="caption" color="text.secondary">{format(parseISO(article.created_at), 'MMMM d, yyyy')}</Typography> 
                        </Box> 
                    </Box> 
                </CardActionArea> 
            </Card> 
        </motion.div> 
    ); 
};

const EventDetailsDialog = ({ open, onClose, event, t }) => { 
    const theme = useTheme(); 
    if (!event) return null; 
    const imageUrl = event.image_url ? `${API_ROOT_URL}${event.image_url}` : 'https://via.placeholder.com/600x300?text=No+Image'; 
    return ( 
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}> 
            <DialogTitle sx={{ p: 0 }}> 
                <Box position="relative"> 
                    <CardMedia component="img" height="300" image={imageUrl} alt={event.title} /> 
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}><Close /></IconButton> 
                </Box> 
            </DialogTitle> 
            <DialogContent sx={{ p: {xs: 2, sm: 4} }}> 
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}> 
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{event.title}</Typography> 
                    <Box><IconButton><BookmarkBorder /></IconButton><IconButton><Share /></IconButton></Box> 
                </Box> 
                <Grid container spacing={4}> 
                    <Grid item xs={12} md={8}> 
                        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>{event.description}</Typography> 
                        <Box mt={4}> 
                            <Typography variant="h6" gutterBottom fontWeight={600}>{t.eventDetails}</Typography> 
                            <Divider sx={{ mb: 2 }} /> 
                            <Box display="flex" alignItems="center" mb={2}><Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}><CalendarToday /></Avatar><Box><Typography variant="body2" color="text.secondary">{t.dateAndTime}</Typography><Typography variant="body1">{format(parseISO(event.event_date), 'EEEE, MMMM d, yyyy - h:mm a')}</Typography></Box></Box> 
                            <Box display="flex" alignItems="center" mb={2}><Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}><LocationOn /></Avatar><Box><Typography variant="body2" color="text.secondary">{t.location}</Typography><Typography variant="body1">{event.location}</Typography></Box></Box> 
                        </Box> 
                    </Grid> 
                    <Grid item xs={12} md={4}> 
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, background: theme.palette.background.default }}> 
                            <Typography variant="h6" gutterBottom fontWeight={600}>{t.registerForEvent}</Typography> 
                            <Typography variant="body2" color="text.secondary" paragraph>{t.registerDescription}</Typography> 
                            <Button variant="contained" fullWidth size="large" sx={{ mt: 2, borderRadius: 50 }}>{t.registerNow}</Button> 
                        </Paper> 
                    </Grid> 
                </Grid> 
            </DialogContent> 
            <DialogActions sx={{ p: 2, background: theme.palette.background.default }}><Button onClick={onClose} variant="outlined">{t.close}</Button><Button variant="contained" color="primary">{t.addToCalendar}</Button></DialogActions> 
        </Dialog> 
    ); 
};

const NewsAndEventsPage = ({ language = 'en' }) => {
  const t = translations[language] || translations.en;
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('news');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState('upcoming');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [newsResponse, eventsResponse] = await Promise.all([
          api.get('/posts'),
          api.get('/events')
        ]);
        setNews(newsResponse.data);
        setEvents(eventsResponse.data);
      } catch (err) {
        console.error("===== DATA FETCHING FAILED =====", err);
        setError('An error occurred while fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const handleEventClick = (event) => { setSelectedEvent(event); setDialogOpen(true); };
  const handleCloseDialog = () => setDialogOpen(false);
  const handleEventFilterChange = (event, newFilter) => { if (newFilter !== null) setEventFilter(newFilter); };
  
  const renderNewsContent = () => { if (!news || news.length === 0) return <NoData><Typography variant="h5">No News Found</Typography></NoData>; const featuredArticle = news[0]; const otherArticles = news.slice(1); return ( <Grid container spacing={4}> {featuredArticle && <Grid item xs={12}><NewsArticleCard article={featuredArticle} isFeatured /></Grid>} {otherArticles.map(article => ( <Grid item xs={12} sm={6} md={4} key={article.id}><NewsArticleCard article={article} /></Grid> ))} </Grid> ); };
  const renderEventsContent = () => { const sortedEvents = [...events].sort((a, b) => new Date(b.event_date) - new Date(a.event_date)); const filteredEvents = sortedEvents.filter(event => { try { if (eventFilter === 'upcoming') return !isPast(parseISO(event.event_date)); if (eventFilter === 'past') return isPast(parseISO(event.event_date)); return true; } catch { return false; } }); if (!events || events.length === 0) return <NoData><Typography variant="h5">{t.noEventsFound}</Typography><Typography color="text.secondary">{t.noEventsUpcoming}</Typography></NoData>; if (filteredEvents.length === 0) return <NoData><Typography variant="h5">{t.noEventsFound}</Typography><Typography color="text.secondary">{t.noEventsFilter}</Typography></NoData>; const renderEventCard = (event) => { const imageUrl = event.image_url ? `${API_ROOT_URL}${event.image_url}` : 'https://via.placeholder.com/400x250?text=No+Image'; return ( <Grid item xs={12} sm={6} md={4} key={event.id}> <CardActionArea onClick={() => handleEventClick(event)} sx={{borderRadius: 4, height: '100%'}}> <EventCard> <EventMedia image={imageUrl} title={event.title} /> <CardContent sx={{ flexGrow: 1 }}> <Typography gutterBottom variant="h5" component="div">{event.title}</Typography> <Box display="flex" alignItems="center" color="text.secondary" mb={1}><CalendarToday sx={{ fontSize: '1rem', mr: 1 }} /><Typography variant="body2">{format(parseISO(event.event_date), 'MMM d, yyyy - h:mm a')}</Typography></Box> <Box display="flex" alignItems="center" color="text.secondary"><LocationOn sx={{ fontSize: '1rem', mr: 1 }} /><Typography variant="body2">{event.location}</Typography></Box> </CardContent> </EventCard> </CardActionArea> </Grid> ); }; return <Grid container spacing={4}>{filteredEvents.map(renderEventCard)}</Grid>; };
  const renderContent = () => { if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>; if (error) return ( <Alert severity="error" sx={{ mt: 4 }}><AlertTitle>Error</AlertTitle>{error}</Alert> ); return activeTab === 'news' ? renderNewsContent() : renderEventsContent(); };

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | ${t.appName}`}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>
      <HeroSection>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' } }}>{t.heroPageTitle}</Typography>
          <Typography sx={{ fontWeight: 400, maxWidth: '800px', mx: 'auto' }}>{t.pageSubtitle}</Typography>
        </motion.div>
      </HeroSection>
      <Container maxWidth="lg" sx={{ py: 4, mb: 6 }}>
        <Paper elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
            <Tab icon={<NewsIcon />} iconPosition="start" label={t.newsTab} value="news" sx={{py: 2.5}} />
            <Tab icon={<EventIcon />} iconPosition="start" label={t.eventsTab} value="events" sx={{py: 2.5}} />
          </Tabs>
        </Paper>
        {activeTab === 'events' && !loading && !error && (
            <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
              <ToggleButtonGroup color="primary" value={eventFilter} exclusive onChange={handleEventFilterChange}>
                <ToggleButton value="upcoming">{t.upcomingEvents}</ToggleButton>
                <ToggleButton value="past">{t.pastEvents}</ToggleButton>
                <ToggleButton value="all">{t.allEvents}</ToggleButton>
              </ToggleButtonGroup>
            </Box>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Container>
      <EventDetailsDialog open={dialogOpen} onClose={handleCloseDialog} event={selectedEvent} t={t} />
    </>
  );
};

export default NewsAndEventsPage;