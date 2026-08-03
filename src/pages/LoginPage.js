import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, Grid, Link, Paper, Avatar, Fade, Slide, styled,
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import brand from '../brand';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const translations = {
  en: {
    pageTitle: 'Sign in',
    pageDescription: 'Sign in to Amde Haymanot Sunday School with your Google account.',
    title: 'Welcome back',
    subtitle: 'Continue with Google to access your account',
    googleHint: 'We only use Google sign-in — no password needed.',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign up',
    loginSuccess: 'Signed in successfully. Welcome back.',
    loginError: 'Google sign-in failed. Please try again.',
  },
  am: {
    pageTitle: 'ይግቡ',
    pageDescription: 'በጉግል መለያዎ ወደ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ይግቡ።',
    title: 'እንኳን ደህና መጡ',
    subtitle: 'ወደ መለያዎ ለመግባት በጉግል ይቀጥሉ',
    googleHint: 'የምንጠቀመው የጉግል መግቢያ ብቻ ነው — የይለፍ ቃል አያስፈልግም።',
    noAccount: 'መለያ የለዎትም?',
    signUpLink: 'ይመዝገቡ',
    loginSuccess: 'በተሳካ ሁኔታ ገብተዋል! እንኳን ደህና መጡ።',
    loginError: 'በጉግል መግባት አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
  },
  ti: {
    pageTitle: 'እተዉ',
    pageDescription: 'ብጉግል ኣካውንትኩም ናብ ቤት ትምህርቲ ሰንበት ዓምደ ሃይማኖት እተዉ።',
    title: 'እንቋዕ ብደሓን መጻእኩም',
    subtitle: 'ናብ ሕሳብኩም ንምእታው ብጉግል ቀጽሉ',
    googleHint: 'ንሕና ብጉግል ጥራይ ንኣቱ — መሕለፊ ቃል ኣየድልን።',
    noAccount: 'ሕሳብ የብልኩምን?',
    signUpLink: 'ተመዝገቡ',
    loginSuccess: 'ብዓወት ኣቲኹም! እንቋዕ ብደሓን መጻእኩም።',
    loginError: 'ብጉግል ምእታው ኣይተኻእለን። በጃኹም እንደገና ፈትኑ።',
  },
  om: {
    pageTitle: 'Seeni',
    pageDescription: 'Akkaawuntii Google keessaniin gara Mana Barumsaa Dilbataa Amde Haymanot seenaa.',
    title: 'Baga Nagaan Dhuftan',
    subtitle: 'Akkaawuntii keessan seenuuf Google waliin itti fufaa',
    googleHint: 'Seensa Google qofa ni fayyadamna — jecha icceetii hin barbaachisu.',
    noAccount: 'Akkaawuntii hin qabdan?',
    signUpLink: "Galmaa'i",
    loginSuccess: "Milkaa'inaan seentaniittu! Baga nagaan dhuftan.",
    loginError: "Seensi Google hin milkoofne. Maaloo irra deebi'aa yaalaa.",
  },
  ge: {
    pageTitle: 'እተዉ',
    pageDescription: 'በጉግል መለያክሙ ውስተ ቤተ ትምህርት ሰንበት ዓምደ ሃይማኖት እተዉ።',
    title: 'እንቋዕ በሰላም መጻእክሙ',
    subtitle: 'ውስተ መዝገብክሙ ለመግባት በጉግል ቀጽሉ',
    googleHint: 'በጉግል ብቻ ንኣቱ — ቃለ ይለፍ ኢየድል።',
    noAccount: 'መዝገብ አልብክሙኑ?',
    signUpLink: 'ተመዝገቡ',
    loginSuccess: 'በሰላም ገባእክሙ! እንቋዕ በሰላም መጻእክሙ።',
    loginError: 'በጉግል ምእታው ኢተኻእለ። እባክሙ ዳግመ ፈትኑ።',
  },
  es: {
    pageTitle: 'Iniciar sesión',
    pageDescription: 'Inicia sesión en la Escuela Dominical Amde Haymanot con tu cuenta de Google.',
    title: 'Bienvenido de nuevo',
    subtitle: 'Continúa con Google para acceder a tu cuenta',
    googleHint: 'Solo usamos inicio de sesión con Google — no necesitas contraseña.',
    noAccount: '¿No tienes una cuenta?',
    signUpLink: 'Regístrate',
    loginSuccess: 'Sesión iniciada correctamente. Bienvenido de nuevo.',
    loginError: 'Error al iniciar sesión con Google. Inténtalo de nuevo.',
  },
  fr: {
    pageTitle: 'Connexion',
    pageDescription: "Connectez-vous à l'École du Dimanche Amde Haymanot avec votre compte Google.",
    title: 'Content de vous revoir',
    subtitle: 'Continuez avec Google pour accéder à votre compte',
    googleHint: "Nous n'utilisons que Google — aucun mot de passe requis.",
    noAccount: "Vous n'avez pas de compte ?",
    signUpLink: "S'inscrire",
    loginSuccess: 'Connexion réussie. Content de vous revoir.',
    loginError: 'Échec de la connexion Google. Veuillez réessayer.',
  },
  ar: {
    pageTitle: 'تسجيل الدخول',
    pageDescription: 'سجّل الدخول إلى مدرسة الأحد عمود الإيمان بحساب Google.',
    title: 'مرحباً بعودتك',
    subtitle: 'تابع مع Google للوصول إلى حسابك',
    googleHint: 'نستخدم تسجيل الدخول عبر Google فقط — لا حاجة لكلمة مرور.',
    noAccount: 'ليس لديك حساب؟',
    signUpLink: 'إنشاء حساب',
    loginSuccess: 'تم تسجيل الدخول بنجاح. مرحباً بعودتك.',
    loginError: 'فشل تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.',
  },
};

