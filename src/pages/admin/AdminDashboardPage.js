import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Skeleton } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import DownloadIcon from '@mui/icons-material/Download';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DevicesIcon from '@mui/icons-material/Devices';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../api/axiosConfig';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/stats');
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Could not load analytics stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminName = localStorage.getItem('userName') || 'Admin';

  const StatCard = ({ title, value, icon, bgColor, color, loading }) => (
    <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: bgColor, color: color, height: '100%' }}>
      {icon}
      <Box>
        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>{title}</Typography>
        {loading ? <Skeleton variant="text" width={80} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} /> : <Typography variant="h4" fontWeight="bold">{value}</Typography>}
      </Box>
    </Paper>
  );

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {adminName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is your enterprise analytics dashboard. Real-time data and 30-day trends are displayed below.
        </Typography>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {/* Top KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Users (30 Days)" 
            value={stats?.activeUsers || 0} 
            icon={<GroupsIcon sx={{ fontSize: 40 }} />} 
            bgColor="primary.main" 
            color="primary.contrastText" 
            loading={loading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="App Downloads (30 Days)" 
            value={stats?.downloadsCount || 0} 
            icon={<DownloadIcon sx={{ fontSize: 40 }} />} 
            bgColor="secondary.main" 
            color="secondary.contrastText" 
            loading={loading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="New Users (30 Days)" 
            value={stats?.newUsers || 0} 
            icon={<PersonAddIcon sx={{ fontSize: 40 }} />} 
            bgColor="success.main" 
            color="success.contrastText" 
            loading={loading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Avg Session Duration" 
            value={`${stats?.avgSessionDuration || 0}s`} 
            icon={<TimerIcon sx={{ fontSize: 40 }} />} 
            bgColor="info.main" 
            color="info.contrastText" 
            loading={loading} 
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="primary" /> Visitor Trend (Last 30 Days)
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.timeseriesData || []}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="visitors" stroke="#1976d2" fillOpacity={1} fill="url(#colorVisitors)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DevicesIcon color="secondary" /> Devices
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading ? (
                <Skeleton variant="circular" width={200} height={200} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.deviceData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(stats?.deviceData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;