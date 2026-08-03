import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Grid, Link, Paper, Avatar, Fade, Slide, styled,
} from '@mui/material';
import { PersonAddAlt as PersonAddAltIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import brand from '../brand';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const translations = {
  en: {
    pageTitle: 'Create an account',
    pageDescription: 'Join Amde Haymanot Sunday School with your Google account.',
    createAccountTitle: 'Create account',
    pageSubtitle: 'Sign up with Google to get started',
    googleHint: 'One tap with Google creates your account. No password to remember.',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    registrationSuccess: 'Account ready. Welcome!',
    registrationFailed: 'Google sign-up failed. Please try again.',
  },
  am: {
    pageTitle: 'መለያ ይፍጠሩ',
    pageDescription: 'በጉግል መለያዎ የዓምደ ሃይማኖት ሰንበት ትምህርት ቤትን ይቀላቀሉ።',
    createAccountTitle: 'መለያ ይፍጠሩ',
    pageSubtitle: 'ለመጀመር በጉግል ይመዝገቡ',
    googleHint: 'በጉግል አንድ ጊዜ በመጫን መለያዎ ይፈጠራል። የይለፍ ቃል አያስፈልግም።',
    alreadyHaveAccount: 'አስቀድመው መለያ አለዎት?',
    signInLink: 'ይግቡ',
    registrationSuccess: 'መለያዎ ዝግጁ ነው! እንኳን ደህና መጡ።',
    registrationFailed: 'በጉግል መመዝገብ አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
  },
  ti: {
    pageTitle: 'ኣካውንት ፍጠር',
    pageDescription: 'ብጉግል ኣካውንትኩም ናብ ቤት ትምህርቲ ሰንበት ዓምደ ሃይማኖት ተጸንበሩ።',
    createAccountTitle: 'ኣካውንት ፍጠር',
    pageSubtitle: 'ንምጅማር ብጉግል ተመዝገቡ',
    googleHint: 'ብጉግል ሓደ ጊዜ ብምጽቃጥ ኣካውንትኩም ይፍጠር። መሕለፊ ቃል ኣየድልን።',
    alreadyHaveAccount: 'ድሮ ኣካውንት ኣለካ?',
    signInLink: 'እቶ',
    registrationSuccess: 'ኣካውንትኩም ድሉው እዩ! ብደሓን ምጹ።',
    registrationFailed: 'ብጉግል ምምዝጋብ ኣይተኻእለን። በጃኹም እንደገና ፈትኑ።',
  },
  om: {
    pageTitle: 'Akkaawuntii Uumuu',
    pageDescription: "Akkaawuntii Google keessaniin Mana Barumsaa Dilbataa Amde Haymanotitti makamaa.",
    createAccountTitle: 'Akkaawuntii Uumuu',
    pageSubtitle: "Jalqabuuf Google waliin galmaa'aa",
    googleHint: "Google waliin al tokko cuqaasuun akkaawuntii keessan uuma. Jecha icceetii hin barbaachisu.",
    alreadyHaveAccount: 'Kanaan dura akkaawuntii qabdaa?',
    signInLink: 'Seeni',
    registrationSuccess: "Akkaawuntiin qophaa'eera! Nagaan dhuftan.",
    registrationFailed: "Galmeen Google hin milkoofne. Maaloo irra deebi'aa yaalaa.",
  },
  ge: {
    pageTitle: 'ፍጠር መለያ',
    pageDescription: 'በጉግል መለያክሙ ውስተ ቤተ ትምህርት ሰንበት ዓምደ ሃይማኖት ተጸንበሩ።',
    createAccountTitle: 'ፍጠር መለያ',
    pageSubtitle: 'ለመጀመር በጉግል ተመዝገቡ',
    googleHint: 'በጉግል አንድ ጊዜ በመጽቀጥ መለያክሙ ይፍጠር። ቃለ ይለፍ ኢየድል።',
    alreadyHaveAccount: 'ሀለወክሙኑ መለያ ቀድሞ?',
    signInLink: 'እተወ',
    registrationSuccess: 'መለያክሙ ዝጉጅ! እንቋዕ በደኃን መጻእኩም።',
    registrationFailed: 'በጉግል ምምዝጋብ ኢተኻእለ። እባክሙ ዳግመ ፈትኑ።',
  },
  ar: {
    pageTitle: 'إنشاء حساب',
    pageDescription: 'انضم إلى مدرسة الأحد عمود الإيمان بحساب Google.',
    createAccountTitle: 'إنشاء حساب',
    pageSubtitle: 'سجّل عبر Google للبدء',
    googleHint: 'نقرة واحدة مع Google تنشئ حسابك. لا حاجة لكلمة مرور.',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInLink: 'تسجيل الدخول',
    registrationSuccess: 'حسابك جاهز. أهلاً بك!',
    registrationFailed: 'فشل التسجيل عبر Google. يرجى المحاولة مرة أخرى.',
  },
  es: {
    pageTitle: 'Crear una cuenta',
    pageDescription: 'Únete a la Escuela Dominical Amde Haymanot con tu cuenta de Google.',
    createAccountTitle: 'Crear cuenta',
    pageSubtitle: 'Regístrate con Google para comenzar',
    googleHint: 'Un toque con Google crea tu cuenta. No necesitas contraseña.',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    signInLink: 'Iniciar sesión',
    registrationSuccess: 'Cuenta lista. ¡Bienvenido!',
    registrationFailed: 'Error al registrarse con Google. Inténtalo de nuevo.',
  },
  fr: {
    pageTitle: 'Créer un compte',
    pageDescription: "Rejoignez l'École du Dimanche Amde Haymanot avec votre compte Google.",
    createAccountTitle: 'Créer un compte',
    pageSubtitle: 'Inscrivez-vous avec Google pour commencer',
    googleHint: 'Un clic avec Google crée votre compte. Aucun mot de passe à retenir.',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    signInLink: 'Se connecter',
    registrationSuccess: 'Compte prêt. Bienvenue !',
    registrationFailed: "Échec de l'inscription Google. Veuillez réessayer.",
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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 2,
  overflow: 'hidden',
  boxShadow: 'none',
  border: `1px solid ${brand.borderSubtle}`,
  background: brand.surfaceElevated,
  maxWidth: 480,
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

const RegisterPage = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const t = translations[language] || translations.en;
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credential) => {
    setLoading(true);
    try {
      await loginWithGoogle(credential);
      enqueueSnackbar(t.registrationSuccess, { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || t.registrationFailed;
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
        <Container component="main" maxWidth="xs" sx={{ py: 4 }}>
          <Slide in direction="up" timeout={500}>
            <Fade in timeout={800}>
              <AnimatedPaper elevation={0}>
                <AuthHeader>
                  <Avatar sx={{ m: '0 auto 1rem', bgcolor: brand.gold, color: brand.navyDark, width: 56, height: 56 }}>
                    <PersonAddAltIcon />
                  </Avatar>
                  <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                    {t.createAccountTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    {t.pageSubtitle}
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
                    text="signup_with"
                    disabled={loading}
                    onSuccess={handleGoogleSuccess}
                    onError={(err) => {
                      enqueueSnackbar(err?.message || t.registrationFailed, { variant: 'error' });
                    }}
                  />
                  <Grid container justifyContent="center" spacing={1} sx={{ mt: 3 }}>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        {t.alreadyHaveAccount}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Link
                        component={RouterLink}
                        to="/login"
                        variant="body2"
                        sx={{ fontWeight: 600, color: 'primary.main', '&:hover': { textDecoration: 'none' } }}
                      >
                        {t.signInLink}
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

export default RegisterPage;
