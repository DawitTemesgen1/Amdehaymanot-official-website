import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Box, Chip } from '@mui/material';
import api from '../../api/axiosConfig';
import { useSnackbar } from 'notistack';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            enqueueSnackbar('Could not fetch users. Ensure you are logged in as an admin.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

        try {
            await api.put(`/auth/users/${userId}/promote`, { role: newRole });
            enqueueSnackbar('User role updated successfully!', { variant: 'success' });
            fetchUsers(); // Refetch all users to show the change
        } catch (error) {
            console.error("Failed to update user role", error);
            enqueueSnackbar('Failed to update user role.', { variant: 'error' });
        }
    };

    const getRoleChipColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'error';
            case 'TEACHER': return 'primary';
            default: return 'default';
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" sx={{ p: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, p: 0 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>Manage Users</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={user.role} 
                                        color={getRoleChipColor(user.role)}
                                        size="small"
                                        sx={{ textTransform: 'capitalize' }}
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.role === 'USER' && (
                                            <Button variant="outlined" size="small" onClick={() => handleRoleChange(user.id, 'TEACHER')}>
                                                Promote to Teacher
                                            </Button>
                                        )}
                                        {user.role === 'TEACHER' && (
                                            <Button variant="outlined" size="small" color="secondary" onClick={() => handleRoleChange(user.id, 'USER')}>
                                                Demote to User
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default ManageUsersPage;