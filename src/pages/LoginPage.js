import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Grid, Link, Paper, Avatar, CircularProgress, Fade, Slide, styled, InputAdornment, IconButton } from '@mui/material';
import { LockOutlined as LockOutlinedIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, EmailOutlined as EmailIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';

const translations = {
  en: {
    pageTitle: 'Login',
    pageDescription: 'Sign in to your Amdehaymanot Sunday School account to access member-only content, manage your profile, and enroll in classes.',
    title: 'Welcome back',
    subtitle: 'Sign in to access your account',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot password?',
    signInButton: 'Sign In',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign Up',
    loginSuccess: 'Login successful! Welcome back.',
    loginError: 'Invalid credentials. Please try again.',
  },
  am: {
    pageTitle: 'ይግቡ',
    pageDescription: 'የአባላትን ብቻ ይዘት ለማግኘት፣ መገለጫዎን ለማስተዳደር እና በክፍሎች ለመመዝገብ ወደ እርስዎ የዓምደሃይማኖት ሰንበት ትምህርት ቤት መለያ ይግቡ።',
    title: 'እንኳን ደህና መጡ',
    subtitle: 'ወደ መለያዎ ለመግባት ይግቡ',
    emailLabel: 'ኢሜይል አድራሻ',
    passwordLabel: 'የይለፍ ቃል',
    forgotPassword: 'የይለፍ ቃል ረሱ?',
    signInButton: 'ይግቡ',
    noAccount: 'መለያ የለዎትም?',
    signUpLink: 'ይመዝገቡ',
    loginSuccess: 'በተሳካ ሁኔታ ገብተዋል! እንኳን ደህና መጡ።',
    loginError: 'ትክክል ያልሆኑ ምስክርነቶች። እባክዎ እንደገና ይሞክሩ።',
  },
  ti: {
    pageTitle: 'እተዉ',
    pageDescription: 'ናይ ኣባላት ጥራይ ትሕዝቶ ንምርካብ፡ መገለጺኹም ንምእላይን ኣብ ክፍሊታት ንምምዝጋብን ናብ ናይ ዓምደሃይማኖት ሰንበት ትምህርቲ ቤት ሕሳብኩም እተዉ።',
    title: 'እንቋዕ ብደሓን መጻእኩም',
    subtitle: 'ናብ ሕሳብኩም ንምእታው እተዉ',
    emailLabel: 'ኢመይል ኣድራሻ',
    passwordLabel: 'መሕለፊ ቓል',
    forgotPassword: 'መሕለፊ ቓል ረሲዕኩም?',
    signInButton: 'እተዉ',
    noAccount: 'ሕሳብ የብልኩምን?',
    signUpLink: 'ተመዝገቡ',
    loginSuccess: 'ብዓወት ኣቲኹም! እንቋዕ ብደሓን መጻእኩም።',
    loginError: 'ጌጋ ምስክርነታት። በጃኹም እንደገና ፈትኑ።',
  },
  om: {
    pageTitle: 'Seeni',
    pageDescription: 'Qabiyyee miseensota qofaaf ta\'e argachuuf, piroofaayilii keessan bulchuuf, fi dareewwanitti galmaa\'uuf gara akkaawuntii Mana Barumsaa Dilbataa Amdehayimanot keessanitti seenaa.',
    title: 'Baga Nagaan Dhuftan',
    subtitle: 'Akkaawuntii keessan seenuuf seenaa',
    emailLabel: 'Teessoo Imeeyilii',
    passwordLabel: 'Jecha Darbii',
    forgotPassword: 'Jecha darbii irraanfatanii?',
    signInButton: 'Seeni',
    noAccount: 'Akkaawuntii hin qabdan?',
    signUpLink: 'Galmaa\'i',
    loginSuccess: 'Milkaa\'inaan seentaniittu! Baga nagaan dhuftan.',
    loginError: 'Waraqaan ragaa dogoggoraa. Maaloo irra deebi\'aa yaalaa.',
  },
  ge: {
    pageTitle: 'እተዉ',
    pageDescription: 'ለይዘቱ አባላት ብቻ ለመድረስ፣ መገለጫዎን ለማስተዳደር እና በክፍሎች ለመመዝገብ ወደ የእርስዎ ዓምደሃይማኖት ሰንበት ትምህርት ቤት መለያ ይግቡ።',
    title: 'እንቋዕ በሰላም መጻእክሙ',
    subtitle: 'ውስተ መዝገብክሙ ለመግባት እተዉ',
    emailLabel: 'አድራሻ ኢሜይል',
    passwordLabel: 'ቃለ ይለፍ',
    forgotPassword: 'ቃለ ይለፍ ረሳዕክሙኑ?',
    signInButton: 'እተዉ',
    noAccount: 'መዝገብ አልብክሙኑ?',
    signUpLink: 'ተመዝገቡ',
    loginSuccess: 'በሰላም ገባእክሙ! እንቋዕ በሰላም መጻእክሙ።',
    loginError: 'ስህተት ምስክርነቶች። እባክሙ ዳግመ ፈትኑ።',
  },
  es: {
    pageTitle: 'Iniciar Sesión',
    pageDescription: 'Inicia sesión en tu cuenta de la Escuela Dominical Amdehayimanot para acceder a contenido exclusivo para miembros, administrar tu perfil e inscribirte en clases.',
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión para acceder a tu cuenta',
    emailLabel: 'Correo Electrónico',
    passwordLabel: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signInButton: 'Iniciar Sesión',
    noAccount: '¿No tienes una cuenta?',
    signUpLink: 'Regístrate',
    loginSuccess: '¡Inicio de sesión exitoso! Bienvenido de nuevo.',
    loginError: 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
  },
  fr: {
    pageTitle: 'Connexion',
    pageDescription: 'Connectez-vous à votre compte de l\'école du dimanche Amdehayimanot pour accéder au contenu réservé aux membres, gérer votre profil et vous inscrire aux cours.',
    title: 'Content de vous revoir',
    subtitle: 'Connectez-vous pour accéder à votre compte',
    emailLabel: 'Adresse e-mail',
    passwordLabel: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    signInButton: 'Se connecter',
    noAccount: "Vous n'avez pas de compte ?",
    signUpLink: "S'inscrire",
    loginSuccess: 'Connexion réussie ! Content de vous revoir.',
    loginError: 'Identifiants invalides. Veuillez réessayer.',
  },
  ar: {
    pageTitle: 'تسجيل الدخول',
    pageDescription: 'سجل الدخول إلى حساب مدرسة الأحد عماد الإيمان للوصول إلى المحتوى المخصص للأعضاء فقط وإدارة ملفك الشخصي والتسجيل في الفصول.',
    title: 'مرحبا بعودتك',
    subtitle: 'سجل الدخول للوصول إلى حسابك',
    emailLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    signInButton: 'تسجيل الدخول',
    noAccount: 'ليس لديك حساب؟',
    signUpLink: 'انشئ حساب',
    loginSuccess: 'تم تسجيل الدخول بنجاح! مرحبا بعودتك.',
    loginError: 'معلومات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.',
  },
};

const RootBox = styled(Box)(({ theme }) => ({ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(to top, ${theme.palette.grey[50]}, ${theme.palette.grey[200]})` }));
const AnimatedPaper = styled(Paper)(({ theme }) => ({ padding: theme.spacing(3, 4), [theme.breakpoints.up('sm')]: { padding: theme.spacing(5), }, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }));
const GradientButton = styled(Button)(({ theme }) => ({ background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)', color: 'white', borderRadius: '8px', padding: '12px 0', fontWeight: '600', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)' }, '&:disabled': { background: theme.palette.grey[300] } }));

const LoginPage = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- FIX: Import useLocation
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = translations[language] || translations.en;

  // --- FIX: Determine where to redirect after login ---
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      enqueueSnackbar('Please fill in both email and password.', { variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await login(formData);
      enqueueSnackbar(t.loginSuccess, { variant: 'success' });
      // --- FIX: Navigate to the correct page after login ---
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || t.loginError;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | Amde Haymanot Sunday School`}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>
      <RootBox>
        <Container component="main" maxWidth="xs">
          <Slide in={true} direction="up" timeout={500}>
            <Fade in={true} timeout={800}>
              <AnimatedPaper elevation={0}>
                <Avatar sx={{ m: 1, bgcolor: 'transparent', width: 64, height: 64 }}><LockOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} /></Avatar>
                <Typography component="h1" variant="h4" sx={{ fontWeight: '700', mb: 1, background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>{t.subtitle}</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                  <TextField margin="normal" required fullWidth id="email" label={t.emailLabel} name="email" autoComplete="email" autoFocus onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>), }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <TextField margin="normal" required fullWidth name="password" label={t.passwordLabel} type={showPassword ? 'text' : 'password'} id="password" autoComplete="current-password" onChange={handleChange} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment>), }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <Box sx={{ textAlign: 'right', my: 1 }}><Link component={RouterLink} to="/forgot-password" variant="body2"> {t.forgotPassword} </Link></Box>
                  <GradientButton type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }} disabled={loading}>{loading ? <CircularProgress size={24} color="inherit" /> : t.signInButton}</GradientButton>
                  <Grid container justifyContent="center"><Grid item><Typography variant="body2" color="text.secondary">{t.noAccount}{' '}</Typography><Link component={RouterLink} to="/register" variant="body2">{t.signUpLink}</Link></Grid></Grid>
                </Box>
              </AnimatedPaper>
            </Fade>
          </Slide>
        </Container>
      </RootBox>
    </>
  );
};

export default LoginPage;