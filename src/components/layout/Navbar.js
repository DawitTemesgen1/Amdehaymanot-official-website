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
  DevicesOutlined,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import { brand } from '../../brand';

const translations = {
  en: {
    "home": "origin",
    "about": "about us",
    "gallery": "Gallery",
    "mediaAndTech": "Media and Tech",
    "classes": "Education",
    "contact": "Contact us",
    "login": "Enter",
    "register": "Register",
    "dashboard": "Dashboard",
    "logout": "come out",
    "appName": "Amdehaymanot",
    "tagline": "Sunday school",
    "newsAndEvents": "News",
    "adminPanel": "Administrator",
    "menu": "Menu",
    "language": "Language",
    "tapLogo": "Touch the logo"
},
  om: {
    "home": "Fuula Duraa",
    "about": "Waa'ee Keenya",
    "gallery": "Kuusaa Suuraa",
    "mediaAndTech": "Miidiyaa fi Teeknooloojii",
    "classes": "Barnoota",
    "contact": "Quunnamtii",
    "login": "Seeni",
    "register": "Galmaa'i",
    "dashboard": "Daashboordii",
    "logout": "Bahi",
    "appName": "Amdehaymanot",
    "tagline": "Mana Barumsaa Sanbataa",
    "newsAndEvents": "Oduu fi Taateewwan",
    "adminPanel": "Kutaa Bulchaa",
    "menu": "Baafata"
  },
  ti: {
    "home": "መሰረት",
    "about": "ብዛዕባና ዝምልከት",
    "gallery": "ጋለሪ",
    "mediaAndTech": "ሚድያን ቴክን",
    "classes": "ትምህርቲ",
    "contact": "ርኸቡና",
    "login": "ኣእትው",
    "register": "ምዝገባ",
    "dashboard": "ዳሽቦርድ",
    "logout": "ውጹ",
    "appName": "ዓምደሃይማኖት",
    "tagline": "ትምህርቲ ሰንበት",
    "newsAndEvents": "ዜና",
    "adminPanel": "ኣመሓዳሪ",
    "menu": "ዝርዝር መግቢ",
    "language": "ቋንቋ",
    "tapLogo": "ነቲ ኣርማ ተንክፎ"
},
  es: {
    "home": "origen",
    "about": "sobre nosotros",
    "gallery": "Galería",
    "mediaAndTech": "Medios y tecnología",
    "classes": "Educación",
    "contact": "Contáctenos",
    "login": "Ingresar",
    "register": "Registro",
    "dashboard": "Panel",
    "logout": "salga",
    "appName": "Amdehaymanot",
    "tagline": "escuela dominical",
    "newsAndEvents": "Noticias",
    "adminPanel": "Administrador",
    "menu": "Menú",
    "language": "Idioma",
    "tapLogo": "Toca el logotipo"
},
  fr: {
    "home": "origine",
    "about": "à propos de nous",
    "gallery": "Galerie",
    "mediaAndTech": "Médias et technologie",
    "classes": "Éducation",
    "contact": "Contactez-nous",
    "login": "Entrer",
    "register": "Registre",
    "dashboard": "Tableau de bord",
    "logout": "sortir",
    "appName": "Amdehaymanot",
    "tagline": "École du dimanche",
    "newsAndEvents": "Nouvelles",
    "adminPanel": "Administrateur",
    "menu": "Menu",
    "language": "Langue",
    "tapLogo": "Touchez le logo"
},
  ar: {
    "home": "أصل",
    "about": "معلومات عنا",
    "gallery": "معرض",
    "mediaAndTech": "وسائل الإعلام والتكنولوجيا",
    "classes": "تعليم",
    "contact": "اتصل بنا",
    "login": "يدخل",
    "register": "يسجل",
    "dashboard": "لوحة القيادة",
    "logout": "يخرج",
    "appName": "آمدهيمانوت",
    "tagline": "مدرسة الأحد",
    "newsAndEvents": "أخبار",
    "adminPanel": "المسؤول",
    "menu": "قائمة طعام",
    "language": "لغة",
    "tapLogo": "المس الشعار"
},
  am: {
    "home": "መነሻ",
    "about": "ስለ እኛ",
    "gallery": "ጋለሪ",
    "mediaAndTech": "ሚዲያ እና ቴክ",
    "classes": "ትምህርት",
    "contact": "ያግኙን",
    "login": "ይግቡ",
    "register": "ይመዝገቡ",
    "dashboard": "ዳሽቦርድ",
    "logout": "ውጣ",
    "appName": "ዓምደሃይማኖት",
    "tagline": "ሰንበት ትምህርት ቤት",
    "newsAndEvents": "ዜና",
    "adminPanel": "አስተዳዳሪ",
    "menu": "ምናሌ",
    "language": "ቋንቋ",
    "tapLogo": "ሎጎ ይንኩ"
},
  ge: {
    "home": "መባእታ",
    "about": "በእንቲአነ",
    "gallery": "ሥዕላት",
    "mediaAndTech": "ሚድያ ወቴክኖሎጂ",
    "classes": "ትምህርት",
    "contact": "ርከቡነ",
    "login": "ባኡ",
    "register": "ተመዝገቡ",
    "dashboard": "ዳሽቦርድ",
    "logout": "ፃእ",
    "appName": "ዓምደሃይማኖት",
    "tagline": "ቤተ ትምህርት ሰንበት",
    "newsAndEvents": "ዜና ወክንውናት",
    "adminPanel": "መኰንን",
    "menu": "ማዕድ"
  },
};;

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

