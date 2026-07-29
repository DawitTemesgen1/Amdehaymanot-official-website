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
    en: { welcome: "Welcome", myProfile: "My Profile", myChildren: "My Children", myEvents: "My Events", announcements: "Announcements", profileInfo: "Profile Information", fullName: "Full Name", emailAddress: "Email Address", memberSince: "Member Since", registeredChildren: "Registered Children", childrenComingSoon: "This feature is coming soon! You will be able to manage your children's class registrations here.", upcomingEvents: "Upcoming Registered Events", noEvents: "You are not registered for any upcoming events.", recentAnnouncements: "Recent Announcements", announcement1Title: "Annual Picnic Date Confirmed", announcement1Detail: "June 15th at Entoto Park. Please RSVP by June 1st.", announcement2Title: "No Classes on Easter Sunday", announcement2Detail: "Please enjoy the holiday with your families." },
    am: { welcome: "እንኳን ደህና መጡ", myProfile: "የእኔ መገለጫ", myChildren: "ልጆቼ", myEvents: "የእኔ ክስተቶች", announcements: "ማስታወቂያዎች", profileInfo: "የመገለጫ መረጃ", fullName: "ሙሉ ስም", emailAddress: "ኢሜይል አድራሻ", memberSince: "የአባልነት ዘመን", registeredChildren: "የተመዘገቡ ልጆች", childrenComingSoon: "ይህ ባህሪ በቅርቡ ይመጣል! የልጆችዎን የክፍል ምዝገባዎች እዚህ ማስተዳደር ይችላሉ።", upcomingEvents: "መጪ የተመዘገቡ ክስተቶች", noEvents: "ለማንኛውም መጪ ክስተቶች አልተመዘገቡም።", recentAnnouncements: "የቅርብ ጊዜ ማስታወቂያዎች", announcement1Title: "ዓመታዊ የሽርሽር ቀን ተረጋግጧል", announcement1Detail: "ሰኔ 15 በእንጦጦ ፓርክ። እባክዎ እስከ ሰኔ 1 ድረስ ይመዝገቡ።", announcement2Title: "በፋሲካ እሁድ ትምህርት የለም", announcement2Detail: "እባክዎ በዓሉን ከቤተሰብዎ ጋር ያክብሩ።" },
    ti: { welcome: "እንቋዕ ብደሓን መጻእኩም", myProfile: "ናይ'ዚ መግለጺ", myChildren: "ደቀይ", myEvents: "ናይ'ዚ ፍጻሜታት", announcements: " ምልክታታት", profileInfo: "ሓበሬታ መግለጺ", fullName: "ሙሉእ ስም", emailAddress: "ኢመይል ኣድራሻ", memberSince: "ኣባል ካብ", registeredChildren: "ዝተመዝገቡ ህጻናት", childrenComingSoon: "እዚ ባህሪ ድሕሪ ቁሩብ ግዜ ክመጽእ እዩ! ኣብዚ ናይ ውሉዳትኩም ምዝገባ ክፍሊ ክትቆጻጸሩ ትኽእሉ ኢኹም።", upcomingEvents: "ዝመጽእ ዝተመዝገቡ ፍጻሜታት", noEvents: "ንዝኾነ ዝመጽእ ፍጻሜ ኣይተመዝገብኩምን።", recentAnnouncements: "ናይ ቀረባ ግዜ ምልክታታት", announcement1Title: "ዓመታዊ ሽርሽር ዕለት ተረጋጊጹ", announcement1Detail: "ሰነ 15 ኣብ እንጦጦ ፓርክ። በጃኹም ክሳብ ሰነ 1 ምምላስ።", announcement2Title: "ብሰንበት ፋሲካ ክፍሊ የለን", announcement2Detail: "በጃኹም በዓል ምስ ስድራቤትኩም ተሓጐሱ።" },
    om: { welcome: "Baga Nagaan Dhuftan", myProfile: "Piroofayilii Koo", myChildren: "Ijoollee Koo", myEvents: "Taateewwan Koo", announcements: "Beeksisa", profileInfo: "Odeeffannoo Piroofayilii", fullName: "Maqaa Guutuu", emailAddress: "Teessoo Imeeyilii", memberSince: "Miseensa Erga Ta'e", registeredChildren: "Ijoollee Galmaa'an", childrenComingSoon: "Amalli kun dhiyeenyatti ni dhufa! Asirratti galmee kutaa ijoollee keessanii to'achuu dandeessu.", upcomingEvents: "Taateewwan Galmaa'an Dhufan", noEvents: "Taateewwan dhufaniif hin galmoofne.", recentAnnouncements: "Beeksisaawwan Dhiheenyaa", announcement1Title: "Guyyaan Pikniikii Waggaa Mirkanaa'e", announcement1Detail: "Waxabajjii 15 Paarkii Inxooxxootti. Maaloo hanga Waxabajjii 1tti deebii kennaa.", announcement2Title: "Dilbata Faasikaa Barnoonni Hin Jiru", announcement2Detail: "Maaloo ayyaanicha maatii keessan waliin bashannanaa." },
    ge: { welcome: "እንቋዕ በሰላም መጻእክሙ", myProfile: "መግለጺየ", myChildren: "ውሉድየ", myEvents: "ፍጻሜያትየ", announcements: "ምልክታት", profileInfo: "ዜና መግለጺ", fullName: "ስም ሙሉእ", emailAddress: "አድራሻ ኢሜይል", memberSince: "አባል እም", registeredChildren: "ዝተመዝገቡ ሕጻናት", childrenComingSoon: "ዝንቱ ነገር በጊዜ ይመጽእ! በዝየ ምዝገባ ውሉድክሙ ትከውኑ ትኽእሉ ኢኹም።", upcomingEvents: "ዝመጽኡ ዝተመዝገቡ ፍጻሜያት", noEvents: "ለዝኾነ ዝመጽእ ፍጻሜ ኢተመዝገብክሙ።", recentAnnouncements: "ቅርብ ጊዜ ምልክታት", announcement1Title: "ዓመታዊ ሽርሽር ዕለት ተረጋግጸ", announcement1Detail: "ሰነ ፲፭ በአንጦጦ ፓርክ። እባክሙ እስከ ሰነ ፩ መልሱ።", announcement2Title: "በሰንበት ፋሲካ ትምህርት አልቦ", announcement2Detail: "እባክሙ በዓለ ምስ ቤተሰብክሙ ተፈሥሑ።" },
    es: { welcome: "Bienvenido", myProfile: "Mi Perfil", myChildren: "Mis Hijos", myEvents: "Mis Eventos", announcements: "Anuncios", profileInfo: "Información del Perfil", fullName: "Nombre Completo", emailAddress: "Correo Electrónico", memberSince: "Miembro Desde", registeredChildren: "Hijos Registrados", childrenComingSoon: "¡Esta función llegará pronto! Podrás gestionar las inscripciones a clases de tus hijos aquí.", upcomingEvents: "Próximos Eventos", noEvents: "No estás registrado para ningún evento próximo.", recentAnnouncements: "Anuncios Recientes", announcement1Title: "Fecha del Picnic Anual Confirmada", announcement1Detail: "15 de junio en el Parque Entoto. Por favor, confirme su asistencia antes del 1 de junio.", announcement2Title: "No hay clases el Domingo de Pascua", announcement2Detail: "Por favor, disfrute de la festividad con sus familias." },
    fr: { welcome: "Bienvenue", myProfile: "Mon Profil", myChildren: "Mes Enfants", myEvents: "Mes Événements", announcements: "Annonces", profileInfo: "Informations du Profil", fullName: "Nom Complet", emailAddress: "Adresse E-mail", memberSince: "Membre Depuis", registeredChildren: "Enfants Inscrits", childrenComingSoon: "Cette fonctionnalité sera bientôt disponible ! Vous pourrez gérer ici les inscriptions de vos enfants aux cours.", upcomingEvents: "Événements à Venir", noEvents: "Vous n'êtes inscrit à aucun événement à venir.", recentAnnouncements: "Annonces Récentes", announcement1Title: "Date du Pique-nique Annuel Confirmée", announcement1Detail: "Le 15 juin au parc Entoto. Veuillez confirmer votre présence avant le 1er juin.", announcement2Title: "Pas de Cours le Dimanche de Pâques", announcement2Detail: "Veuillez profiter des vacances avec vos familles." },
    ar: { welcome: "أهلاً بك", myProfile: "ملفي الشخصي", myChildren: "أطفالي", myEvents: "أحداثي", announcements: "الإعلانات", profileInfo: "معلومات الملف الشخصي", fullName: "الاسم الكامل", emailAddress: "البريد الإلكتروني", memberSince: "عضو منذ", registeredChildren: "الأطفال المسجلون", childrenComingSoon: "هذه الميزة ستتوفر قريبًا! ستتمكن من إدارة تسجيلات أطفالك في الفصول الدراسية هنا.", upcomingEvents: "الأحداث القادمة", noEvents: "أنت غير مسجل في أي أحداث قادمة.", recentAnnouncements: "الإعلانات الأخيرة", announcement1Title: "تأكيد موعد النزهة السنوية", announcement1Detail: "15 يونيو في حديقة إنتوتو. يرجى تأكيد الحضور بحلول 1 يونيو.", announcement2Title: "لا توجد فصول دراسية يوم أحد الفصح", announcement2Detail: "يرجى الاستمتاع بالعطلة مع عائلاتكم." }
};

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