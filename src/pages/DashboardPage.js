import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, Chip,Skeleton } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

// --- Icon Imports ---
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';

// --- COMPLETE TRANSLATIONS ---
const translations = {
  en: {
    "welcome": "Welcome",
    "myProfile": "My profile",
    "myChildren": "My children",
    "myEvents": "My events",
    "announcements": "Advertisements",
    "profileInfo": "Profile information",
    "fullName": "full name",
    "emailAddress": "Email address",
    "memberSince": "Membership period",
    "registeredChildren": "Enrolled children",
    "childrenComingSoon": "This feature is coming soon! You can manage your children's class registrations here.",
    "upcomingEvents": "Upcoming registered events",
    "noEvents": "You are not registered for any upcoming events.",
    "recentAnnouncements": "Latest announcements",
    "announcement1Title": "The date of the annual excursion has been confirmed",
    "announcement1Detail": "June 15 at Ento Park. Please register by June 1st.",
    "announcement2Title": "There is no school on Easter Sunday",
    "announcement2Detail": "Please celebrate the festival with your family."
},
  om: {
    "welcome": "Baga nagaan dhufte",
    "myProfile": "Profaayila koo",
    "myChildren": "Ijoollee koo",
    "myEvents": "Taateewwan koo",
    "announcements": "Beeksisa",
    "profileInfo": "Odeeffannoo piroofaayilii",
    "fullName": "maqaa guutuu",
    "emailAddress": "Teessoo imeelii",
    "memberSince": "Yeroo miseensummaa",
    "registeredChildren": "Ijoollee galmaa'an",
    "childrenComingSoon": "Feature kun yeroo dhiyootti dhufaa jira! Galmee daree ijoollee keessanii asitti bulchuu dandeessu.",
    "upcomingEvents": "Taateewwan galmaa'an dhufan",
    "noEvents": "Taateewwan dhufan kamiifuu hin galmooftan.",
    "recentAnnouncements": "Beeksisa yeroo dhiyoo",
    "announcement1Title": "Guyyaan daawwannaa waggaa kun mirkanaa'eera",
    "announcement1Detail": "June 15 Ento Park keessatti. Hanga June 1tti galmaa'aa.",
    "announcement2Title": "Wiixata Faasikaa manni barumsaa hin jiru",
    "announcement2Detail": "Maaloo ayyaanicha maatii keessan waliin kabajaa."
},
  ti: {
    "welcome": "እንኳዕ ደሓን መፁ",
    "myProfile": "ፕሮፋይለይ",
    "myChildren": "ደቀይ",
    "myEvents": "ፍጻሜታተይ",
    "announcements": "መወዓውዒታት",
    "profileInfo": "ሓበሬታ ፕሮፋይል",
    "fullName": "ምሉእ ስም",
    "emailAddress": "ናይ ኢመይል ኣድራሻ",
    "memberSince": "ናይ ኣባልነት ግዜ",
    "registeredChildren": "ዝተመዝገቡ ህጻናት",
    "childrenComingSoon": "እዚ ባህሪ ኣብ ቀረባ እዋን ክመጽእ እዩ! ምዝገባ ክፍሊ ደቅኹም ኣብዚ ከተመሓድሩ ትኽእሉ ኢኹም።",
    "upcomingEvents": "ኣብ ቀረባ እዋን ዝተመዝገቡ ፍጻመታት",
    "noEvents": "ንዝኾነ ዝመጽእ ፍጻመታት ኣይተመዝገብኩምን።",
    "recentAnnouncements": "እዋናዊ ምልክታታት",
    "announcement1Title": "ዓመታዊ ዑደት ዝካየደሉ ዕለት ተረጋጊጹ ኣሎ።",
    "announcement1Detail": "15 ሰነ ኣብ ኤንቶ ፓርክ። ክሳብ 1 ሰነ ክትምዝገቡ ንላቦ።",
    "announcement2Title": "ሰንበት ፋሲካ ቤት ትምህርቲ የለን",
    "announcement2Detail": "በጃኹም ነቲ በዓል ምስ ስድራኹም ኣኽብሩ።"
},
  es: {
    "welcome": "Bienvenido",
    "myProfile": "mi perfil",
    "myChildren": "mis hijos",
    "myEvents": "mis eventos",
    "announcements": "anuncios",
    "profileInfo": "Información de perfil",
    "fullName": "nombre completo",
    "emailAddress": "Dirección de correo electrónico",
    "memberSince": "Período de membresía",
    "registeredChildren": "Niños matriculados",
    "childrenComingSoon": "¡Esta característica estará disponible pronto! Puedes gestionar las inscripciones a clases de tus hijos aquí.",
    "upcomingEvents": "Próximos eventos registrados",
    "noEvents": "No estás registrado para ningún evento próximo.",
    "recentAnnouncements": "Últimos anuncios",
    "announcement1Title": "Confirmada la fecha de la excursión anual",
    "announcement1Detail": "15 de junio en Ento Park. Regístrese antes del 1 de junio.",
    "announcement2Title": "No hay clases el domingo de Pascua",
    "announcement2Detail": "Celebre el festival con su familia."
},
  fr: {
    "welcome": "Accueillir",
    "myProfile": "Mon profil",
    "myChildren": "Mes enfants",
    "myEvents": "Mes événements",
    "announcements": "Publicités",
    "profileInfo": "Informations sur le profil",
    "fullName": "nom et prénom",
    "emailAddress": "Adresse email",
    "memberSince": "Période d'adhésion",
    "registeredChildren": "Enfants inscrits",
    "childrenComingSoon": "Cette fonctionnalité arrive bientôt ! Vous pouvez gérer ici les inscriptions aux cours de vos enfants.",
    "upcomingEvents": "Événements inscrits à venir",
    "noEvents": "Vous n'êtes inscrit à aucun événement à venir.",
    "recentAnnouncements": "Dernières annonces",
    "announcement1Title": "La date de l'excursion annuelle a été confirmée",
    "announcement1Detail": "Le 15 juin à Ento Park. Merci de vous inscrire avant le 1er juin.",
    "announcement2Title": "Il n'y a pas d'école le dimanche de Pâques",
    "announcement2Detail": "S'il vous plaît, célébrez la fête avec votre famille."
},
  ar: {
    "welcome": "مرحباً",
    "myProfile": "ملفي الشخصي",
    "myChildren": "أطفالي",
    "myEvents": "أحداثي",
    "announcements": "إعلانات",
    "profileInfo": "معلومات الملف الشخصي",
    "fullName": "الاسم الكامل",
    "emailAddress": "عنوان البريد الإلكتروني",
    "memberSince": "فترة العضوية",
    "registeredChildren": "الأطفال المسجلين",
    "childrenComingSoon": "هذه الميزة قادمة قريبا! يمكنك إدارة تسجيلات صف أطفالك هنا.",
    "upcomingEvents": "الأحداث المسجلة القادمة",
    "noEvents": "أنت غير مسجل في أي أحداث قادمة.",
    "recentAnnouncements": "أحدث الإعلانات",
    "announcement1Title": "تم تأكيد موعد الرحلة السنوية",
    "announcement1Detail": "15 يونيو في إنتو بارك. يرجى التسجيل بحلول 1 يونيو.",
    "announcement2Title": "لا توجد مدرسة في عيد الفصح الأحد",
    "announcement2Detail": "يرجى الاحتفال بالعيد مع عائلتك."
},
  am: {
    "welcome": "እንኳን ደህና መጡ",
    "myProfile": "የእኔ መገለጫ",
    "myChildren": "ልጆቼ",
    "myEvents": "የእኔ ክስተቶች",
    "announcements": "ማስታወቂያዎች",
    "profileInfo": "የመገለጫ መረጃ",
    "fullName": "ሙሉ ስም",
    "emailAddress": "ኢሜይል አድራሻ",
    "memberSince": "የአባልነት ዘመን",
    "registeredChildren": "የተመዘገቡ ልጆች",
    "childrenComingSoon": "ይህ ባህሪ በቅርቡ ይመጣል! የልጆችዎን የክፍል ምዝገባዎች እዚህ ማስተዳደር ይችላሉ።",
    "upcomingEvents": "መጪ የተመዘገቡ ክስተቶች",
    "noEvents": "ለማንኛውም መጪ ክስተቶች አልተመዘገቡም።",
    "recentAnnouncements": "የቅርብ ጊዜ ማስታወቂያዎች",
    "announcement1Title": "ዓመታዊ የሽርሽር ቀን ተረጋግጧል",
    "announcement1Detail": "ሰኔ 15 በእንጦጦ ፓርክ። እባክዎ እስከ ሰኔ 1 ድረስ ይመዝገቡ።",
    "announcement2Title": "በፋሲካ እሁድ ትምህርት የለም",
    "announcement2Detail": "እባክዎ በዓሉን ከቤተሰብዎ ጋር ያክብሩ።"
},
  ge: {
    "welcome": "እንኳን ደህና መጡ",
    "myProfile": "የእኔ መገለጫ",
    "myChildren": "ልጆቼ",
    "myEvents": "የእኔ ክስተቶች",
    "announcements": "ማስታወቂያዎች",
    "profileInfo": "የመገለጫ መረጃ",
    "fullName": "ሙሉ ስም",
    "emailAddress": "ኢሜይል አድራሻ",
    "memberSince": "የአባልነት ዘመን",
    "registeredChildren": "የተመዘገቡ ልጆች",
    "childrenComingSoon": "ይህ ባህሪ በቅርቡ ይመጣል! የልጆችዎን የክፍል ምዝገባዎች እዚህ ማስተዳደር ይችላሉ።",
    "upcomingEvents": "መጪ የተመዘገቡ ክስተቶች",
    "noEvents": "ለማንኛውም መጪ ክስተቶች አልተመዘገቡም።",
    "recentAnnouncements": "የቅርብ ጊዜ ማስታወቂያዎች",
    "announcement1Title": "ዓመታዊ የሽርሽር ቀን ተረጋግጧል",
    "announcement1Detail": "ሰኔ 15 በእንጦጦ ፓርክ። እባክዎ እስከ ሰኔ 1 ድረስ ይመዝገቡ።",
    "announcement2Title": "በፋሲካ እሁድ ትምህርት የለም",
    "announcement2Detail": "እባክዎ በዓሉን ከቤተሰብዎ ጋር ያክብሩ።"
},
};;