/** Simplified Ethiopian Orthodox cross (decorative) */
function EthiopicCross({ size = 12, color = brand.gold, opacity = 0.9 }) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      sx={{ display: 'block', flexShrink: 0, opacity }}
    >
      <path
        fill={color}
        d="M15.2 2.2h1.6v5.4h5.4v1.6h-5.4v5.4h5.4v1.6h-5.4v8.2h-1.6v-8.2H9.8v-1.6h5.4V9.2H9.8V7.6h5.4V2.2zm-3.8 8.8h1.4v1.4h-1.4v-1.4zm7.8 0h1.4v1.4h-1.4v-1.4zM9.2 20.4h1.4v1.4H9.2v-1.4zm12.2 0h1.4v1.4h-1.4v-1.4z"
      />
      <circle cx="16" cy="10.4" r="1.15" fill={color} />
    </Box>
  );
}

/** Triple gold manuscript rule with centered cross */
function FiligreeBand({ light = false, compact = false }) {
  const line = light ? alpha(brand.goldDark, 0.55) : alpha(brand.gold, 0.7);
  const soft = light ? alpha(brand.navy, 0.12) : alpha(brand.gold, 0.22);
  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: compact ? 8 : 11,
        px: 2,
      }}
    >
      <Box sx={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, bgcolor: soft, transform: 'translateY(-2.5px)' }} />
      <Box
        sx={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          top: '50%',
          height: 1.5,
          transform: 'translateY(-50%)',
          background: `linear-gradient(90deg, transparent, ${line} 18%, ${line} 82%, transparent)`,
        }}
      />
      <Box sx={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, bgcolor: soft, transform: 'translateY(2.5px)' }} />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.85,
          px: 1,
          bgcolor: light ? alpha(brand.white, 0.95) : alpha(brand.navyInk, 0.92),
        }}
      >
        <Box sx={{ width: 14, height: 1, bgcolor: line }} />
        <EthiopicCross size={compact ? 9 : 11} color={light ? brand.goldDark : brand.gold} />
        <Box sx={{ width: 14, height: 1, bgcolor: line }} />
      </Box>
    </Box>
  );
}

