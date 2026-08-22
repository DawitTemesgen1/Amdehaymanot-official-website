import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Paper, Button, CircularProgress, Chip, Alert,
    Divider, Stack, TextField, Avatar, Tooltip, Grid, Skeleton, Accordion,
    AccordionSummary, AccordionDetails
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api, { API_ROOT_URL } from '../api/axiosConfig';
import DownloadIcon from '@mui/icons-material/Download';
import AndroidIcon from '@mui/icons-material/Android';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format, formatDistanceToNow } from 'date-fns';
import { useSnackbar } from 'notistack';

// --- TRANSLATIONS (omitted for brevity in comments, but included in code) ---
const translations = {
  en: {
    "title": "Download the religious song",
    "subtitle": "Discover more than 2400 Orthodox hymns on your Android device.",
    "yourDevice": "Recommended for your device",
    "detected": "Derived architecture",
    "download": "Download",
    "otherVersions": "Other available versions",
    "notes": "Release notes",
    "version": "Version",
    "downloads": "Downloads",
    "lastUpdated": "Last updated",
    "feedbackTitle": "Comments and opinions",
    "likeTooltip": "Do you like the app? Let us know!",
    "postComment": "Post a comment",
    "yourName": "Your name",
    "leaveComment": "Leave a comment...",
    "noBuilds": "No app builds have been uploaded yet. Please check back later.",
    "downloading": "Preparing..."
},
  om: {
    "title": "Faarfannaa amantaa buufadhaa",
    "subtitle": "Faarfannaa Ortodoksii 2400 ol meeshaa Android keessan irratti argadhaa.",
    "yourDevice": "Meeshaa keessaniif kan gorfamu",
    "detected": "Arkiteekcharii irraa argame",
    "download": "Buusuu",
    "otherVersions": "Versions biroo kan jiran",
    "notes": "Yaadannoo gadhiifamuu",
    "version": "Gosa",
    "downloads": "Downloads",
    "lastUpdated": "Yeroo dhumaaf kan fooyya'e",
    "feedbackTitle": "Yaada fi yaada",
    "likeTooltip": "Appichi ni jaallattu? Nu beeksisaa!",
    "postComment": "Yaada keessan maxxansaa",
    "yourName": "Maqaa kee",
    "leaveComment": "Yaada keessan nuuf barreessaa...",
    "noBuilds": "App builds hanga ammaatti hin olkaa'amne. Mee booda deebi'aa ilaalaa.",
    "downloading": "Qophii..."
},
  ti: {
    "title": "እታ ሃይማኖታዊት ደርፊ ኣውርድዋ",
    "subtitle": "ኣብ ኣንድሮይድ መሳርሒኹም ልዕሊ 2400 ኦርቶዶክሳዊ መዝሙራት ርኸቡ።",
    "yourDevice": "ንመሳርሒኻ ዝምከር እዩ።",
    "detected": "ዝተረኽበ ስነ ህንጻ",
    "download": "ምውራድ",
    "otherVersions": "ካልኦት ዝርከቡ ስሪታት",
    "notes": "ምውጻእ መዘኻኸሪታት",
    "version": "ሕታም",
    "downloads": "ዳውንሎድ ምግባር",
    "lastUpdated": "ናይ መወዳእታ ዝተሓደሰ",
    "feedbackTitle": "ርእይቶታትን ርእይቶታትን",
    "likeTooltip": "እታ ኣፕ ትፈትውዋ ዶ? ንፍለጥ!",
    "postComment": "ኮመንት ፖስት ግበሩ",
    "yourName": "ስምካ",
    "leaveComment": "ርእይቶኹም ግደፉ...",
    "noBuilds": "ክሳብ ሕጂ ዝኾነ ኣፕ ቢልድ ኣይተሰቐለን። በጃኹም ድሒርኩም ተመለሱ።",
    "downloading": "ምድላው..."
},
  es: {
    "title": "Descarga la canción religiosa",
    "subtitle": "Descubre más de 2400 himnos ortodoxos en tu dispositivo Android.",
    "yourDevice": "Recomendado para tu dispositivo",
    "detected": "Arquitectura derivada",
    "download": "Descargar",
    "otherVersions": "Otras versiones disponibles",
    "notes": "Notas de la versión",
    "version": "Versión",
    "downloads": "Descargas",
    "lastUpdated": "Última actualización",
    "feedbackTitle": "Comentarios y opiniones",
    "likeTooltip": "¿Te gusta la aplicación? ¡Háganos saber!",
    "postComment": "Publicar un comentario",
    "yourName": "Su nombre",
    "leaveComment": "Deja un comentario...",
    "noBuilds": "Aún no se han subido compilaciones de aplicaciones. Vuelve a consultar más tarde.",
    "downloading": "Preparante..."
},
  fr: {
    "title": "Téléchargez le chant religieux",
    "subtitle": "Découvrez plus de 2400 hymnes orthodoxes sur votre appareil Android.",
    "yourDevice": "Recommandé pour votre appareil",
    "detected": "Architecture dérivée",
    "download": "Télécharger",
    "otherVersions": "Autres versions disponibles",
    "notes": "Notes de version",
    "version": "Version",
    "downloads": "Téléchargements",
    "lastUpdated": "Dernière mise à jour",
    "feedbackTitle": "Commentaires et avis",
    "likeTooltip": "Aimez-vous l'application? Faites-le-nous savoir !",
    "postComment": "Poster un commentaire",
    "yourName": "Votre nom",
    "leaveComment": "Laissez un commentaire...",
    "noBuilds": "Aucune version d'application n'a encore été téléchargée. Veuillez revenir plus tard.",
    "downloading": "Préparation..."
},
  ar: {
    "title": "تحميل اغنية دينية",
    "subtitle": "اكتشف أكثر من 2400 ترنيمة أرثوذكسية على جهاز Android الخاص بك.",
    "yourDevice": "الموصى بها لجهازك",
    "detected": "العمارة المشتقة",
    "download": "تحميل",
    "otherVersions": "الإصدارات الأخرى المتاحة",
    "notes": "ملاحظات الإصدار",
    "version": "إصدار",
    "downloads": "التنزيلات",
    "lastUpdated": "آخر تحديث",
    "feedbackTitle": "التعليقات والآراء",
    "likeTooltip": "هل تحب التطبيق؟ اسمحوا لنا أن نعرف!",
    "postComment": "أضف تعليقا",
    "yourName": "اسمك",
    "leaveComment": "اترك تعليقا...",
    "noBuilds": "لم يتم تحميل أي إصدارات للتطبيق حتى الآن. يرجى التحقق مرة أخرى في وقت لاحق.",
    "downloading": "جارٍ التحضير..."
},
  am: {
    "title": "ዓምደሃይማኖት ዝማሬን ያውርዱ",
    "subtitle": "በአንድሮይድ መሳሪያዎ ላይ ከ2400 በላይ የኦርቶዶክስ መዝሙራትን ያግኙ።",
    "yourDevice": "ለመሣሪያዎ የሚመከር",
    "detected": "የተገኘ አርክቴክቸር",
    "download": "ያውርዱ",
    "otherVersions": "ሌሎች የሚገኙ ስሪቶች",
    "notes": "የልቀት ማስታወሻዎች",
    "version": "ስሪት",
    "downloads": "ውርዶች",
    "lastUpdated": "ለመጨረሻ ጊዜ የተሻሻለው",
    "feedbackTitle": "አስተያየት እና አስተያየቶች",
    "likeTooltip": "መተግበሪያውን ወደዱት? ያሳውቁን!",
    "postComment": "አስተያየት ለጥፍ",
    "yourName": "የእርስዎ ስም",
    "leaveComment": "አስተያየት ይተዉ...",
    "noBuilds": "ምንም የመተግበሪያ ግንባታዎች እስካሁን አልተሰቀሉም። እባክዎ ቆይተው ተመልሰው ይመልከቱ።",
    "downloading": "በመዘጋጀት ላይ..."
},
  ge: {
    "title": "ዓምደሃይማኖት ዝማሬን ያውርዱ",
    "subtitle": "በአንድሮይድ መሳሪያዎ ላይ ከ2400 በላይ የኦርቶዶክስ መዝሙራትን ያግኙ።",
    "yourDevice": "ለመሣሪያዎ የሚመከር",
    "detected": "የተገኘ አርክቴክቸር",
    "download": "ያውርዱ",
    "otherVersions": "ሌሎች የሚገኙ ስሪቶች",
    "notes": "የልቀት ማስታወሻዎች",
    "version": "ስሪት",
    "downloads": "ውርዶች",
    "lastUpdated": "ለመጨረሻ ጊዜ የተሻሻለው",
    "feedbackTitle": "አስተያየት እና አስተያየቶች",
    "likeTooltip": "መተግበሪያውን ወደዱት? ያሳውቁን!",
    "postComment": "አስተያየት ለጥፍ",
    "yourName": "የእርስዎ ስም",
    "leaveComment": "አስተያየት ይተዉ...",
    "noBuilds": "ምንም የመተግበሪያ ግንባታዎች እስካሁን አልተሰቀሉም። እባክዎ ቆይተው ተመልሰው ይመልከቱ።",
    "downloading": "በመዘጋጀት ላይ..."
},
};;

