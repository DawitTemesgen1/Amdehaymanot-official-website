import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosConfig';
import { Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';
import { format, parseISO } from 'date-fns';

const ViewMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch (error) {
      enqueueSnackbar('Could not fetch messages.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom>Contact Form Messages</Typography>
      <Box>
        {messages.length > 0 ? messages.map((msg) => (
          <Accordion key={msg.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>{msg.name} - <Typography component="span" color="text.secondary">{msg.subject || 'No Subject'}</Typography></Typography>
                  <Typography variant="caption" color="text.secondary">{msg.email}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {format(parseISO(msg.submitted_at), 'MMM d, yyyy, h:mm a')}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: 'grey.100' }}>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {msg.message}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )) : (
          <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>No messages found.</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ViewMessagesPage;