/** Crest in an arched gold frame — cathedral entrance motif */
function CrestMark({ size = 56, light = false }) {
  const outer = size + 10;
  return (
    <Box
      sx={{
        position: 'relative',
        width: outer,
        height: outer,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Arch hood */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: brand.archRadius,
          border: `1.5px solid ${alpha(brand.gold, light ? 0.7 : 0.85)}`,
          background: light
            ? `linear-gradient(180deg, ${alpha(brand.gold, 0.12)} 0%, transparent 55%)`
            : `linear-gradient(180deg, ${alpha(brand.gold, 0.18)} 0%, transparent 58%)`,
          boxShadow: light
            ? `inset 0 0 0 1px ${alpha(brand.navy, 0.06)}`
            : `inset 0 0 0 1px ${alpha(brand.gold, 0.15)}`,
        }}
      />
      <Box
        component="img"
        src={logo}
        alt=""
        sx={{
          position: 'relative',
          zIndex: 1,
          width: size,
          height: size,
          mb: '3px',
          objectFit: 'contain',
          bgcolor: brand.white,
          borderRadius: '50%',
          border: `2px solid ${brand.gold}`,
          p: `${Math.max(3, size * 0.06)}px`,
          boxShadow: light
            ? `0 0 0 3px ${alpha(brand.gold, 0.16)}, 0 6px 18px ${alpha(brand.navyInk, 0.1)}`
            : `0 0 0 3px ${alpha(brand.gold, 0.2)}, 0 6px 20px ${alpha('#000', 0.35)}`,
        }}
      />
    </Box>
  );
}

const cathedralPattern = (subtle = false) => {
  const a = subtle ? 0.035 : 0.055;
  const b = subtle ? 0.025 : 0.04;
  return {
    backgroundImage: `
      radial-gradient(ellipse 80% 120% at 50% -20%, ${alpha(brand.gold, subtle ? 0.08 : 0.14)} 0%, transparent 55%),
      repeating-linear-gradient(60deg, transparent 0 14px, ${alpha(brand.gold, a)} 14px 15px),
      repeating-linear-gradient(-60deg, transparent 0 14px, ${alpha(brand.gold, b)} 14px 15px)
    `,
  };
};

const Bar = styled(AppBar, {
  shouldForwardProp: (p) => p !== 'scrolled' && p !== 'light',
})(({ scrolled, light }) => ({
  backgroundColor: light
    ? (scrolled ? alpha(brand.white, 0.94) : alpha(brand.white, 0.72))
    : brand.navyInk,
  backgroundImage: light
    ? `linear-gradient(180deg, ${alpha(brand.white, 0.96)} 0%, ${alpha(brand.stone, 0.9)} 100%)`
    : `linear-gradient(180deg, ${brand.navyDark} 0%, ${brand.navyInk} 72%, #00091A 100%)`,
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  color: light ? brand.navy : brand.white,
  borderBottom: 'none',
  boxShadow: light
    ? (scrolled ? `0 10px 32px ${alpha(brand.navyInk, 0.08)}` : 'none')
    : (scrolled
      ? `0 12px 40px ${alpha(brand.navyInk, 0.45)}`
      : `0 4px 24px ${alpha(brand.navyInk, 0.25)}`),
  overflow: light && !scrolled ? 'visible' : 'hidden',
  transition: 'background-color 0.35s ease, box-shadow 0.35s ease, color 0.35s ease',
  ...(!light && {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      ...cathedralPattern(false),
      opacity: scrolled ? 0.7 : 1,
      transition: 'opacity 0.35s ease',
    },
  }),
}));

