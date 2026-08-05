import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { mezmurApi } from '../../api/mezmurApi';
import api from '../../api/axiosConfig';

// Icons
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import CategoryIcon from '@mui/icons-material/Category';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ p: 2, borderRadius: '50%', bgcolor: `${color}.light`, color: `${color}.main`, display: 'flex' }}>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

const AppDashboardPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMezmurs: 0,
    totalCategories: 0,
    latestBuildVersion: 'N/A',
    pushSent: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // Fetch all required data in parallel
        const [mezmursRes, categoriesRes, buildsRes] = await Promise.all([
          mezmurApi.getAllMezmurs(1, 1), // Only fetch 1 to get the total count efficiently
          mezmurApi.getCategories(),
          api.get('/app/builds').catch(() => ({ data: [] })) // Graceful fail if no builds table
        ]);

        const totalMezmurs = mezmursRes.data.total || 0;
        const totalCategories = (categoriesRes.data || []).length;
        
        let latestVersion = 'N/A';
        if (buildsRes.data && buildsRes.data.length > 0) {
          // Assuming builds are returned with most recent first, or sort them:
          const sortedBuilds = [...buildsRes.data].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
          latestVersion = `v${sortedBuilds[0].version}`;
        }

        setStats({
          totalMezmurs,
          totalCategories,
          latestBuildVersion: latestVersion,
          pushSent: 0 // Placeholder until Push backend is fully implemented
        });
      } catch (error) {
        console.error("Failed to fetch app dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          App Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {currentUser?.name}. Here is an overview of the mobile app's statistics.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Mezmurs" 
            value={stats.totalMezmurs} 
            icon={<LibraryMusicIcon fontSize="large" />} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Mezmur Categories" 
            value={stats.totalCategories} 
            icon={<CategoryIcon fontSize="large" />} 
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Latest App Build" 
            value={stats.latestBuildVersion} 
            icon={<PhoneAndroidIcon fontSize="large" />} 
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pushes Sent" 
            value={stats.pushSent} 
            icon={<NotificationsActiveIcon fontSize="large" />} 
            color="warning"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Use the sidebar to navigate to specific management sections for the mobile app, or use these quick links.
        </Typography>
        {/* Quick action buttons can be placed here if needed */}
      </Paper>
    </Box>
  );
};

export default AppDashboardPage;
