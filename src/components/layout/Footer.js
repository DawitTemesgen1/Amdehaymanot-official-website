import React, { useState } from 'react';
import {
  Box, Container, Grid, Typography, Link as MuiLink, Divider,
  InputBase, Button, Stack, useTheme,
} from '@mui/material';
import {
  Facebook, Instagram, YouTube, Email, Phone, LocationOn,
  ArrowForward, Telegram, Storefront,
} from '@mui/icons-material';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import { styled, alpha } from '@mui/system';
import { useSnackbar } from 'notistack';
import api from '../../api/axiosConfig';
import logoImage from '../../assets/logo.png';
import { OrthodoxPattern, CathedralArch } from '../ui';
import { brand } from '../../brand';
import { PLAY_STORE_URL } from '../../config/links';

const translations = {
  en: {
    "churchName": "St. Mary's Cathedral",
    "churchLocation": "Jimma, Ethiopia",
    "stayConnected": "Get complete information",
    "newsletterPrompt": "Get the latest news and events delivered to your email inbox.",
    "emailPlaceholder": "Enter your email",
    "motto": "But we strive to pray and serve the word. - Acts 6:4",
    "explore": "Explore",
    "support": "Support",
    "getInTouch": "Contact us",
    "copyright": "All rights reserved",
    "home": "origin",
    "aboutUs": "about us",
    "events": "Events",
    "gallery": "Gallery",
    "mediaAndTech": "Media and Tech",
    "ourClasses": "Our lessons",
    "newsUpdates": "News and updates",
    "contactUs": "Contact us"
},
  om: {
    "churchName": "Kaatediraala Qulqulleettii Maariyaam",
    "churchLocation": "Jimmaa, Itoophiyaa",
    "stayConnected": "Odeeffannoo Guutuu Argadhaa",
    "newsletterPrompt": "Oduu fi taateewwan haaraa email keessaniin argadhaa.",
    "emailPlaceholder": "Email keessan galchaa",
    "motto": "Nuti garuu kadhachuu fi dubbicha tajaajiluuf ni carraaqna. — Hojii Ergamootaa 6:4",
    "explore": "Qo'adhaa",
    "support": "Deeggarsa",
    "getInTouch": "Nu Quunnamaa",
    "copyright": "Mirgi Qopheessaa Seeraan Kan Eegame",
    "home": "Fuula Duraa",
    "aboutUs": "Waa'ee Keenya",
    "events": "Taateewwan",
    "gallery": "Kuusaa Suuraa",
    "mediaAndTech": "Miidiyaa fi Teeknooloojii",
    "ourClasses": "Barnoota Keenya",
    "newsUpdates": "Oduu fi Odeeffannoo Haaraa",
    "contactUs": "Nu Quunnamaa"

  },
  ti: {
    "churchName": "ካቴድራል ቅድስቲ ማርያም",
    "churchLocation": "ጅማ ኢትዮጵያ",
    "stayConnected": "ምሉእ ሓበሬታ ውሰድ",
    "newsletterPrompt": "እዋናዊ ዜናን ፍጻሜታትን ናብ ኢመይል ኢንቦክስኩም ይበጽሑ።",
    "emailPlaceholder": "ኢመይልኩም ኣእትዉ",
    "motto": "ንሕና ግና ነቲ ቃል ክንጽሊን ከነገልግሎን ንጽዕር። - ግብሪ ሃዋርያት 6፡4",
    "explore": "ዳህሰሳ",
    "support": "ሓገዝ",
    "getInTouch": "ርኸቡና",
    "copyright": "ኩሉ መሰላት ዝተሓለወ እዩ።",
    "home": "መሰረት",
    "aboutUs": "ብዛዕባና ዝምልከት",
    "events": "ፍጻመታት",
    "gallery": "ጋለሪ",
    "mediaAndTech": "ሚድያን ቴክን",
    "ourClasses": "ትምህርትና",
    "newsUpdates": "ዜናን እዋናዊ ሓበሬታን",
    "contactUs": "ርኸቡና"
},
  es: {
    "churchName": "Catedral de Santa María",
    "churchLocation": "Jima, Etiopía",
    "stayConnected": "Obtener información completa",
    "newsletterPrompt": "Reciba las últimas noticias y eventos en la bandeja de entrada de su correo electrónico.",
    "emailPlaceholder": "Introduce tu correo electrónico",
    "motto": "Pero nos esforzamos en orar y servir a la palabra. - Hechos 6:4",
    "explore": "Explorar",
    "support": "Apoyo",
    "getInTouch": "Contáctenos",
    "copyright": "Reservados todos los derechos",
    "home": "origen",
    "aboutUs": "sobre nosotros",
    "events": "Eventos",
    "gallery": "Galería",
    "mediaAndTech": "Medios y tecnología",
    "ourClasses": "Nuestras lecciones",
    "newsUpdates": "Noticias y actualizaciones",
    "contactUs": "Contáctenos"
},
  fr: {
    "churchName": "Cathédrale Sainte-Marie",
    "churchLocation": "Jimma, Éthiopie",
    "stayConnected": "Obtenez des informations complètes",
    "newsletterPrompt": "Recevez les dernières nouvelles et événements dans votre boîte de réception e-mail.",
    "emailPlaceholder": "Entrez votre email",
    "motto": "Mais nous nous efforçons de prier et de servir la parole. - Actes 6:4",
    "explore": "Explorer",
    "support": "Soutien",
    "getInTouch": "Contactez-nous",
    "copyright": "Tous droits réservés",
    "home": "origine",
    "aboutUs": "à propos de nous",
    "events": "Événements",
    "gallery": "Galerie",
    "mediaAndTech": "Médias et technologie",
    "ourClasses": "Nos cours",
    "newsUpdates": "Nouvelles et mises à jour",
    "contactUs": "Contactez-nous"
},
  ar: {
    "churchName": "كاتدرائية سانت ماري",
    "churchLocation": "جيما، إثيوبيا",
    "stayConnected": "الحصول على معلومات كاملة",
    "newsletterPrompt": "احصل على آخر الأخبار والأحداث التي يتم تسليمها إلى صندوق بريدك الإلكتروني.",
    "emailPlaceholder": "أدخل بريدك الإلكتروني",
    "motto": "ولكننا نجتهد في الصلاة وخدمة الكلمة. - أعمال 6: 4",
    "explore": "يستكشف",
    "support": "يدعم",
    "getInTouch": "اتصل بنا",
    "copyright": "جميع الحقوق محفوظة",
    "home": "أصل",
    "aboutUs": "معلومات عنا",
    "events": "الأحداث",
    "gallery": "معرض",
    "mediaAndTech": "وسائل الإعلام والتكنولوجيا",
    "ourClasses": "دروسنا",
    "newsUpdates": "الأخبار والتحديثات",
    "contactUs": "اتصل بنا"
},
  am: {
    "churchName": "የቅድስት ማርያም ካቴድራል",
    "churchLocation": "ጅማ, ኢትዮጵያ",
    "stayConnected": "ሙሉ መረጃ ያግኙ",
    "newsletterPrompt": "የቅርብ ጊዜ ዜናዎችን እና ክስተቶችን በኢሜይል መልእክት ሳጥንዎ ያግኙ።",
    "emailPlaceholder": "ኢሜልዎን ያስገቡ",
    "motto": "እኛ ግን ለጸሎትና ቃሉን ለማገልገል እንተጋለን። — ሐዋርያት 6፥4",
    "explore": "ያስሱ",
    "support": "ድጋፍ",
    "getInTouch": "ያግኙን",
    "copyright": "ሁሉም መብቶች የተጠበቁ ናቸው",
    "home": "መነሻ",
    "aboutUs": "ስለ እኛ",
    "events": "ክስተቶች",
    "gallery": "ጋለሪ",
    "mediaAndTech": "ሚዲያ እና ቴክ",
    "ourClasses": "ትምህርቶቻችን",
    "newsUpdates": "ዜና እና ዝመናዎች",
    "contactUs": "ያግኙን"
},
  ge: {
    "churchName": "ካቴድራል ቅድስት ማርያም",
    "churchLocation": "ጅማ, ኢትዮጵያ",
    "stayConnected": "ርከቡ ምሉእ ሐበሬታ",
    "newsletterPrompt": "ርከቡ ሐዲሰ ዜና ወክንውናተ በኢሜልክሙ።",
    "emailPlaceholder": "አእትዉ ኢሜል",
    "motto": "ወንሕነሰ ንተግህ ለጸሎት ወለአገልግሎተ ቃል ። — ግብረ ሐዋርያት ፮፡፬",
    "explore": "ኅሡ",
    "support": "ረድኤት",
    "getInTouch": "ርከቡነ",
    "copyright": "ኵሉ ብሕትውና ዝዑቅ ውእቱ",
    "home": "መባእታ",
    "aboutUs": "በእንቲአነ",
    "events": "ክንውናት",
    "gallery": "ሥዕላት",
    "mediaAndTech": "ሚድያ ወቴክኖሎጂ",
    "ourClasses": "ትምህርትነ",
    "newsUpdates": "ዜና ወእድሳት",
    "contactUs": "ርከቡነ"

  },
};;

