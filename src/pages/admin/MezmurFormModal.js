import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

const MezmurFormModal = ({ open, onClose, onSave, categories, mezmur }) => {
  const [formData, setFormData] = useState({ title: '', content: '', category_id: '', language: 'am' });
  const [selectedFile, setSelectedFile] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      if (mezmur) {
        setFormData({ 
          title: mezmur.title, 
          content: mezmur.content, 
          category_id: mezmur.category_id || '', 
          language: mezmur.language || 'am' 
        });
      } else {
        setFormData({ title: '', content: '', category_id: '', language: 'am' });
      }
      setSelectedFile(null);
    }
  }, [open, mezmur]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
      enqueueSnackbar('Title, Content, and Category are required.', { variant: 'warning' });
      return;
    }
    onSave(formData, selectedFile);
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
                    <MenuItem key={cat.id} value={cat.id}>{cat.title_am} {cat.title_en ? `(${cat.title_en})` : ''}</MenuItem>
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
              <Button variant="outlined" component="label" fullWidth>
                {mezmur?.audio_url ? 'Replace Audio File (Optional)' : 'Upload Audio File (Optional)'}
                <input type="file" hidden onChange={handleFileChange} accept="audio/*" />
              </Button>
              {selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>Selected: {selectedFile.name}</Typography>}
              {mezmur?.audio_url && !selectedFile && <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Current Audio: {mezmur.audio_url}</Typography>}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">{mezmur ? 'Save Changes' : 'Create Mezmur'}</Button>
      </DialogActions>
    </Dialog>
  );
};
export default MezmurFormModal;
