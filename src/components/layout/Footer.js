// THIS IS THE COMPLETE FILE FROM YOUR PREVIOUS PROMPT, PRE-MODIFIED
import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, Divider, InputBase, Button, Paper, Stack, useTheme } from '@mui/material';
import { Facebook, Instagram, YouTube, Email, Phone, LocationOn, ArrowForward, Telegram, Storefront } from '@mui/icons-material';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import { styled, alpha, keyframes } from '@mui/system';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../../api/axiosConfig';
import logoImage from '../../assets/logo.png';

const translations = {
  "en": { "churchName": "Saint Mary Cathedral", "churchLocation": "Jimma, Ethiopia", "stayConnected": "Stay Informed", "newsletterPrompt": "Get the latest news and events delivered to your inbox.", "emailPlaceholder": "Enter your email", "motto": "But we preach Christ crucified, a stumbling block to Jews and foolishness to Gentiles.", "explore": "Explore", "support": "Support", "getInTouch": "Get In Touch", "copyright": "All Rights Reserved", "home": "Home", "aboutUs": "About Us", "events": "Events", "gallery": "Gallery", "ourClasses": "Our Classes", "newsUpdates": "News & Updates", "contactUs": "Contact Us", "privacyPolicy": "Privacy Policy" },
  "am": { "churchName": "የቅድስት ማርያም ካቴድራል", "churchLocation": "ጅማ, ኢትዮጵያ", "stayConnected": "ሙሉ መረጃ ያግኙ", "newsletterPrompt": "የቅርብ ጊዜ ዜናዎችን እና ክስተቶችን በኢሜይል መልእክት ሳጥንዎ ያግኙ።", "emailPlaceholder": "ኢሜልዎን ያስገቡ", "motto": "እኛ ግን የተሰቀለውን ክርስቶስን እንሰብካለን፤ ይህም ለአይሁድ ማሰናከያ ለአሕዛብም ሞኝነት ነው፥", "explore": "ያስሱ", "support": "ድጋፍ", "getInTouch": "ያግኙን", "copyright": "ሁሉም መብቶች የተጠበቁ ናቸው", "home": "መነሻ", "aboutUs": "ስለ እኛ", "events": "ክስተቶች", "gallery": "ጋለሪ", "ourClasses": "ትምህርቶቻችን", "newsUpdates": "ዜና እና ዝመናዎች", "contactUs": "ያግኙን", "privacyPolicy": "የግላዊነት ፖሊሲ" },
  "om": { "churchName": "Katidiraalii Qulqulleettii Maariyaam", "churchLocation": "Jimmaa, Itoophiyaa", "stayConnected": "Odeeffannoo Qabaadhaa", "newsletterPrompt": "Oduu fi taateewwan haaraa sanduuqa ergaa keessanitti argadhaa.", "emailPlaceholder": "Imeelii keessan galchaa", "motto": "Nuti garuu Kiristoos isa fannifame lallabna; kunis Yihudootaaf gufuu, warra saba Waaqayyoo hin ta'iniif immoo gowwummaadha.", "explore": "Sakatta'i", "support": "Deeggarsa", "getInTouch": "Nu Qunnamaa", "copyright": "Mirgi Hundi Seeraan Eegamaadha", "home": "Fuula Jalqabaa", "aboutUs": "Waa'ee Keenya", "events": "Taateewwan", "gallery": "Kuusaa Suuraa", "ourClasses": "Barnoota Keenya", "newsUpdates": "Oduu fi Fooyya'iinsa", "contactUs": "Nu Qunnamaa", "privacyPolicy": "Imaammata Mateenyaa" },
  "ti": { "churchName": "ካቴድራል ቅድስት ማርያም", "churchLocation": "ጅማ, ኢትዮጵያ", "stayConnected": "ሓበሬታ ኹኑ", "newsletterPrompt": "ሓድሽ ዜናታትን ፍጻመታትን ኣብ ኢመይል ሳጹንኩም ተቐበሉ", "emailPlaceholder": "ኢሜይልኩም ኣእትዉ", "motto": "ንሕና ግና ነቲ እተሰቕለ ክርስቶስ ንሰብኽ: ንኣይሁድ መዓንቀፊ: ንኣህዛብ ድማ ዕሽነት እዩ።", "explore": "ኣስስ", "support": "ድጋፍ", "getInTouch": "ተራኸቡና", "copyright": "መሰሉ ብሕጊ ዝተሓለወ እዩ", "home": "መበገሲ", "aboutUs": "ብዛዕባና", "events": "ፍጻመታት", "gallery": "መአከቢ ስእሊ", "ourClasses": "ክፍልታትና", "newsUpdates": "ዜናን ሓበሬታን", "contactUs": "ተራኸቡና", "privacyPolicy": "ፖሊሲ ብሕታዊነት" },
  "ge": { "churchName": "ቤተ ፡ ክርስቲያን ፡ ቅድስት ፡ ማርያም", "churchLocation": "ጅማ ፡ ኢትዮጵያ", "stayConnected": "ተአምኁ ፡ ወትረ", "newsletterPrompt": "ዜና ፡ ሐዲስ ፡ ወግብረ ፡ በኢሜይል ፡ በጽሐክሙ።", "emailPlaceholder": "አግባእ ፡ ኢሜይለከ", "motto": "ወንሕነሰ ፡ ንሰብክ ፡ ክርስቶስ ፡ ዘተሰቅለ ፡ ለአይሁድሰ ፡ ዕንቅፋት ፡ ወለአሕዛብስ ፡ ዕብደት።", "explore": "አስስ", "support": "ረድኤት", "getInTouch": "ተራከቡነ", "copyright": "ኵሉ ፡ መብት ፡ ኅልው ፡ ውእቱ።", "home": "አርእስት", "aboutUs": "ስለ ፡ አነ", "events": "ምክንያታት", "gallery": "ማዕከለ ፡ ስእል", "ourClasses": "ክፍለ ፡ ትምህርትነ", "newsUpdates": "ዜና ፡ ወሐዲስ", "contactUs": "ተራከቡነ", "privacyPolicy": "ሥርዓተ ፡ ምሥጢር" },
  "es": { "churchName": "Catedral de Santa María", "churchLocation": "Jimma, Etiopía", "stayConnected": "Manténgase Informado", "newsletterPrompt": "Reciba las últimas noticias y eventos en su bandeja de entrada.", "emailPlaceholder": "Ingrese su correo electrónico", "motto": "Pero nosotros predicamos a Cristo crucificado, para los judíos ciertamente tropezadero, y para los gentiles locura.", "explore": "Explorar", "support": "Apoyo", "getInTouch": "Ponerse en Contacto", "copyright": "Todos los Derechos Reservados", "home": "Inicio", "aboutUs": "Sobre Nosotros", "events": "Eventos", "gallery": "Galería", "ourClasses": "Nuestras Clases", "newsUpdates": "Noticias y Actualizaciones", "contactUs": "Contáctenos", "privacyPolicy": "Política de Privacidad" },
  "fr": { "churchName": "Cathédrale Sainte-Marie", "churchLocation": "Jimma, Éthiopie", "stayConnected": "Restez Informé", "newsletterPrompt": "Recevez les dernières nouvelles et événements dans votre boîte de réception.", "emailPlaceholder": "Entrez votre courriel", "motto": "Nous, nous prêchons Christ crucifié, scandale pour les Juifs et folie pour les païens.", "explore": "Explorer", "support": "Soutien", "getInTouch": "Contactez-nous", "copyright": "Tous Droits Réservés", "home": "Accueil", "aboutUs": "À Propos de Nous", "events": "Événements", "gallery": "Galerie", "ourClasses": "Nos Cours", "newsUpdates": "Nouvelles et Mises à Jour", "contactUs": "Contactez-nous", "privacyPolicy": "Politique de Confidentialité" },
  "ar": { "churchName": "كاتدرائية القديسة مريم", "churchLocation": "جيما، إثيوبيا", "stayConnected": "ابق على اطلاع", "newsletterPrompt": "احصل على آخر الأخبار والفعاليات في بريدك الوارد.", "emailPlaceholder": "أدخل بريدك الإلكتروني", "motto": "ولكننا نحن نكرز بالمسيح مصلوبا، لليهود عثرة ولليونانيين جهالة.", "explore": "استكشف", "support": "الدعم", "getInTouch": "تواصل معنا", "copyright": "كل الحقوق محفوظة", "home": "الرئيسية", "aboutUs": "من نحن", "events": "الفعاليات", "gallery": "المعرض", "ourClasses": "فصولنا", "newsUpdates": "الأخبار والتحديثات", "contactUs": "اتصل بنا", "privacyPolicy": "سياسة الخصوصية" }
};

