import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { format, parseISO } from 'date-fns';
import EventFormModal from './EventFormModal';
import api from '../../api/axiosConfig';

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [formOpen, setFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch events.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  const handleSaveEvent = async (eventData, imageFile) => {
    const formData = new FormData();
    Object.keys(eventData).forEach(key => formData.append(key, eventData[key]));
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (eventToEdit) {
            await api.put(`/events/${eventToEdit.id}`, formData, config);
            enqueueSnackbar('Event updated successfully!', { variant: 'success' });
        } else {
            await api.post('/events', formData, config);
            enqueueSnackbar('Event created successfully!', { variant: 'success' });
        }
        fetchEvents();
        setFormOpen(false);
        setEventToEdit(null);
    } catch (error) {
        enqueueSnackbar(error.response?.data?.message || 'An error occurred while saving the event.', { variant: 'error' });
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    try {
        await api.delete(`/events/${eventToDelete.id}`);
        enqueueSnackbar('Event deleted successfully!', { variant: 'success' });
        fetchEvents();
    } catch (error) {
        enqueueSnackbar('Failed to delete event.', { variant: 'error' });
    } finally {
        setDeleteDialogOpen(false);
        setEventToDelete(null);
    }
  };
  
  const handleOpenCreate = () => { setEventToEdit(null); setFormOpen(true); };
  const handleOpenEdit = (event) => { setEventToEdit(event); setFormOpen(true); };
  const handleDeleteClick = (event) => { setEventToDelete(event); setDeleteDialogOpen(true); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage Events</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>Create New Event</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{event.title}</TableCell>
                <TableCell>{format(parseISO(event.event_date), 'MMM d, yyyy, h:mm a')}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Event"><IconButton onClick={() => handleOpenEdit(event)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete Event"><IconButton onClick={() => handleDeleteClick(event)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EventFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSaveEvent} event={eventToEdit} />
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete the event "{eventToDelete?.title}"?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageEventsPage;