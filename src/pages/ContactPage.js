import React, { useState } from 'react';
import {
  Box, Typography, Container, TextField, Button,
  CircularProgress, IconButton, Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import {
  PlaceOutlined,
  PhoneInTalkOutlined,
  MailOutline,
  Facebook,
  Instagram,
  YouTube,
  Telegram,
  Storefront,
  Send,
  LockOutlined,
  VerifiedOutlined,
  Directions,
} from '@mui/icons-material';

import api from '../api/axiosConfig';
import { AboutHero, PageSection } from '../components/ui';
import { brand } from '../brand';
import { PLAY_STORE_URL, CHURCH_MAP_EMBED_URL, CHURCH_DIRECTIONS_URL } from '../config/links';
import contactSubject from '../assets/spiritual-course.jpg';
import heroBackground from '../assets/gallery.jpg';

const brandTitles = {
  en: 'Amde Haymanot',
  am: 'ዓምደ ሃይማኖት',
  om: 'Amdehaayimaanot',
  ti: 'ዓምደሃይማኖት',
  ge: 'ዓምደ ሃይማኖት',
  es: 'Amde Haymanot',
  fr: 'Amde Haymanot',
  ar: 'عمود الإيمان',
};

const placeLabels = {
  en: 'Jimma · Debre Ephrata St. Virgin Mary Cathedral',
  am: 'ጅማ · ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል',
  om: 'Jimmaa · Dabra Efraataa',
  ti: 'ጅማ · ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል',
  ge: 'ጅማ · ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል',
  es: 'Jimma · Debre Ephrata Santa Virgen María Catedral',
  fr: 'Jimma · Debre Ephrata Sainte Vierge Marie Cathédrale',
  ar: 'جيما · دير إفراتا القديسة العذراء مريم كاتدرائية',
};

const yearCaptions = {
  en: 'Founded',
  am: 'ተመሠረተ',
  om: 'Kan hundeeffame',
  ti: 'ተመስሪቱ',
  ge: 'ተመሥረተ',
  es: 'Fundada',
  fr: 'Fondée',
  ar: 'تأسست',
};

const directionsLabels = {
  en: 'Get Directions',
  am: 'አቅጣጫ ያግኙ',
  om: 'Qajeelfama Argadhu',
  ti: 'ኣንፈት ርኸቡ',
  ge: 'ርከብ ፡ አቅጣጫ',
  es: 'Cómo llegar',
  fr: 'Itinéraire',
  ar: 'احصل على الاتجاهات',
};

const translations = {
  en: { pageTitle: "Contact Us", pageDescription: "Get in touch with Amdehaymanot Sunday School in Jimma, Ethiopia. Find our address, phone number, and send us a message through our contact form.", appName: "Amdehaymanot Sunday School", churchName: "Debre Ephrata Saint Virgin Mary Cathedral", churchLocation: "Jimma, Ethiopia", pageTitleHeader: "Connect With Us", pageSubtitle: "We're here to answer your questions and welcome your feedback. Reach out through the form below or connect with us directly.", infoTitle: "Our Information", locationLabel: "Our Location", phoneLabel: "Phone Number", emailLabel: "Email Address", followUsLabel: "Follow Us", formTitle: "Send Us a Message", nameLabel: "Your Name", emailFormLabel: "Your Email", subjectLabel: "Subject", messageLabel: "Your Message", sendButton: "Send Message", sendingButton: "Sending...", successTitle: "Thank You!", successMessage: "Your message has been successfully sent. We'll get back to you within 24-48 hours.", sendAnotherButton: "Send Another Message", securityNote: "Your information is protected and will not be shared.", snackbar: { success: 'Your message has been sent successfully!', error: 'Failed to send message. Please try again later.' } },
  am: { pageTitle: "ያግኙን", pageDescription: "ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት ጋር ይገናኙ። አድራሻችንን፣ ስልክ ቁጥራችንን ያግኙ እና በእኛ መገኛ ቅጽ በኩል መልዕክት ይላኩልን።", appName: "ዓምደሃይማኖት ሰንበት ትምህርት ቤት", churchName: "ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ቤተ ክርስቲያን", churchLocation: "ጅማ, ኢትዮጵያ", pageTitleHeader: "ከእኛ ጋር ይገናኙ", pageSubtitle: "ጥያቄዎችዎን ለመመለስ እና አስተያየትዎን ለመቀበል እዚህ ነን። ከታች ባለው ቅጽ በኩል ያግኙን ወይም በቀጥታ ከእኛ ጋር ይገናኙ።", infoTitle: "የእኛ መረጃ", locationLabel: "የእኛ አድራሻ", phoneLabel: "ስልክ ቁጥር", emailLabel: "ኢሜይል አድራሻ", followUsLabel: "ይከተሉን", formTitle: "መልዕክት ይላኩልን", nameLabel: "የእርስዎ ስም", emailFormLabel: "የእርስዎ ኢሜይል", subjectLabel: "ርዕሰ ጉዳይ", messageLabel: "የእርስዎ መልዕክት", sendButton: "መልዕክት ላክ", sendingButton: "እየተላከ ነው...", successTitle: "እናመሰግናለን!", successMessage: "መልዕክትዎ በተሳካ ሁኔታ ተልኳል። በ24-48 ሰዓታት ውስጥ ምላሽ እንሰጥዎታለን።", sendAnotherButton: "ሌላ መልዕክት ላክ", securityNote: "የእርስዎ መረጃ የተጠበቀ ነው እና ለማንም አይሰጥም።", snackbar: { success: 'መልዕክትዎ በተሳካ ሁኔታ ተልኳል!', error: 'መልዕክት መላክ አልተሳካም። እባክዎ ቆይተው እንደገና ይሞክሩ።' } },
  om: { pageTitle: "Nu Qunnamaa", pageDescription: "Mana Barumsaa Dilbataa Amdehayimanot Jimmaatti argamu qunnamaa. Teessoo, lakkoofsa bilbilaa keenya argadhaa, fi unka keenyaan ergaa nuuf ergaa.", appName: "Mana Barumsaa Dilbataa Amdehayimanot", churchName: "Waldaa Qulqulleettii Maariyaam Dabra Efraataa", churchLocation: "Jimmaa, Itoophiyaa", pageTitleHeader: "Nu Qunnamaa", pageSubtitle: "Gaaffiiwwan keessan deebisuuf yaada keessanis simachuuf as jirra. Unka armaan gadiitiin nu qunnamaa yookiin kallattiidhaan nu waliin wal qunnamaa.", infoTitle: "Odeeffannoo Keenya", locationLabel: "Iddoo Keenya", phoneLabel: "Lakkofsa Bilbilaa", emailLabel: "Teessoo Imeelii", followUsLabel: "Nu Hordofaa", formTitle: "Ergaa Nuuf Ergaa", nameLabel: "Maqaa Keessan", emailFormLabel: "Imeelii Keessan", subjectLabel: "Mata Duree", messageLabel: "Ergaa Keessan", sendButton: "Ergaa Ergi", sendingButton: "Ergamaa Jira...", successTitle: "Galatoomaa!", successMessage: "Ergaan keessan milkaa'inaan ergameera. Sa'aatii 24-48 keessatti isiniif deebisna.", sendAnotherButton: "Ergaa Biraa Ergi", securityNote: "Odeeffannoon keessan eegamaadha, eenyufiyyuu hin hiramu.", snackbar: { success: 'Ergaan keessan milkaa’inaan ergameera!', error: 'Ergaa erguun hin milkoofne. Maaloo booda irra deebi’aa yaalaa.' } },
  ti: { pageTitle: "ተራኸቡና", pageDescription: "ምስ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ኣብ ጅማ ተራኸቡ። ኣድራሻና፡ ቁጽሪ ስልክና ርኸቡን መልእኽቲ ብመንገዲ ናይ መርበብ ሓበሬታና ስደዱልና።", appName: "ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት", churchName: "ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል", churchLocation: "ጅማ, ኢትዮጵያ", pageTitleHeader: "ምሳና ተራኸቡ", pageSubtitle: "ሕቶታትኩም ንምምላስን ርእይቶኹም ንምቕባልን ኣብዚ ኣለና። በቲ ኣብ ታሕቲ ዘሎ ቅጥዒ ርኸቡና ወይ ብቐጥታ ምሳና ተራኸቡ።", infoTitle: "ሓበሬታና", locationLabel: "ኣድራሻና", phoneLabel: "ቁጽሪ ስልኪ", emailLabel: "ኢመይል ኣድራሻ", followUsLabel: "ተኸታተሉና", formTitle: "መልእኽቲ ስደዱልና", nameLabel: "ሽምኩም", emailFormLabel: "ኢመይልኩም", subjectLabel: "ጉዳይ", messageLabel: "መልእኽትኹም", sendButton: "መልእኽቲ ስደድ", sendingButton: "ይስደድ ኣሎ...", successTitle: "የቐንየልና!", successMessage: "መልእኽትኹም ብዓወት ተላኢኹ። ኣብ ውሽጢ 24-48 ሰዓታት ክንምልሰልኩም ኢና።", sendAnotherButton: "ኻሊእ መልእኽቲ ስደድ", securityNote: "ሓበሬታኹም ዝተሓለወ እዩን ንኻልእ ኣይካፈልን እዩ።", snackbar: { success: 'መልእኽትኹም ብዓወት ተላኢኹ!', error: 'መልእኽቲ ምልኣኽ ኣይተኻእለን። በጃኹም ጸኒሕኩም እንደገና ፈትኑ።' } },
  ge: { pageTitle: "ተራከቡነ", pageDescription: "ምስለ ቤተ ትምህርት ሰንበት ዓምደሃይማኖት በጅማ ተራከቡ። አድራሻነ፣ ቁጽረ ስልክነ ርከቡ ወፈነዉ መልእክተ በበድረ ገጽነ።", appName: "ቤተ ትምህርት ሰንበት ዓምደሃይማኖት", churchName: "ደብረ ፡ ኤፍራታ ፡ ቅድስት ፡ ማርያም", churchLocation: "ጅማ ፡ ኢትዮጵያ", pageTitleHeader: "ተራከቡነ", pageSubtitle: "ንሕነ ፡ ዝየነ ፡ ለምላሽ ፡ ጥያቄያቲክሙ ፡ ወለተቀብሎ ፡ ርእይቶቲክሙ። ተራከቡነ ፡ በቅጽ ፡ ዝንቱ ፡ ታሕተ ፡ ወይስ ፡ በቀጥታ።", infoTitle: "ዜናነ", locationLabel: "መካንነ", phoneLabel: "ቁጽረ ፡ ስልክ", emailLabel: "አድራሻ ፡ ኢሜይል", followUsLabel: "ተከተሉነ", formTitle: "ፈነዉ ፡ መልእክተ ፡ ለንሕነ", nameLabel: "ስምከ/ኪ", emailFormLabel: "ኢሜይልከ/ኪ", subjectLabel: "ርእስ", messageLabel: "መልእክትከ/ኪ", sendButton: "ፈኑ ፡ መልእክተ", sendingButton: "ይትፌነዉ ፡ አልቦ...", successTitle: "ይትባረክ!", successMessage: "መልእክትክሙ ፡ ተፈነወ ፡ በሰላም። ንመልስ ፡ ለክሙ ፡ ውስተ ፡ 24-48 ፡ ሰዓታት።", sendAnotherButton: "ፈኑ ፡ ካልአ ፡ መልእክተ", securityNote: "ዜናክሙ ፡ ኅልው ፡ ውእቱ ፡ ወኢይትካፈል ፡ ለማንም።", snackbar: { success: 'መልእክትክሙ ፡ ተፈነወ ፡ በሰላም!', error: 'ፈነወ ፡ መልእክት ፡ አልቦ ፡ ተሳከፈ። እባክዎ ፡ ጸኒሕክሙ ፡ ዳግመ ፡ ፈትኑ።' } },
  es: { pageTitle: "Contáctenos", pageDescription: "Póngase en contacto con la Escuela Dominical Amdehayimanot en Jimma, Etiopía. Encuentre nuestra dirección, número de teléfono y envíenos un mensaje a través de nuestro formulario de contacto.", appName: "Escuela Dominical Amdehayimanot", churchName: "Iglesia Debre Ephrata Santa Virgen María Catedral", churchLocation: "Jimma, Etiopía", pageTitleHeader: "Conéctate con Nosotros", pageSubtitle: "Estamos aquí para responder tus preguntas y recibir tus comentarios. Contáctanos a través del siguiente formulario o directamente.", infoTitle: "Nuestra Información", locationLabel: "Nuestra Ubicación", phoneLabel: "Número de Teléfono", emailLabel: "Dirección de Correo Electrónico", followUsLabel: "Síguenos", formTitle: "Envíanos un Mensaje", nameLabel: "Tu Nombre", emailFormLabel: "Tu Correo Electrónico", subjectLabel: "Asunto", messageLabel: "Tu Mensaje", sendButton: "Enviar Mensaje", sendingButton: "Enviando...", successTitle: "¡Gracias!", successMessage: "Tu mensaje ha sido enviado con éxito. Te responderemos en 24-48 horas.", sendAnotherButton: "Enviar Otro Mensaje", securityNote: "Tu información está protegida y no será compartida.", snackbar: { success: '¡Tu mensaje ha sido enviado con éxito!', error: 'No se pudo enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' } },
  fr: { pageTitle: "Nous Contacter", pageDescription: "Prenez contact avec l'école du dimanche Amdehayimanot à Jimma, Éthiopie. Trouvez notre adresse, notre numéro de téléphone et envoyez-nous un message via notre formulaire de contact.", appName: "École du Dimanche Amdehayimanot", churchName: "Église Debre Ephrata Sainte Vierge Marie Cathédrale", churchLocation: "Jimma, Éthiopie", pageTitleHeader: "Connectez-vous avec Nous", pageSubtitle: "Nous sommes là pour répondre à vos questions et accueillir vos commentaires. Contactez-nous via le formulaire ci-dessous ou directement.", infoTitle: "Nos Informations", locationLabel: "Notre Emplacement", phoneLabel: "Numéro de Téléphone", emailLabel: "Adresse E-mail", followUsLabel: "Suivez-nous", formTitle: "Envoyez-nous un Message", nameLabel: "Votre Nom", emailFormLabel: "Votre E-mail", subjectLabel: "Sujet", messageLabel: "Votre Message", sendButton: "Envoyer le Message", sendingButton: "Envoi en cours...", successTitle: "Merci !", successMessage: "Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 à 48 heures.", sendAnotherButton: "Envoyer un autre Message", securityNote: "Vos informations sont protégées et ne seront pas partagées.", snackbar: { success: 'Votre message a été envoyé avec succès !', error: 'Échec de l\'envoi du message. Veuillez réessayer plus tard.' } },
  ar: { pageTitle: "اتصل بنا", pageDescription: "تواصل مع مدرسة الأحد عماد الإيمان في جيما، إثيوبيا. اعثر على عنواننا ورقم هاتفنا وأرسل لنا رسالة عبر نموذج الاتصال الخاص بنا.", appName: "مدرسة الأحد عماد الإيمان", churchName: "كنيسة دبرة إفراتا القديسة مريم", churchLocation: "جيما، إثيوبيا", pageTitleHeader: "تواصل معنا", pageSubtitle: "نحن هنا للإجابة على أسئلتكم والترحيب بآرائكم. تواصلوا معنا عبر النموذج أدناه أو اتصلوا بنا مباشرة.", infoTitle: "معلوماتنا", locationLabel: "موقعنا", phoneLabel: "رقم الهاتف", emailLabel: "البريد الإلكتروني", followUsLabel: "تابعنا", formTitle: "أرسل لنا رسالة", nameLabel: "اسمك", emailFormLabel: "بريدك الإلكتروني", subjectLabel: "الموضوع", messageLabel: "رسالتك", sendButton: "إرسال الرسالة", sendingButton: "جارٍ الإرسال...", successTitle: "شكرًا لك!", successMessage: "تم إرسال رسالتك بنجاح. سنعود إليك في غضون 24-48 ساعة.", sendAnotherButton: "إرسال رسالة أخرى", securityNote: "معلوماتك محمية ولن تتم مشاركتها.", snackbar: { success: 'تم إرسال رسالتك بنجاح!', error: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى في وقت لاحق.' } },
}

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.2 };

function EthiopicCross({ size = 12, color = brand.goldDark }) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      sx={{ display: 'block', flexShrink: 0 }}
    >
      <path
        fill={color}
        d="M15.2 2.2h1.6v5.4h5.4v1.6h-5.4v5.4h5.4v1.6h-5.4v8.2h-1.6v-8.2H9.8v-1.6h5.4V9.2H9.8V7.6h5.4V2.2zm-3.8 8.8h1.4v1.4h-1.4v-1.4zm7.8 0h1.4v1.4h-1.4v-1.4zM9.2 20.4h1.4v1.4H9.2v-1.4zm12.2 0h1.4v1.4h-1.4v-1.4z"
      />
      <circle cx="16" cy="10.4" r="1.15" fill={color} />
    </Box>
  );
}

