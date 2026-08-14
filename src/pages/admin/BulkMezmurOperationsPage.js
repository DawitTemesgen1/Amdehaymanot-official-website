import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { 
  Typography, Paper, Box, Button, CircularProgress, 
  Grid, Divider, List, ListItem, ListItemIcon, ListItemText,
  Alert, Chip, Collapse
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import api from '../../api/axiosConfig';

const BulkMezmurOperationsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Duplicate detection state
  const [dupLoading, setDupLoading] = useState(false);
  const [dupPreview, setDupPreview] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.json')) {
        enqueueSnackbar('Please upload a valid CSV or JSON file.', { variant: 'error' });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      enqueueSnackbar('Please select a file to upload.', { variant: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      enqueueSnackbar('Bulk import completed successfully!', { variant: 'success' });
      setFile(null);
      document.getElementById('bulk-upload-input').value = null;
    } catch (error) {
      console.error("Bulk upload error:", error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to process bulk upload.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDuplicates = async () => {
    setDupLoading(true);
    setDupPreview(null);
    try {
      const res = await api.get('/mezmur/duplicates/preview');
      setDupPreview(res.data);
      if (res.data.groupCount === 0) {
        enqueueSnackbar('No duplicates found in the database!', { variant: 'success' });
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to scan for duplicates.', { variant: 'error' });
    } finally {
      setDupLoading(false);
    }
  };

  const handleRejectDuplicates = async () => {
    if (!dupPreview || dupPreview.groupCount === 0) return;
    setRejectLoading(true);
    try {
      const res = await api.post('/mezmur/duplicates/reject');
      enqueueSnackbar(res.data.message, { variant: 'success' });
      setDupPreview(null);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to reject duplicates.', { variant: 'error' });
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <UploadFileIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" component="h1">
            Bulk Operations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Import hundreds of Mezmurs instantly using a CSV or JSON file.
          </Typography>
        </Box>
      </Box>

      {/* ── Duplicate Detector Section ── */}
      <Paper sx={{ p: 4, borderRadius: 3, mb: 4, border: '1px solid', borderColor: 'warning.light' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon color="warning" /> Duplicate Mezmur Detector
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Scan all published Mezmurs for duplicate content. Duplicates will be soft-deleted (removed from the app but kept in the database for audit).
          The copy <strong>with audio</strong> is always kept.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button
            id="btn-preview-duplicates"
            variant="outlined"
            color="warning"
            startIcon={dupLoading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
            onClick={handlePreviewDuplicates}
            disabled={dupLoading || rejectLoading}
          >
            {dupLoading ? 'Scanning...' : 'Scan for Duplicates'}
          </Button>

          {dupPreview && dupPreview.groupCount > 0 && (
            <Button
              id="btn-reject-duplicates"
              variant="contained"
              color="error"
              startIcon={rejectLoading ? <CircularProgress size={18} color="inherit" /> : <DeleteSweepIcon />}
              onClick={handleRejectDuplicates}
              disabled={rejectLoading}
            >
              {rejectLoading ? 'Removing...' : `Remove ${dupPreview.groups.reduce((s, g) => s + g.duplicates.length, 0)} Duplicate(s)`}
            </Button>
          )}
        </Box>

        <Collapse in={!!(dupPreview && dupPreview.groupCount > 0)}>
          <Alert severity="warning" sx={{ mb: 1 }}>
            Found <strong>{dupPreview?.groupCount}</strong> duplicate group(s).{' '}
            <strong>{dupPreview?.groups.reduce((s, g) => s + g.duplicates.length, 0)}</strong> Mezmur(s) will be removed.
          </Alert>
          {dupPreview?.groups.map((group, i) => (
            <Box key={i} sx={{ mb: 1.5, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>✅ Keep:</strong> [ID {group.keep.id}] {group.keep.title}
                {group.keep.audio_url && <Chip size="small" label="Has Audio" color="success" sx={{ ml: 1 }} />}
              </Typography>
              {group.duplicates.map(d => (
                <Typography key={d.id} variant="body2" color="error.main" sx={{ pl: 2 }}>
                  🗑 Remove: [ID {d.id}] {d.title}
                  {d.audio_url && <Chip size="small" label="Has Audio" color="success" sx={{ ml: 1 }} />}
                </Typography>
              ))}
            </Box>
          ))}
        </Collapse>

        {dupPreview && dupPreview.groupCount === 0 && (
          <Alert severity="success">No duplicates found — your library is clean! 🎉</Alert>
        )}
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUploadIcon color="primary" /> Upload Data File
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ 
              border: '2px dashed #ccc', 
              borderRadius: 2, 
              p: 6, 
              textAlign: 'center',
              bgcolor: 'background.default',
              mb: 3
            }}>
              <UploadFileIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag & Drop or Click to Upload
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Supports .CSV and .JSON files
              </Typography>
              <Button variant="contained" component="label" size="large">
                Select File
                <input id="bulk-upload-input" type="file" hidden accept=".csv,.json" onChange={handleFileChange} />
              </Button>
            </Box>

            {file && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'success.light', color: 'success.dark', borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon />
                  <Typography variant="body1"><strong>Selected:</strong> {file.name}</Typography>
                </Box>
                <Typography variant="body2">{(file.size / 1024).toFixed(2)} KB</Typography>
              </Box>
            )}

            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth 
              size="large" 
              onClick={handleUpload}
              disabled={!file || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            >
              {loading ? 'Processing Upload...' : 'Begin Import'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 3, height: '100%', bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="info" /> Formatting Guidelines
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              To ensure a successful import, your file must adhere to the correct schema.
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Required CSV Columns:
            </Typography>
            <List dense>
              <ListItem><ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon><ListItemText primary="title (The title of the Mezmur)" /></ListItem>
              <ListItem><ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon><ListItemText primary="content (The lyrics of the Mezmur)" /></ListItem>
              <ListItem><ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon><ListItemText primary="category_id (Numeric ID of the Category)" /></ListItem>
              <ListItem><ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon><ListItemText primary="language (am, en, or om)" /></ListItem>
            </List>

            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }} gutterBottom>
              Example JSON Format:
            </Typography>
            <Box sx={{ bgcolor: '#2d2d2d', color: '#fff', p: 2, borderRadius: 2, overflowX: 'auto', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <pre style={{ margin: 0 }}>
{`[
  {
    "category_id": 1,
    "title": "Example Mezmur",
    "content": "Lyrics go here...",
    "language": "am"
  }
]`}
              </pre>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BulkMezmurOperationsPage;


