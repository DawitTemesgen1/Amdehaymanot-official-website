import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Grid, Link, Paper, Avatar, CircularProgress, Fade, Slide, styled, InputAdornment, IconButton } from '@mui/material';
import { PersonAddAlt as PersonAddAltIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, EmailOutlined as EmailIcon, PersonOutline as PersonIcon, LockOutlined as LockIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import brand from '../brand';

const translations = {
  en: {
    pageTitle: "Create an Account",
    pageDescription: "Register for a new account with Amdehaymanot Sunday School to join our online community, enroll in classes, and stay updated with our events.",
    createAccountTitle: "Create Account",
    pageSubtitle: "Join us today and get started",
    fullNameLabel: "Full Name",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    passwordStrengthLabel: "Password strength:",
    createButton: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    signInLink: "Sign In",
    passwordsDoNotMatch: "Passwords do not match!",
    registrationSuccess: "Registration successful! Welcome.",
    registrationFailed: "Registration failed. Please try again.",
  },
  am: {
    pageTitle: "መለያ ይፍጠሩ",
    pageDescription: "ከዓምደሃይማኖት ሰንበት ትምህርት ቤት ጋር አዲስ መለያ ይመዝገቡ። የኦንላይን ማህበረሰባችንን ለመቀላቀል፣ በክፍሎች ለመመዝገብ እና ከክስተቶቻችን ጋር ለመዘመን።",
    createAccountTitle: "መለያ ይፍጠሩ",
    pageSubtitle: "ዛሬውኑ ይቀላቀሉን እና ይጀምሩ",
    fullNameLabel: "ሙሉ ስም",
    emailLabel: "የኢሜይል አድራሻ",
    passwordLabel: "የይለፍ ቃል",
    confirmPasswordLabel: "የይለፍ ቃል ያረጋግጡ",
    passwordStrengthLabel: "የይለፍ ቃል ጥንካሬ:",
    createButton: "መለያ ፍጠር",
    alreadyHaveAccount: "አስቀድመው መለያ አለዎት?",
    signInLink: "ይግቡ",
    passwordsDoNotMatch: "የይለፍ ቃላት አይዛመዱም!",
    registrationSuccess: "ምዝገባው ተሳክቷል! እንኳን ደህና መጡ።",
    registrationFailed: "ምዝገባ አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
  },
  ti: {
    pageTitle: "ኣካውንት ፍጠር",
    pageDescription: "ምስ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ሓድሽ ኣካውንት መዝግብ። ናይ ኦንላይን ማሕበረሰብና ንምጽንባር፡ ኣብ ክፍሊታት ንምምዝጋብን ምስ ፍጻመታትና ንምክትታልን።",
    createAccountTitle: "ኣካውንት ፍጠር",
    pageSubtitle: "ሎሚ ተጸንበሩና ጀምሩ",
    fullNameLabel: "ሙሉእ ሽም",
    emailLabel: "ኢመይል ኣድራሻ",
    passwordLabel: "መሕለፊ ቃል",
    confirmPasswordLabel: "መሕለፊ ቃል ኣረጋግጽ",
    passwordStrengthLabel: "ጽንዓት መሕለፊ ቃል:",
    createButton: "ኣካውንት ፍጠር",
    alreadyHaveAccount: "ድሮ ኣካውንት ኣለካ?",
    signInLink: "እቶ",
    passwordsDoNotMatch: "መሕለፊ ቃላት ኣይመሳሰልን!",
    registrationSuccess: "ምዝገባ ብዓወት ተፈጺሙ! ብደሓን ምጹ።",
    registrationFailed: "ምዝገባ ኣይተኻእለን። በጃኹም እንደገና ፈትኑ።",
  },
  om: {
    pageTitle: "Akkaawuntii Uumuu",
    pageDescription: "Hawaasa keenya kan toora interneetii hirmaachuuf, dareewwanitti galmaa'uuf, fi taateewwan keenyaan yeroo hunda of haaromsuuf Mana Barumsaa Dilbataa Amdehayimanot keessatti akkaawuntii haaraa galmeessi.",
    createAccountTitle: "Akkaawuntii Uumuu",
    pageSubtitle: "Har'a nuutti makamaa jalqabaa",
    fullNameLabel: "Maqaa Guutuu",
    emailLabel: "Teessoo Imeeyilii",
    passwordLabel: "Jecha Icceetii",
    confirmPasswordLabel: "Jecha Icceetii Mirkaneessi",
    passwordStrengthLabel: "Jabeenya Jecha Icceetii:",
    createButton: "Akkaawuntii Uumi",
    alreadyHaveAccount: "Kanaan dura akkaawuntii qabdaa?",
    signInLink: "Seeni",
    passwordsDoNotMatch: "Jechoonni icceetii wal hin fakkaatan!",
    registrationSuccess: "Galmeen milkaa'eera! Nagaan dhuftan.",
    registrationFailed: "Galmeen hin milkoofne. Maaloo irra deebi'aa yaalaa.",
  },
  ge: {
    pageTitle: "ፍጠር መለያ",
    pageDescription: "ለመሳተፍ በማኅበረሰብነ በመስመር፣ ለመመዝገብ በክፍሎች፣ ወለማወቅ ዜና በዓላትነ፣ ፍጠር ሓዲስ መለያ ምስለ ቤተ ትምህርት ሰንበት ዓምደሃይማኖት።",
    createAccountTitle: "ፍጠር መለያ",
    pageSubtitle: "ተጸንበሩ ዮም ወጀምሩ",
    fullNameLabel: "ስም ሙሉእ",
    emailLabel: "አድራሻ ኢሜይል",
    passwordLabel: "ቃል ኅቡእ",
    confirmPasswordLabel: "አረጋግጽ ቃል ኅቡእ",
    passwordStrengthLabel: "ጽንዓተ ቃል ኅቡእ:",
    createButton: "ፍጠር መለያ",
    alreadyHaveAccount: "ሀለወክሙኑ መለያ ቀድሞ?",
    signInLink: "እተወ",
    passwordsDoNotMatch: "ቃላት ኅቡኣን ኢይመሳሰሉ!",
    registrationSuccess: "ምዝገባ ተፈጸመ በሰላም! እንቋዕ በደኃን መጻእኩም።",
    registrationFailed: "ምዝገባ ኢተኻእለ። እባክሙ ዳግመ ፈትኑ።",
  },
  ar: {
    pageTitle: "إنشاء حساب",
    pageDescription: "سجل للحصول على حساب جديد في مدرسة الأحد عماد الإيمان للانضمام إلى مجتمعنا عبر الإنترنت والتسجيل في الفصول والبقاء على اطلاع دائم بأحداثنا.",
    createAccountTitle: "إنشاء حساب",
    pageSubtitle: "انضم إلينا اليوم وابدأ",
    fullNameLabel: "الاسم الكامل",
    emailLabel: "عنوان البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    confirmPasswordLabel: "تأكيد كلمة المرور",
    passwordStrengthLabel: "قوة كلمة المرور:",
    createButton: "إنشاء حساب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signInLink: "تسجيل الدخول",
    passwordsDoNotMatch: "كلمات المرور غير متطابقة!",
    registrationSuccess: "تم التسجيل بنجاح! أهلاً بك.",
    registrationFailed: "فشل التسجيل. يرجى المحاولة مرة أخرى.",
  },
  es: {
    pageTitle: "Crear una Cuenta",
    pageDescription: "Regístrese para obtener una nueva cuenta en la Escuela Dominical Amdehayimanot para unirse a nuestra comunidad en línea, inscribirse en clases y mantenerse actualizado sobre nuestros eventos.",
    createAccountTitle: "Crear cuenta",
    pageSubtitle: "Únete a nosotros hoy y comienza",
    fullNameLabel: "Nombre completo",
    emailLabel: "Dirección de correo electrónico",
    passwordLabel: "Contraseña",
    confirmPasswordLabel: "Confirmar contraseña",
    passwordStrengthLabel: "Fortaleza de la contraseña:",
    createButton: "Crear cuenta",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    signInLink: "Iniciar sesión",
    passwordsDoNotMatch: "¡Las contraseñas no coinciden!",
    registrationSuccess: "¡Registro exitoso! Bienvenido.",
    registrationFailed: "Falló el registro. Inténtalo de nuevo.",
  },
  fr: {
    pageTitle: "Créer un Compte",
    pageDescription: "Créez un nouveau compte à l'école du dimanche Amdehayimanot pour rejoindre notre communauté en ligne, vous inscrire à des cours et rester informé de nos événements.",
    createAccountTitle: "Créer un compte",
    pageSubtitle: "Rejoignez-nous aujourd'hui et commencez",
    fullNameLabel: "Nom complet",
    emailLabel: "Adresse e-mail",
    passwordLabel: "Mot de passe",
    confirmPasswordLabel: "Confirmer le mot de passe",
    passwordStrengthLabel: "Force du mot de passe:",
    createButton: "Créer un compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    signInLink: "Se connecter",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas !",
    registrationSuccess: "Inscription réussie ! Bienvenue.",
    registrationFailed: "L'inscription a échoué. Veuillez réessayer.",
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
const GradientButton = styled(Button)({
  borderRadius: 2,
  padding: '12px 0',
  fontWeight: 600,
});
const PasswordStrengthIndicator = styled(Box)(({ strength, theme }) => { const strengthColors = { 0: theme.palette.error.main, 1: theme.palette.error.main, 2: theme.palette.warning.main, 3: theme.palette.success.main, 4: theme.palette.success.main }; return { height: '4px', borderRadius: '2px', width: `${(strength + 1) * 25}%`, backgroundColor: strengthColors[strength], transition: 'all 0.3s ease', marginTop: '4px' }; });

const RegisterPage = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const t = translations[language] || translations.en;
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(-1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = -1;
    if (password.length > 0) strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    setPasswordStrength(Math.max(0, strength));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar(t.passwordsDoNotMatch, { variant: 'error' });
      return;
    }
    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      enqueueSnackbar(t.registrationSuccess, { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || t.registrationFailed;
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
      <Container component="main" maxWidth="xs" sx={{ py: 4 }}>
        <Slide in={true} direction="up" timeout={500}>
          <Fade in={true} timeout={800}>
            <AnimatedPaper elevation={0}>
              <AuthHeader>
                <Avatar sx={{ m: '0 auto 1rem', bgcolor: brand.gold, color: brand.navyDark, width: 56, height: 56 }}>
                  <PersonAddAltIcon />
                </Avatar>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>{t.createAccountTitle}</Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>{t.pageSubtitle}</Typography>
              </AuthHeader>
              <AuthBody>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField autoComplete="given-name" name="name" required fullWidth id="name" label={t.fullNameLabel} autoFocus onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }}} /></Grid>
                  <Grid item xs={12}><TextField required fullWidth id="email" label={t.emailLabel} name="email" autoComplete="email" onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }}} /></Grid>
                  <Grid item xs={12}>
                    <TextField required fullWidth name="password" label={t.passwordLabel} type={showPassword ? 'text' : 'password'} id="password" onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon color="action" /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }}} />
                    {passwordStrength >= 0 && (<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}><Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>{t.passwordStrengthLabel}</Typography><PasswordStrengthIndicator strength={passwordStrength} /></Box>)}
                  </Grid>
                  <Grid item xs={12}><TextField required fullWidth name="confirmPassword" label={t.confirmPasswordLabel} type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon color="action" /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }}} /></Grid>
                </Grid>
                <GradientButton type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} disabled={loading}>{loading ? <CircularProgress size={24} color="inherit" /> : t.createButton}</GradientButton>
                <Grid container justifyContent="center" spacing={1} sx={{ mt: 2 }}>
                  <Grid item><Typography variant="body2" color="text.secondary">{t.alreadyHaveAccount}</Typography></Grid>
                  <Grid item><Link component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: '600', color: 'primary.main', '&:hover': { textDecoration: 'none' } }}>{t.signInLink}</Link></Grid>
                </Grid>
              </Box>
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