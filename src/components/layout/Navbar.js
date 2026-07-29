import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Avatar, Box,
  styled, useTheme, useMediaQuery, Menu, MenuItem, Fade,
  Select, FormControl, alpha, Divider
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion';

const translations = {
    en: { home: 'Home', about: 'About', gallery: 'Gallery', classes: 'Classes', contact: 'Contact', login: 'Login', register: 'Register', dashboard: 'Dashboard', logout: 'Logout', appName: 'Amdehayimanot Sunday School', newsAndEvents: 'News & Events', adminPanel: 'Admin Panel' },
    am: { home: 'መነሻ', about: 'ስለ እኛ', gallery: 'ጋለሪ', classes: 'ትምህርቶች', contact: 'ያግኙን', login: 'ይግቡ', register: 'ይመዝገቡ', dashboard: 'ዳሽቦርድ', logout: 'ውጣ', appName: 'ዓምደሃይማኖት ሰንበት ትምህርት ቤት', newsAndEvents: 'ዜና እና ክስተቶች', adminPanel: 'የአስተዳዳሪ ፓነል' },
    om: { home: 'Fuula Jalqabaa', about: 'Waa\'ee Keenya', gallery: 'Kuusaa Suuraa', classes: 'Barnoota', contact: 'Nu Qunnamaa', login: 'Seeni', register: 'Galmaahi', dashboard: 'Daashboordii', logout: 'Bahi', appName: 'Mana Barnootaa Dilbataa Amdehayimanot', newsAndEvents: 'Oduu fi Taateewwan', adminPanel: 'Paaneelii Bulchaa' },
    ti: { home: 'መበገሲ', about: 'ብዛዕባና', gallery: 'መአከቢ ስእሊ', classes: 'ክፍልታት', contact: 'ይርከቡና', login: 'እቶ', register: 'ተመዝገብ', dashboard: 'ዳሽቦርድ', logout: 'ውጻእ', appName: 'ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት', newsAndEvents: 'ዜናን ፍጻመታትን', adminPanel: 'መቆጻጸሪ ፓነል' },
    ge: { home: 'አርእስት', about: 'ስለ አነ', gallery: 'ማዕከለ ስእል', classes: 'ክፍለ ፡ ትምህርት', contact: 'ንረክብ', login: 'ግባእ', register: 'ተመዝገብ', dashboard: 'ዳሽቦርድ', logout: 'ውጻእ', appName: 'ቤተ ፡ ትምህርት ፡ ሰንበት ፡ አምደሃይማኖት', newsAndEvents: 'ዜና ወምክንያት', adminPanel: 'አስተዳደር' },
    es: { home: 'Inicio', about: 'Sobre nosotros', gallery: 'Galería', classes: 'Clases', contact: 'Contacto', login: 'Iniciar sesión', register: 'Registrarse', dashboard: 'Panel', logout: 'Cerrar sesión', appName: 'Escuela Dominical Amdehayimanot', newsAndEvents: 'Noticias y Eventos', adminPanel: 'Panel de Administrador' },
    fr: { home: 'Accueil', about: 'À propos', gallery: 'Galerie', classes: 'Cours', contact: 'Contact', login: 'Connexion', register: 'S\'inscrire', dashboard: 'Tableau de bord', logout: 'Déconnexion', appName: 'École du Dimanche Amdehayimanot', newsAndEvents: 'Actualités et Événements', adminPanel: 'Panneau d\'administration' },
    ar: { home: 'الصفحة الرئيسية', about: 'معلومات عنا', gallery: 'صالة عرض', classes: 'الطبقات', contact: 'اتصل', login: 'تسجيل الدخول', register: 'يسجل', dashboard: 'لوحة القيادة', logout: 'خروج', appName: 'مدرسة الأحد أمدهيمانوت', newsAndEvents: 'الأخبار و الأحداث', adminPanel: 'لوحة الادارة' }
};

