import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

const AlbumFormModal = ({ open, onClose, onSave, categories, album }) => {
  const [formData, setFormData] = useState({ title: '', description: '', categoryId: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      if (album) {
        setFormData({ title: album.title, description: album.description || '', categoryId: album.categoryId || '' });
      } else {
        setFormData({ title: '', description: '', categoryId: '' });
      }
      setSelectedFile(null);
    }
  }, [open, album]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      enqueueSnackbar('Album Title is required.', { variant: 'warning' });
      return;
    }
    onSave(formData, selectedFile);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{album ? 'Edit Album' : 'Create New Album'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField name="title" label="Album Title" value={formData.title} onChange={handleChange} fullWidth required autoFocus /></Grid>
            <Grid item xs={12}><TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} /></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select labelId="category-select-label" name="categoryId" value={formData.categoryId} label="Category" onChange={handleChange}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {Array.isArray(categories) && categories.map((cat) => (<MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                {album ? 'Change Cover Image' : 'Upload Cover Image'}
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </Button>
              {selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>Selected: {selectedFile.name}</Typography>}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}><Button onClick={onClose}>Cancel</Button><Button onClick={handleSave} variant="contained">{album ? 'Save Changes' : 'Create Album'}</Button></DialogActions>
    </Dialog>
  );
};
export default AlbumFormModal;