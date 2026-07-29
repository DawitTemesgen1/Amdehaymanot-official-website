import React, { useState } from 'react';
import {
  Box, Typography, Container, Grid, Paper, TextField, Button,
  styled, CircularProgress, useTheme, Divider, IconButton, Tooltip,
  Icon
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';

import api from '../api/axiosConfig';
import { PageSection, SectionHeader, PageHero } from '../components/ui';
import brand from '../brand';
import { PLAY_STORE_URL } from '../config/links';
import contactHero from '../assets/community.jpg';

const translations = {
  en: { pageTitle: "Contact Us", pageDescription: "Get in touch with Amdehaymanot Sunday School in Jimma, Ethiopia. Find our address, phone number, and send us a message through our contact form.", appName: "Amdehaymanot Sunday School", churchName: "Saint Mary Cathedral", churchLocation: "Jimma, Ethiopia", pageTitleHeader: "Connect With Us", pageSubtitle: "We're here to answer your questions and welcome your feedback. Reach out through the form below or connect with us directly.", infoTitle: "Our Information", locationLabel: "Our Location", phoneLabel: "Phone Number", emailLabel: "Email Address", followUsLabel: "Follow Us", formTitle: "Send Us a Message", nameLabel: "Your Name", emailFormLabel: "Your Email", subjectLabel: "Subject", messageLabel: "Your Message", sendButton: "Send Message", sendingButton: "Sending...", successTitle: "Thank You!", successMessage: "Your message has been successfully sent. We'll get back to you within 24-48 hours.", sendAnotherButton: "Send Another Message", securityNote: "Your information is protected and will not be shared.", snackbar: { success: 'Your message has been sent successfully!', error: 'Failed to send message. Please try again later.' } },
  am: { pageTitle: "ያግኙን", pageDescription: "ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት ጋር ይገናኙ። አድራሻችንን፣ ስልክ ቁጥራችንን ያግኙ እና በእኛ መገኛ ቅጽ በኩል መልዕክት ይላኩልን።", appName: "ዓምደሃይማኖት ሰንበት ትምህርት ቤት", churchName: "የቅድስት ማርያም ካቴድራል", churchLocation: "ጅማ, ኢትዮጵያ", pageTitleHeader: "ከእኛ ጋር ይገናኙ", pageSubtitle: "ጥያቄዎችዎን ለመመለስ እና አስተያየትዎን ለመቀበል እዚህ ነን። ከታች ባለው ቅጽ በኩል ያግኙን ወይም በቀጥታ ከእኛ ጋር ይገናኙ።", infoTitle: "የእኛ መረጃ", locationLabel: "የእኛ አድራሻ", phoneLabel: "ስልክ ቁጥር", emailLabel: "ኢሜይል አድራሻ", followUsLabel: "ይከተሉን", formTitle: "መልዕክት ይላኩልን", nameLabel: "የእርስዎ ስም", emailFormLabel: "የእርስዎ ኢሜይል", subjectLabel: "ርዕሰ ጉዳይ", messageLabel: "የእርስዎ መልዕክት", sendButton: "መልዕክት ላክ", sendingButton: "እየተላከ ነው...", successTitle: "እናመሰግናለን!", successMessage: "መልዕክትዎ በተሳካ ሁኔታ ተልኳል። በ24-48 ሰዓታት ውስጥ ምላሽ እንሰጥዎታለን።", sendAnotherButton: "ሌላ መልዕክት ላክ", securityNote: "የእርስዎ መረጃ የተጠበቀ ነው እና ለማንም አይሰጥም።", snackbar: { success: 'መልዕክትዎ በተሳካ ሁኔታ ተልኳል!', error: 'መልዕክት መላክ አልተሳካም። እባክዎ ቆይተው እንደገና ይሞክሩ።' } },
  om: { pageTitle: "Nu Qunnamaa", pageDescription: "Mana Barumsaa Dilbataa Amdehayimanot Jimmaatti argamu qunnamaa. Teessoo, lakkoofsa bilbilaa keenya argadhaa, fi unka keenyaan ergaa nuuf ergaa.", appName: "Mana Barumsaa Dilbataa Amdehayimanot", churchName: "Katidiraalii Qulqulleettii Maariyaam", churchLocation: "Jimmaa, Itoophiyaa", pageTitleHeader: "Nu Qunnamaa", pageSubtitle: "Gaaffiiwwan keessan deebisuuf yaada keessanis simachuuf as jirra. Unka armaan gadiitiin nu qunnamaa yookiin kallattiidhaan nu waliin wal qunnamaa.", infoTitle: "Odeeffannoo Keenya", locationLabel: "Iddoo Keenya", phoneLabel: "Lakkofsa Bilbilaa", emailLabel: "Teessoo Imeelii", followUsLabel: "Nu Hordofaa", formTitle: "Ergaa Nuuf Ergaa", nameLabel: "Maqaa Keessan", emailFormLabel: "Imeelii Keessan", subjectLabel: "Mata Duree", messageLabel: "Ergaa Keessan", sendButton: "Ergaa Ergi", sendingButton: "Ergamaa Jira...", successTitle: "Galatoomaa!", successMessage: "Ergaan keessan milkaa'inaan ergameera. Sa'aatii 24-48 keessatti isiniif deebisna.", sendAnotherButton: "Ergaa Biraa Ergi", securityNote: "Odeeffannoon keessan eegamaadha, eenyufiyyuu hin hiramu.", snackbar: { success: 'Ergaan keessan milkaa’inaan ergameera!', error: 'Ergaa erguun hin milkoofne. Maaloo booda irra deebi’aa yaalaa.' } },
  ti: { pageTitle: "ተራኸቡና", pageDescription: "ምስ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ኣብ ጅማ ተራኸቡ። ኣድራሻና፡ ቁጽሪ ስልክና ርኸቡን መልእኽቲ ብመንገዲ ናይ መርበብ ሓበሬታና ስደዱልና።", appName: "ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት", churchName: "ካቴድራል ቅድስት ማርያም", churchLocation: "ጅማ, ኢትዮጵያ", pageTitleHeader: "ምሳና ተራኸቡ", pageSubtitle: "ሕቶታትኩም ንምምላስን ርእይቶኹም ንምቕባልን ኣብዚ ኣለና። በቲ ኣብ ታሕቲ ዘሎ ቅጥዒ ርኸቡና ወይ ብቐጥታ ምሳና ተራኸቡ።", infoTitle: "ሓበሬታና", locationLabel: "ኣድራሻና", phoneLabel: "ቁጽሪ ስልኪ", emailLabel: "ኢመይል ኣድራሻ", followUsLabel: "ተኸታተሉና", formTitle: "መልእኽቲ ስደዱልና", nameLabel: "ሽምኩም", emailFormLabel: "ኢመይልኩም", subjectLabel: "ጉዳይ", messageLabel: "መልእኽትኹም", sendButton: "መልእኽቲ ስደድ", sendingButton: "ይስደድ ኣሎ...", successTitle: "የቐንየልና!", successMessage: "መልእኽትኹም ብዓወት ተላኢኹ። ኣብ ውሽጢ 24-48 ሰዓታት ክንምልሰልኩም ኢና።", sendAnotherButton: "ኻሊእ መልእኽቲ ስደድ", securityNote: "ሓበሬታኹም ዝተሓለወ እዩን ንኻልእ ኣይካፈልን እዩ።", snackbar: { success: 'መልእኽትኹም ብዓወት ተላኢኹ!', error: 'መልእኽቲ ምልኣኽ ኣይተኻእለን። በጃኹም ጸኒሕኩም እንደገና ፈትኑ።' } },
  ge: { pageTitle: "ተራከቡነ", pageDescription: "ምስለ ቤተ ትምህርት ሰንበት ዓምደሃይማኖት በጅማ ተራከቡ። አድራሻነ፣ ቁጽረ ስልክነ ርከቡ ወፈነዉ መልእክተ በበድረ ገጽነ።", appName: "ቤተ ትምህርት ሰንበት ዓምደሃይማኖት", churchName: "ቤተ ፡ ክርስቲያን ፡ ቅድስት ፡ ማርያም", churchLocation: "ጅማ ፡ ኢትዮጵያ", pageTitleHeader: "ተራከቡነ", pageSubtitle: "ንሕነ ፡ ዝየነ ፡ ለምላሽ ፡ ጥያቄያቲክሙ ፡ ወለተቀብሎ ፡ ርእይቶቲክሙ። ተራከቡነ ፡ በቅጽ ፡ ዝንቱ ፡ ታሕተ ፡ ወይስ ፡ በቀጥታ።", infoTitle: "ዜናነ", locationLabel: "መካንነ", phoneLabel: "ቁጽረ ፡ ስልክ", emailLabel: "አድራሻ ፡ ኢሜይል", followUsLabel: "ተከተሉነ", formTitle: "ፈነዉ ፡ መልእክተ ፡ ለንሕነ", nameLabel: "ስምከ/ኪ", emailFormLabel: "ኢሜይልከ/ኪ", subjectLabel: "ርእስ", messageLabel: "መልእክትከ/ኪ", sendButton: "ፈኑ ፡ መልእክተ", sendingButton: "ይትፌነዉ ፡ አልቦ...", successTitle: "ይትባረክ!", successMessage: "መልእክትክሙ ፡ ተፈነወ ፡ በሰላም። ንመልስ ፡ ለክሙ ፡ ውስተ ፡ 24-48 ፡ ሰዓታት።", sendAnotherButton: "ፈኑ ፡ ካልአ ፡ መልእክተ", securityNote: "ዜናክሙ ፡ ኅልው ፡ ውእቱ ፡ ወኢይትካፈል ፡ ለማንም።", snackbar: { success: 'መልእክትክሙ ፡ ተፈነወ ፡ በሰላም!', error: 'ፈነወ ፡ መልእክት ፡ አልቦ ፡ ተሳከፈ። እባክዎ ፡ ጸኒሕክሙ ፡ ዳግመ ፡ ፈትኑ።' } },
  es: { pageTitle: "Contáctenos", pageDescription: "Póngase en contacto con la Escuela Dominical Amdehayimanot en Jimma, Etiopía. Encuentre nuestra dirección, número de teléfono y envíenos un mensaje a través de nuestro formulario de contacto.", appName: "Escuela Dominical Amdehayimanot", churchName: "Catedral de Santa María", churchLocation: "Jimma, Etiopía", pageTitleHeader: "Conéctate con Nosotros", pageSubtitle: "Estamos aquí para responder tus preguntas y recibir tus comentarios. Contáctanos a través del siguiente formulario o directamente.", infoTitle: "Nuestra Información", locationLabel: "Nuestra Ubicación", phoneLabel: "Número de Teléfono", emailLabel: "Dirección de Correo Electrónico", followUsLabel: "Síguenos", formTitle: "Envíanos un Mensaje", nameLabel: "Tu Nombre", emailFormLabel: "Tu Correo Electrónico", subjectLabel: "Asunto", messageLabel: "Tu Mensaje", sendButton: "Enviar Mensaje", sendingButton: "Enviando...", successTitle: "¡Gracias!", successMessage: "Tu mensaje ha sido enviado con éxito. Te responderemos en 24-48 horas.", sendAnotherButton: "Enviar Otro Mensaje", securityNote: "Tu información está protegida y no será compartida.", snackbar: { success: '¡Tu mensaje ha sido enviado con éxito!', error: 'No se pudo enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' } },
  fr: { pageTitle: "Nous Contacter", pageDescription: "Prenez contact avec l'école du dimanche Amdehayimanot à Jimma, Éthiopie. Trouvez notre adresse, notre numéro de téléphone et envoyez-nous un message via notre formulaire de contact.", appName: "École du Dimanche Amdehayimanot", churchName: "Cathédrale Sainte-Marie", churchLocation: "Jimma, Éthiopie", pageTitleHeader: "Connectez-vous avec Nous", pageSubtitle: "Nous sommes là pour répondre à vos questions et accueillir vos commentaires. Contactez-nous via le formulaire ci-dessous ou directement.", infoTitle: "Nos Informations", locationLabel: "Notre Emplacement", phoneLabel: "Numéro de Téléphone", emailLabel: "Adresse E-mail", followUsLabel: "Suivez-nous", formTitle: "Envoyez-nous un Message", nameLabel: "Votre Nom", emailFormLabel: "Votre E-mail", subjectLabel: "Sujet", messageLabel: "Votre Message", sendButton: "Envoyer le Message", sendingButton: "Envoi en cours...", successTitle: "Merci !", successMessage: "Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 à 48 heures.", sendAnotherButton: "Envoyer un autre Message", securityNote: "Vos informations sont protégées et ne seront pas partagées.", snackbar: { success: 'Votre message a été envoyé avec succès !', error: 'Échec de l\'envoi du message. Veuillez réessayer plus tard.' } },
  ar: { pageTitle: "اتصل بنا", pageDescription: "تواصل مع مدرسة الأحد عماد الإيمان في جيما، إثيوبيا. اعثر على عنواننا ورقم هاتفنا وأرسل لنا رسالة عبر نموذج الاتصال الخاص بنا.", appName: "مدرسة الأحد عماد الإيمان", churchName: "كاتدرائية القديسة مريم", churchLocation: "جيما، إثيوبيا", pageTitleHeader: "تواصل معنا", pageSubtitle: "نحن هنا للإجابة على أسئلتكم والترحيب بآرائكم. تواصلوا معنا عبر النموذج أدناه أو اتصلوا بنا مباشرة.", infoTitle: "معلوماتنا", locationLabel: "موقعنا", phoneLabel: "رقم الهاتف", emailLabel: "البريد الإلكتروني", followUsLabel: "تابعنا", formTitle: "أرسل لنا رسالة", nameLabel: "اسمك", emailFormLabel: "بريدك الإلكتروني", subjectLabel: "الموضوع", messageLabel: "رسالتك", sendButton: "إرسال الرسالة", sendingButton: "جارٍ الإرسال...", successTitle: "شكرًا لك!", successMessage: "تم إرسال رسالتك بنجاح. سنعود إليك في غضون 24-48 ساعة.", sendAnotherButton: "إرسال رسالة أخرى", securityNote: "معلوماتك محمية ولن تتم مشاركتها.", snackbar: { success: 'تم إرسال رسالتك بنجاح!', error: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى في وقت لاحق.' } }
};

const GradientPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  background: brand.surfaceElevated,
  border: `1px solid ${brand.borderSubtle}`,
  boxShadow: 'none',
  borderRadius: 2,
  transition: 'border-color 0.3s ease',
  '&:hover': { borderColor: brand.borderGold },
}));
const InfoItem = styled(Box)(({ theme }) => ({ display: 'flex', alignItems: 'flex-start', marginBottom: theme.spacing(3), '& .MuiIcon-root': { marginRight: theme.spacing(2), color: theme.palette.secondary.main, fontSize: '1.8rem' }, '&:hover .MuiIcon-root': { transform: 'scale(1.1)', transition: 'transform 0.3s ease' } }));
const SocialButton = styled(IconButton)(({ theme }) => ({ margin: theme.spacing(0.5), backgroundColor: theme.palette.background.paper, '&:hover': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText } }));