function TikTokIcon({ size = 18 }) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      sx={{ display: 'block' }}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .56.04.82.12v-3.56a6.27 6.27 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
    </Box>
  );
}

const Layout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '0.95fr 1.05fr',
  gap: 'clamp(2rem, 5vw, 4rem)',
  alignItems: 'start',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(5),
  },
}));

const InfoRow = styled(motion.div)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '48px 1fr',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  padding: theme.spacing(2.25, 0),
  borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
  '&:last-of-type': { borderBottom: 'none' },
}));

const IndexMark = styled(Box)({
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: `1px solid ${alpha(brand.gold, 0.7)}`,
  background: `linear-gradient(160deg, ${brand.white} 0%, ${brand.stone} 100%)`,
  color: brand.navy,
  boxShadow: `inset 0 0 0 3px ${alpha(brand.gold, 0.12)}`,
  '& .MuiSvgIcon-root': {
    fontSize: 22,
    color: brand.goldDark,
  },
});

const FormShell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3.5, 0, 0),
  borderTop: `2px solid ${brand.gold}`,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 0, 0, 3.5),
    borderTop: 'none',
    borderLeft: `1px solid ${alpha(brand.navy, 0.1)}`,
  },
}));

const SocialButton = styled(IconButton, {
  shouldForwardProp: (p) => p !== 'accent',
})(({ accent }) => ({
  width: 44,
  height: 44,
  borderRadius: 1,
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  color: brand.navy,
  backgroundColor: brand.white,
  transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
  '& .MuiSvgIcon-root, & svg': {
    fontSize: 20,
  },
  '&:hover': {
    backgroundColor: accent || brand.navy,
    color: brand.white,
    borderColor: accent || brand.navy,
    transform: 'translateY(-2px)',
  },
}));

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    backgroundColor: brand.white,
  },
};

