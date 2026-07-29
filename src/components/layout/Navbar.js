import React, { useState, useEffect, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box,
  styled, useTheme, useMediaQuery, Menu, MenuItem, Fade,
  Select, FormControl, alpha, Divider, Backdrop,
} from '@mui/material';
import {
  HomeOutlined,
  InfoOutlined,
  NewspaperOutlined,
  PhotoLibraryOutlined,
  SchoolOutlined,
  MailOutlined,
  LoginOutlined,
  PersonAddAlt,
  DashboardOutlined,
  AdminPanelSettingsOutlined,
  LogoutOutlined,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import { brand } from '../../brand';

const translations = {
  en: { home: 'Home', about: 'About', gallery: 'Gallery', classes: 'Classes', contact: 'Contact', login: 'Login', register: 'Register', dashboard: 'Dashboard', logout: 'Logout', appName: 'Amdehayimanot', tagline: 'Sunday School', newsAndEvents: 'News', adminPanel: 'Admin', menu: 'Menu', language: 'Lang', tapLogo: 'Tap logo' },
  am: { home: 'መነሻ', about: 'ስለ እኛ', gallery: 'ጋለሪ', classes: 'ትምህርት', contact: 'ያግኙን', login: 'ይግቡ', register: 'ይመዝገቡ', dashboard: 'ዳሽቦርድ', logout: 'ውጣ', appName: 'ዓምደሃይማኖት', tagline: 'ሰንበት ትምህርት ቤት', newsAndEvents: 'ዜና', adminPanel: 'አስተዳዳሪ', menu: 'ምናሌ', language: 'ቋንቋ', tapLogo: 'ሎጎ ይንኩ' },
  om: { home: 'Jalqaba', about: 'Waa\'ee', gallery: 'Suuraa', classes: 'Barnoota', contact: 'Qunnamaa', login: 'Seeni', register: 'Galmaa\'i', dashboard: 'Daashboordii', logout: 'Bahi', appName: 'Amdehayimanot', tagline: 'Mana Barumsaa Dilbataa', newsAndEvents: 'Oduu', adminPanel: 'Bulchaa', menu: 'Baafata', language: 'Afaan', tapLogo: 'Loogoo tuqi' },
  ti: { home: 'መበገሲ', about: 'ብዛዕባና', gallery: 'ጋለሪ', classes: 'ክፍሊ', contact: 'ርኸቡና', login: 'እቶ', register: 'ተመዝገብ', dashboard: 'ዳሽቦርድ', logout: 'ውጻእ', appName: 'ዓምደሃይማኖት', tagline: 'ቤት ትምህርቲ ሰንበት', newsAndEvents: 'ዜና', adminPanel: 'ኣድሚን', menu: 'ዝርዝር', language: 'ቋንቋ', tapLogo: 'ሎጎ ጠውቑ' },
  ge: { home: 'አርእስት', about: 'ስለ አነ', gallery: 'ጋለሪ', classes: 'ትምህርት', contact: 'ንረክብ', login: 'ግባእ', register: 'ተመዝገብ', dashboard: 'ዳሽቦርድ', logout: 'ውጻእ', appName: 'አምደሃይማኖት', tagline: 'ቤተ ትምህርት ሰንበት', newsAndEvents: 'ዜና', adminPanel: 'አስተዳደር', menu: 'ምናሌ', language: 'ልሳን', tapLogo: 'ሎጎ ጽቀጥ' },
  es: { home: 'Inicio', about: 'Nosotros', gallery: 'Galería', classes: 'Clases', contact: 'Contacto', login: 'Entrar', register: 'Registro', dashboard: 'Panel', logout: 'Salir', appName: 'Amdehayimanot', tagline: 'Escuela Dominical', newsAndEvents: 'Noticias', adminPanel: 'Admin', menu: 'Menú', language: 'Idioma', tapLogo: 'Toca el logo' },
  fr: { home: 'Accueil', about: 'À propos', gallery: 'Galerie', classes: 'Cours', contact: 'Contact', login: 'Connexion', register: 'S\'inscrire', dashboard: 'Tableau', logout: 'Déconnexion', appName: 'Amdehayimanot', tagline: 'École du Dimanche', newsAndEvents: 'Actus', adminPanel: 'Admin', menu: 'Menu', language: 'Langue', tapLogo: 'Touchez le logo' },
  ar: { home: 'الرئيسية', about: 'عنا', gallery: 'المعرض', classes: 'الفصول', contact: 'اتصل', login: 'دخول', register: 'تسجيل', dashboard: 'لوحة', logout: 'خروج', appName: 'أمدهيمانوت', tagline: 'مدرسة الأحد', newsAndEvents: 'أخبار', adminPanel: 'إدارة', menu: 'القائمة', language: 'اللغة', tapLogo: 'اضغط الشعار' },
};

const LANG_OPTIONS = [
  { value: 'en', label: 'EN' },
  { value: 'am', label: 'አማ' },
  { value: 'ti', label: 'ትግ' },
  { value: 'om', label: 'Orm' },
  { value: 'ge', label: 'ግዕ' },
  { value: 'es', label: 'ES' },
  { value: 'fr', label: 'FR' },
  { value: 'ar', label: 'ع' },
];

const Bar = styled(AppBar, { shouldForwardProp: (p) => p !== 'scrolled' })(({ scrolled }) => ({
  backgroundColor: scrolled ? alpha(brand.navyInk, 0.96) : brand.navyInk,
  backdropFilter: scrolled ? 'blur(16px)' : 'none',
  WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
  color: brand.white,
  borderBottom: `1px solid ${alpha(brand.gold, scrolled ? 0.55 : 0.28)}`,
  transition: 'border-color 0.3s ease, background-color 0.3s ease',
}));

const NavLink = styled(Button, { shouldForwardProp: (p) => p !== 'active' })(({ active }) => ({
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: active ? 700 : 500,
  textTransform: 'none',
  fontSize: '0.9rem',
  letterSpacing: '0.02em',
  color: active ? brand.gold : alpha(brand.white, 0.82),
  borderRadius: 0,
  padding: '8px 14px',
  minWidth: 0,
  position: 'relative',
  backgroundColor: 'transparent',
  '&:hover': { backgroundColor: 'transparent', color: brand.gold },
  ...(active && {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 14,
      right: 14,
      bottom: 4,
      height: 1.5,
      backgroundColor: brand.gold,
    },
  }),
}));