const ContactPage = ({ language = 'en' }) => {
  const theme = useTheme();
  const t = translations[language] || translations.en;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required.";
    tempErrors.email = (/$^|.+@.+..+/).test(formData.email) ? "" : "Email is not valid.";
    tempErrors.message = formData.message ? "" : "Message is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      enqueueSnackbar('Please correct the form errors.', { variant: 'warning' });
      return;
    }
    setLoading(true);

    try {
      // MODIFIED: Removed '/api' from the endpoint URL.
      // The 'api' instance already has the base URL set to '.../api'.
      const response = await api.post('/contact', formData); 
      
      console.log('Success:', response.data);
      setFormSubmitted(true);
      enqueueSnackbar(t.snackbar.success, { variant: 'success' });

    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || t.snackbar.error;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setFormSubmitted(false);
  };

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | ${t.appName}`}</title>
        <meta name="description" content={t.pageDescription} />
        <meta 
          name="keywords" 
          content="contact amdehaymanot, jimma sunday school address, ዓምደሃይማኖት ስልክ ቁጥር, ጂማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት, amdehaymanot sunday school location, quunnamaa, get in touch, አድራሻ"
        />
      </Helmet>

      <PageHero
        backgroundImage={contactHero}
        brandName={t.pageTitleHeader}
        headline={t.pageSubtitle}
        minHeight="60vh"
      />

      <PageSection variant="stone">
      <Container maxWidth="lg">
        <SectionHeader title={t.formTitle} subtitle={t.infoTitle} />

        <Grid container spacing={5}>
            <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <GradientPaper elevation={3}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>{t.infoTitle}</Typography>
                <InfoItem><Icon fontSize="large">location_on</Icon><Box><Typography variant="h6" sx={{ fontWeight: 500 }}>{t.locationLabel}</Typography><Typography variant="body1" color="text.secondary">{t.churchName}<br />{t.churchLocation}</Typography></Box></InfoItem>
                <InfoItem><Icon fontSize="large">phone</Icon><Box><Typography variant="h6" sx={{ fontWeight: 500 }}>{t.phoneLabel}</Typography><Typography variant="body1" color="text.secondary">+251 90 606 1432</Typography></Box></InfoItem>
                <InfoItem><Icon fontSize="large">email</Icon><Box><Typography variant="h6" sx={{ fontWeight: 500 }}>{t.emailLabel}</Typography><Typography variant="body1" color="text.secondary">jimaamdehaymanot21@gmail.com</Typography></Box></InfoItem>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>{t.followUsLabel}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Tooltip title="Facebook"><SocialButton aria-label="Facebook" href="https://www.facebook.com/EOTCJSU" target="_blank"><Icon>facebook</Icon></SocialButton></Tooltip>
                    <Tooltip title="Instagram"><SocialButton aria-label="Instagram" href="https://www.instagram.com/amdehaymanot/" target="_blank"><Icon>instagram</Icon></SocialButton></Tooltip>
                    <Tooltip title="YouTube"><SocialButton aria-label="YouTube" href="https://www.youtube.com/channel/UC-Qy_h0-kDBAQXM3c34Jd-A" target="_blank"><Icon>youtube</Icon></SocialButton></Tooltip>
                    <Tooltip title="Telegram"><SocialButton aria-label="Telegram" href="https://t.me/amdehaymanot" target="_blank"><Icon>telegram</Icon></SocialButton></Tooltip>
                    <Tooltip title="TikTok"><SocialButton aria-label="TikTok" href="https://www.tiktok.com/@amdehaymanot" target="_blank"><Icon>music_video</Icon></SocialButton></Tooltip>
                    <Tooltip title="Play Store"><SocialButton aria-label="Play Store" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"><Icon>storefront</Icon></SocialButton></Tooltip>
                </Box>
                <Box sx={{ mt: 4, height: 250, borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[5] }}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.046313353591!2d36.83296081526683!3d7.67499649452702!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x17caf26569730421%3A0x64402c4636952cc1!2sSt.%20George's%20Cathedral!5e0!3m2!1sen!2sus!4v1672691507914!5m2!1sen!2sus" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Church Location" />
                </Box>
                </GradientPaper>
            </motion.div>
            </Grid>
            
            <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
                <GradientPaper elevation={3} component="form" onSubmit={handleSubmit} noValidate>
                <AnimatePresence>
                    {formSubmitted ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Icon color="success" sx={{ fontSize: 80, mb: 2 }}>verified_user</Icon>
                        <Typography variant="h5" gutterBottom>{t.successTitle}</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{t.successMessage}</Typography>
                        <Button variant="outlined" color="primary" onClick={handleResetForm} sx={{ mt: 2 }}>{t.sendAnotherButton}</Button>
                        </Box>
                    </motion.div>
                    ) : (
                    <motion.div>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>{t.formTitle}</Typography>
                        <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}><TextField fullWidth label={t.nameLabel} name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} variant="outlined" required /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth type="email" label={t.emailFormLabel} name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} variant="outlined" required /></Grid>
                        <Grid item xs={12}><TextField fullWidth label={t.subjectLabel} name="subject" value={formData.subject} onChange={handleChange} variant="outlined" /></Grid>
                        <Grid item xs={12}><TextField fullWidth multiline rows={5} label={t.messageLabel} name="message" value={formData.message} onChange={handleChange} error={!!errors.message} helperText={errors.message} variant="outlined" required /></Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" size="large" color="primary" disabled={loading} fullWidth sx={{ py: 1.5, fontWeight: 600 }} endIcon={!loading && <Icon>send</Icon>}>
                            {loading ? <><CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />{t.sendingButton}</> : t.sendButton}
                            </Button>
                        </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <Icon color="inherit" fontSize="small" sx={{ mr: 1 }}>lock</Icon>
                        <Typography variant="body2">{t.securityNote}</Typography>
                        </Box>
                    </motion.div>
                    )}
                </AnimatePresence>
                </GradientPaper>
            </motion.div>
            </Grid>
        </Grid>
      </Container>
      </PageSection>
    </>
  );
};

export default ContactPage;