const ContactPage = ({ language = 'en' }) => {
  const t = translations[language] || translations.en;
  const brandName = brandTitles[language] || brandTitles.en;
  const directionsLabel = directionsLabels[language] || directionsLabels.en;
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const validate = () => {
    const tempErrors = {
      name: formData.name ? '' : 'Name is required.',
      email: /.+@.+\..+/.test(formData.email) ? '' : 'Email is not valid.',
      message: formData.message ? '' : 'Message is required.',
    };
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      enqueueSnackbar('Please correct the form errors.', { variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/contact', formData);
      setFormSubmitted(true);
      enqueueSnackbar(t.snackbar.success, { variant: 'success' });
    } catch (error) {
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

  const infoItems = [
    {
      icon: <PlaceOutlined />,
      label: t.locationLabel,
      body: (
        <>
          {t.churchName}
          <br />
          {t.churchLocation}
        </>
      ),
    },
    {
      icon: <PhoneInTalkOutlined />,
      label: t.phoneLabel,
      body: '+251 90 606 1432',
    },
    {
      icon: <MailOutline />,
      label: t.emailLabel,
      body: 'jimaamdehaymanot21@gmail.com',
    },
  ];

  const socialLinks = [
    { title: 'Facebook', href: 'https://www.facebook.com/EOTCJSU', icon: <Facebook />, accent: '#1877F2' },
    { title: 'Instagram', href: 'https://www.instagram.com/amdehaymanot/', icon: <Instagram />, accent: '#E4405F' },
    { title: 'YouTube', href: 'https://www.youtube.com/channel/UC-Qy_h0-kDBAQXM3c34Jd-A', icon: <YouTube />, accent: '#FF0000' },
    { title: 'Telegram', href: 'https://t.me/amdehaymanot', icon: <Telegram />, accent: '#0088cc' },
    { title: 'TikTok', href: 'https://www.tiktok.com/@amdehaymanot', icon: <TikTokIcon />, accent: '#010101' },
    { title: 'Play Store', href: PLAY_STORE_URL, icon: <Storefront />, accent: '#3DDC84' },
  ];

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | ${t.appName}`}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>

      <Box sx={{ bgcolor: brand.stone }}>
        <AboutHero
          subjectImage={contactSubject}
          subjectFit="cover"
          subjectPosition="center 35%"
          backgroundImage={heroBackground}
          brandName={brandName}
          tagline={t.pageTitleHeader}
          storyTitle={t.infoTitle}
          storyLead={t.pageSubtitle}
          placeLabel={placeLabels[language] || placeLabels.en}
          yearCaption={yearCaptions[language] || yearCaptions.en}
          foundedYear="1964"
          lineClamp={3}
          mobileLineClamp={2}
        />

        <PageSection variant="white">
          <Container maxWidth="lg">
            <Layout>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewOpts}
                transition={{ duration: 0.6, ease: easeOut }}
              >
                <Box
                  aria-hidden
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    mb: 2.5,
                  }}
                >
                  <Box sx={{ width: 36, height: 1, bgcolor: alpha(brand.goldDark, 0.7) }} />
                  <EthiopicCross size={12} />
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: 120,
                      height: 1,
                      background: `linear-gradient(90deg, ${alpha(brand.goldDark, 0.7)}, transparent)`,
                    }}
                  />
                </Box>

                <Typography
                  component="h2"
                  sx={{
                    m: 0,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                    color: brand.navy,
                  }}
                >
                  {t.infoTitle}
                </Typography>
                <Box aria-hidden sx={{ width: 48, height: 2, my: 2, bgcolor: brand.gold }} />

                {infoItems.map((item, i) => (
                  <InfoRow
                    key={item.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewOpts}
                    transition={{ duration: 0.4, ease: easeOut, delay: i * 0.05 }}
                  >
                    <IndexMark>
                      {item.icon}
                    </IndexMark>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          color: brand.navy,
                          mb: 0.35,
                          lineHeight: 1.2,
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                          color: alpha(brand.ink, 0.65),
                          lineHeight: 1.65,
                          fontSize: '0.98rem',
                        }}
                      >
                        {item.body}
                      </Typography>
                    </Box>
                  </InfoRow>
                ))}

                <Typography
                  sx={{
                    mt: 3.5,
                    mb: 1.5,
                    fontFamily: '"Source Sans 3", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: brand.navy,
                  }}
                >
                  {t.followUsLabel}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                  {socialLinks.map((link) => (
                    <Tooltip key={link.title} title={link.title}>
                      <SocialButton
                        aria-label={link.title}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        accent={link.accent}
                      >
                        {link.icon}
                      </SocialButton>
                    </Tooltip>
                  ))}
                </Box>
              </motion.div>

              <FormShell component="form" onSubmit={handleSubmit} noValidate>
                <AnimatePresence mode="wait">
                  {formSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <VerifiedOutlined sx={{ fontSize: 64, mb: 2, color: brand.goldDark }} />
                        <Typography
                          sx={{
                            fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                            fontWeight: 700,
                            fontSize: '1.85rem',
                            color: brand.navy,
                            mb: 1.5,
                          }}
                        >
                          {t.successTitle}
                        </Typography>
                        <Typography sx={{ color: alpha(brand.ink, 0.65), mb: 3, lineHeight: 1.7 }}>
                          {t.successMessage}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleResetForm}
                          sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 700 }}
                        >
                          {t.sendAnotherButton}
                        </Button>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: easeOut }}
                    >
                      <Typography
                        component="h2"
                        sx={{
                          m: 0,
                          fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                          fontWeight: 700,
                          fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                          color: brand.navy,
                        }}
                      >
                        {t.formTitle}
                      </Typography>
                      <Box aria-hidden sx={{ width: 48, height: 2, my: 2, bgcolor: brand.gold }} />

                      <Box sx={{ display: 'grid', gap: 2.5, mt: 1 }}>
                        <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                          <TextField fullWidth label={t.nameLabel} name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required sx={fieldSx} />
                          <TextField fullWidth type="email" label={t.emailFormLabel} name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} required sx={fieldSx} />
                        </Box>
                        <TextField fullWidth label={t.subjectLabel} name="subject" value={formData.subject} onChange={handleChange} sx={fieldSx} />
                        <TextField fullWidth multiline rows={5} label={t.messageLabel} name="message" value={formData.message} onChange={handleChange} error={!!errors.message} helperText={errors.message} required sx={fieldSx} />
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={loading}
                          endIcon={!loading && <Send sx={{ fontSize: 18 }} />}
                          sx={{
                            borderRadius: 1,
                            py: 1.4,
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: 'none',
                          }}
                        >
                          {loading ? (
                            <>
                              <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />
                              {t.sendingButton}
                            </>
                          ) : t.sendButton}
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: alpha(brand.ink, 0.55) }}>
                          <LockOutlined sx={{ fontSize: 18, mr: 1 }} />
                          <Typography variant="body2">{t.securityNote}</Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FormShell>
            </Layout>
          </Container>
        </PageSection>

        <PageSection variant="stone" sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                textAlign: 'center',
                mb: 3,
              }}
            >
              <Typography
                component="h2"
                sx={{
                  m: 0,
                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  color: brand.navy,
                }}
              >
                {t.locationLabel}
              </Typography>
              <Box aria-hidden sx={{ width: 48, height: 2, mx: 'auto', my: 2, bgcolor: brand.gold }} />
              <Button
                component="a"
                href={CHURCH_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
                startIcon={<Directions />}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none',
                  px: 2.75,
                  py: 1.1,
                }}
              >
                {directionsLabel}
              </Button>
            </Box>
            <Box
              sx={{
                height: { xs: 280, md: 380 },
                overflow: 'hidden',
                border: `1px solid ${alpha(brand.navy, 0.12)}`,
                position: 'relative',
              }}
            >
              <Box
                aria-hidden
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  right: -8,
                  bottom: -8,
                  border: `1.5px solid ${alpha(brand.gold, 0.55)}`,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
                <iframe
                  src={CHURCH_MAP_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Debre Efrata Saint Virgin Mary Cathedral, Jimma"
                />
                <Tooltip title={directionsLabel}>
                  <IconButton
                    component="a"
                    href={CHURCH_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={directionsLabel}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: brand.white,
                      color: brand.navy,
                      border: `1px solid ${alpha(brand.navy, 0.12)}`,
                      boxShadow: '0 4px 16px rgba(0, 14, 31, 0.14)',
                      '&:hover': {
                        bgcolor: brand.navy,
                        color: brand.gold,
                        borderColor: brand.navy,
                      },
                    }}
                  >
                    <Directions />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Container>
        </PageSection>
      </Box>
    </>
  );
};

export default ContactPage;