const Cta = styled(Button)({
  marginLeft: 8,
  fontWeight: 700,
  borderRadius: 2,
  boxShadow: 'none',
  border: `1px solid ${brand.goldDark}`,
  '&:hover': { boxShadow: `0 6px 20px ${alpha(brand.gold, 0.3)}` },
});

const LogoFab = styled(Box, { shouldForwardProp: (p) => p !== 'open' })(({ open }) => ({
  position: 'relative',
  zIndex: 2,
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  // Light ground so the navy crest reads clearly
  background: open
    ? `linear-gradient(145deg, ${brand.navyDark} 0%, ${brand.navyInk} 100%)`
    : `linear-gradient(160deg, #FFFFFF 0%, #E8EEF4 100%)`,
  border: `2.5px solid ${open ? brand.gold : brand.gold}`,
  boxShadow: open
    ? `0 0 0 6px ${alpha(brand.gold, 0.22)}, 0 10px 36px ${alpha(brand.navyInk, 0.55)}`
    : `0 8px 28px ${alpha(brand.navyInk, 0.35)}, 0 0 0 3px ${alpha('#fff', 0.5)}`,
  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease, box-shadow 0.35s ease, background 0.3s ease',
  transform: open ? 'scale(1.06)' : 'scale(1)',
  WebkitTapHighlightColor: 'transparent',
  overflow: 'hidden',
  '&:active': { transform: 'scale(0.94)' },
  '& img': {
    width: '88%',
    height: '88%',
    objectFit: 'contain',
  },
}));

