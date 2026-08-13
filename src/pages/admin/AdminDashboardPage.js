import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Chip, Grid, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import GroupsIcon from '@mui/icons-material/Groups';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../../api/axiosConfig';

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Could not load analytics stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mt: 1 }}>Analytics (All Time)</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && stats && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <GroupsIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6">Website Visitors</Typography>
                <Typography variant="h4" fontWeight="bold">{stats.visitorsAllTime}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
              <DownloadIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6">App Downloads</Typography>
                <Typography variant="h4" fontWeight="bold">{stats.downloadsAllTime}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
export default AdminDashboardPage;