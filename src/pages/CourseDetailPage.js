// THIS IS THE COMPLETE FILE YOU PROVIDED, PRE-MODIFIED AND FINALIZED
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Typography, Container, Grid, Paper, List, ListItemButton, ListItemText, CircularProgress, Divider, TextField, Button, Avatar, Stack, useTheme, styled, alpha, Chip, ListItemIcon } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es, fr, ar } from 'date-fns/locale'; 
import { motion } from 'framer-motion';
import brand from '../brand';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CategoryIcon from '@mui/icons-material/Category';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { AuthContext } from '../context/AuthContext';
import api, { API_ROOT_URL } from '../api/axiosConfig';

const translations = {
    en: { loadError: 'Failed to load course.', videoError: 'Could not load video details.', likeLoginError: 'You must be logged in to like.', liked: 'Liked!', commentLoginError: 'You must be logged in to comment.', commentPostError: 'Failed to post comment.', like: 'Like', commentsTitle: 'Comments & Q&A', commentLabel: 'Ask a question or leave a comment...', post: 'Post', liveSessionTitle: 'Live Session', schedule: 'Schedule:', joinButton: 'Join Live Session', noVideos: 'No videos in this course yet.', playlist: 'Playlist', backToCourses: 'Back to Courses', instructor: 'Instructor', category: 'Category' },
    am: { loadError: 'ትምህርቱን መጫን አልተሳካም።', videoError: 'የቪዲዮ ዝርዝሮችን መጫን አልተቻለም።', likeLoginError: 'ለመውደድ መግባት አለብዎት።', liked: 'ተወዷል!', commentLoginError: 'አስተያየት ለመስጠት መግባት አለብዎት።', commentPostError: 'አስተያየት መለጠፍ አልተሳካም።', like: 'ይውደዱ', commentsTitle: 'አስተያየቶች እና ጥያቄና መልስ', commentLabel: 'ጥያቄ ይጠይቁ ወይም አስተያየት ይስጡ...', post: 'ለጠፍ', liveSessionTitle: 'የቀጥታ ስርጭት', schedule: 'መርሐግብር:', joinButton: 'የቀጥታ ስርጭቱን ይቀላቀሉ', noVideos: 'በዚህ ትምህርት ውስጥ እስካሁን ምንም ቪዲዮዎች የሉም።', playlist: 'አጫዋች ዝርዝር', backToCourses: 'ወደ ትምህርቶች ተመለስ', instructor: 'አስተማሪ', category: 'ምድብ' },
    om: { loadError: 'Koorsii fe\'uu dadhabe.', videoError: 'Tartiiba viidiyoo fe\'uu hin danda\'amne.', likeLoginError: 'Jaallachuuf seenuu qabda.', liked: 'Jaalatameera!', commentLoginError: 'Yaada kennuuf seenuu qabda.', commentPostError: 'Yaada maxxansuun hin milkoofne.', like: 'Jaaladhu', commentsTitle: 'Yaadaafi Gaaffiif Deebii', commentLabel: 'Gaaffii gaafadhaa ykn yaada keessan kennaa...', post: 'Maxxansi', liveSessionTitle: 'Sagantaa Kallattii', schedule: 'Sagantaa:', joinButton: 'Sagantaa Kallattii seeni', noVideos: 'Koorsii kana keessa ammatti viidiyoon hin jiru.', playlist: 'Tarree Taphichaa', backToCourses: 'Gara Koorsiitti Deebi\'i', instructor: 'Barsiisaa', category: 'Ramaddii' },
    ti: { loadError: 'ኮርስ ምጽዓን ኣይተኻእለን።', videoError: 'ዝርዝራት ቪድዮ ምጽዓን ኣይተኻእለን።', likeLoginError: 'like ንምግባር login ክትገብር ኣለካ።', liked: 'ተፈትዩ!', commentLoginError: 'comment ንምጽሓፍ login ክትገብር ኣለካ።', commentPostError: 'comment ምጽሓፍ ኣይተኻእለን።', like: 'ፈተው', commentsTitle: 'ሓሳባትን ሕቶን መልስን', commentLabel: 'ሕቶ ሕተት ወይ ሓሳብ ሃብ...', post: 'ለጠፍ', liveSessionTitle: 'ቀጥታ መደብ', schedule: 'መርሐግብር:', joinButton: 'ቀጥታ መደብ ተጸንበር', noVideos: 'ኣብዚ ኮርስ ገና ቪዲዮ የለን።', playlist: 'ዝርዝር መጻወቲ', backToCourses: 'ናብ ኮርሳት ተመለስ', instructor: 'መምህር', category: 'ምድብ' },
    ge: { loadError: 'ኮርስ ፡ ለጽዒኖት ፡ አልቦ።', videoError: 'ዝርዝረ ፡ ቪድዮ ፡ ለጽዒኖት ፡ አልቦ።', likeLoginError: 'ለፍቅር ፡ ግባእ።', liked: 'ተፈቀደ!', commentLoginError: 'ለአስተያየት ፡ ግባእ።', commentPostError: 'አስተያየት ፡ ለመለጠፍ ፡ አልቦ።', like: 'ፍቀድ', commentsTitle: 'አስተያየታት ፡ ወ ፡ ጥያቄ ፡ ወመልስ', commentLabel: 'ጥያቄ ፡ ጠይቅ ፡ ወይም ፡ አስተያየት ፡ ተው...', post: 'ለጠፍ', liveSessionTitle: 'ቀጥታ ፡ ክፍለ ፡ ጊዜ', schedule: 'መርሐግብር:', joinButton: 'ቀጥታ ፡ ክፍለ ፡ ጊዜ ፡ ተቀላቀል', noVideos: 'በዝንቱ ፡ ኮርስ ፡ ቪድዮ ፡ አልቦ።', playlist: 'ዝርዝረ ፡ ተውኔት', backToCourses: 'ውስተ ፡ ኮርሳት ፡ ተመለስ', instructor: 'መምህር', category: 'ክፍል' },
    es: { loadError: 'Error al cargar el curso.', videoError: 'No se pudieron cargar los detalles del video.', likeLoginError: 'Debes iniciar sesión para dar "Me gusta".', liked: '¡Te gusta!', commentLoginError: 'Debes iniciar sesión para comentar.', commentPostError: 'Error al publicar el comentario.', like: 'Me gusta', commentsTitle: 'Comentarios y Preguntas', commentLabel: 'Haz una pregunta o deja un comentario...', post: 'Publicar', liveSessionTitle: 'Sesión en vivo', schedule: 'Horario:', joinButton: 'Unirse a la sesión en vivo', noVideos: 'Aún no hay videos en este curso.', playlist: 'Lista de reproducción', backToCourses: 'Volver a Cursos', instructor: 'Instructor', category: 'Categoría' },
    fr: { loadError: 'Échec du chargement du cours.', videoError: 'Impossible de charger les détails de la vidéo.', likeLoginError: 'Vous devez être connecté pour aimer.', liked: 'Aimé !', commentLoginError: 'Vous devez être connecté pour commenter.', commentPostError: 'Échec de la publication du commentaire.', like: 'Aimer', commentsTitle: 'Commentaires & Q&R', commentLabel: 'Posez une question ou laissez un commentaire...', post: 'Publier', liveSessionTitle: 'Session en direct', schedule: 'Horaire :', joinButton: 'Rejoindre la session en direct', noVideos: 'Aucune vidéo dans ce cours pour le moment.', playlist: 'Playlist', backToCourses: 'Retour aux cours', instructor: 'Instructeur', category: 'Catégorie' },
    ar: { loadError: 'فشل تحميل الدورة.', videoError: 'لا يمكن تحميل تفاصيل الفيديو.', likeLoginError: 'يجب عليك تسجيل الدخول للإعجاب.', liked: 'أعجبني!', commentLoginError: 'يجب عليك تسجيل الدخول للتعليق.', commentPostError: 'فشل نشر التعليق.', like: 'إعجاب', commentsTitle: 'التعليقات والأسئلة والأجوبة', commentLabel: 'اطرح سؤالاً أو اترك تعليقاً...', post: 'نشر', liveSessionTitle: 'جلسة مباشرة', schedule: 'الجدول الزمني:', joinButton: 'انضم إلى الجلسة المباشرة', noVideos: 'لا توجد مقاطع فيديو في هذه الدورة حتى الآن.', playlist: 'قائمة التشغيل', backToCourses: 'العودة إلى الدورات', instructor: 'المدرب', category: 'الفئة' }
};
const localeMap = { en: enUS, es: es, fr: fr, ar: ar, am: enUS, ti: enUS, om: enUS, ge: enUS };