const NavLink = styled(Button, {
  shouldForwardProp: (p) => p !== 'active' && p !== 'light',
})(({ active, light }) => ({
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: active ? 700 : 500,
  textTransform: 'none',
  fontSize: '0.9rem',
  letterSpacing: '0.05em',
  color: light
    ? (active ? brand.navy : alpha(brand.navy, 0.58))
    : (active ? brand.gold : alpha(brand.white, 0.78)),
  borderRadius: 0,
  padding: '10px 14px',
  minWidth: 0,
  position: 'relative',
  backgroundColor: 'transparent',
  transition: 'color 0.2s ease',
  '&:hover': {
    backgroundColor: 'transparent',
    color: light ? brand.navy : brand.gold,
    '&::before': { opacity: 1, transform: 'scaleX(1)' },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 5,
    height: 1.5,
    background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
    opacity: active ? 1 : 0,
    transform: active ? 'scaleX(1)' : 'scaleX(0.35)',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
  },
  ...(active && {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '50%',
      bottom: 1,
      width: 5,
      height: 5,
      marginLeft: -2.5,
      backgroundColor: brand.gold,
      transform: 'rotate(45deg)',
      boxShadow: light ? `0 0 0 3px ${alpha(brand.gold, 0.18)}` : `0 0 8px ${alpha(brand.gold, 0.45)}`,
    },
  }),
}));

const Cta = styled(Button, { shouldForwardProp: (p) => p !== 'light' })(({ light }) => ({
  marginLeft: 4,
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  borderRadius: 2,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontSize: '0.78rem',
  boxShadow: 'none',
  border: light ? `1.5px solid ${brand.navy}` : `1.5px solid ${brand.gold}`,
  padding: '8px 18px',
  ...(light
    ? {
        backgroundColor: `${brand.navy} !important`,
        color: `${brand.white} !important`,
        '&:hover': {
          backgroundColor: `${brand.navyDark} !important`,
          boxShadow: `0 8px 24px ${alpha(brand.navy, 0.28)}`,
          transform: 'translateY(-1px)',
        },
      }
    : {
        backgroundColor: `${alpha(brand.gold, 0.12)} !important`,
        color: `${brand.gold} !important`,
        '&:hover': {
          backgroundColor: `${brand.gold} !important`,
          color: `${brand.navyInk} !important`,
          boxShadow: `0 8px 24px ${alpha(brand.gold, 0.35)}`,
          transform: 'translateY(-1px)',
        },
      }),
}));

const BrandLockup = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  color: 'inherit',
  textDecoration: 'none',
  minWidth: 0,
});