const auroraGlow = keyframes` 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } `;
const FooterWrapper = styled('footer')(({ theme }) => ({ backgroundColor: theme.palette.primary.dark, color: theme.palette.common.white, position: 'relative', overflow: 'hidden', zIndex: 1, paddingTop: theme.spacing(10), '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.8)} 50%, ${theme.palette.primary.dark} 100%)`, backgroundSize: '400% 400%', animation: `${auroraGlow} 15s ease infinite`, zIndex: -1 } }));
const FooterLink = styled(MuiLink)(({ theme }) => ({ display: 'inline-block', position: 'relative', color: theme.palette.common.white, textDecoration: 'none', padding: theme.spacing(0.5, 0), transition: 'all 0.3s ease', '&::after': { content: '""', position: 'absolute', width: '100%', height: '2px', bottom: 0, left: 0, backgroundColor: theme.palette.secondary.main, transform: 'scaleX(0)', transformOrigin: 'bottom right', transition: 'transform 0.4s cubic-bezier(0.86, 0, 0.07, 1)' }, '&:hover': { color: theme.palette.common.white, transform: 'translateX(5px)', '&::after': { transform: 'scaleX(1)', transformOrigin: 'bottom left' } } }));
const NewsletterForm = styled(motion.form)(({ theme }) => ({ display: 'flex', gap: theme.spacing(1), marginTop: theme.spacing(2), backgroundColor: alpha(theme.palette.common.black, 0.3), borderRadius: '50px', padding: theme.spacing(0.5), border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`, boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.2)}`, transition: 'all 0.3s ease', '&:hover': { boxShadow: `0 6px 25px ${alpha(theme.palette.secondary.main, 0.3)}`, transform: 'translateY(-2px)' } }));
const StyledInput = styled(InputBase)(({ theme }) => ({ color: theme.palette.common.white, flexGrow: 1, padding: theme.spacing(0, 3), fontSize: theme.typography.pxToRem(15), '& .MuiInputBase-input::placeholder': { opacity: 0.8, color: theme.palette.common.white } }));
const SocialIconWrapper = styled(motion.a)(({ theme }) => ({ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.common.white, textDecoration: 'none', border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`, transition: 'all 0.3s ease', '&:hover': { color: theme.palette.common.white, borderColor: theme.palette.secondary.main, transform: 'translateY(-3px)', boxShadow: `0 5px 15px ${alpha(theme.palette.secondary.main, 0.3)}` } }));
const ContactItem = styled(motion.div)(({ theme }) => ({ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5), padding: theme.spacing(1, 0), '& svg': { transition: 'all 0.3s ease' }, '&:hover': { '& svg': { transform: 'scale(1.2)', color: theme.palette.secondary.main } } }));
const LogoImage = styled(motion.img)({ cursor: 'pointer', transition: 'all 0.5s ease' });

const Footer = ({ language = 'en' }) => {
  const theme = useTheme();
  const t = translations[language] || translations.en;
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      enqueueSnackbar('Please enter a valid email address.', { variant: 'warning' });
      return;
    }
    try {
      const response = await api.post('/subscribe', { email });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      setEmail('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Subscription failed. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const quickLinks = [ { title: t.home, path: '/' }, { title: t.aboutUs, path: '/about' }, { title: t.events, path: '/news-and-events' }, { title: t.gallery, path: '/gallery' } ];
  const supportLinks = [ { title: t.ourClasses, path: '/classes' }, { title: t.newsUpdates, path: '/news-and-events' }, { title: t.contactUs, path: '/contact' } ];
  const contactInfo = [ { id: 'location', text: `${t.churchName}, ${t.churchLocation}`, icon: <LocationOn fontSize="small" /> }, { id: 'phone', text: '+251 90 606 1432', icon: <Phone fontSize="small" /> }, { id: 'email', text: 'jimaamdehaymanot21@gmail.com', icon: <Email fontSize="small" /> } ];
  const socialLinks = [ { icon: <YouTube />, name: 'YouTube', url: 'https://www.youtube.com/@JimmaAmdehaymanot', color: '#FF0000' }, { icon: <Facebook />, name: 'Facebook', url: 'https://www.facebook.com/amdehymanot', color: '#1877F2' }, { icon: <Telegram />, name: 'Telegram', url: 'https://t.me/amdehaymanotmedia', color: '#0088cc' }, { icon: <MusicVideoIcon />, name: 'TikTok', url: 'https://www.tiktok.com/@jimaamdehaymanotsunday?_t=ZM-8xGyYrCWeOe&_r=1', color: '#000000' }, { icon: <Storefront />, name: 'Play Store', url: 'https://play.google.com/store/apps/details?id=com.amdehayimanot', color: '#3DDC84' }, { icon: <Instagram />, name: 'Instagram', url: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=yndpdny', color: '#E4405F' } ];
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <Box sx={{ position: 'relative', backgroundColor: theme.palette.background.default, mt: 'auto' }}>
      <FooterWrapper>
        <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 3, md: 4 } }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', backdropFilter: 'blur(10px)', border: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
              <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" fontWeight={700}>{t.stayConnected}</Typography>
                  <Typography>{t.newsletterPrompt}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <NewsletterForm onSubmit={handleSubscribe}>
                    <StyledInput placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} type="email"/>
                    <Button variant="contained" color="secondary" type="submit"><ArrowForward /></Button>
                  </NewsletterForm>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          <Grid container spacing={5} sx={{ my: { xs: 4, md: 6 } }} component={motion.div} variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
              <Box mb={2}><LogoImage src={logoImage} alt="Amdehayimanot Logo" style={{ height: 60 }} /></Box>
              <Typography variant="body2">{t.motto}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2} component={motion.div} variants={itemVariants}>
              <Typography variant="h6">{t.explore}</Typography>
              <Stack spacing={1.5}>{quickLinks.map((link) => ( <motion.div key={link.title}><FooterLink href={link.path}>{link.title}</FooterLink></motion.div> ))}</Stack>
            </Grid>
            <Grid item xs={6} sm={3} md={2} component={motion.div} variants={itemVariants}>
              <Typography variant="h6">{t.support}</Typography>
              <Stack spacing={1.5}>{supportLinks.map(link => ( <motion.div key={link.title}><FooterLink href={link.path}>{link.title}</FooterLink></motion.div> ))}</Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4} component={motion.div} variants={itemVariants}>
              <Typography variant="h6">{t.getInTouch}</Typography>
              <Stack spacing={1}>{contactInfo.map(info => ( <ContactItem key={info.id}> <Box sx={{ color: 'secondary.main' }}>{info.icon}</Box> <Typography variant="body2">{info.text}</Typography> </ContactItem> ))}</Stack>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.1) }} />

          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'space-between' }, alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: 2, pt: 4 }}>
            <Typography variant="body2">© {new Date().getFullYear()} Amdehayimanot Sunday School. {t.copyright}.</Typography>
            <Stack direction="row" spacing={1.5}>{socialLinks.map((social) => ( <SocialIconWrapper key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, backgroundColor: alpha(social.color, 0.2), borderColor: social.color }}>{social.icon}</SocialIconWrapper> ))}</Stack>
          </Box>
        </Container>
      </FooterWrapper>
    </Box>
  );
};

export default Footer;