const PageWrapper = styled(Box)({ backgroundColor: brand.surfaceMuted, minHeight: '100vh' });
const HeaderPaper = styled(Paper)(({ theme }) => ({ padding: theme.spacing(3, 4), marginBottom: theme.spacing(4), borderRadius: theme.shape.borderRadius * 2, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }));
const PlayerPaper = styled(Paper)(({ theme }) => ({ borderRadius: theme.shape.borderRadius * 2, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }));
const PlaylistPaper = styled(Paper)(({ theme }) => ({ borderRadius: theme.shape.borderRadius * 2, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }));
const PlaylistItemStyled = styled(ListItemButton)(({ theme }) => ({ padding: theme.spacing(1.5, 2), transition: 'background-color 0.3s ease, border-left-color 0.3s ease', borderLeft: '4px solid transparent', '&.Mui-selected': { backgroundColor: alpha(theme.palette.primary.main, 0.1), borderLeftColor: theme.palette.primary.main }, '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) } }));
const LiveSessionCard = styled(Paper)(({ theme }) => ({ padding: theme.spacing(4, 3), textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: theme.shape.borderRadius * 2, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: theme.palette.primary.contrastText, minHeight: 300 }));

const VideoPlayer = ({ video }) => {
    if (!video || !video.video_url) return null;
    const isYouTube = video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be');
    const getYouTubeId = (url) => { const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/; const match = url.match(regExp); return (match && match[2].length === 11) ? match[2] : null; };
    if (isYouTube) {
        const videoId = getYouTubeId(video.video_url);
        return <Box sx={{ position: 'relative', paddingTop: '56.25%' }}><iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen title={video.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} /></Box>;
    }
    return <Box sx={{ position: 'relative', paddingTop: '56.25%' }}><video controls src={`${API_ROOT_URL}${video.video_url}`} title={video.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} /></Box>;
};

const CourseDetailPage = ({ language = 'en' }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');

    const t = translations[language] || translations.en;
    const dateLocale = localeMap[language] || enUS;

    const fetchCourseData = useCallback(async () => {
        try {
            const courseRes = await api.get(`/courses/${courseId}`);
            setCourse(courseRes.data);
            if (courseRes.data.course_type === 'PLAYLIST') {
                const videosRes = await api.get(`/courses/${courseId}/videos`);
                setVideos(videosRes.data);
                if (videosRes.data.length > 0) {
                    const firstVideoDetails = await api.get(`/courses/${courseId}/videos/${videosRes.data[0].id}`);
                    setActiveVideo(firstVideoDetails.data);
                }
            }
        } catch (error) { enqueueSnackbar(t.loadError, { variant: 'error' }); } 
        finally { setLoading(false); }
    }, [courseId, enqueueSnackbar, t]);

    useEffect(() => { fetchCourseData(); }, [fetchCourseData]);

    const handleVideoSelect = async (video) => {
        try {
            const res = await api.get(`/courses/${courseId}/videos/${video.id}`);
            setActiveVideo(res.data);
        } catch { enqueueSnackbar(t.videoError, { variant: 'error' }); }
    };

    const handleLike = async () => {
        if (!currentUser) return enqueueSnackbar(t.likeLoginError, { variant: 'info' });
        try {
            await api.post(`/courses/${courseId}/videos/${activeVideo.id}/like`);
            handleVideoSelect(activeVideo); // Refetch to update like status and count
        } catch(e) { enqueueSnackbar('Action could not be completed', { variant: 'error' }); }
    };

    const handlePostComment = async () => {
        if (!currentUser) return enqueueSnackbar(t.commentLoginError, { variant: 'info' });
        if (!comment.trim()) return;
        try {
            await api.post(`/courses/${courseId}/videos/${activeVideo.id}/comments`, { content: comment });
            setComment('');
            handleVideoSelect(activeVideo); // Refetch to show new comment
        } catch { enqueueSnackbar(t.commentPostError, { variant: 'error' }); }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><CircularProgress size={60} /></Box>;

    return (
        <PageWrapper>
            <Container maxWidth="xl" sx={{ py: 5 }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <HeaderPaper>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/classes')} sx={{ mb: 2 }}>{t.backToCourses}</Button>
                        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>{course?.title}</Typography>
                        <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 3}} alignItems={{xs: 'flex-start', sm: 'center'}} divider={<Divider orientation="vertical" flexItem />}>
                            <Box display="flex" alignItems="center" gap={1}><PersonOutlineIcon color="action" /><Typography color="text.secondary">{t.instructor}: {course?.instructor_name}</Typography></Box>
                            <Box display="flex" alignItems="center" gap={1}><CategoryIcon color="action" /><Typography color="text.secondary">{t.category}: {course?.category}</Typography></Box>
                            {course?.course_type === 'PLAYLIST' && <Box display="flex" alignItems="center" gap={1}><OndemandVideoIcon color="action" /><Typography color="text.secondary">{videos.length} Videos</Typography></Box>}
                        </Stack>
                        <Typography color="text.secondary" paragraph sx={{ mt: 2 }}>{course?.description}</Typography>
                    </HeaderPaper>
                </motion.div>
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={8}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            {activeVideo ? (
                                <PlayerPaper>
                                    <VideoPlayer video={activeVideo} />
                                    <Box sx={{ p: 3 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h5" component="h2">{activeVideo.title}</Typography>
                                            <Button variant={activeVideo.liked_by_user ? "contained" : "outlined"} startIcon={activeVideo.liked_by_user ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />} onClick={handleLike}>{t.like} ({activeVideo.likes || 0})</Button>
                                        </Stack>
                                        <Divider sx={{ my: 3 }} />
                                        <Box>
                                            <Typography variant="h6" gutterBottom>{t.commentsTitle}</Typography>
                                            {currentUser ? (
                                                <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                                                    <Avatar sx={{ mt: 1 }}>{currentUser.name.charAt(0)}</Avatar>
                                                    <TextField fullWidth multiline value={comment} onChange={e => setComment(e.target.value)} label={t.commentLabel} />
                                                    <Button variant="contained" onClick={handlePostComment}>{t.post}</Button>
                                                </Stack>
                                            ) : <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>{t.commentLoginError}</Typography>}
                                            <Stack spacing={2.5}>
                                                {activeVideo.comments?.map(c => (
                                                    <Box key={c.id} display="flex" gap={2}>
                                                        <Avatar sx={{ bgcolor: 'secondary.main' }}>{c.user_name.charAt(0)}</Avatar>
                                                        <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, width: '100%' }}>
                                                            <Typography variant="subtitle2">{c.user_name} <Typography variant="caption" color="text.secondary">• {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: dateLocale })}</Typography></Typography>
                                                            <Typography sx={{ mt: 0.5 }}>{c.content}</Typography>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Box>
                                </PlayerPaper>
                            ) : course?.course_type === 'LIVE' ? (
                                <LiveSessionCard>
                                    <Chip label="LIVE" color="error" icon={<LiveTvIcon />} sx={{ mb: 2 }} />
                                    <Typography variant="h4" gutterBottom>{t.liveSessionTitle}</Typography>
                                    <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 3 }}><ScheduleIcon /><Typography variant="h6">{t.schedule} {course.schedule}</Typography></Stack>
                                    <Button variant="contained" color="secondary" size="large" href={course.live_session_url} target="_blank">{t.joinButton}</Button>
                                </LiveSessionCard>
                            ) : <Paper sx={{p:4, textAlign:'center'}}><Typography>{t.noVideos}</Typography></Paper>}
                        </motion.div>
                    </Grid>
                    {course?.course_type === 'PLAYLIST' &&
                        <Grid item xs={12} lg={4}>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                                <PlaylistPaper>
                                    <Typography variant="h6" sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>{t.playlist}</Typography>
                                    <List component="nav" sx={{ maxHeight: '80vh', overflow: 'auto', p: 1 }}>
                                        {videos.map((video, index) => (
                                            <PlaylistItemStyled key={video.id} selected={activeVideo?.id === video.id} onClick={() => handleVideoSelect(video)}>
                                                <ListItemIcon sx={{minWidth: 40}}><PlayCircleOutlineIcon color={activeVideo?.id === video.id ? 'primary' : 'action'} /></ListItemIcon>
                                                <ListItemText primary={`${index + 1}. ${video.title}`} />
                                            </PlaylistItemStyled>
                                        ))}
                                    </List>
                                </PlaylistPaper>
                            </motion.div>
                        </Grid>
                    }
                </Grid>
            </Container>
        </PageWrapper>
    );
};

export default CourseDetailPage;