/** Single orbiting section button */
const OrbitItem = styled(Box, {
  shouldForwardProp: (p) => !['open', 'x', 'y', 'delay', 'active'].includes(p),
})(({ open, x, y, delay, active }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 64,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  textDecoration: 'none',
  color: brand.white,
  pointerEvents: open ? 'auto' : 'none',
  zIndex: 1,
  transform: open
    ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
    : 'translate(-50%, -50%) scale(0.2)',
  opacity: open ? 1 : 0,
  transition: `transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
  WebkitTapHighlightColor: 'transparent',
  '& .orbit-icon': {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: active
      ? `linear-gradient(145deg, ${brand.gold} 0%, ${brand.goldDark} 100%)`
      : `linear-gradient(145deg, ${brand.navyDark} 0%, ${brand.navyInk} 100%)`,
    border: `1.5px solid ${active ? brand.goldLight : alpha(brand.gold, 0.45)}`,
    color: active ? brand.navyInk : brand.gold,
    boxShadow: active
      ? `0 6px 20px ${alpha(brand.gold, 0.4)}`
      : `0 6px 18px ${alpha(brand.navyInk, 0.4)}`,
    transition: 'transform 0.2s ease, border-color 0.2s ease',
  },
  '&:active .orbit-icon': {
    transform: 'scale(0.92)',
  },
  '& .orbit-label': {
    fontSize: '0.68rem',
    fontWeight: active ? 700 : 600,
    letterSpacing: '0.02em',
    textAlign: 'center',
    lineHeight: 1.15,
    maxWidth: 72,
    color: active ? brand.gold : brand.white,
    textShadow: `0 1px 8px ${alpha(brand.navyInk, 0.9)}`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const Navbar = ({ language, onLanguageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = translations[language] || translations.en;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobile) return undefined;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, isMobile]);

  const navLinks = useMemo(
    () => [
      { title: t.home, path: '/', icon: <HomeOutlined sx={{ fontSize: 22 }} /> },
      { title: t.about, path: '/about', icon: <InfoOutlined sx={{ fontSize: 22 }} /> },
      { title: t.newsAndEvents, path: '/news-and-events', icon: <NewspaperOutlined sx={{ fontSize: 22 }} /> },
      { title: t.gallery, path: '/gallery', icon: <PhotoLibraryOutlined sx={{ fontSize: 22 }} /> },
      { title: t.classes, path: '/classes', icon: <SchoolOutlined sx={{ fontSize: 22 }} /> },
      { title: t.contact, path: '/contact', icon: <MailOutlined sx={{ fontSize: 22 }} /> },
    ],
    [t],
  );

  /** Arc above the center logo (left → top → right) */
  const orbitPositions = useMemo(() => {
    const n = navLinks.length;
    const radius = 118;
    // Math angles: π (left) → π/2 (up) → 0 (right). CSS y is down, so negate sin.
    return navLinks.map((_, i) => {
      const angle = Math.PI - (i / (n - 1)) * Math.PI;
      return {
        x: Math.cos(angle) * radius,
        y: -Math.sin(angle) * radius,
        delay: 40 + i * 45,
      };
    });
  }, [navLinks]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/');
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const selectSx = {
    color: 'inherit',
    borderRadius: 1,
    fontSize: '0.85rem',
    '.MuiOutlinedInput-notchedOutline': { borderColor: alpha(brand.gold, 0.35) },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: brand.gold },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: brand.gold },
    '& .MuiSelect-icon': { color: brand.gold },
  };

  /* ——— Desktop ——— */
  if (!isMobile) {
    return (
      <>
        <Bar position="fixed" scrolled={scrolled ? 1 : 0} elevation={0}>
          <Box sx={{ height: 2, background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`, opacity: 0.8 }} />
          <Toolbar sx={{ justifyContent: 'space-between', px: 3, minHeight: 72, gap: 1 }}>
            <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'inherit', textDecoration: 'none' }}>
              <Box
                component="img"
                src={logo}
                alt=""
                sx={{
                  height: 52,
                  width: 52,
                  objectFit: 'contain',
                  bgcolor: '#FFFFFF',
                  borderRadius: '50%',
                  border: `1.5px solid ${brand.gold}`,
                  p: 0.5,
                  boxShadow: `0 2px 10px ${alpha('#000', 0.25)}`,
                }}
              />
              <Typography sx={{ fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif', fontWeight: 600, fontSize: '1.35rem' }}>
                {t.appName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              {navLinks.map((link) => (
                <NavLink key={link.path} component={RouterLink} to={link.path} active={isActive(link.path) ? 1 : 0}>
                  {link.title}
                </NavLink>
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 110 }}>
                <Select value={language} onChange={(e) => onLanguageChange(e.target.value)} sx={selectSx}>
                  {LANG_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {currentUser ? (
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
                  <Avatar sx={{ width: 34, height: 34, bgcolor: brand.gold, color: brand.navyInk, fontWeight: 700, borderRadius: 1 }}>
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              ) : (
                <>
                  <NavLink component={RouterLink} to="/login">{t.login}</NavLink>
                  <Cta variant="contained" color="secondary" component={RouterLink} to="/register" sx={{ px: 2.5 }}>
                    {t.register}
                  </Cta>
                </>
              )}
            </Box>
          </Toolbar>
        </Bar>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} TransitionComponent={Fade}>
          {currentUser?.role === 'ADMIN' && (
            <Box>
              <MenuItem component={RouterLink} to="/admin" onClick={() => setAnchorEl(null)}>{t.adminPanel}</MenuItem>
              <Divider />
            </Box>
          )}
          <MenuItem component={RouterLink} to="/dashboard" onClick={() => setAnchorEl(null)}>{t.dashboard}</MenuItem>
          <MenuItem onClick={handleLogout}>{t.logout}</MenuItem>
        </Menu>
      </>
    );
  }

  /* ——— Mobile: branding AppBar + bottom radial logo nav ——— */
  return (
    <>
      {/* Branding bar only — no navigation */}
      <Bar position="fixed" scrolled={scrolled ? 1 : 0} elevation={0}>
        <Box
          sx={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
            opacity: 0.85,
          }}
        />
        <Toolbar
          sx={{
            minHeight: { xs: 60, sm: 64 },
            px: 1.5,
            gap: 1,
            justifyContent: 'space-between',
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              color: 'inherit',
              textDecoration: 'none',
              minWidth: 0,
              flex: 1,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt=""
              sx={{
                height: 44,
                width: 44,
                flexShrink: 0,
                objectFit: 'contain',
                bgcolor: '#FFFFFF',
                borderRadius: '50%',
                border: `1.5px solid ${brand.gold}`,
                p: 0.4,
                boxShadow: `0 2px 10px ${alpha('#000', 0.25)}`,
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  lineHeight: 1.15,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t.appName}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: brand.gold,
                  fontWeight: 600,
                  mt: 0.25,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t.tagline}
              </Typography>
            </Box>
          </Box>

          <FormControl size="small" sx={{ minWidth: 78, flexShrink: 0 }}>
            <Select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              aria-label={t.language}
              sx={{
                color: brand.gold,
                borderRadius: 1,
                fontSize: '0.8rem',
                fontWeight: 700,
                height: 36,
                bgcolor: alpha('#fff', 0.04),
                '.MuiOutlinedInput-notchedOutline': { borderColor: alpha(brand.gold, 0.45) },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: brand.gold },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: brand.gold },
                '& .MuiSelect-icon': { color: brand.gold },
                '& .MuiSelect-select': { py: 0.75, pr: '28px !important' },
              }}
            >
              {LANG_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </Bar>

      <Backdrop
        open={menuOpen}
        onClick={() => setMenuOpen(false)}
        sx={{
          zIndex: (z) => z.zIndex.modal - 1,
          backgroundColor: alpha(brand.navyInk, 0.78),
          backdropFilter: 'blur(8px)',
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (z) => z.zIndex.modal,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pb: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          pointerEvents: 'none',
        }}
      >
        {/* Orbit stage */}
        <Box
          sx={{
            position: 'relative',
            width: 320,
            height: menuOpen ? 260 : 96,
            transition: 'height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: 38,
              width: 236,
              height: 236,
              borderRadius: '50%',
              border: `1px solid ${alpha(brand.gold, 0.28)}`,
              transform: 'translate(-50%, 50%)',
              opacity: menuOpen ? 1 : 0,
              transition: 'opacity 0.35s ease',
              pointerEvents: 'none',
              boxShadow: `inset 0 0 40px ${alpha(brand.gold, 0.06)}`,
            }}
          />

          <Box sx={{ position: 'absolute', left: '50%', bottom: 38, width: 0, height: 0 }}>
            {navLinks.map((link, i) => {
              const pos = orbitPositions[i];
              const active = isActive(link.path);
              return (
                <OrbitItem
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  open={menuOpen ? 1 : 0}
                  x={pos.x}
                  y={pos.y}
                  delay={pos.delay}
                  active={active ? 1 : 0}
                  onClick={() => setMenuOpen(false)}
                >
                  <Box className="orbit-icon">{link.icon}</Box>
                  <Typography className="orbit-label" component="span">{link.title}</Typography>
                </OrbitItem>
              );
            })}
          </Box>

          <Box sx={{ position: 'relative', zIndex: 3, pointerEvents: 'auto', mb: 0.5 }}>
            {!menuOpen && (
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  mb: 1,
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: brand.white,
                  bgcolor: alpha(brand.navyInk, 0.6),
                  px: 1.25,
                  py: 0.35,
                  borderRadius: 1,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: `1px solid ${alpha(brand.gold, 0.25)}`,
                  pointerEvents: 'none',
                }}
              >
                {t.tapLogo}
              </Typography>
            )}
            <LogoFab
              open={menuOpen ? 1 : 0}
              role="button"
              tabIndex={0}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setMenuOpen((v) => !v);
                }
              }}
            >
              {menuOpen ? (
                <CloseIcon sx={{ color: brand.gold, fontSize: 36, fontWeight: 700 }} />
              ) : (
                <Box component="img" src={logo} alt={t.appName} />
              )}
            </LogoFab>
          </Box>
        </Box>

        {/* Auth utilities under the logo when open */}
        {menuOpen && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              mt: 0.5,
              pointerEvents: 'auto',
            }}
          >
            {currentUser ? (
              <>
                {currentUser.role === 'ADMIN' && (
                  <IconButton
                    component={RouterLink}
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    sx={{ width: 38, height: 38, bgcolor: alpha(brand.navyInk, 0.9), border: `1px solid ${alpha(brand.gold, 0.4)}`, color: brand.gold, borderRadius: '50%' }}
                  >
                    <AdminPanelSettingsOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                <IconButton
                  component={RouterLink}
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  sx={{ width: 38, height: 38, bgcolor: alpha(brand.navyInk, 0.9), border: `1px solid ${alpha(brand.gold, 0.4)}`, color: brand.gold, borderRadius: '50%' }}
                >
                  <DashboardOutlined sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  onClick={handleLogout}
                  sx={{ width: 38, height: 38, bgcolor: alpha(brand.navyInk, 0.9), border: `1px solid ${alpha(brand.gold, 0.4)}`, color: brand.white, borderRadius: '50%' }}
                >
                  <LogoutOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  component={RouterLink}
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  sx={{ width: 38, height: 38, bgcolor: alpha(brand.navyInk, 0.9), border: `1px solid ${alpha(brand.gold, 0.4)}`, color: brand.gold, borderRadius: '50%' }}
                  aria-label={t.login}
                >
                  <LoginOutlined sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  component={RouterLink}
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  sx={{ width: 38, height: 38, bgcolor: brand.gold, border: `1px solid ${brand.goldDark}`, color: brand.navyInk, borderRadius: '50%' }}
                  aria-label={t.register}
                >
                  <PersonAddAlt sx={{ fontSize: 18 }} />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Navbar;
