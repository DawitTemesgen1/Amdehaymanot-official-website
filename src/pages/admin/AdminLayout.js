import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, CssBaseline, AppBar } from '@mui/material';
import { NavLink, Outlet, useLocation, Link as RouterLink } from 'react-router-dom';

// --- Icon Imports ---
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from '@mui/icons-material/Email';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'; // <-- IMPORT THE NEW ICON

const drawerWidth = 240;

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Posts', path: '/admin/posts', icon: <ArticleIcon /> },
    { text: 'Manage Events', path: '/admin/events', icon: <EventIcon /> },
    { text: 'Manage Courses', path: '/admin/courses', icon: <SchoolIcon /> },
    { text: 'Manage Albums', path: '/admin/albums', icon: <PhotoLibraryIcon /> },
    { text: 'Gallery Categories', path: '/admin/gallery-categories', icon: <CategoryIcon /> },
    { text: 'View Messages', path: '/admin/messages', icon: <EmailIcon /> },
    { text: 'Subscribers', path: '/admin/subscribers', icon: <SubscriptionsIcon /> },
    { text: 'Manage Users', path: '/admin/users', icon: <GroupIcon /> },
    // --- THIS IS THE FIX: ADD THE NEW LINK HERE ---
    { text: 'Manage App', path: '/admin/app', icon: <PhoneAndroidIcon /> },
  ];

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={location.pathname.startsWith(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
           <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/">
                  <ListItemIcon><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Back to Public Site" />
              </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'primary.dark' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">Admin Panel</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        {drawerContent}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'grey.100', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;