import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Grid, Link, Paper, Avatar, Fade, Slide, styled,
} from '@mui/material';
import { PersonAddAlt as PersonAddAltIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import SEO from '../components/layout/SEO';
import brand from '../brand';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const translations = {
  en: {
    "pageTitle": "Create an account",
    "pageDescription": "Join Pillar Religion Sunday School with your Google account.",
    "createAccountTitle": "Create an account",
    "pageSubtitle": "Sign up with Google to get started",
    "googleHint": "Your account will be created with one click on Google. No password required.",
    "alreadyHaveAccount": "Already have an account?",
    "signInLink": "Enter",
    "registrationSuccess": "Your account is ready! You are welcome.",
    "registrationFailed": "Failed to register with Google. Please try again."
},
  om: {
    "pageTitle": "Akkaawuntii uumuu",
    "pageDescription": "Mana Barumsaa Sanbataa Amantii Utubaa akkaawuntii Google keessaniin join godhaa.",
    "createAccountTitle": "Akkaawuntii uumuu",
    "pageSubtitle": "Jalqabuuf Google irratti galmaa'aa",
    "googleHint": "Akkaawuntii keessan Google irratti cuqaasuu tokkoon ni uuma. Jechi icciitii hin barbaachisu.",
    "alreadyHaveAccount": "Duraanis akkaawuntii qabduu?",
    "signInLink": "Seenuu",
    "registrationSuccess": "Akkaawuntii keessan qophaa'eera! Homaa miti.",
    "registrationFailed": "Google irratti galmaa'uu hin dandeenye. Mee irra deebi'ii yaalaa."
},
  ti: {
    "pageTitle": "ኣካውንት ምፍጣር",
    "pageDescription": "ኣብ ቤት ትምህርቲ ሰንበት ዓንዲ ሃይማኖት ብናይ Google ኣካውንትኩም ተጸንበሩ።",
    "createAccountTitle": "ኣካውንት ምፍጣር",
    "pageSubtitle": "ንምጅማር ኣብ Google ተመዝገቡ።",
    "googleHint": "ኣካውንትካ ኣብ Google ብሓደ ጠውቂ ክፍጠር እዩ። ፓስዎርድ ኣየድልን።",
    "alreadyHaveAccount": "ድሮ ኣካውንት ኣለካ ድዩ?",
    "signInLink": "ኣእትው",
    "registrationSuccess": "ኣካውንትኩም ድሉው እዩ! ገንዘብካ።",
    "registrationFailed": "ኣብ ጉግል ክምዝገብ ኣይከኣለን። በጃኹም ደጊምኩም ፈትኑ።"
},
  es: {
    "pageTitle": "Crea una cuenta",
    "pageDescription": "Únase a la Escuela Dominical de Pillar Religion con su cuenta de Google.",
    "createAccountTitle": "Crea una cuenta",
    "pageSubtitle": "Regístrese en Google para comenzar",
    "googleHint": "Su cuenta se creará con un clic en Google. No se requiere contraseña.",
    "alreadyHaveAccount": "¿Ya tienes una cuenta?",
    "signInLink": "Ingresar",
    "registrationSuccess": "¡Tu cuenta está lista! De nada.",
    "registrationFailed": "No se pudo registrar en Google. Por favor inténtalo de nuevo."
},
  fr: {
    "pageTitle": "Créer un compte",
    "pageDescription": "Rejoignez l'école du dimanche Pillar Religion avec votre compte Google.",
    "createAccountTitle": "Créer un compte",
    "pageSubtitle": "Inscrivez-vous avec Google pour commencer",
    "googleHint": "Votre compte sera créé en un clic sur Google. Aucun mot de passe requis.",
    "alreadyHaveAccount": "Vous avez déjà un compte ?",
    "signInLink": "Entrer",
    "registrationSuccess": "Votre compte est prêt ! Je vous en prie.",
    "registrationFailed": "Échec de l'inscription auprès de Google. Veuillez réessayer."
},
  ar: {
    "pageTitle": "إنشاء حساب",
    "pageDescription": "انضم إلى مدرسة Pillar Religion Sunday School باستخدام حساب Google الخاص بك.",
    "createAccountTitle": "إنشاء حساب",
    "pageSubtitle": "قم بالتسجيل مع جوجل للبدء",
    "googleHint": "سيتم إنشاء حسابك بنقرة واحدة على جوجل. لا كلمة المرور المطلوبة.",
    "alreadyHaveAccount": "هل لديك حساب بالفعل؟",
    "signInLink": "يدخل",
    "registrationSuccess": "حسابك جاهز! مرحباً بك.",
    "registrationFailed": "فشل التسجيل في جوجل. يرجى المحاولة مرة أخرى."
},
  am: {
    "pageTitle": "መለያ ይፍጠሩ",
    "pageDescription": "በጉግል መለያዎ የዓምደ ሃይማኖት ሰንበት ትምህርት ቤትን ይቀላቀሉ።",
    "createAccountTitle": "መለያ ይፍጠሩ",
    "pageSubtitle": "ለመጀመር በጉግል ይመዝገቡ",
    "googleHint": "በጉግል አንድ ጊዜ በመጫን መለያዎ ይፈጠራል። የይለፍ ቃል አያስፈልግም።",
    "alreadyHaveAccount": "አስቀድመው መለያ አለዎት?",
    "signInLink": "ይግቡ",
    "registrationSuccess": "መለያዎ ዝግጁ ነው! እንኳን ደህና መጡ።",
    "registrationFailed": "በጉግል መመዝገብ አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
},
  ge: {
    "pageTitle": "መለያ ይፍጠሩ",
    "pageDescription": "በጉግል መለያዎ የዓምደ ሃይማኖት ሰንበት ትምህርት ቤትን ይቀላቀሉ።",
    "createAccountTitle": "መለያ ይፍጠሩ",
    "pageSubtitle": "ለመጀመር በጉግል ይመዝገቡ",
    "googleHint": "በጉግል አንድ ጊዜ በመጫን መለያዎ ይፈጠራል። የይለፍ ቃል አያስፈልግም።",
    "alreadyHaveAccount": "አስቀድመው መለያ አለዎት?",
    "signInLink": "ይግቡ",
    "registrationSuccess": "መለያዎ ዝግጁ ነው! እንኳን ደህና መጡ።",
    "registrationFailed": "በጉግል መመዝገብ አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
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
      <SEO title={t.pageTitle} description={t.pageDescription} language={language} />
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