const RootBox = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 74px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: brand.stone,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const AnimatedPaper = styled(Paper)({
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 2,
  overflow: 'hidden',
  boxShadow: 'none',
  border: `1px solid ${brand.borderSubtle}`,
  background: brand.surfaceElevated,
  maxWidth: 440,
  width: '100%',
});

const AuthHeader = styled(Box)(({ theme }) => ({
  width: '100%',
  background: `linear-gradient(160deg, ${brand.navyInk} 0%, ${brand.navy} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(4, 3),
  textAlign: 'center',
  borderBottom: `2px solid ${brand.gold}`,
}));

const AuthBody = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(4, 3),
}));

const LoginPage = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const t = translations[language] || translations.en;
  const from = location.state?.from?.pathname || '/dashboard';

  const handleGoogleSuccess = async (credential) => {
    setLoading(true);
    try {
      await loginWithGoogle(credential);
      enqueueSnackbar(t.loginSuccess, { variant: 'success' });
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || t.loginError;
      enqueueSnackbar(errorMessage, { variant: 'error' });
      throw err;
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
          <Slide in direction="up" timeout={500}>
            <Fade in timeout={800}>
              <AnimatedPaper elevation={0}>
                <AuthHeader>
                  <Avatar sx={{ m: '0 auto 1rem', bgcolor: brand.gold, color: brand.navyDark, width: 56, height: 56 }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                    {t.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    {t.subtitle}
                  </Typography>
                </AuthHeader>
                <AuthBody>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', mb: 3, lineHeight: 1.6 }}
                  >
                    {t.googleHint}
                  </Typography>
                  <GoogleAuthButton
                    language={language}
                    text="signin_with"
                    disabled={loading}
                    onSuccess={handleGoogleSuccess}
                    onError={(err) => {
                      enqueueSnackbar(err?.message || t.loginError, { variant: 'error' });
                    }}
                  />
                  <Grid container justifyContent="center" sx={{ mt: 3 }}>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary" component="span">
                        {t.noAccount}{' '}
                      </Typography>
                      <Link component={RouterLink} to="/register" variant="body2">
                        {t.signUpLink}
                      </Link>
                    </Grid>
                  </Grid>
                </AuthBody>
              </AnimatedPaper>
            </Fade>
          </Slide>
        </Container>
      </RootBox>
    </>
  );
};

export default LoginPage;
