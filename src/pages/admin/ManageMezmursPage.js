import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Tooltip, TablePagination, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MezmurFormModal from './MezmurFormModal';
import { mezmurApi } from '../../api/mezmurApi';

const ManageMezmursPage = () => {
  const [mezmurs, setMezmurs] = useState([]);
  const [filteredMezmurs, setFilteredMezmurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [mezmurToEdit, setMezmurToEdit] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mezmurToDelete, setMezmurToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [mezmursRes, categoriesRes] = await Promise.all([
        mezmurApi.getAllMezmurs(),
        mezmurApi.getCategories()
      ]);
      
      const activeMezmurs = (mezmursRes.data.data || [])
        .filter(m => !m.deleted_at) // ignore soft-deleted ones for the list
        .sort((a, b) => a.id - b.id); // oldest first (start from 1)

      setMezmurs(activeMezmurs);
      setFilteredMezmurs(activeMezmurs);
      setCategories(categoriesRes.data || []);
    } catch (error) { 
      console.error("Failed to fetch mezmurs:", error.response || error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch mezmurs.', { variant: 'error' }); 
    } finally { 
      setLoading(false); 
    }
  }, [enqueueSnackbar]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // Handle Search and Filter
  useEffect(() => {
    let result = mezmurs;
    
    if (selectedCategory !== 'all') {
      result = result.filter(m => m.category_id === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.title?.toLowerCase().includes(query) || 
        m.content?.toLowerCase().includes(query)
      );
    }
    
    setFilteredMezmurs(result);
    setPage(0);
  }, [searchQuery, selectedCategory, mezmurs]);

  const handleSaveMezmur = async (formData) => {
    try {
      if (mezmurToEdit) {
        await mezmurApi.updateMezmur(mezmurToEdit.id, formData);
        enqueueSnackbar('Mezmur updated successfully!', { variant: 'success' });
      } else {
        await mezmurApi.createMezmur(formData);
        enqueueSnackbar('Mezmur created successfully!', { variant: 'success' });
      }

      fetchData();
      setFormOpen(false); 
      setMezmurToEdit(null); 
    } catch (error) { 
      console.error("Save mezmur error:", error.response || error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to save mezmur.', { variant: 'error' }); 
    }
  };
  
  const handleDeleteClick = (mezmur) => { setMezmurToDelete(mezmur); setDeleteDialogOpen(true); };
  const handleOpenEdit = (mezmur) => { setMezmurToEdit(mezmur); setFormOpen(true); };
  const handleOpenCreate = () => { setMezmurToEdit(null); setFormOpen(true); };

  const handleDeleteConfirm = async () => {
    try {
      await mezmurApi.deleteMezmur(mezmurToDelete.id);
      enqueueSnackbar('Mezmur deleted successfully!', { variant: 'success' });
      fetchData();
    } catch (error) {
      console.error("Delete mezmur error:", error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete mezmur.', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setMezmurToDelete(null);
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? (cat.title_am || cat.title_om || cat.title_en || 'Unknown') : 'Unknown';
  };

  const handleChangePage = (event, newPage) => { setPage(newPage); };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Manage Mezmurs</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all"><em>All Categories</em></MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.title_am || c.title_om || c.title_en || 'Unknown'} {c.title_am && c.title_en ? `(${c.title_en})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search mezmurs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />
          <Button variant="contained" onClick={handleOpenCreate}>Add New Mezmur</Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Audio</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMezmurs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((mezmur) => (
                  <TableRow key={mezmur.id} hover>
                    <TableCell>{mezmur.id}</TableCell>
                    <TableCell>{mezmur.title}</TableCell>
                    <TableCell>{getCategoryName(mezmur.category_id)}</TableCell>
                    <TableCell>
                      {mezmur.audio_url ? <LibraryMusicIcon color="primary" /> : <Typography variant="body2" color="text.secondary">None</Typography>}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Mezmur"><IconButton onClick={() => handleOpenEdit(mezmur)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Delete Mezmur"><IconButton onClick={() => handleDeleteClick(mezmur)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMezmurs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No mezmurs found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredMezmurs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <MezmurFormModal 
        open={formOpen} 
        onClose={() => { setFormOpen(false); setMezmurToEdit(null); }} 
        onSave={handleSaveMezmur} 
        categories={categories} 
        mezmur={mezmurToEdit} 
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the mezmur "{mezmurToDelete?.title}"?
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
export default ManageMezmursPage;
