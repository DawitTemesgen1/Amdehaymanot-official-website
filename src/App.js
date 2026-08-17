import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { GoogleOAuthProvider } from '@react-oauth/google';

// --- CORE APP SETUP ---
import theme from './theme';
import { AuthProvider } from './context/AuthContext';

// --- LAYOUT COMPONENTS ---
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// --- PUBLIC PAGE COMPONENTS ---
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NewsAndEventsPage from './pages/NewsAndEventsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import EventDetailPage from './pages/EventDetailPage';
import GalleryPage from './pages/GalleryPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import ClassesPage from './pages/ClassesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CourseDetailPage from './pages/CourseDetailPage';
import DownloadAppPage from './pages/DownloadAppPage'; // Import the new page
import MediaAndTechPage from './pages/MediaAndTechPage';


// --- ADMIN COMPONENTS ---
import ProtectedRoute from './pages/admin/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManagePostsPage from './pages/admin/ManagePostsPage';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import ManageCoursesPage from './pages/admin/ManageCoursesPage';
import ManageCourseVideosPage from './pages/admin/ManageCourseVideosPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ViewMessagesPage from './pages/admin/ViewMessagesPage';
import SubscribersPage from './pages/admin/SubscribersPage';
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage';
import ManageAlbumsPage from './pages/admin/ManageAlbumsPage';
import ManageAlbumPhotosPage from './pages/admin/ManageAlbumPhotosPage';
import ManageAppPage from './pages/admin/ManageAppPage'; 
import ManageMezmursPage from './pages/admin/ManageMezmursPage';
import AppDashboardPage from './pages/admin/AppDashboardPage';
import ManageMezmurCategoriesPage from './pages/admin/ManageMezmurCategoriesPage';
import ManagePushNotificationsPage from './pages/admin/ManagePushNotificationsPage';
import BulkMezmurOperationsPage from './pages/admin/BulkMezmurOperationsPage';
import ManageSubmissionsPage from './pages/admin/ManageSubmissionsPage';
import ReactGA from 'react-ga4';

const TRACKING_ID = "G-X8T7HKZV97";
ReactGA.initialize(TRACKING_ID);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const muiTheme = useTheme();
  // --- THIS IS THE FIX ---
  // Changed 'mui-theme' to 'muiTheme' to match the variable name
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const location = useLocation();
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'en');

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  const handleLanguageChange = (lang) => {
    localStorage.setItem('appLanguage', lang);
    setLanguage(lang);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');
  // Mobile: bottom logo nav — no top offset, reserve space at bottom for the FAB.
  // Desktop: top AppBar offset.
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: !isAdminRoute && isMobile ? '96px' : 0,
      }}
    >
      
      {!isAdminRoute && <Navbar language={language} onLanguageChange={handleLanguageChange} />}
      
      <main style={{ flexGrow: 1 }}>
        <Box sx={{ paddingTop: isAdminRoute ? 0 : isMobile ? '72px' : '96px' }}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage language={language} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
            <Route path="/news-and-events" element={<NewsAndEventsPage language={language} />} />
            <Route path="/news-and-events/event/:eventId" element={<EventDetailPage language={language} />} />
            <Route path="/news-and-events/:articleId" element={<ArticleDetailPage language={language} />} />
            <Route path="/gallery" element={<GalleryPage language={language} />} />
            <Route path="/gallery/album/:albumId" element={<AlbumDetailPage language={language} />} />
            <Route path="/media-and-tech" element={<MediaAndTechPage language={language} />} />
            <Route path="/classes" element={<ClassesPage language={language} />} />
            <Route path="/contact" element={<ContactPage language={language} />} />
            <Route path="/register" element={<RegisterPage language={language} />} />
            <Route path="/login" element={<LoginPage language={language} />} />
              <Route path="/download" element={<DownloadAppPage language={language} />} />

            <Route path="/classes/course/:courseId" element={<CourseDetailPage language={language} />} />
            
            {/* USER DASHBOARD (PROTECTED) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage language={language} />} />
            </Route>

            {/* ADMIN ROUTES (PROTECTED AND ADMIN-ONLY) */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="posts" element={<ManagePostsPage />} />
                <Route path="events" element={<ManageEventsPage />} />
                  <Route path="app" element={<ManageAppPage />} />
                <Route path="courses" element={<ManageCoursesPage />} />
                <Route path="courses/:courseId/videos" element={<ManageCourseVideosPage />} />
                <Route path="users" element={<ManageUsersPage />} />
                <Route path="messages" element={<ViewMessagesPage />} />
                <Route path="subscribers" element={<SubscribersPage />} />
                <Route path="gallery-categories" element={<ManageCategoriesPage />} />
                <Route path="albums" element={<ManageAlbumsPage />} />
                <Route path="albums/:albumId/photos" element={<ManageAlbumPhotosPage />} />
                
                {/* App Management Routes */}
                <Route path="app-dashboard" element={<AppDashboardPage />} />
                <Route path="mezmur-categories" element={<ManageMezmurCategoriesPage />} />
                <Route path="mezmurs" element={<ManageMezmursPage />} />
                <Route path="submissions" element={<ManageSubmissionsPage />} />
                <Route path="push-notifications" element={<ManagePushNotificationsPage />} />
                <Route path="bulk-mezmurs" element={<BulkMezmurOperationsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </main>
      
      {!isAdminRoute && <Footer language={language} />}
    </Box>
  );
};

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function App() {
  const appTree = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Router>
          <AuthProvider>
            <ScrollToTop />
            <AppContent />
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );

  // Provider is required for the Google button; pages show a clear warning if unset.
  if (!googleClientId) {
    return appTree;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {appTree}
    </GoogleOAuthProvider>
  );
}

export default App;