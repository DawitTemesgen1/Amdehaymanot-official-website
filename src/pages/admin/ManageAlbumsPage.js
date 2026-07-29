import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Avatar, Tooltip } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AlbumFormModal from './AlbumFormModal';
import api, { API_ROOT_URL } from '../../api/axiosConfig';

const ManageAlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [albumsRes, categoriesRes] = await Promise.all([
        api.get('/gallery/albums'),
        api.get('/gallery/categories')
      ]);
      setAlbums(albumsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) { 
      console.error("Failed to fetch data:", error.response || error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch data.', { variant: 'error' }); 
    } 
    finally { setLoading(false); }
  }, [enqueueSnackbar]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveAlbum = async (formData, imageFile) => {
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);
    try {
      if (albumToEdit) {
        await api.put(`/gallery/albums/${albumToEdit.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        enqueueSnackbar('Album updated successfully!', { variant: 'success' });
      } else {
        await api.post('/gallery/albums', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        enqueueSnackbar('Album created successfully!', { variant: 'success' });
      }
      fetchData();
    } catch (error) { 
      console.error("Save album error:", error.response || error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to save album.', { variant: 'error' }); 
    }
    finally { setFormOpen(false); setAlbumToEdit(null); }
  };
  
  const handleDeleteClick = (album) => { setAlbumToDelete(album); setDeleteDialogOpen(true); };
  const handleOpenEdit = (album) => { setAlbumToEdit(album); setFormOpen(true); };
  const handleOpenCreate = () => { setAlbumToEdit(null); setFormOpen(true); };

  const handleDeleteConfirm = async () => { /* ... see previous response ... */ };
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage Albums</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>Create New Album</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead><TableRow><TableCell>Cover</TableCell><TableCell>Title</TableCell><TableCell>Category</TableCell><TableCell>Photos</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {albums.map((album) => (
              <TableRow key={album.id} hover>
                <TableCell><Avatar src={album.cover_image_url ? `${API_ROOT_URL}${album.cover_image_url}` : undefined} variant="rounded"><PhotoLibraryIcon /></Avatar></TableCell>
                <TableCell>{album.title}</TableCell>
                <TableCell>{album.category?.name || 'N/A'}</TableCell>
                <TableCell>{album._count?.images || 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Manage Photos"><IconButton onClick={() => navigate(`/admin/albums/${album.id}/photos`)}><PhotoLibraryIcon /></IconButton></Tooltip>
                  <Tooltip title="Edit Album"><IconButton onClick={() => handleOpenEdit(album)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete Album"><IconButton onClick={() => handleDeleteClick(album)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AlbumFormModal open={formOpen} onClose={() => { setFormOpen(false); setAlbumToEdit(null); }} onSave={handleSaveAlbum} categories={categories} album={albumToEdit} />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete the album "{albumToDelete?.title}"? This will delete all images inside it and cannot be undone.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button onClick={handleDeleteConfirm} color="error">Delete</Button></DialogActions>
      </Dialog>
    </Paper>
  );
};
export default ManageAlbumsPage;