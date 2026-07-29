import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

// The 'adminOnly' prop is the key to differentiating between a normal user and an admin
const ProtectedRoute = ({ adminOnly = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // --- FIX: If this route requires admin and the user is NOT an admin, redirect ---
  // The backend role is 'ADMIN' (uppercase).
  if (adminOnly && currentUser.role !== 'ADMIN') {
    // A regular logged-in user trying to access /admin will be sent to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If all checks pass, render the child route (e.g., <DashboardPage /> or <AdminLayout />)
  return <Outlet />;
};

export default ProtectedRoute;