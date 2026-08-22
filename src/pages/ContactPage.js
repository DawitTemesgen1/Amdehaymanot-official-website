import React, { useState } from 'react';
import {
  Box, Typography, Container, TextField, Button,
  CircularProgress, IconButton, Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import SEO from '../components/layout/SEO';
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
  om: 'Amdehaymanot',
  ti: 'ዓምደሃይማኖት',
  ge: 'ዓምደ ሃይማኖት',
  es: 'Amde Haymanot',
  fr: 'Amdehaymanot',
  ar: 'عمود الإيمان',
};

const placeLabels = {
  en: 'Jimma · Debre Ephrata St. Virgin Mary Cathedral',
  am: 'ጅማ · ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል',
  om: 'Jimmaa · Debre Efraataa',
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
  en: {
    "pageTitle": "Contact us",
    "pageDescription": "Connect with Jimma Pillar Religion Sunday School. Find our address, phone number and send us a message through our contact form.",
    "appName": "Amdehaymanot",
    "churchName": "Mount Ephrata Holy Virgin Mary Church",
    "churchLocation": "Jimma, Ethiopia",
    "pageTitleHeader": "Connect with us",
    "pageSubtitle": "We are here to answer your questions and welcome your feedback. Contact us via the form below or contact us directly.",
    "infoTitle": "Our information",
    "locationLabel": "Our address",
    "phoneLabel": "phone number",
    "emailLabel": "Email address",
    "followUsLabel": "Follow us",
    "formTitle": "Send us a message",
    "nameLabel": "Your name",
    "emailFormLabel": "Your email",
    "subjectLabel": "Subject",
    "messageLabel": "Your message",
    "sendButton": "Send a message",
    "sendingButton": "Sending...",
    "successTitle": "Thank you!",
    "successMessage": "Your message has been sent successfully. We will respond to you within 24-48 hours.",
    "sendAnotherButton": "Send another message",
    "securityNote": "Your information is protected and will not be shared with anyone.",
    "snackbar": {
        "success": "Your message has been sent successfully!",
        "error": "Failed to send message. Please try again later."
    }
},
  om: {
    "pageTitle": "Nu qunnamaa",
    "pageDescription": "Mana Barumsa Sanbataa Amantii Utubaa Jimmaa waliin wal qunnamaa. Teessoo, lakkoofsa bilbilaa keenya barbaadaa karaa unka quunnamtii keenyaa ergaa nuuf ergaa.",
    "appName": "Amdehaymanot",
    "churchName": "Waldaa Tulluu Efraataa Qulqulleettii Durbee Maariyaam",
    "churchLocation": "Jimmaa, Itoophiyaa",
    "pageTitleHeader": "Nu waliin wal qunnamaa",
    "pageSubtitle": "Gaaffii keessaniif deebii kennuu fi yaada keessan simachuuf as jirra. Karaa unka armaan gadiitiin nu qunnamaa ykn kallattiin nu qunnamaa.",
    "infoTitle": "Odeeffannoo keenya",
    "locationLabel": "Teessoo keenya",
    "phoneLabel": "lakkoofsa bilbilaa",
    "emailLabel": "Teessoo imeelii",
    "followUsLabel": "Nu hordofaa",
    "formTitle": "Ergaa nuuf ergaa",
    "nameLabel": "Maqaa kee",
    "emailFormLabel": "Imeelii keessan",
    "subjectLabel": "Mata duree",
    "messageLabel": "Ergaa keessan",
    "sendButton": "Ergaa ergaa",
    "sendingButton": "Ergaa...",
    "successTitle": "Galatoomaa!",
    "successMessage": "Ergaan keessan milkaa'inaan ergameera. Sa'aatii 24-48 keessatti deebii isiniif kennina.",
    "sendAnotherButton": "Ergaa biraa ergaa",
    "securityNote": "Odeeffannoon keessan eegumsa waan qabuuf eenyuufuu hin qoodamu.",
    "snackbar": {
        "success": "Ergaan keessan milkaa'inaan ergameera!",
        "error": "Ergaa erguu hin dandeenye. Mee booda irra deebi'ii yaalaa."
    }
},
  ti: {
    "pageTitle": "ርኸቡና",
    "pageDescription": "ምስ ቤት ትምህርቲ ሰንበት ሃይማኖት ዓንዲ ጅማ ተራኸቡ። ኣድራሻና፣ ቁጽሪ ተሌፎንና ረኺብኩም ብናይ ርክብ ቅጥዒና መልእኽቲ ስደዱልና።",
    "appName": "ዓምደሃይማኖት",
    "churchName": "ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ቤተ ክርስቲያን",
    "churchLocation": "ጅማ ኢትዮጵያ",
    "pageTitleHeader": "ምሳና ተራኸቡ።",
    "pageSubtitle": "ሕቶታትኩም ንምምላስን ርእይቶኹም ንምቕባልን ኣብዚ ኣለና። በዚ ኣብ ታሕቲ ዘሎ ፎርም ርኸቡና ወይ ድማ ብቐጥታ ርኸቡና።",
    "infoTitle": "ሓበሬታና",
    "locationLabel": "ኣድራሻና",
    "phoneLabel": "ቁጽሪ ተሌፎን",
    "emailLabel": "ናይ ኢመይል ኣድራሻ",
    "followUsLabel": "ተኸታተሉና።",
    "formTitle": "መልእኽቲ ስደዱልና",
    "nameLabel": "ስምካ",
    "emailFormLabel": "ኢመይልካ",
    "subjectLabel": "ዋና",
    "messageLabel": "መልእኽትኻ",
    "sendButton": "መልእኽቲ ስደዱ",
    "sendingButton": "ምልኣኽ...",
    "successTitle": "የቕንየለይ!",
    "successMessage": "መልእኽትኹም ብዓወት ተላኢኹ ኣሎ። ኣብ ውሽጢ 24-48 ሰዓታት መልሲ ክንህበኩም ኢና።",
    "sendAnotherButton": "ካልእ መልእኽቲ ስደዱ",
    "securityNote": "ሓበሬታኹም ዝተሓለወ ስለዝኾነ ንማንም ኣይክካፈልን እዩ።",
    "snackbar": {
        "success": "መልእኽትኹም ብዓወት ተላኢኹ ኣሎ!",
        "error": "መልእኽቲ ምልኣኽ ኣይከኣለን። በጃኹም ድሒርኩም ደጊምኩም ፈትኑ።"
    }
},
  es: {
    "pageTitle": "Contáctenos",
    "pageDescription": "Conéctese con la escuela dominical de religión Jimma Pillar. Encuentra nuestra dirección, número de teléfono y envíanos un mensaje a través de nuestro formulario de contacto.",
    "appName": "Amdehaymanot",
    "churchName": "Monte Ephrata Iglesia de la Santísima Virgen María",
    "churchLocation": "Jima, Etiopía",
    "pageTitleHeader": "Conéctate con nosotros",
    "pageSubtitle": "Estamos aquí para responder sus preguntas y agradecer sus comentarios. Contáctenos a través del siguiente formulario o contáctenos directamente.",
    "infoTitle": "Nuestra información",
    "locationLabel": "Nuestra dirección",
    "phoneLabel": "número de teléfono",
    "emailLabel": "Dirección de correo electrónico",
    "followUsLabel": "Síganos",
    "formTitle": "Envíanos un mensaje",
    "nameLabel": "Su nombre",
    "emailFormLabel": "Tu correo electrónico",
    "subjectLabel": "Sujeto",
    "messageLabel": "tu mensaje",
    "sendButton": "enviar un mensaje",
    "sendingButton": "Envío...",
    "successTitle": "¡Gracias!",
    "successMessage": "Su mensaje ha sido enviado exitosamente. Le responderemos dentro de 24-48 horas.",
    "sendAnotherButton": "enviar otro mensaje",
    "securityNote": "Su información está protegida y no será compartida con nadie.",
    "snackbar": {
        "success": "¡Tu mensaje ha sido enviado exitosamente!",
        "error": "No se pudo enviar el mensaje. Inténtelo de nuevo más tarde."
    }
},
  fr: {
    "pageTitle": "Contactez-nous",
    "pageDescription": "Connectez-vous à l’école du dimanche Jimma Pillar Religion. Trouvez notre adresse, notre numéro de téléphone et envoyez-nous un message via notre formulaire de contact.",
    "appName": "Amdehaymanot",
    "churchName": "Église Sainte-Vierge-Marie du Mont Ephrata",
    "churchLocation": "Jimma, Éthiopie",
    "pageTitleHeader": "Connectez-vous avec nous",
    "pageSubtitle": "Nous sommes là pour répondre à vos questions et recevoir vos commentaires. Contactez-nous via le formulaire ci-dessous ou contactez-nous directement.",
    "infoTitle": "Nos informations",
    "locationLabel": "Notre adresse",
    "phoneLabel": "numéro de téléphone",
    "emailLabel": "Adresse email",
    "followUsLabel": "Suivez-nous",
    "formTitle": "Envoyez-nous un message",
    "nameLabel": "Votre nom",
    "emailFormLabel": "Votre email",
    "subjectLabel": "Sujet",
    "messageLabel": "Votre message",
    "sendButton": "Envoyer un message",
    "sendingButton": "Envoi...",
    "successTitle": "Merci!",
    "successMessage": "Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 à 48 heures.",
    "sendAnotherButton": "Envoyer un autre message",
    "securityNote": "Vos informations sont protégées et ne seront partagées avec personne.",
    "snackbar": {
        "success": "Votre message a été envoyé avec succès !",
        "error": "Échec de l'envoi du message. Veuillez réessayer plus tard."
    }
},
  ar: {
    "pageTitle": "اتصل بنا",
    "pageDescription": "تواصل مع مدرسة الأحد الدينية جيما بيلار. ابحث عن عنواننا ورقم هاتفنا وأرسل لنا رسالة من خلال نموذج الاتصال الخاص بنا.",
    "appName": "آمدهيمانوت",
    "churchName": "كنيسة جبل افراتا مريم العذراء المقدسة",
    "churchLocation": "جيما، إثيوبيا",
    "pageTitleHeader": "تواصل معنا",
    "pageSubtitle": "نحن هنا للإجابة على أسئلتك ونرحب بتعليقاتك. اتصل بنا عبر النموذج أدناه أو اتصل بنا مباشرة.",
    "infoTitle": "معلوماتنا",
    "locationLabel": "عنواننا",
    "phoneLabel": "رقم التليفون",
    "emailLabel": "عنوان البريد الإلكتروني",
    "followUsLabel": "تابعنا",
    "formTitle": "أرسل لنا رسالة",
    "nameLabel": "اسمك",
    "emailFormLabel": "البريد الإلكتروني الخاص بك",
    "subjectLabel": "موضوع",
    "messageLabel": "رسالتك",
    "sendButton": "أرسل رسالة",
    "sendingButton": "إرسال...",
    "successTitle": "شكرًا لك!",
    "successMessage": "لقد تم إرسال رسالتك بنجاح. سوف نقوم بالرد عليك خلال 24-48 ساعة.",
    "sendAnotherButton": "أرسل رسالة أخرى",
    "securityNote": "معلوماتك محمية ولن تتم مشاركتها مع أي شخص.",
    "snackbar": {
        "success": "لقد تم إرسال رسالتك بنجاح!",
        "error": "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى في وقت لاحق."
    }
},
  am: {
    "pageTitle": "ያግኙን",
    "pageDescription": "ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት ጋር ይገናኙ። አድራሻችንን፣ ስልክ ቁጥራችንን ያግኙ እና በእኛ መገኛ ቅጽ በኩል መልዕክት ይላኩልን።",
    "appName": "ዓምደሃይማኖት",
    "churchName": "ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ቤተ ክርስቲያን",
    "churchLocation": "ጅማ, ኢትዮጵያ",
    "pageTitleHeader": "ከእኛ ጋር ይገናኙ",
    "pageSubtitle": "ጥያቄዎችዎን ለመመለስ እና አስተያየትዎን ለመቀበል እዚህ ነን። ከታች ባለው ቅጽ በኩል ያግኙን ወይም በቀጥታ ከእኛ ጋር ይገናኙ።",
    "infoTitle": "የእኛ መረጃ",
    "locationLabel": "የእኛ አድራሻ",
    "phoneLabel": "ስልክ ቁጥር",
    "emailLabel": "ኢሜይል አድራሻ",
    "followUsLabel": "ይከተሉን",
    "formTitle": "መልዕክት ይላኩልን",
    "nameLabel": "የእርስዎ ስም",
    "emailFormLabel": "የእርስዎ ኢሜይል",
    "subjectLabel": "ርዕሰ ጉዳይ",
    "messageLabel": "የእርስዎ መልዕክት",
    "sendButton": "መልዕክት ላክ",
    "sendingButton": "እየተላከ ነው...",
    "successTitle": "እናመሰግናለን!",
    "successMessage": "መልዕክትዎ በተሳካ ሁኔታ ተልኳል። በ24-48 ሰዓታት ውስጥ ምላሽ እንሰጥዎታለን።",
    "sendAnotherButton": "ሌላ መልዕክት ላክ",
    "securityNote": "የእርስዎ መረጃ የተጠበቀ ነው እና ለማንም አይሰጥም።",
    "snackbar": {
        "success": "መልዕክትዎ በተሳካ ሁኔታ ተልኳል!",
        "error": "መልዕክት መላክ አልተሳካም። እባክዎ ቆይተው እንደገና ይሞክሩ።"
    }
},
  ge: {
    "pageTitle": "ያግኙን",
    "pageDescription": "ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት ጋር ይገናኙ። አድራሻችንን፣ ስልክ ቁጥራችንን ያግኙ እና በእኛ መገኛ ቅጽ በኩል መልዕክት ይላኩልን።",
    "appName": "ዓምደሃይማኖት",
    "churchName": "ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ቤተ ክርስቲያን",
    "churchLocation": "ጅማ, ኢትዮጵያ",
    "pageTitleHeader": "ከእኛ ጋር ይገናኙ",
    "pageSubtitle": "ጥያቄዎችዎን ለመመለስ እና አስተያየትዎን ለመቀበል እዚህ ነን። ከታች ባለው ቅጽ በኩል ያግኙን ወይም በቀጥታ ከእኛ ጋር ይገናኙ።",
    "infoTitle": "የእኛ መረጃ",
    "locationLabel": "የእኛ አድራሻ",
    "phoneLabel": "ስልክ ቁጥር",
    "emailLabel": "ኢሜይል አድራሻ",
    "followUsLabel": "ይከተሉን",
    "formTitle": "መልዕክት ይላኩልን",
    "nameLabel": "የእርስዎ ስም",
    "emailFormLabel": "የእርስዎ ኢሜይል",
    "subjectLabel": "ርዕሰ ጉዳይ",
    "messageLabel": "የእርስዎ መልዕክት",
    "sendButton": "መልዕክት ላክ",
    "sendingButton": "እየተላከ ነው...",
    "successTitle": "እናመሰግናለን!",
    "successMessage": "መልዕክትዎ በተሳካ ሁኔታ ተልኳል። በ24-48 ሰዓታት ውስጥ ምላሽ እንሰጥዎታለን።",
    "sendAnotherButton": "ሌላ መልዕክት ላክ",
    "securityNote": "የእርስዎ መረጃ የተጠበቀ ነው እና ለማንም አይሰጥም።",
    "snackbar": {
        "success": "መልዕክትዎ በተሳካ ሁኔታ ተልኳል!",
        "error": "መልዕክት መላክ አልተሳካም። እባክዎ ቆይተው እንደገና ይሞክሩ።"
    }
},
};

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
      <SEO title={t.pageTitle} description={t.pageDescription} language={language} />

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
