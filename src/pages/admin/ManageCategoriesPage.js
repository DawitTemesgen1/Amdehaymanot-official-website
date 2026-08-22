import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Typography, Paper, Box, Button, TextField, List, ListItem, ListItemText, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axiosConfig';

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/gallery/categories');
      setCategories(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch categories.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      enqueueSnackbar('Category name cannot be empty.', { variant: 'warning' });
      return;
    }
    try {
      await api.post('/gallery/categories', { name: newCategoryName });
      enqueueSnackbar('Category added successfully!', { variant: 'success' });
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to add category.', { variant: 'error' });
    }
  };
  
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await api.delete(`/gallery/categories/${categoryToDelete.id}`);
      enqueueSnackbar('Category deleted successfully!', { variant: 'success' });
      fetchCategories();
    } catch (error) {
      enqueueSnackbar('Failed to delete category.', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, margin: 'auto', borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Gallery Categories</Typography>
      
      <Box component="form" onSubmit={handleAddCategory} sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          label="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        />
        <Button type="submit" variant="contained">Add</Button>
      </Box>

      <Typography variant="h6">Existing Categories</Typography>
      <List>
        {categories.length > 0 ? categories.map((cat) => (
          <ListItem
            key={cat.id}
            divider
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(cat)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={cat.name} />
          </ListItem>
        )) : (
          <ListItem><ListItemText primary="No categories found. Add one to get started." /></ListItem>
        )}
      </List>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{categoryToDelete?.name}"?
            This will not delete albums, but will remove their category assignment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageCategoriesPage;