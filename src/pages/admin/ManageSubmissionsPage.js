import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { submissionApi } from '../../api/submissionApi';
import { mezmurApi } from '../../api/mezmurApi';

const ManageSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [submissionsRes, categoriesRes] = await Promise.all([
        submissionApi.getSubmissions('pending'),
        mezmurApi.getCategories()
      ]);
      setSubmissions(submissionsRes.data.data || []);
      setCategories(categoriesRes.data.data || categoriesRes.data || []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      enqueueSnackbar(error.response?.data?.error || 'Failed to fetch submissions.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (submission) => {
    try {
      // Find matching category ID or use 1
      let category_id = 1;
      const aiMetadata = typeof submission.ai_metadata === 'string' 
        ? JSON.parse(submission.ai_metadata) 
        : (submission.ai_metadata || {});
      
      const suggestedCategory = aiMetadata.category || '';
      const matchedCat = categories.find(c => 
        c.title_am === suggestedCategory || 
        c.title_en?.toLowerCase() === suggestedCategory.toLowerCase()
      );
      if (matchedCat) {
        category_id = matchedCat.id;
      }

      await submissionApi.approveSubmission(submission.id, {
        category_id,
        title: aiMetadata.title || 'Untitled Mezmur',
        lyrics: submission.lyrics || aiMetadata.formatted_lyrics || ''
      });
      enqueueSnackbar('Submission approved successfully!', { variant: 'success' });
      fetchData();
    } catch (error) {
      console.error("Approve error:", error);
      enqueueSnackbar(error.response?.data?.error || 'Failed to approve submission.', { variant: 'error' });
    }
  };

  const handleReject = async (submission) => {
    if (!window.confirm('Are you sure you want to reject this submission?')) return;
    try {
      await submissionApi.rejectSubmission(submission.id);
      enqueueSnackbar('Submission rejected.', { variant: 'info' });
      fetchData();
    } catch (error) {
      console.error("Reject error:", error);
      enqueueSnackbar(error.response?.data?.error || 'Failed to reject submission.', { variant: 'error' });
    }
  };

  const parseAiMeta = (str) => {
    if (!str) return {};
    if (typeof str === 'object') return str;
    try { return JSON.parse(str); } catch (e) { return {}; }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Pending Telegram Submissions</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Suggested Title & Category</TableCell>
                <TableCell>Lyrics Snippet</TableCell>
                <TableCell>Audio Output</TableCell>
                <TableCell>Warnings</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((sub) => {
                const ai = parseAiMeta(sub.ai_metadata);
                return (
                  <TableRow key={sub.id} hover>
                    <TableCell>{sub.id}</TableCell>
                    <TableCell>
                      <strong>{ai.title || 'Untitled'}</strong><br />
                      <Typography variant="caption" color="text.secondary">
                        {ai.category || 'Unknown Category'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sub.lyrics || ai.formatted_lyrics || 'No text provided'}
                    </TableCell>
                    <TableCell>
                      {sub.m4a_audio ? <a href={sub.m4a_audio} target="_blank" rel="noreferrer">Play M4A</a> : 'No Audio'}
                    </TableCell>
                    <TableCell>
                      {sub.duplicate_of && (
                        <Alert severity="warning" sx={{ py: 0, px: 1 }}>
                          Possible duplicate of #{sub.duplicate_of}
                        </Alert>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />} 
                        onClick={() => handleApprove(sub)}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<CancelIcon />} 
                        onClick={() => handleReject(sub)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {submissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No pending submissions.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};
export default ManageSubmissionsPage;
