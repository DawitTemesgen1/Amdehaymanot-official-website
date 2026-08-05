import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { 
  Typography, Paper, Box, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Tooltip, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  CircularProgress 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { mezmurApi } from '../../api/mezmurApi';

const ManageMezmurCategoriesPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title_am: '',
    title_om: '',
    title_en: '',
    sort_order: 0
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mezmurApi.getCategories();
      // Sort by sort_order
      const sorted = (res.data || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      setCategories(sorted);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      enqueueSnackbar('Failed to fetch categories.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ id: '', title_am: '', title_om: '', title_en: '', sort_order: 0 });
    setFormOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      title_am: category.title_am || '',
      title_om: category.title_om || '',
      title_en: category.title_en || '',
      sort_order: category.sort_order || 0
    });
    setFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.title_am) {
      enqueueSnackbar('ID and Amharic Title are required.', { variant: 'warning' });
      return;
    }

    try {
      if (editingCategory) {
        await mezmurApi.updateCategory(editingCategory.id, formData);
        enqueueSnackbar('Category updated successfully!', { variant: 'success' });
      } else {
        await mezmurApi.createCategory(formData);
        enqueueSnackbar('Category created successfully!', { variant: 'success' });
      }
      setFormOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to save category.', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Mezmur Categories
        </Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          Add New Category
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Amharic Title</TableCell>
                  <TableCell>English Title</TableCell>
                  <TableCell>Oromiffa Title</TableCell>
                  <TableCell>Sort Order</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>{category.id}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{category.title_am}</TableCell>
                    <TableCell>{category.title_en}</TableCell>
                    <TableCell>{category.title_om}</TableCell>
                    <TableCell>{category.sort_order}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Category">
                        <IconButton onClick={() => handleOpenEdit(category)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No categories found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField 
                name="id" 
                label="Category ID (Integer)" 
                type="number"
                value={formData.id} 
                onChange={handleChange} 
                required 
                disabled={!!editingCategory} 
                helperText={!editingCategory ? "Unique integer ID for this category (e.g. 1, 2, 3)" : ""}
              />
              <TextField 
                name="title_am" 
                label="Amharic Title" 
                value={formData.title_am} 
                onChange={handleChange} 
                required 
              />
              <TextField 
                name="title_en" 
                label="English Title" 
                value={formData.title_en} 
                onChange={handleChange} 
              />
              <TextField 
                name="title_om" 
                label="Oromiffa Title" 
                value={formData.title_om} 
                onChange={handleChange} 
              />
              <TextField 
                name="sort_order" 
                label="Sort Order" 
                type="number"
                value={formData.sort_order} 
                onChange={handleChange} 
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Category</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ManageMezmurCategoriesPage;