const DashboardPage = ({ language = 'en' }) => {
    const { currentUser } = useAuth();
    const t = translations[language] || translations.en;
    const isAdmin = currentUser?.role === 'ADMIN';

    const [stats, setStats] = useState({ upcomingEvents: 0, totalCourses: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const [eventsRes, coursesRes] = await Promise.all([
                api.get('/events'),
                api.get('/courses')
            ]);
            const upcomingEventsCount = eventsRes.data.filter(e => new Date(e.event_date) > new Date()).length;
            setStats({ upcomingEvents: upcomingEventsCount, totalCourses: coursesRes.data.length });
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 }
    };

    return (
        <>
            <Helmet>
                <title>{`${t.pageTitle} | Amde Haymanot Sunday School`}</title>
            </Helmet>
            <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 }, minHeight: 'calc(100vh - 64px)' }}>
                <Container maxWidth="lg">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                                {t.welcome}, {currentUser?.name}!
                            </Typography>
                            {currentUser?.role && (
                                <Chip 
                                    label={currentUser.role}
                                    color={isAdmin ? 'error' : 'primary'}
                                    size="small"
                                />
                            )}
                        </Box>
                        <Typography color="text.secondary" paragraph sx={{ fontSize: '1.1rem' }}>
                            {t.description}
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        {/* Admin Panel Card - Conditional */}
                        {isAdmin && (
                            <Grid item xs={12} md={6} lg={4}>
                                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1, duration: 0.5 }}>
                                    <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 4, background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`, color: 'white', boxShadow: '0 10px 30px -5px rgba(0, 65, 121, 0.4)' }}>
                                        <AdminPanelSettingsIcon sx={{ fontSize: 48, mb: 2 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t.adminPanelTitle}</Typography>
                                        <Typography sx={{ my: 2, flexGrow: 1, opacity: 0.8 }}>
                                            {t.adminPanelDesc}
                                        </Typography>
                                        <Button component={RouterLink} to="/admin" variant="contained" color="secondary" size="large" sx={{ alignSelf: 'flex-start' }}>
                                            {t.goToAdmin}
                                        </Button>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        )}
                        
                        <Grid item xs={12} md={6} lg={4}>
                            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2, duration: 0.5 }}>
                                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                                    <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t.myCoursesTitle}</Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>{t.myCoursesDesc}</Typography>
                                    {loading ? <Skeleton width="50%" height={40} /> : <Typography variant="h3" sx={{ my: 2 }}>{stats.totalCourses}</Typography>}
                                    <Button component={RouterLink} to="/classes" variant="outlined">{t.viewCourses}</Button>
                                </Paper>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3, duration: 0.5 }}>
                                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                                    <EventIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t.eventsTitle}</Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>{t.eventsDesc}</Typography>
                                    {loading ? <Skeleton width="50%" height={40} /> : <Typography variant="h3" sx={{ my: 2 }}>{stats.upcomingEvents} <Typography component="span" variant="h6" color="text.secondary">{t.upcoming}</Typography></Typography>}
                                    <Button component={RouterLink} to="/news-and-events" variant="outlined">{t.viewEvents}</Button>
                                </Paper>
                            </motion.div>
                        </Grid>
                        
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default DashboardPage;