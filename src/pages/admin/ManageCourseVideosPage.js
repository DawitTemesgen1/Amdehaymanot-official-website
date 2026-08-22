import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Typography, Paper, Box, Button, TextField, List, ListItem, ListItemText, IconButton, CircularProgress, Breadcrumbs, Link as MuiLink, Tabs, Tab, LinearProgress, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/axiosConfig';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (<div role="tabpanel" hidden={value !== index} {...other}>{value === index && <Box sx={{ p: 3, pt: 2 }}>{children}</Box>}</div>);
}

const ManageCourseVideosPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [videos, setVideos] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [urlVideo, setUrlVideo] = useState({ title: '', video_url: '' });
    const [fileVideo, setFileVideo] = useState({ title: '', file: null });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fetchVideos = useCallback(async () => {
        try {
            const [courseRes, videosRes] = await Promise.all([
                api.get(`/courses/${courseId}`),
                api.get(`/courses/${courseId}/videos`)
            ]);
            setCourse(courseRes.data);
            setVideos(videosRes.data);
        } catch (error) {
            enqueueSnackbar('Failed to fetch course data.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [courseId, enqueueSnackbar]);

    useEffect(() => {
        setLoading(true);
        fetchVideos();
    }, [fetchVideos]);

    const handleAddByUrl = async (e) => {
        e.preventDefault();
        if (!urlVideo.title || !urlVideo.video_url) return enqueueSnackbar('Title and URL are required.', { variant: 'warning' });
        try {
            await api.post(`/courses/${courseId}/videos`, urlVideo);
            enqueueSnackbar('Video added from URL!', { variant: 'success' });
            setUrlVideo({ title: '', video_url: '' });
            fetchVideos();
        } catch (error) { enqueueSnackbar('Failed to add video.', { variant: 'error' }); }
    };

    const handleFileChange = (e) => { setFileVideo(prev => ({ ...prev, file: e.target.files[0] })); };

    const handleUploadFile = async (e) => {
        e.preventDefault();
        if (!fileVideo.title || !fileVideo.file) return enqueueSnackbar('Title and a video file are required.', { variant: 'warning' });
        const formData = new FormData();
        formData.append('video', fileVideo.file);
        setUploading(true);
        setUploadProgress(0);
        try {
            const uploadRes = await api.post('/upload/video', formData, {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                }
            });
            const { filePath } = uploadRes.data;
            await api.post(`/courses/${courseId}/videos`, { title: fileVideo.title, video_url: filePath });
            enqueueSnackbar('Video uploaded and added!', { variant: 'success' });
            setFileVideo({ title: '', file: null });
            fetchVideos();
        } catch (error) { enqueueSnackbar(error.response?.data?.message || 'Upload failed.', { variant: 'error' }); } 
        finally { setUploading(false); }
    };

    const handleDeleteVideo = async (videoId) => {
        if (window.confirm('Are you sure you want to delete this video from the playlist?')) {
            try {
                await api.delete(`/courses/${courseId}/videos/${videoId}`);
                enqueueSnackbar('Video deleted.', { variant: 'success' });
                fetchVideos();
            } catch (error) { enqueueSnackbar('Failed to delete video.', { variant: 'error' }); }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Breadcrumbs sx={{ mb: 2 }}>
                <MuiLink component="button" onClick={() => navigate('/admin/courses')} sx={{ display: 'flex', alignItems: 'center' }}><ArrowBackIcon sx={{ mr: 0.5 }} /> Manage Courses</MuiLink>
                <Typography color="text.primary">Manage Videos</Typography>
            </Breadcrumbs>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>Manage Videos for "{course?.title}"</Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                        <Tab label="Add by URL (YouTube)" />
                        <Tab label="Upload Video File" />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <Typography variant="h6" gutterBottom>Add YouTube Video</Typography>
                    <Box component="form" onSubmit={handleAddByUrl} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField label="Video Title" value={urlVideo.title} onChange={(e) => setUrlVideo({...urlVideo, title: e.target.value })} fullWidth size="small" />
                        <TextField label="YouTube Video URL" value={urlVideo.video_url} onChange={(e) => setUrlVideo({...urlVideo, video_url: e.target.value })} fullWidth size="small" />
                        <Button type="submit" variant="contained">Add</Button>
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h6" gutterBottom>Upload Video File</Typography>
                    <Box component="form" onSubmit={handleUploadFile} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Video Title" value={fileVideo.title} onChange={(e) => setFileVideo({...fileVideo, title: e.target.value })} fullWidth size="small" />
                        <Button variant="outlined" component="label">
                            Choose Video File
                            <input type="file" hidden onChange={handleFileChange} accept="video/mp4,video/x-m4v,video/*" />
                        </Button>
                        {fileVideo.file && <Typography variant="body2">Selected: {fileVideo.file.name}</Typography>}
                        {uploading && <LinearProgress variant="determinate" value={uploadProgress} />}
                        <Button type="submit" variant="contained" disabled={uploading}>{uploading ? `Uploading ${uploadProgress}%` : 'Upload and Add'}</Button>
                    </Box>
                </TabPanel>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h5" gutterBottom>Current Playlist ({videos.length})</Typography>
                <List>
                    {videos.length > 0 ? videos.map(video => (
                        <ListItem key={video.id} divider secondaryAction={<IconButton edge="end" onClick={() => handleDeleteVideo(video.id)}><DeleteIcon /></IconButton>}>
                            <ListItemText primary={video.title} secondary={video.video_url} />
                        </ListItem>
                    )) : (<Typography sx={{ p: 2, color: 'text.secondary' }}>No videos have been added to this course yet.</Typography>)}
                </List>
            </Paper>
        </Box>
    );
};

export default ManageCourseVideosPage;