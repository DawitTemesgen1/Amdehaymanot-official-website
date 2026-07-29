import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Tooltip
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useSnackbar } from 'notistack';
import { format, parseISO } from 'date-fns';

// Import your configured api client
import api from '../../api/axiosConfig';

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      // The backend route to get all subscribers is GET /api/subscribe
      const { data } = await api.get('/subscribe');
      setSubscribers(data);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      enqueueSnackbar('Could not fetch subscribers. Ensure you are logged in as an admin.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleExport = () => {
    if (subscribers.length === 0) {
      enqueueSnackbar('There are no subscribers to export.', { variant: 'info' });
      return;
    }
    
    // Define CSV header
    const csvHeader = "Email,Subscribed At\n";

    // Map data to CSV format rows
    const csvRows = subscribers.map(sub => {
      const email = `"${sub.email}"`; // Wrap in quotes to handle any special characters
      const date = `"${format(parseISO(sub.subscribed_at), 'yyyy-MM-dd HH:mm:ss')}"`;
      return `${email},${date}`;
    }).join("\n");
    
    const csvString = `${csvHeader}${csvRows}`;
    
    // Create a Blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    const filename = `amdehaymanot-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    enqueueSnackbar('Subscriber list export started!', { variant: 'success' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Newsletter Subscribers ({subscribers.length})
        </Typography>
        <Tooltip title="Download the list as a CSV file">
          <span>
            <Button 
              variant="contained" 
              onClick={handleExport} 
              disabled={subscribers.length === 0}
              startIcon={<FileDownloadIcon />}
            >
              Export as CSV
            </Button>
          </span>
        </Tooltip>
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date Subscribed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <TableRow key={subscriber.id} hover>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>{format(parseISO(subscriber.subscribed_at), 'MMMM d, yyyy, h:mm a')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    No subscribers found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SubscribersPage;