// --- Your Original Styled Components ---
const StyledAppBar = styled(AppBar)(({ theme }) => ({ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, boxShadow: theme.shadows[3] }));
const NavButton = styled(Button)(({ theme }) => ({ fontWeight: 600, textTransform: 'none', margin: '0 8px', padding: '8px 16px', fontSize: '1rem', color: 'inherit', position: 'relative', overflow: 'hidden', '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.1) } }));
const LogoImage = styled(motion.img)({ height: '50px', marginRight: '15px' });
const RegisterButton = styled(Button)(({ theme }) => ({ marginLeft: '10px', fontWeight: 'bold', borderRadius: '20px', boxShadow: `0px 4px 15px -5px ${alpha(theme.palette.secondary.dark, 0.7)}`, transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover': { transform: 'scale(1.05)', boxShadow: `0px 6px 20px -5px ${alpha(theme.palette.secondary.dark, 0.9)}` } }));
const ScrollContainer = styled(Box)({ display: 'flex', overflowX: 'auto', padding: '8px 16px', borderTop: `1px solid ${alpha('#FFFFFF', 0.2)}`, '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none' });
const MobileNavLink = styled(RouterLink)(({ theme }) => ({ color: alpha(theme.palette.common.white, 0.8), padding: '8px 12px', textDecoration: 'none', textAlign: 'center', flexShrink: 0, position: 'relative', transition: 'color 0.3s ease', '&.active': { color: theme.palette.common.white, fontWeight: 'bold' } }));

const Navbar = ({ language, onLanguageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const t = translations[language] || translations.en;

  const navLinks = [
    { title: t.home, path: '/' }, { title: t.about, path: '/about' }, { title: t.newsAndEvents, path: '/news-and-events' }, { title: t.gallery, path: '/gallery' }, { title: t.classes, path: '/classes' }, { title: t.contact, path: '/contact' },
  ];

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { logout(); navigate('/'); handleMenuClose(); };
  
  const handleDropdownChange = (event) => {
    onLanguageChange(event.target.value);
  };

  const renderDesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;
        return ( 
          <NavButton key={link.title} component={RouterLink} to={link.path} color="inherit"> 
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>{link.title}</motion.div> 
            {isActive && <motion.div layoutId="desktop-underline" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: theme.palette.secondary.main, borderRadius: '2px' }} />} 
          </NavButton> 
        );
      })}
    </Box>
  );

  const renderAuthControls = () => {
    if (currentUser) {
      // --- FIX: This block now renders for both desktop and mobile if a user is logged in ---
      return (
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 'bold' }}>
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </Avatar>
          </IconButton>
        </motion.div>
      );
    }
    
    // This part now only renders if there is NO logged-in user
    if (isMobile) {
        return <RegisterButton variant="contained" color="secondary" size="small" component={RouterLink} to="/register">{t.register}</RegisterButton>
    }

    return (
        <>
            <NavButton component={RouterLink} to="/login" color="inherit">{t.login}</NavButton>
            <RegisterButton variant="contained" color="secondary" component={RouterLink} to="/register">{t.register}</RegisterButton>
        </>
    )
  }

  return (
    <>
      <AppBar position="fixed" component={StyledAppBar}>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 24px' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <LogoImage src={logo} alt="Logo" />
              {!isMobile && <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t.appName}</Typography>}
            </RouterLink>
          </motion.div>

          {!isMobile && <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{renderDesktopNav()}</Box>}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
              <Select value={language} onChange={handleDropdownChange} displayEmpty
                 sx={{ color: 'inherit', borderRadius: '20px', transition: 'all 0.3s ease', '.MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.common.white, 0.5) }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.common.white }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.secondary.main }, '& .MuiSelect-icon': { color: 'inherit' }, }}>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="am">Amharic</MenuItem>
                <MenuItem value="ti">Tigrinya</MenuItem>
                <MenuItem value="om">Afaan Oromoo</MenuItem>
                <MenuItem value="ge">Geez</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>
            {renderAuthControls()}
          </Box>
        </Toolbar>

        {isMobile && ( <ScrollContainer> {navLinks.map((link) => { const isActive = location.pathname === link.path; return ( <MobileNavLink key={link.title} to={link.path} className={isActive ? 'active' : ''}> {link.title} {isActive && <motion.div layoutId="mobile-underline" style={{ position: 'absolute', bottom: -5, left: 0, right: 0, height: '3px', background: theme.palette.secondary.main, borderRadius: '2px' }} />} </MobileNavLink> ); })} </ScrollContainer> )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} TransitionComponent={Fade}>
          {/* --- FIX: Check for 'ADMIN' (uppercase) --- */}
          {currentUser && currentUser.role === 'ADMIN' && (
            <Box>
              <MenuItem component={RouterLink} to="/admin" onClick={handleMenuClose}>{t.adminPanel}</MenuItem>
              <Divider />
            </Box>
          )}
          <MenuItem component={RouterLink} to="/dashboard" onClick={handleMenuClose}>{t.dashboard}</MenuItem>
          <MenuItem onClick={handleLogout}>{t.logout}</MenuItem>
        </Menu>
      </AppBar>
    </>
  );
};

export default Navbar;