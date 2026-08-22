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
    "pageTitle": "Enter",
    "pageDescription": "Sign in to Pillar Religion Sunday School with your Google account.",
    "title": "Welcome",
    "subtitle": "Continue with Google to log in to your account",
    "googleHint": "We only use Google login — no password required.",
    "noAccount": "Don't have an account?",
    "signUpLink": "Register",
    "loginSuccess": "You are successfully logged in! You are welcome.",
    "loginError": "Failed to sign in with Google. Please try again."
},
  om: {
    "pageTitle": "Seenuu",
    "pageDescription": "Akkaawuntii Google keessaniin Mana Barumsaa Sanbataa Amantii Utubaa keessa seena.",
    "title": "Baga nagaan dhufte",
    "subtitle": "Google itti fufuun akkaawuntii keessan seena",
    "googleHint": "Google login qofa fayyadamna — jecha icciitii hin barbaachisu.",
    "noAccount": "Akkaawuntii hin qabduu?",
    "signUpLink": "Galmeessuu",
    "loginSuccess": "Milkaa'inaan seentee jirta! Homaa miti.",
    "loginError": "Google waliin seenuu hin dandeenye. Mee irra deebi'ii yaalaa."
},
  ti: {
    "pageTitle": "ኣእትው",
    "pageDescription": "ኣብ ቤት ትምህርቲ ሰንበት ዓንዲ ሃይማኖት ብናይ Google ኣካውንትኩም እቶ።",
    "title": "እንኳዕ ደሓን መፁ",
    "subtitle": "ናብ ኣካውንትካ ንምእታው ብጉግል ቀጽል",
    "googleHint": "Google login ጥራይ ኢና ንጥቀም — ፓስዎርድ ኣየድልን።",
    "noAccount": "ኣካውንት የብልካን?",
    "signUpLink": "ምዝገባ",
    "loginSuccess": "ብዓወት ኣቲኻ ኣለኻ! ገንዘብካ።",
    "loginError": "ብጉግል ክኣቱ ኣይከኣለን። በጃኹም ደጊምኩም ፈትኑ።"
},
  es: {
    "pageTitle": "Ingresar",
    "pageDescription": "Inicie sesión en la Escuela Dominical de Pillar Religion con su cuenta de Google.",
    "title": "Bienvenido",
    "subtitle": "Continúe con Google para iniciar sesión en su cuenta",
    "googleHint": "Solo utilizamos el inicio de sesión de Google, no se requiere contraseña.",
    "noAccount": "¿No tienes una cuenta?",
    "signUpLink": "Registro",
    "loginSuccess": "¡Has iniciado sesión correctamente! De nada.",
    "loginError": "No se pudo iniciar sesión con Google. Por favor inténtalo de nuevo."
},
  fr: {
    "pageTitle": "Entrer",
    "pageDescription": "Connectez-vous à l’école du dimanche Pillar Religion avec votre compte Google.",
    "title": "Accueillir",
    "subtitle": "Continuez avec Google pour vous connecter à votre compte",
    "googleHint": "Nous utilisons uniquement la connexion Google – aucun mot de passe requis.",
    "noAccount": "Vous n'avez pas de compte ?",
    "signUpLink": "Registre",
    "loginSuccess": "Vous êtes connecté avec succès ! Je vous en prie.",
    "loginError": "Échec de la connexion avec Google. Veuillez réessayer."
},
  ar: {
    "pageTitle": "يدخل",
    "pageDescription": "قم بتسجيل الدخول إلى Pillar Religion Sunday School باستخدام حساب Google الخاص بك.",
    "title": "مرحباً",
    "subtitle": "تابع مع Google لتسجيل الدخول إلى حسابك",
    "googleHint": "نحن نستخدم تسجيل الدخول بحساب Google فقط، ولا نحتاج إلى كلمة مرور.",
    "noAccount": "ليس لديك حساب؟",
    "signUpLink": "يسجل",
    "loginSuccess": "لقد تم تسجيل دخولك بنجاح! مرحباً بك.",
    "loginError": "فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى."
},
  am: {
    "pageTitle": "ይግቡ",
    "pageDescription": "በጉግል መለያዎ ወደ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ይግቡ።",
    "title": "እንኳን ደህና መጡ",
    "subtitle": "ወደ መለያዎ ለመግባት በጉግል ይቀጥሉ",
    "googleHint": "የምንጠቀመው የጉግል መግቢያ ብቻ ነው — የይለፍ ቃል አያስፈልግም።",
    "noAccount": "መለያ የለዎትም?",
    "signUpLink": "ይመዝገቡ",
    "loginSuccess": "በተሳካ ሁኔታ ገብተዋል! እንኳን ደህና መጡ።",
    "loginError": "በጉግል መግባት አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
},
  ge: {
    "pageTitle": "ይግቡ",
    "pageDescription": "በጉግል መለያዎ ወደ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ይግቡ።",
    "title": "እንኳን ደህና መጡ",
    "subtitle": "ወደ መለያዎ ለመግባት በጉግል ይቀጥሉ",
    "googleHint": "የምንጠቀመው የጉግል መግቢያ ብቻ ነው — የይለፍ ቃል አያስፈልግም።",
    "noAccount": "መለያ የለዎትም?",
    "signUpLink": "ይመዝገቡ",
    "loginSuccess": "በተሳካ ሁኔታ ገብተዋል! እንኳን ደህና መጡ።",
    "loginError": "በጉግል መግባት አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
},
};;

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
