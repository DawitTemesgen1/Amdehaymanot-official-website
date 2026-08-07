import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { mezmurApi } from '../../api/mezmurApi';
import { API_ROOT_URL } from '../../api/axiosConfig';

const MezmurFormModal = ({ open, onClose, onSave, categories, mezmur }) => {
  const [formData, setFormData] = useState({ title: '', content: '', category_id: '', language: 'am', audio_url: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      if (mezmur) {
        setFormData({
          title: mezmur.title,
          content: mezmur.content,
          category_id: mezmur.category_id || '',
          language: mezmur.language || 'am',
          audio_url: mezmur.audio_url || ''
        });
      } else {
        setFormData({ title: '', content: '', category_id: '', language: 'am', audio_url: '' });
      }
      setSelectedFile(null);
      setUploading(false);
      setUploadProgress(0);
    }
  }, [open, mezmur]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await mezmurApi.uploadAudioTemp(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      setFormData(prev => ({ ...prev, audio_url: res.data.audio_url }));
      enqueueSnackbar('Audio uploaded successfully!', { variant: 'success' });
    } catch (error) {
      console.error("Audio upload error:", error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to upload audio.', { variant: 'error' });
      setSelectedFile(null); // reset file if upload failed
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
      enqueueSnackbar('Title, Content, and Category are required.', { variant: 'warning' });
      return;
    }
    // We pass formData (which now contains audio_url) to onSave
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{mezmur ? 'Edit Mezmur' : 'Create New Mezmur'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField name="title" label="Title (First Line)" value={formData.title} onChange={handleChange} fullWidth required autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select labelId="category-select-label" name="category_id" value={formData.category_id} label="Category" onChange={handleChange}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {Array.isArray(categories) && categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.title_am || cat.title_om || cat.title_en} {cat.title_am && cat.title_en ? `(${cat.title_en})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="language-select-label">Language</InputLabel>
                <Select labelId="language-select-label" name="language" value={formData.language} label="Language" onChange={handleChange}>
                  <MenuItem value="am">Amharic (am)</MenuItem>
                  <MenuItem value="om">Afaan Oromo (om)</MenuItem>
                  <MenuItem value="en">English (en)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField name="content" label="Hymn Lyrics" value={formData.content} onChange={handleChange} fullWidth multiline rows={8} required />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Audio File</Typography>

                {formData.audio_url && !selectedFile && (
                  <Box sx={{ mb: 2 }}>
                    <audio
                      controls
                      src={`${API_ROOT_URL}${formData.audio_url}`}
                      style={{ width: '100%', outline: 'none' }}
                    />
                  </Box>
                )}

                <Button variant="outlined" component="label" fullWidth disabled={uploading}>
                  {formData.audio_url ? 'Replace Audio File' : 'Upload Audio File'}
                  <input type="file" hidden onChange={handleFileChange} accept="audio/*" />
                </Button>

                {selectedFile && <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Preparing upload: {selectedFile.name}</Typography>}

                {uploading && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">{`${uploadProgress}%`}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} disabled={uploading}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={uploading}>
          {mezmur ? 'Save Changes' : 'Create Mezmur'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default MezmurFormModal;
