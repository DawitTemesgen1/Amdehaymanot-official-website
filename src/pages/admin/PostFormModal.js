
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Typography, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';


const initialFormState = {
title: '',
content: '',
category: 'General',
author: '',
image_url: ''
};

const PostFormModal = ({ open, onClose, onSave, post }) => {
const [formData, setFormData] = useState(initialFormState);
const [selectedFile, setSelectedFile] = useState(null);
const { currentUser } = useAuth();

useEffect(() => {
if (post) {
setFormData({
title: post.title || '',
content: post.content || '',
category: post.category || 'General',
author: post.author || currentUser?.name || '',
image_url: post.image_url || ''
});
} else {
// For a new post, default the author to the current user's name
setFormData({ ...initialFormState, author: currentUser?.name || '' });
}
// Reset file input on open
setSelectedFile(null);
}, [post, open, currentUser]);

const handleChange = (e) => {
setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleFileChange = (e) => {
setSelectedFile(e.target.files[0]);
if (e.target.files[0]) {
// Clear the image_url field if a file is selected
setFormData(prev => ({ ...prev, image_url: '' }));
}
};

const handleSave = () => {
onSave(formData, selectedFile);
};

return (
<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
<DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
<DialogContent>
<Box component="form" noValidate sx={{ mt: 2 }}>
<Grid container spacing={2}>
<Grid item xs={12}>
<TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth required autoFocus />
</Grid>
<Grid item xs={12} sm={6}>
<TextField name="category" label="Category" value={formData.category} onChange={handleChange} fullWidth required />
</Grid>
<Grid item xs={12} sm={6}>
<TextField name="author" label="Author" value={formData.author} onChange={handleChange} fullWidth helperText="Defaults to your name." />
</Grid>

code
Code
download
content_copy
expand_less
<Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>POST COVER IMAGE</Typography>
            <Button variant="outlined" component="label" fullWidth>
                Upload Image File
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
            {selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>Selected: {selectedFile.name}</Typography>}
            <Divider sx={{ my: 2 }}>OR</Divider>
            <TextField name="image_url" label="Paste Image URL" value={formData.image_url} onChange={handleChange} fullWidth disabled={!!selectedFile} helperText="Uploading a file will override the URL." />
        </Grid>

        <Grid item xs={12}>
          <TextField name="content" label="Content" value={formData.content} onChange={handleChange} fullWidth multiline rows={12} required />
        </Grid>
      </Grid>
    </Box>
  </DialogContent>
  <DialogActions sx={{ p: '16px 24px' }}>
    <Button onClick={onClose}>Cancel</Button>
    <Button onClick={handleSave} variant="contained">{post ? 'Save Changes' : 'Create Post'}</Button>
  </DialogActions>
</Dialog>

);
};

export default PostFormModal;