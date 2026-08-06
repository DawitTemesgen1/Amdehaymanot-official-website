import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, CssBaseline, AppBar, Tabs, Tab } from '@mui/material';
import { NavLink, Outlet, useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';

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
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';

const drawerWidth = 240;

const websiteMenuItems = [
  { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { text: 'Manage Posts', path: '/admin/posts', icon: <ArticleIcon /> },
  { text: 'Manage Events', path: '/admin/events', icon: <EventIcon /> },
  { text: 'Manage Courses', path: '/admin/courses', icon: <SchoolIcon /> },
  { text: 'Manage Albums', path: '/admin/albums', icon: <PhotoLibraryIcon /> },
  { text: 'Gallery Categories', path: '/admin/gallery-categories', icon: <CategoryIcon /> },
  { text: 'View Messages', path: '/admin/messages', icon: <EmailIcon /> },
  { text: 'Subscribers', path: '/admin/subscribers', icon: <SubscriptionsIcon /> },
  { text: 'Manage Users', path: '/admin/users', icon: <GroupIcon /> },
];

const appMenuItems = [
  { text: 'App Dashboard', path: '/admin/app-dashboard', icon: <AppShortcutIcon /> },
  { text: 'Mezmur Categories', path: '/admin/mezmur-categories', icon: <CategoryIcon /> },
  { text: 'Mezmurs Manager', path: '/admin/mezmurs', icon: <LibraryMusicIcon /> },
  { text: 'Mezmur Submissions', path: '/admin/submissions', icon: <UploadFileIcon /> },
  { text: 'Bulk Operations', path: '/admin/bulk-mezmurs', icon: <UploadFileIcon /> },
  { text: 'Push Notifications', path: '/admin/push-notifications', icon: <NotificationsActiveIcon /> },
  { text: 'App Releases', path: '/admin/app', icon: <PhoneAndroidIcon /> },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on current path
  const isAppRoute = location.pathname.startsWith('/admin/app') || location.pathname.startsWith('/admin/mezmurs') || location.pathname.startsWith('/admin/bulk-mezmurs') || location.pathname.startsWith('/admin/push-notifications') || location.pathname.startsWith('/admin/mezmur-categories') || location.pathname.startsWith('/admin/submissions') || location.pathname.startsWith('/admin/app-dashboard');
  const [activeTab, setActiveTab] = useState(isAppRoute ? 1 : 0);

  useEffect(() => {
    setActiveTab(isAppRoute ? 1 : 0);
  }, [isAppRoute]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/app-dashboard');
    }
  };

  const currentMenuItems = activeTab === 0 ? websiteMenuItems : appMenuItems;

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {currentMenuItems.map((item) => (
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
          <Typography variant="h6" noWrap component="div" sx={{ width: drawerWidth - 24, flexShrink: 0 }}>
            Admin Panel
          </Typography>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ ml: 4 }}
          >
            <Tab icon={<LanguageIcon />} iconPosition="start" label="Website Management" />
            <Tab icon={<PhoneAndroidIcon />} iconPosition="start" label="Mobile App Management" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
          borderRight: '1px solid',
          borderColor: 'primary.main',
          '& .MuiListItemIcon-root': { color: 'secondary.main' },
          '& .MuiListItemButton-root.Mui-selected': {
            bgcolor: 'primary.main',
            borderLeft: '3px solid',
            borderColor: 'secondary.main',
          },
        },
      }}>
        {drawerContent}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.paper', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;