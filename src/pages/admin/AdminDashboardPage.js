import React from 'react';
import { Typography, Paper, Box, Chip } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="h4" component="h1">
          Welcome, {currentUser?.name}!
        </Typography>
        {currentUser?.role && (
          <Chip label={capitalize(currentUser.role)} color="primary" size="small" />
        )}
      </Box>
      <Typography variant="body1" color="text.secondary">
        This is the admin dashboard. From here you can manage all the content on the website.
        Use the sidebar to navigate to different management sections.
      </Typography>
    </Paper>
  );
};
export default AdminDashboardPage;