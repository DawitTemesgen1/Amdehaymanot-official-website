import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Tabs, Tab } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { submissionApi } from '../../api/submissionApi';
import { mezmurApi } from '../../api/mezmurApi';

const ManageSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editLyrics, setEditLyrics] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let status = 'pending';
      if (tabIndex === 2) status = 'rejected';
      if (tabIndex === 3) status = 'approved';

      const [submissionsRes, categoriesRes] = await Promise.all([
        submissionApi.getSubmissions(status),
        mezmurApi.getCategories()
      ]);
      
      let filteredSubmissions = submissionsRes.data.data || [];
      if (tabIndex === 0) {
        // Pending New
        filteredSubmissions = filteredSubmissions.filter(s => !s.duplicate_of);
      } else if (tabIndex === 1) {
        // Pending Edits
        filteredSubmissions = filteredSubmissions.filter(s => s.duplicate_of);
      }
      
      setSubmissions(filteredSubmissions);
      setCategories(categoriesRes.data.data || categoriesRes.data || []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      enqueueSnackbar(error.response?.data?.error || 'Failed to fetch submissions.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, tabIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openReviewModal = (submission) => {
    // Parse AI metadata
    const aiMetadata = typeof submission.ai_metadata === 'string' 
      ? JSON.parse(submission.ai_metadata) 
      : (submission.ai_metadata || {});
    
    // Find matching category ID or use 1
    let category_id = 1;
    const suggestedCategory = aiMetadata.category || '';
    const matchedCat = categories.find(c => 
      c.title_am?.trim() === suggestedCategory.trim() || 
      c.title_om?.trim() === suggestedCategory.trim() ||
      c.title_en?.trim().toLowerCase() === suggestedCategory.trim().toLowerCase()
    );
    if (matchedCat) {
      category_id = matchedCat.id;
    }

    setEditTitle(aiMetadata.title || 'Untitled Mezmur');
    setEditCategoryId(category_id);
    setEditLyrics(submission.lyrics || aiMetadata.formatted_lyrics || '');
    setSelectedSubmission(submission);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedSubmission(null);
  };

  const submitApproval = async () => {
    if (!selectedSubmission) return;
    setIsApproving(true);
    try {
      await submissionApi.approveSubmission(selectedSubmission.id, {
        category_id: editCategoryId,
        title: editTitle,
        lyrics: editLyrics
      });
      enqueueSnackbar('Submission approved successfully!', { variant: 'success' });
      closeReviewModal();
      fetchData();
    } catch (error) {
      console.error("Approve error:", error);
      enqueueSnackbar(error.response?.data?.error || 'Failed to approve submission.', { variant: 'error' });
    } finally {
      setIsApproving(false);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Telegram Submissions</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)}>
          <Tab label="Pending New" />
          <Tab label="Pending Edits" />
          <Tab label="Rejected (Archive)" />
          <Tab label="Approved (Audit Log)" />
        </Tabs>
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
                <TableCell>Warnings / Edits</TableCell>
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
                      {sub.m4a_audio ? (
                        <audio controls src={sub.m4a_audio} style={{ width: '200px', height: '30px' }} />
                      ) : 'No Audio'}
                    </TableCell>
                    <TableCell>
                      {sub.duplicate_of && (
                        <Alert severity="info" sx={{ py: 0, px: 1 }}>
                          Editing target ID: #{sub.duplicate_of}
                        </Alert>
                      )}
                    </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        {(tabIndex === 0 || tabIndex === 1) ? (
                          <>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="primary" 
                              onClick={() => openReviewModal(sub)}
                              sx={{ mr: 1 }}
                            >
                              Review
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
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {tabIndex === 2 ? 'Rejected' : 'Approved'}
                          </Typography>
                        )}
                      </TableCell>
                  </TableRow>
                );
              })}
              {submissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No {tabIndex === 2 ? 'rejected' : tabIndex === 3 ? 'approved' : 'pending'} submissions.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Review & Edit Modal */}
      <Dialog open={reviewModalOpen} onClose={closeReviewModal} maxWidth="md" fullWidth>
        <DialogTitle>Review Submission</DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              {selectedSubmission.m4a_audio && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Listen to Audio</Typography>
                  <audio controls src={selectedSubmission.m4a_audio} style={{ width: '100%' }} />
                </Box>
              )}
              
              <TextField 
                label="Title" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                fullWidth 
              />
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editCategoryId}
                  label="Category"
                  onChange={(e) => setEditCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {(c.title_am?.trim() || c.title_om?.trim() || c.title_en?.trim())} {(c.title_am?.trim() && c.title_en?.trim()) ? `(${c.title_en})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField 
                label="Lyrics" 
                value={editLyrics} 
                onChange={(e) => setEditLyrics(e.target.value)} 
                multiline 
                minRows={6} 
                fullWidth 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviewModal} color="inherit">Cancel</Button>
          <Button 
            onClick={submitApproval} 
            color="success" 
            variant="contained" 
            disabled={isApproving}
            startIcon={<CheckCircleIcon />}
          >
            {isApproving ? 'Approving...' : 'Approve & Publish'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
export default ManageSubmissionsPage;
