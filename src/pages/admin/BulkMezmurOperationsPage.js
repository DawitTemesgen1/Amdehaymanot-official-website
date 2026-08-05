import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { 
  Typography, Paper, Box, Button, CircularProgress, 
  Grid, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BulkMezmurOperationsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // Create FormData to send the file to the backend
      // const formData = new FormData();
      // formData.append('file', file);
      // await api.post('/mezmur/bulk-upload', formData);

      // Simulating network delay for UI mockup
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
