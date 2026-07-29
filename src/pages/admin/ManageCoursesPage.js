
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { useSnackbar } from 'notistack';
import CourseFormModal from './CourseFormModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch courses.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  const handleSaveCourse = async (courseData, imageFile) => {
    const formData = new FormData();
    Object.keys(courseData).forEach(key => formData.append(key, courseData[key]));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    // Default instructor to current user if not provided
    if (!formData.get('instructor_name')) {
      formData.set('instructor_name', currentUser.name);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (courseToEdit) {
        await api.put(`/courses/${courseToEdit.id}`, formData, config);
        enqueueSnackbar('Course updated successfully!', { variant: 'success' });
      } else {
        await api.post('/courses', formData, config);
        enqueueSnackbar('Course created successfully!', { variant: 'success' });
      }
      fetchCourses();
      setFormOpen(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to save course.', { variant: 'error' });
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    try {
      await api.delete(`/courses/${courseToDelete.id}`);
      enqueueSnackbar('Course deleted successfully!', { variant: 'success' });
      fetchCourses();
    } catch (error) {
      enqueueSnackbar('Failed to delete course.', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleOpenCreate = () => { setCourseToEdit(null); setFormOpen(true); };
  const handleOpenEdit = (course) => { setCourseToEdit(course); setFormOpen(true); };
  const handleDeleteClick = (course) => { setCourseToDelete(course); setDeleteDialogOpen(true); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage Courses</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>Create New Course</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{course.course_type.toLowerCase()}</TableCell>
                  <TableCell>{course.instructor_name || 'N/A'}</TableCell>
                  <TableCell align="right">
                    {course.course_type === 'PLAYLIST' && (
                      <Tooltip title="Manage Videos"><IconButton onClick={() => navigate(`/admin/courses/${course.id}/videos`)}><PlaylistPlayIcon /></IconButton></Tooltip>
                    )}
                    <Tooltip title="Edit Course"><IconButton onClick={() => handleOpenEdit(course)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete Course"><IconButton onClick={() => handleDeleteClick(course)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CourseFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSaveCourse} course={courseToEdit} />
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete the course "{courseToDelete?.title}"? This will delete all associated videos and cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
export default ManageCoursesPage;