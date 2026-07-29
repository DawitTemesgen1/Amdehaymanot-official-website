import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Select, MenuItem, FormControl, InputLabel, Typography, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';


const initialFormState = {
title: '', description: '', category: 'GENERAL',
course_type: 'PLAYLIST', image_url: '', instructor_name: '',
schedule: '', live_session_url: ''
};

const courseCategories = ["GENERAL", "SPIRITUAL", "HYMNS", "INSTRUMENTS", "ABINET"];

const CourseFormModal = ({ open, onClose, onSave, course }) => {
const [formData, setFormData] = useState(initialFormState);
const [selectedFile, setSelectedFile] = useState(null);
const { currentUser } = useAuth();

useEffect(() => {
if (course) {
setFormData({ ...initialFormState, ...course });
} else {
setFormData({...initialFormState, instructor_name: currentUser?.name || ''});
}
setSelectedFile(null);
}, [course, open, currentUser]);

const handleChange = (e) => {
setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleFileChange = (e) => {
setSelectedFile(e.target.files[0]);
if (e.target.files[0]) {
setFormData(prev => ({ ...prev, image_url: '' }));
}
};

const handleSave = () => {
onSave(formData, selectedFile);
};

return (
<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
<DialogTitle>{course ? 'Edit Course' : 'Create New Course'}</DialogTitle>
<DialogContent>
<Box component="form" sx={{ mt: 2 }}>
<Grid container spacing={2}>
<Grid item xs={12}><TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth required autoFocus /></Grid>
<Grid item xs={12} sm={6}>
<FormControl fullWidth><InputLabel>Category</InputLabel>
<Select name="category" value={formData.category} label="Category" onChange={handleChange}>
{courseCategories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
</Select>
</FormControl>
</Grid>
<Grid item xs={12} sm={6}>
<FormControl fullWidth><InputLabel>Course Type</InputLabel>
<Select name="course_type" value={formData.course_type} label="Course Type" onChange={handleChange}>
<MenuItem value="PLAYLIST">Video Playlist</MenuItem>
<MenuItem value="LIVE">Live Session</MenuItem>
</Select>
</FormControl>
</Grid>
<Grid item xs={12}><TextField name="instructor_name" label="Instructor Name" value={formData.instructor_name} onChange={handleChange} fullWidth helperText="Defaults to your name if left blank." /></Grid>
<Grid item xs={12}>
<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>COURSE COVER IMAGE</Typography>
<Button variant="outlined" component="label" fullWidth>Upload Image File</Button>
<input type="file" hidden onChange={handleFileChange} accept="image/*" />
{selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>Selected: {selectedFile.name}</Typography>}
<Divider sx={{ my: 2 }}>OR</Divider>
<TextField name="image_url" label="Paste Image URL" value={formData.image_url} onChange={handleChange} fullWidth disabled={!!selectedFile} helperText="Uploading a file will override the URL." />
</Grid>
{formData.course_type === 'LIVE' && (
<>
<Grid item xs={12} sm={6}><TextField name="schedule" label="Schedule (e.g., Mondays, 7 PM)" value={formData.schedule} onChange={handleChange} fullWidth /></Grid>
<Grid item xs={12} sm={6}><TextField name="live_session_url" label="Live Session URL (Zoom, Meet, etc.)" value={formData.live_session_url} onChange={handleChange} fullWidth /></Grid>
</>
)}
<Grid item xs={12}><TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} required /></Grid>
</Grid>
</Box>
</DialogContent>
<DialogActions sx={{ p: '16px 24px' }}>
<Button onClick={onClose}>Cancel</Button>
<Button onClick={handleSave} variant="contained">{course ? 'Save Changes' : 'Create Course'}</Button>
</DialogActions>
</Dialog>
);
};
export default CourseFormModal;