const FooterLink = styled(MuiLink)({
  color: alpha('#fff', 0.75),
  textDecoration: 'none',
  display: 'inline-block',
  padding: '4px 0',
  transition: 'color 0.2s ease, transform 0.2s ease',
  '&:hover': { color: brand.gold, transform: 'translateX(4px)' },
});

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
      enqueueSnackbar(error.response?.data?.message || 'Subscription failed.', { variant: 'error' });
    }
  };

  const quickLinks = [
    { title: t.home, path: '/' },
    { title: t.aboutUs, path: '/about' },
    { title: t.events, path: '/news-and-events' },
    { title: t.gallery, path: '/gallery' },
    { title: t.mediaAndTech, path: '/media-and-tech' },
  ];
  const supportLinks = [
    { title: t.ourClasses, path: '/classes' },
    { title: t.newsUpdates, path: '/news-and-events' },
    { title: t.contactUs, path: '/contact' },
  ];
  const socialLinks = [
    { icon: <YouTube />, url: 'https://www.youtube.com/@JimmaAmdehaymanot', color: '#FF0000' },
    { icon: <Facebook />, url: 'https://www.facebook.com/amdehymanot', color: '#1877F2' },
    { icon: <Telegram />, url: 'https://t.me/amdehaymanotmedia', color: '#0088cc' },
    { icon: <MusicVideoIcon />, url: 'https://www.tiktok.com/@jimaamdehaymanotsunday?_t=ZM-8xGyYrCWeOe&_r=1', color: '#000' },
    { icon: <Storefront />, url: PLAY_STORE_URL, color: '#3DDC84' },
    { icon: <Instagram />, url: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=yndpdny', color: '#E4405F' },
  ];

  return (
    <Box component="footer" sx={{ mt: 'auto', bgcolor: brand.navyInk, color: brand.white, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: brand.stone, lineHeight: 0 }}>
        <CathedralArch sx={{ transform: 'scaleY(-1)', opacity: 0.9, color: brand.navyInk }} />
      </Box>
      <OrthodoxPattern opacity={0.05} color={brand.gold} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} alignItems="flex-end" sx={{ mb: 6 }}>
          <Grid item xs={12} md={5}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 600,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                color: brand.gold,
                mb: 1,
              }}
            >
              {t.stayConnected}
            </Typography>
            <Typography sx={{ color: alpha('#fff', 0.7), maxWidth: 360 }}>{t.newsletterPrompt}</Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                display: 'flex',
                gap: 1,
                p: 0.75,
                border: `1px solid ${alpha(brand.gold, 0.35)}`,
                bgcolor: alpha('#000', 0.25),
              }}
            >
              <InputBase
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                sx={{ flex: 1, color: '#fff', px: 2, fontSize: '0.95rem' }}
              />
              <Button type="submit" variant="contained" color="secondary" sx={{ minWidth: 48, borderRadius: 1 }}>
                <ArrowForward />
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={logoImage}
              alt="Amdehayimanot Logo"
              sx={{
                height: 72,
                width: 72,
                objectFit: 'contain',
                bgcolor: '#FFFFFF',
                borderRadius: '50%',
                border: `1.5px solid ${brand.gold}`,
                p: 0.75,
                mb: 2,
                boxShadow: `0 4px 16px ${alpha('#000', 0.3)}`,
              }}
            />
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8, maxWidth: 320 }}>
              {t.motto}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography sx={{ color: brand.gold, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.75rem', mb: 2 }}>
              {t.explore}
            </Typography>
            <Stack spacing={1}>{quickLinks.map((l) => <FooterLink key={l.path} href={l.path}>{l.title}</FooterLink>)}</Stack>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography sx={{ color: brand.gold, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.75rem', mb: 2 }}>
              {t.support}
            </Typography>
            <Stack spacing={1}>{supportLinks.map((l) => <FooterLink key={l.path} href={l.path}>{l.title}</FooterLink>)}</Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ color: brand.gold, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.75rem', mb: 2 }}>
              {t.getInTouch}
            </Typography>
            <Stack spacing={1.5} sx={{ color: alpha('#fff', 0.75) }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <LocationOn sx={{ color: brand.gold, fontSize: 18, mt: 0.3 }} />
                <Typography variant="body2">{t.churchName}, {t.churchLocation}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Phone sx={{ color: brand.gold, fontSize: 18 }} />
                <Typography variant="body2">+251 90 606 1432</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Email sx={{ color: brand.gold, fontSize: 18 }} />
                <Typography variant="body2">jimaamdehaymanot21@gmail.com</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: alpha('#fff', 0.1), my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.55) }}>
            © {new Date().getFullYear()} Amdehayimanot Sunday School. {t.copyright}.
          </Typography>
          <Stack direction="row" spacing={1}>
            {socialLinks.map((s, i) => (
              <Box
                key={i}
                component="a"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: alpha('#fff', 0.8),
                  border: `1px solid ${alpha('#fff', 0.2)}`,
                  transition: 'all 0.25s ease',
                  '&:hover': { color: brand.gold, borderColor: brand.gold, bgcolor: alpha(s.color, 0.15) },
                }}
              >
                {s.icon}
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
