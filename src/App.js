import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

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
import GalleryPage from './pages/GalleryPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import ClassesPage from './pages/ClassesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CourseDetailPage from './pages/CourseDetailPage';
import DownloadAppPage from './pages/DownloadAppPage'; // Import the new page


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
        <Box sx={{ paddingTop: isAdminRoute ? 0 : isMobile ? '64px' : '82px' }}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage language={language} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
            <Route path="/news-and-events" element={<NewsAndEventsPage language={language} />} />
            <Route path="/news-and-events/:articleId" element={<ArticleDetailPage language={language} />} />
            <Route path="/gallery" element={<GalleryPage language={language} />} />
            <Route path="/gallery/album/:albumId" element={<AlbumDetailPage language={language} />} />
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

function App() {
  return (
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
}

export default App;