import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { 
  Typography, Paper, Box, Button, TextField, CircularProgress, 
  Grid, Card, CardContent, Divider 
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
// import api from '../../api/axiosConfig'; // Will be used when backend is ready

const ManagePushNotificationsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    target: 'all' // 'all', 'android', 'ios'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendPush = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.body) {
      enqueueSnackbar('Title and Body are required.', { variant: 'warning' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for now since backend FCM isn't fully integrated yet
      await new Promise(r => setTimeout(r, 1500));
      // await api.post('/app/notifications/send', formData);

      enqueueSnackbar('Push notification dispatched successfully!', { variant: 'success' });
      setFormData({ title: '', body: '', target: 'all' });
    } catch (error) {
      console.error("Failed to send push notification:", error);
      enqueueSnackbar('Failed to send push notification.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <NotificationsActiveIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" component="h1">
            Push Notifications Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Broadcast messages directly to all users who have installed the mobile app.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SendIcon color="secondary" /> Compose Notification
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSendPush}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField 
                  name="title"
                  label="Notification Title"
                  placeholder="e.g. New Mezmur Added!"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField 
                  name="body"
                  label="Notification Body / Message"
                  placeholder="e.g. Check out the latest addition to our library."
                  value={formData.body}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  >
                    {loading ? 'Sending...' : 'Broadcast Notification'}
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, borderRadius: 3, height: '100%', bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Live Preview
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: 3,
              maxWidth: 320,
              mx: 'auto',
              bgcolor: 'background.paper'
            }}>
              <Box sx={{ bgcolor: '#f0f0f0', p: 1, display: 'flex', justifyContent: 'center' }}>
                <PhoneAndroidIcon sx={{ color: '#999' }} />
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '20%', bgcolor: 'primary.main' }}></Box>
                  <Typography variant="caption" color="text.secondary">Amdehaymanot • Now</Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {formData.title || 'Notification Title'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {formData.body || 'This is how your message will appear on a user\'s device.'}
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'warning.light', borderRadius: 2, color: 'warning.dark' }}>
              <Typography variant="body2">
                <strong>Note:</strong> Firebase Cloud Messaging (FCM) credentials must be configured on the backend server for notifications to successfully reach devices.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagePushNotificationsPage;
