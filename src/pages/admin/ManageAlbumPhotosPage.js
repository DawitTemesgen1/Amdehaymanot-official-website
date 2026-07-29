import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDropzone } from 'react-dropzone';
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Chip,
  LinearProgress,
  Tooltip,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import api, { API_ROOT_URL } from '../../api/axiosConfig';

const ManageAlbumPhotosPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchAlbum = useCallback(async () => {
    try {
      const response = await api.get(`/gallery/albums/${albumId}`);
      setAlbum(response.data);
    } catch (error) {
      // --- THIS IS THE MODIFICATION ---
      // Log the detailed error object to the browser console for debugging
      console.error("Failed to fetch album details:", error.response || error);

      // Show a more informative message to the user from the backend, if available
      const errorMsg = error.response?.data?.message || 'Failed to fetch album details.';
      enqueueSnackbar(errorMsg, { variant: 'error' });
      navigate('/admin/albums');
    } finally {
      setLoading(false);
    }
  }, [albumId, navigate, enqueueSnackbar]);

  useEffect(() => {
    setLoading(true);
    fetchAlbum();
  }, [fetchAlbum]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const formData = new FormData();
    acceptedFiles.forEach(file => formData.append('images', file));
    setUploading(true);
    setUploadProgress(0);
    try {
      const uploadResponse = await api.post('/upload/many', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      const { processedFiles } = uploadResponse.data;
      const newImagesData = processedFiles.map(file => ({ ...file, title: 'New Image' }));
      await api.post(`/gallery/albums/${albumId}/images`, { images: newImagesData });
      enqueueSnackbar(`${processedFiles.length} images uploaded successfully!`, { variant: 'success' });
      fetchAlbum();
    } catch (error) {
      console.error("Upload error:", error.response || error);
      enqueueSnackbar(error.response?.data?.message || 'Upload failed.', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  }, [albumId, enqueueSnackbar, fetchAlbum]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] } });

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image? This cannot be undone.')) {
      try {
        await api.delete(`/gallery/images/${imageId}`);
        enqueueSnackbar('Image deleted successfully.', { variant: 'success' });
        fetchAlbum();
      } catch (error) {
        console.error("Delete image error:", error.response || error);
        enqueueSnackbar('Failed to delete image.', { variant: 'error' });
      }
    }
  };

  const handleDownloadImage = (image) => window.open(`${API_ROOT_URL}${image.image_url}`, '_blank');
  const handleDownloadAllImages = async () => { /* ... see previous response ... */ };

  if (loading || !album) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink component="button" onClick={() => navigate('/admin/albums')} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} color="inherit"><ArrowBackIcon sx={{ mr: 0.5 }} /> Manage Albums</MuiLink>
        <Typography color="text.primary">{album?.title || 'Album Photos'}</Typography>
      </Breadcrumbs>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4">{album?.title}</Typography>
            <Typography variant="body1" color="text.secondary">{album?.description}</Typography>
            {album?.category?.name && <Chip label={album.category.name} size="small" sx={{ mt: 1 }} />}
          </Box>
          {album?.images && album.images.length > 0 && (<Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadAllImages}>Download All ({album.images.length})</Button>)}
        </Box>
        <Box {...getRootProps()} sx={{ border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.400'}`, borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer', backgroundColor: isDragActive ? 'action.hover' : 'background.paper', mb: 4 }}>
          <input {...getInputProps()} />
          <UploadFileIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
          <Typography>{isDragActive ? 'Drop files here...' : "Drag & drop images here, or click to select"}</Typography>
        </Box>
        {uploading && (<Box sx={{ width: '100%', mb: 4 }}><LinearProgress variant="determinate" value={uploadProgress} /><Typography textAlign="center" sx={{ mt: 1 }}>{uploadProgress}%</Typography></Box>)}
        <Typography variant="h5" gutterBottom>Album Photos ({album?.images?.length || 0})</Typography>
        <Grid container spacing={2}>
          {album?.images && album.images.length > 0 ? album.images.map(image => (
            <Grid item key={image.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ position: 'relative', height: '100%' }}>
                <CardMedia component="img" height="200" image={`${API_ROOT_URL}${image.thumbnail_url}`} alt={image.title || 'Album image'} sx={{ objectFit: 'cover' }} />
                <CardActions sx={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.4)', gap: 0.5 }}>
                  <Tooltip title="Download"><IconButton size="small" onClick={() => handleDownloadImage(image)}><DownloadIcon sx={{ color: 'white' }} /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDeleteImage(image.id)}><DeleteIcon sx={{ color: 'white' }} /></IconButton></Tooltip>
                </CardActions>
                <Box sx={{ p: 1 }}><Typography variant="body2" noWrap title={image.title}>{image.title || 'Untitled'}</Typography></Box>
              </Card>
            </Grid>
          )) : (<Grid item xs={12}><Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>This album is empty. Upload photos to get started.</Typography></Grid>)}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ManageAlbumPhotosPage;