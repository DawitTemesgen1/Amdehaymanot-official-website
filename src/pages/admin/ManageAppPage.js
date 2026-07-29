import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { 
    Typography, Paper, Box, Button, TextField, CircularProgress, Grid, 
    Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Tooltip, Dialog, 
    DialogTitle, DialogContent, DialogContentText, DialogActions 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import api from '../../api/axiosConfig';

const ManageAppPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formState, setFormState] = useState({
        id: null,
        version: '',
        platform: 'Android',
        architecture: 'arm64-v8a',
        notes: ''
    });
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [buildToDelete, setBuildToDelete] = useState(null);

    const fetchBuilds = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/app/builds');
            setBuilds(res.data);
        } catch (error) {
            enqueueSnackbar('Failed to fetch app builds.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchBuilds();
    }, [fetchBuilds]);

    const handleFormChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const resetForm = () => {
        setFormState({ id: null, version: '', platform: 'Android', architecture: 'arm64-v8a', notes: '' });
        setFile(null);
        if (document.getElementById('app-file-input')) {
            document.getElementById('app-file-input').value = null;
        }
    };

    const handleEditClick = (build) => {
        setFormState({
            id: build.id,
            version: build.version,
            platform: build.platform,
            architecture: build.architecture,
            notes: build.notes || ''
        });
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // File is only required if we are creating a new build
        if (!formState.id && !file) {
            enqueueSnackbar('An .apk file is required for a new build.', { variant: 'warning' });
            return;
        }
        if (!formState.version || !formState.architecture) {
            enqueueSnackbar('Version and Architecture are required.', { variant: 'warning' });
            return;
        }

        setSubmitting(true);
        const uploadData = new FormData();
        Object.keys(formState).forEach(key => {
            if (formState[key] !== null) uploadData.append(key, formState[key]);
        });
        if (file) {
            uploadData.append('appfile', file);
        }

        try {
            const url = formState.id ? `/app/builds/${formState.id}` : '/app/upload';
            const method = formState.id ? 'put' : 'post';

            const res = await api[method](url, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            enqueueSnackbar(res.data.message || 'Action successful!', { variant: 'success' });
            resetForm();
            fetchBuilds();
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'An error occurred.', { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (build) => {
        setBuildToDelete(build);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!buildToDelete) return;
        try {
            await api.delete(`/app/builds/${buildToDelete.id}`);
            enqueueSnackbar('Build deleted successfully!', { variant: 'success' });
            fetchBuilds();
        } catch (error) {
            enqueueSnackbar('Failed to delete build.', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setBuildToDelete(null);
        }
    };

    return (
        <Grid container spacing={4}>
            {/* Form Section */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom>{formState.id ? 'Update App Build' : 'Upload New App Build'}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        {formState.id ? `You are editing the build for ${formState.architecture}. Uploading a new file will replace the old one.` : 'Upload a new version of the app. This will replace any existing build for the same architecture.'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField name="version" label="Version (e.g., 1.0.1)" value={formState.version} onChange={handleFormChange} fullWidth required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>CPU Architecture</InputLabel>
                                    <Select name="architecture" value={formState.architecture} label="CPU Architecture" onChange={handleFormChange} disabled={!!formState.id}>
                                        <MenuItem value="arm64-v8a">arm64-v8a (Most modern phones)</MenuItem>
                                        <MenuItem value="armeabi-v7a">armeabi-v7a (Older 32-bit phones)</MenuItem>
                                        <MenuItem value="x86_64">x86_64 (Emulators/some devices)</MenuItem>
                                        <MenuItem value="x86">x86 (Older emulators)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}><TextField name="notes" label="Release Notes (Optional)" value={formState.notes} onChange={handleFormChange} fullWidth multiline rows={3} /></Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" component="label" fullWidth>
                                    {formState.id ? 'Upload New .apk to Replace' : 'Select .apk File'}
                                    <input id="app-file-input" type="file" hidden accept=".apk" onChange={handleFileChange} />
                                </Button>
                                {file && <Typography sx={{ mt: 1, color: 'success.main' }}>Selected: {file.name}</Typography>}
                            </Grid>
                            <Grid item xs={12} container spacing={2} alignItems="center">
                                <Grid item><Button type="submit" variant="contained" size="large" disabled={submitting}>{submitting ? <CircularProgress size={24} color="inherit" /> : (formState.id ? 'Update Build' : 'Upload Build')}</Button></Grid>
                                {formState.id && <Grid item><Button variant="text" onClick={resetForm}>Cancel Edit</Button></Grid>}
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>

            {/* List Section */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom>Current App Builds</Typography>
                    {loading ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> :
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Version</TableCell>
                                    <TableCell>Architecture</TableCell>
                                    <TableCell>Last Updated</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {builds.map((build) => (
                                    <TableRow key={build.id} hover>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{build.version}</TableCell>
                                        <TableCell>{build.architecture}</TableCell>
                                        <TableCell>
                                            {/* --- FIX IS HERE: Check if the date exists before formatting --- */}
                                            {build.uploadedAt ? format(new Date(build.uploadedAt), 'MMM d, yyyy, h:mm a') : 'N/A'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit Info"><IconButton onClick={() => handleEditClick(build)}><EditIcon /></IconButton></Tooltip>
                                            <Tooltip title="Delete Build"><IconButton onClick={() => handleDeleteClick(build)}><DeleteIcon /></IconButton></Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    }
                </Paper>
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent><DialogContentText>Are you sure you want to delete the build for "{buildToDelete?.architecture}" (v{buildToDelete?.version})? This action cannot be undone.</DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default ManageAppPage;