const NavRail = styled(Box, { shouldForwardProp: (p) => p !== 'light' })(({ light }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
  padding: '3px 8px',
  borderRadius: 2,
  position: 'relative',
  border: light
    ? `1px solid ${alpha(brand.navy, 0.1)}`
    : `1px solid ${alpha(brand.gold, 0.22)}`,
  background: light
    ? alpha(brand.navy, 0.025)
    : alpha(brand.gold, 0.04),
  boxShadow: light
    ? `inset 0 0 0 1px ${alpha(brand.white, 0.6)}`
    : `inset 0 0 20px ${alpha(brand.gold, 0.04)}`,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 6,
    bottom: 6,
    width: 1,
    background: light
      ? `linear-gradient(180deg, transparent, ${alpha(brand.navy, 0.2)}, transparent)`
      : `linear-gradient(180deg, transparent, ${alpha(brand.gold, 0.35)}, transparent)`,
  },
  '&::before': { left: 0 },
  '&::after': { right: 0 },
}));

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
  background: open
    ? `linear-gradient(145deg, ${brand.navyDark} 0%, ${brand.navyInk} 100%)`
    : `linear-gradient(160deg, #FFFFFF 0%, #E8EEF4 100%)`,
  border: `2.5px solid ${brand.gold}`,
  boxShadow: open
    ? `0 0 0 5px ${alpha(brand.gold, 0.22)}, 0 0 0 9px ${alpha(brand.navyInk, 0.35)}, 0 10px 36px ${alpha(brand.navyInk, 0.55)}`
    : `0 0 0 4px ${alpha(brand.gold, 0.18)}, 0 8px 28px ${alpha(brand.navyInk, 0.35)}, 0 0 0 3px ${alpha('#fff', 0.5)}`,
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
      { title: t.mediaAndTech, path: '/media-and-tech', icon: <DevicesOutlined sx={{ fontSize: 22 }} /> },
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

  // Desktop uses the same navy bar on every page (home included).
  const lightNav = false;
  const light = 0;

  const selectSx = {
    color: 'inherit',
    borderRadius: 1,
    fontSize: '0.85rem',
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: lightNav ? alpha(brand.navy, 0.2) : alpha(brand.gold, 0.35),
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: lightNav ? brand.navy : brand.gold,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: lightNav ? brand.navy : brand.gold,
    },
    '& .MuiSelect-icon': { color: lightNav ? brand.navy : brand.gold },
  };

  /* ——— Desktop ——— */
  if (!isMobile) {
    const crestSize = scrolled ? 44 : 52;
    return (
      <>
        <Bar position="fixed" scrolled={scrolled ? 1 : 0} light={light} elevation={0}>
          <FiligreeBand light={lightNav} />
          <Toolbar
            sx={{
              position: 'relative',
              zIndex: 1,
              justifyContent: 'space-between',
              px: { md: 2.5, lg: 3.5 },
              minHeight: scrolled ? 64 : 74,
              gap: 2,
              transition: 'min-height 0.3s ease',
            }}
          >
            <BrandLockup component={RouterLink} to="/">
              <CrestMark size={crestSize} light={lightNav} />
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.85 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                      fontWeight: 700,
                      fontSize: scrolled ? '1.28rem' : '1.5rem',
                      lineHeight: 1.05,
                      letterSpacing: '-0.015em',
                      color: lightNav ? brand.navy : brand.white,
                      transition: 'font-size 0.3s ease, color 0.3s ease',
                    }}
                  >
                    {t.appName}
                  </Typography>
                  <EthiopicCross
                    size={11}
                    color={lightNav ? brand.goldDark : brand.gold}
                    opacity={0.85}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.66rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: lightNav ? brand.goldDark : brand.gold,
                    fontWeight: 700,
                    mt: 0.4,
                  }}
                >
                  {t.tagline}
                </Typography>
              </Box>
            </BrandLockup>

            <NavRail light={light} sx={{ flex: 1, maxWidth: 740, mx: 1.5 }}>
              {navLinks.map((link, i) => (
                <React.Fragment key={link.path}>
                  {i > 0 && i === Math.floor(navLinks.length / 2) && (
                    <Box
                      aria-hidden
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 0.35,
                        opacity: 0.75,
                      }}
                    >
                      <EthiopicCross
                        size={9}
                        color={lightNav ? brand.goldDark : brand.gold}
                        opacity={0.7}
                      />
                    </Box>
                  )}
                  <NavLink
                    component={RouterLink}
          to={link.path}
                    active={isActive(link.path) ? 1 : 0}
                    light={light}
        >
          {link.title}
                  </NavLink>
                </React.Fragment>
              ))}
            </NavRail>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, flexShrink: 0 }}>
              <FormControl size="small" sx={{ minWidth: 84 }}>
                <Select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  sx={{
                    ...selectSx,
                    color: lightNav ? brand.navy : brand.gold,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    height: 36,
                    borderRadius: 1,
                    bgcolor: lightNav ? alpha(brand.navy, 0.04) : alpha(brand.gold, 0.06),
                    '& .MuiSelect-select': { py: 0.75 },
                  }}
                >
                  {LANG_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box
                aria-hidden
                sx={{
                  width: 1,
                  height: 26,
                  background: lightNav
                    ? `linear-gradient(180deg, transparent, ${alpha(brand.navy, 0.25)}, transparent)`
                    : `linear-gradient(180deg, transparent, ${alpha(brand.gold, 0.45)}, transparent)`,
                  mx: 0.35,
                }}
              />

              {currentUser ? (
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    p: 0.35,
                    border: `1.5px solid ${alpha(brand.gold, lightNav ? 0.75 : 0.55)}`,
                    borderRadius: 1,
                    '&:hover': {
                      borderColor: brand.gold,
                      bgcolor: alpha(brand.gold, lightNav ? 0.12 : 0.08),
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: brand.gold,
                      color: brand.navyInk,
                      fontWeight: 700,
                      borderRadius: 0.75,
                      fontSize: '0.9rem',
                    }}
                  >
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              ) : (
                <>
                  <NavLink component={RouterLink} to="/login" light={light} sx={{ px: 1.25 }}>
                    {t.login}
                  </NavLink>
                  <Cta
                    variant="contained"
                    color="secondary"
                    light={light}
                    component={RouterLink}
                    to="/register"
                  >
                    {t.register}
                  </Cta>
                </>
              )}
            </Box>
          </Toolbar>

          <FiligreeBand light={lightNav} compact />
          {lightNav && !scrolled && (
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -24,
                height: 24,
                pointerEvents: 'none',
                background: `linear-gradient(180deg, ${alpha(brand.white, 0.5)} 0%, transparent 100%)`,
              }}
            />
          )}
        </Bar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 1,
              border: `1px solid ${brand.borderSubtle}`,
              boxShadow: brand.shadowCard,
              overflow: 'hidden',
              '& .MuiMenuItem-root': {
                fontSize: '0.92rem',
                py: 1.25,
                '&:hover': { bgcolor: alpha(brand.navy, 0.06) },
              },
            },
          }}
        >
          {currentUser?.role === 'ADMIN' && (
            <Box>
              <MenuItem component={RouterLink} to="/admin" onClick={() => setAnchorEl(null)}>
                {t.adminPanel}
              </MenuItem>
              <Divider />
    </Box>
          )}
          <MenuItem component={RouterLink} to="/dashboard" onClick={() => setAnchorEl(null)}>
            {t.dashboard}
          </MenuItem>
          <MenuItem onClick={handleLogout}>{t.logout}</MenuItem>
        </Menu>
      </>
    );
  }

  /* ——— Mobile: branding AppBar + bottom radial logo nav ——— */
  return (
    <>
      <Bar position="fixed" scrolled={scrolled ? 1 : 0} elevation={0}>
        <FiligreeBand compact />
        <Toolbar
          sx={{
            position: 'relative',
            zIndex: 1,
            minHeight: { xs: 58, sm: 62 },
            px: 1.25,
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
              gap: 1.1,
              color: 'inherit',
              textDecoration: 'none',
              minWidth: 0,
              flex: 1,
            }}
          >
            <CrestMark size={40} light={false} />
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.65 }}>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 700,
                    fontSize: { xs: '1.05rem', sm: '1.22rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t.appName}
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <EthiopicCross size={10} color={brand.gold} opacity={0.85} />
                </Box>
              </Box>
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: brand.gold,
                  fontWeight: 700,
                  mt: 0.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t.tagline}
              </Typography>
            </Box>
          </Box>

          <FormControl size="small" sx={{ minWidth: 74, flexShrink: 0 }}>
            <Select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              aria-label={t.language}
              sx={{
                color: brand.gold,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 700,
                height: 34,
                bgcolor: alpha(brand.gold, 0.07),
                '.MuiOutlinedInput-notchedOutline': { borderColor: alpha(brand.gold, 0.4) },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: brand.gold },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: brand.gold },
                '& .MuiSelect-icon': { color: brand.gold },
                '& .MuiSelect-select': { py: 0.65, pr: '26px !important' },
              }}
            >
              {LANG_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
            </FormControl>
        </Toolbar>
        <Box
          aria-hidden
          sx={{
            height: 2,
            background: `linear-gradient(90deg, transparent 5%, ${brand.gold} 50%, transparent 95%)`,
            opacity: 0.85,
          }}
        />
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