// Function to detect device architecture from user agent string
const detectArch = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('aarch64') || ua.includes('armv8')) return 'arm64-v8a';
    if (ua.includes('x86_64')) return 'x86_64';
    if (ua.includes('arm')) return 'armeabi-v7a';
    return null; // Return null if undetectable
};

const DownloadAppPage = ({ language = 'en' }) => {
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [builds, setBuilds] = useState([]);
    const [feedback, setFeedback] = useState({ comments: [], totalLikes: 0 });
    const [detectedArch] = useState(detectArch());
    const [comment, setComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [downloadingArch, setDownloadingArch] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const t = translations[language] || translations.en;

    // Check localStorage to see if the user has already liked the app
    useEffect(() => {
        const likedStatus = localStorage.getItem('appLiked');
        if (likedStatus === 'true') {
            setIsLiked(true);
        }
    }, []);

    const fetchAllData = useCallback(async () => {
        try {
            const [buildsRes, feedbackRes] = await Promise.all([
                api.get('/app/builds/public'),
                api.get('/app/feedback')
            ]);
            setBuilds(buildsRes.data || []);
            setFeedback({
                comments: feedbackRes.data.comments || [],
                totalLikes: Number(feedbackRes.data.totalLikes) || 0
            });
            setStatus('success');
        } catch (err) {
            enqueueSnackbar('Failed to load download page data.', { variant: 'error' });
            setStatus('error');
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleDownloadClick = (architecture) => {
        setDownloadingArch(architecture);
        
        // Update download count on the server in the background
        api.post(`/app/download/${architecture}/count`).catch(err => console.error("Failed to update count", err));

        // ADVANCED: Create an invisible link and click it to trigger a robust download
        const link = document.createElement('a');
        link.href = `${API_ROOT_URL}/api/app/download/${architecture}`;
        
        const build = builds.find(b => b.architecture === architecture);
        if (build) {
            link.setAttribute('download', `amdehaymanot-v${build.version}-${build.architecture}.apk`);
        }
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Update local state for immediate user feedback
        setBuilds(prev => prev.map(b => b.architecture === architecture ? { ...b, downloads: (b.downloads || 0) + 1 } : b));
        
        // Reset the button's loading state after a short delay
        setTimeout(() => setDownloadingArch(null), 1500);
    };

    const handleLike = async () => {
        if (isLiked) return; // Prevent multiple likes

        // ADVANCED: Optimistic UI Update - update the state immediately
        setIsLiked(true);
        setFeedback(prev => ({ ...prev, totalLikes: Number(prev.totalLikes) + 1 }));
        localStorage.setItem('appLiked', 'true');

        try {
            const archToLike = recommendedBuild?.architecture || builds[0]?.architecture;
            if (archToLike) {
                await api.post('/app/like', { architecture: archToLike });
            }
        } catch (error) {
            // If the API call fails, revert the changes
            setIsLiked(false);
            setFeedback(prev => ({ ...prev, totalLikes: Number(prev.totalLikes) - 1 }));
            localStorage.removeItem('appLiked');
            enqueueSnackbar("Could not register like. Please try again.", { variant: 'error' });
        }
    };

    const handlePostComment = async () => {
        if (!comment.trim() || !authorName.trim()) {
            return enqueueSnackbar('Please provide your name and a comment.', { variant: 'warning' });
        }
        setIsSubmittingComment(true);
        try {
            await api.post('/app/comments', { authorName, content: comment });
            setComment('');
            enqueueSnackbar("Comment posted successfully! Thank you.", { variant: 'success' });
            fetchAllData(); // Refresh comments list
        } catch (error) {
            enqueueSnackbar("Failed to post comment.", { variant: 'error' });
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const recommendedBuild = detectedArch ? builds.find(b => b.architecture === detectedArch) : (builds[0] || null);
    const otherBuilds = builds.filter(b => b.architecture !== recommendedBuild?.architecture);
    
    // --- RENDER SKELETON LOADER ---
    if (status === 'loading') {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
                    <Stack alignItems="center" spacing={2} mb={4}>
                        <Skeleton variant="circular" width={80} height={80} />
                        <Skeleton variant="text" width="60%" height={48} />
                        <Skeleton variant="text" width="80%" height={32} />
                    </Stack>
                    <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
                </Paper>
            </Container>
        );
    }
    
    // --- RENDER ERROR STATE ---
    if (status === 'error') {
         return <Alert severity="error" sx={{ m: 4 }}>Could not load app data. Please try refreshing the page.</Alert>;
    }

    // --- RENDER MAIN CONTENT ---
    return (
        <>
            <Helmet><title>{`${t.title} | Amde Haymanot`}</title></Helmet>
            <Box sx={{ bgcolor: 'background.default', py: 8 }}>
                <Container maxWidth="md">
                    <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)' }}>
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                            <Stack alignItems="center" spacing={2} mb={4}>
                                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}><AndroidIcon sx={{ fontSize: 50 }} /></Avatar>
                                <Typography variant="h3" component="h1" align="center" sx={{ fontWeight: 700 }}>{t.title}</Typography>
                                <Typography variant="h6" color="text.secondary" align="center">{t.subtitle}</Typography>
                            </Stack>
                        </motion.div>
                        
                        {builds.length === 0 ? (
                            <Alert severity="info" sx={{ my: 4 }}>{t.noBuilds}</Alert>
                        ) : (
                            <>
                                {recommendedBuild && (
                                    <Box sx={{ my: 4, p: 3, bgcolor: 'primary.lighter', borderRadius: 3 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t.yourDevice}</Typography>
                                        {detectedArch && <Chip label={`${t.detected}: ${recommendedBuild.architecture}`} color="success" size="small" sx={{ my: 1 }} />}
                                        <Paper elevation={2} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={8}>
                                                    <Typography variant="h6">v{recommendedBuild.version}</Typography>
                                                    <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ color: 'text.secondary', mt: 1 }}>
                                                        <Box display="flex" alignItems="center" gap={0.5}><CloudDownloadIcon fontSize="small" /><Typography variant="body2">{(recommendedBuild.downloads || 0).toLocaleString()} {t.downloads}</Typography></Box>
                                                        <Box display="flex" alignItems="center" gap={0.5}><HistoryIcon fontSize="small" /><Typography variant="body2">{t.lastUpdated}: {recommendedBuild.uploaded_at ? format(new Date(recommendedBuild.uploaded_at), 'MMM d, yyyy') : 'N/A'}</Typography></Box>
                                                    </Stack>
                                                    {recommendedBuild.notes && <Typography variant="body2" sx={{ mt: 2 }}><b>{t.notes}:</b> {recommendedBuild.notes}</Typography>}
                                                </Grid>
                                                <Grid item xs={12} sm={4} sx={{ textAlign: {xs: 'left', sm: 'right'}, mt: {xs: 2, sm: 0} }}>
                                                    <Button type="button" variant="contained" size="large" startIcon={downloadingArch === recommendedBuild.architecture ? <CircularProgress size={20} color="inherit"/> : <DownloadIcon />} onClick={() => handleDownloadClick(recommendedBuild.architecture)} disabled={!!downloadingArch}>
                                                        {downloadingArch === recommendedBuild.architecture ? t.downloading : t.download}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Box>
                                )}

                                {otherBuilds.length > 0 && (
                                    <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography color="primary">{t.otherVersions}</Typography></AccordionSummary>
                                        <AccordionDetails>
                                            <Stack spacing={2}>
                                                {otherBuilds.map(build => (
                                                    <Paper key={build.id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 'bold' }}>{build.architecture}</Typography>
                                                            <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
                                                                <Typography variant="body2">{t.version}: {build.version}</Typography>
                                                                <Typography variant="body2">{(build.downloads || 0).toLocaleString()} {t.downloads}</Typography>
                                                            </Stack>
                                                        </Box>
                                                        <Button type="button" variant="outlined" startIcon={downloadingArch === build.architecture ? <CircularProgress size={20} /> : <DownloadIcon />} onClick={() => handleDownloadClick(build.architecture)} disabled={!!downloadingArch}>
                                                            {downloadingArch === build.architecture ? t.downloading : t.download}
                                                        </Button>
                                                    </Paper>
                                                ))}
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                )}
                            </>
                        )}

                        <Divider sx={{ my: 5 }} />

                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t.feedbackTitle}</Typography>
                                <Tooltip title={isLiked ? "You've liked this!" : t.likeTooltip}>
                                    <span>
                                        <Button variant={isLiked ? "contained" : "outlined"} color="primary" startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />} onClick={handleLike} disabled={isLiked || builds.length === 0} sx={{ borderRadius: '50px' }}>
                                            Like ({(feedback.totalLikes || 0).toLocaleString()})
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Stack>
                            <Stack spacing={2} sx={{ mb: 4 }}>
                                <TextField label={t.yourName} variant="outlined" size="small" value={authorName} onChange={e => setAuthorName(e.target.value)} />
                                <TextField label={t.leaveComment} variant="outlined" multiline rows={3} value={comment} onChange={e => setComment(e.target.value)} />
                                <Button variant="contained" onClick={handlePostComment} disabled={isSubmittingComment} sx={{ alignSelf: 'flex-start' }}>
                                    {isSubmittingComment ? <CircularProgress size={24} color="inherit" /> : t.postComment}
                                </Button>
                            </Stack>
                            <Stack spacing={2.5}>
                                {feedback.comments.map(c => (
                                    <Box key={c.id} display="flex" gap={2}>
                                        <Avatar sx={{ bgcolor: 'secondary.main' }}>{c.authorName ? c.authorName.charAt(0).toUpperCase() : '?'}</Avatar>
                                        <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, width: '100%' }}>
                                            <Typography variant="subtitle2">{c.authorName} 
                                                <Typography variant="caption" color="text.secondary">•&nbsp;
                                                    {c.created_at ? formatDistanceToNow(new Date(c.created_at), { addSuffix: true }) : 'some time ago'}
                                                </Typography>
                                            </Typography>
                                            <Typography sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{c.content}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Paper> 
                </Container>
            </Box>
        </>
    );
};

export default DownloadAppPage;