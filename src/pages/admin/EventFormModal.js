import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Typography, Divider } from '@mui/material';


const initialFormState = {
title: '',
description: '',
event_date: '',
location: '',
image_url: '',
organizer: ''
};

const EventFormModal = ({ open, onClose, onSave, event }) => {
const [formData, setFormData] = useState(initialFormState);
const [selectedFile, setSelectedFile] = useState(null);

useEffect(() => {
if (event) {
// Format the date correctly for the datetime-local input
const formattedDate = event.event_date ? new Date(new Date(event.event_date).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';
setFormData({ ...initialFormState, ...event, event_date: formattedDate });
} else {
setFormData(initialFormState);
}
setSelectedFile(null); // Reset file on open
}, [event, open]);

const handleChange = (e) => {
setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleFileChange = (e) => {
setSelectedFile(e.target.files[0]);
if (e.target.files[0]) {
// Clear URL field if file is selected
setFormData(prev => ({ ...prev, image_url: '' }));
}
};

const handleSave = () => {
onSave(formData, selectedFile);
};

return (
<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
<DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
<DialogContent>
<Box component="form" sx={{ mt: 2 }}>
<Grid container spacing={2}>
<Grid item xs={12}><TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth required autoFocus /></Grid>
<Grid item xs={12} sm={6}><TextField name="event_date" label="Event Date and Time" type="datetime-local" value={formData.event_date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} /></Grid>
<Grid item xs={12} sm={6}><TextField name="location" label="Location" value={formData.location} onChange={handleChange} fullWidth required /></Grid>
<Grid item xs={12}><TextField name="organizer" label="Organizer (Optional)" value={formData.organizer} onChange={handleChange} fullWidth /></Grid>

code
Code
download
content_copy
expand_less
<Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>EVENT COVER IMAGE</Typography>
            <Button variant="outlined" component="label" fullWidth>
                Upload Image File
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
            {selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>Selected: {selectedFile.name}</Typography>}
            <Divider sx={{ my: 2 }}>OR</Divider>
            <TextField name="image_url" label="Paste Image URL" value={formData.image_url} onChange={handleChange} fullWidth disabled={!!selectedFile} helperText="Uploading a file will override the URL." />
        </Grid>

        <Grid item xs={12}><TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth multiline rows={6} required /></Grid>
      </Grid>
    </Box>
  </DialogContent>
  <DialogActions sx={{ p: '16px 24px' }}>
    <Button onClick={onClose}>Cancel</Button>
    <Button onClick={handleSave} variant="contained">{event ? 'Save Changes' : 'Create Event'}</Button>
  </DialogActions>
</Dialog>

);
};

export default EventFormModal;
