
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Tooltip, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { format, parseISO } from 'date-fns';
import PostFormModal from './PostFormModal';
import api from '../../api/axiosConfig';

const ManagePostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [formOpen, setFormOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch posts', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleOpenCreate = () => { setPostToEdit(null); setFormOpen(true); };
  const handleOpenEdit = (post) => { setPostToEdit(post); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setPostToEdit(null); };
  const handleDeleteClick = (post) => { setPostToDelete(post); setDeleteDialogOpen(true); };

  const handleSavePost = async (postData, imageFile) => {
    const formData = new FormData();
    // Append all text fields from postData to formData
    Object.keys(postData).forEach(key => {
      if (postData[key] !== null && postData[key] !== undefined) {
        formData.append(key, postData[key]);
      }
    });
    // Append the file if it exists
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (postToEdit) {
        await api.put(`/posts/${postToEdit.id}`, formData, config);
        enqueueSnackbar('Post updated successfully!', { variant: 'success' });
      } else {
        await api.post('/posts', formData, config);
        enqueueSnackbar('Post created successfully!', { variant: 'success' });
      }
      fetchPosts();
      handleCloseForm();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'An error occurred while saving the post.', { variant: 'error' });
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/posts/${postToDelete.id}`);
      enqueueSnackbar('Post deleted successfully!', { variant: 'success' });
      fetchPosts();
    } catch (error) {
      enqueueSnackbar('Failed to delete post.', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage News Posts</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>Create New Post</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{post.title}</TableCell>
                <TableCell>
                  {post.source === 'telegram' ? (
                    <Chip size="small" label="Telegram" color="primary" variant="outlined" />
                  ) : (
                    <Chip size="small" label="Manual" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{format(parseISO(post.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Post"><IconButton onClick={() => handleOpenEdit(post)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete Post"><IconButton onClick={() => handleDeleteClick(post)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PostFormModal open={formOpen} onClose={handleCloseForm} onSave={handleSavePost} post={postToEdit} />
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete the post "{postToDelete?.title}"?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManagePostsPage;