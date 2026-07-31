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
  en: { churchName: 'Saint Mary Cathedral', churchLocation: 'Jimma, Ethiopia', stayConnected: 'Stay Informed', newsletterPrompt: 'Get the latest news and events delivered to your inbox.', emailPlaceholder: 'Enter your email', motto: 'But we preach Christ crucified, a stumbling block to Jews and foolishness to Gentiles.', explore: 'Explore', support: 'Support', getInTouch: 'Get In Touch', copyright: 'All Rights Reserved', home: 'Home', aboutUs: 'About Us', events: 'Events', gallery: 'Gallery', mediaAndTech: 'Media & Tech', ourClasses: 'Our Classes', newsUpdates: 'News & Updates', contactUs: 'Contact Us' },
  am: { churchName: 'የቅድስት ማርያም ካቴድራል', churchLocation: 'ጅማ, ኢትዮጵያ', stayConnected: 'ሙሉ መረጃ ያግኙ', newsletterPrompt: 'የቅርብ ጊዜ ዜናዎችን እና ክስተቶችን በኢሜይል መልእክት ሳጥንዎ ያግኙ።', emailPlaceholder: 'ኢሜልዎን ያስገቡ', motto: 'እኛ ግን የተሰቀለውን ክርስቶስን እንሰብካለን፤ ይህም ለአይሁድ ማሰናከያ ለአሕዛብም ሞኝነት ነው፥', explore: 'ያስሱ', support: 'ድጋፍ', getInTouch: 'ያግኙን', copyright: 'ሁሉም መብቶች የተጠበቁ ናቸው', home: 'መነሻ', aboutUs: 'ስለ እኛ', events: 'ክስተቶች', gallery: 'ጋለሪ', mediaAndTech: 'ሚዲያ እና ቴክ', ourClasses: 'ትምህርቶቻችን', newsUpdates: 'ዜና እና ዝመናዎች', contactUs: 'ያግኙን' },
  om: { churchName: 'Katidiraalii Qulqulleettii Maariyaam', churchLocation: 'Jimmaa, Itoophiyaa', stayConnected: 'Odeeffannoo Qabaadhaa', newsletterPrompt: 'Oduu fi taateewwan haaraa sanduuqa ergaa keessanitti argadhaa.', emailPlaceholder: 'Imeelii keessan galchaa', motto: 'Nuti garuu Kiristoos isa fannifame lallabna.', explore: 'Sakatta\'i', support: 'Deeggarsa', getInTouch: 'Nu Qunnamaa', copyright: 'Mirgi Hundi Seeraan Eegamaadha', home: 'Fuula Jalqabaa', aboutUs: 'Waa\'ee Keenya', events: 'Taateewwan', gallery: 'Kuusaa Suuraa', mediaAndTech: 'Miidiyaa & Teek', ourClasses: 'Barnoota Keenya', newsUpdates: 'Oduu fi Fooyya\'iinsa', contactUs: 'Nu Qunnamaa' },
  ti: { churchName: 'ካቴድራል ቅድስት ማርያም', churchLocation: 'ጅማ, ኢትዮጵያ', stayConnected: 'ሓበሬታ ኹኑ', newsletterPrompt: 'ሓድሽ ዜናታትን ፍጻመታትን ኣብ ኢመይል ሳጹንኩም ተቐበሉ', emailPlaceholder: 'ኢሜይልኩም ኣእትዉ', motto: 'ንሕና ግና ነቲ እተሰቕለ ክርስቶስ ንሰብኽ።', explore: 'ኣስስ', support: 'ድጋፍ', getInTouch: 'ተራኸቡና', copyright: 'መሰሉ ብሕጊ ዝተሓለወ እዩ', home: 'መበገሲ', aboutUs: 'ብዛዕባና', events: 'ፍጻመታት', gallery: 'መአከቢ ስእሊ', mediaAndTech: 'ሚድያን ቴክን', ourClasses: 'ክፍልታትና', newsUpdates: 'ዜናን ሓበሬታን', contactUs: 'ተራኸቡና' },
  ge: { churchName: 'ቤተ ፡ ክርስቲያን ፡ ቅድስት ፡ ማርያም', churchLocation: 'ጅማ ፡ ኢትዮጵያ', stayConnected: 'ተአምኁ ፡ ወትረ', newsletterPrompt: 'ዜና ፡ ሐዲስ ፡ ወግብረ ፡ በኢሜይል ፡ በጽሐክሙ።', emailPlaceholder: 'አግባእ ፡ ኢሜይለከ', motto: 'ወንሕነሰ ፡ ንሰብክ ፡ ክርስቶስ ፡ ዘተሰቅለ።', explore: 'አስስ', support: 'ረድኤት', getInTouch: 'ተራከቡነ', copyright: 'ኵሉ ፡ መብት ፡ ኅልው ፡ ውእቱ።', home: 'አርእስት', aboutUs: 'ስለ ፡ አነ', events: 'ምክንያታት', gallery: 'ማዕከለ ፡ ስእል', mediaAndTech: 'ሚዲያ ወቴክ', ourClasses: 'ክፍለ ፡ ትምህርትነ', newsUpdates: 'ዜና ፡ ወሐዲስ', contactUs: 'ተራከቡነ' },
  es: { churchName: 'Catedral de Santa María', churchLocation: 'Jimma, Etiopía', stayConnected: 'Manténgase Informado', newsletterPrompt: 'Reciba las últimas noticias y eventos en su bandeja de entrada.', emailPlaceholder: 'Ingrese su correo electrónico', motto: 'Pero nosotros predicamos a Cristo crucificado.', explore: 'Explorar', support: 'Apoyo', getInTouch: 'Ponerse en Contacto', copyright: 'Todos los Derechos Reservados', home: 'Inicio', aboutUs: 'Sobre Nosotros', events: 'Eventos', gallery: 'Galería', mediaAndTech: 'Media y Tech', ourClasses: 'Nuestras Clases', newsUpdates: 'Noticias y Actualizaciones', contactUs: 'Contáctenos' },
  fr: { churchName: 'Cathédrale Sainte-Marie', churchLocation: 'Jimma, Éthiopie', stayConnected: 'Restez Informé', newsletterPrompt: 'Recevez les dernières nouvelles et événements dans votre boîte de réception.', emailPlaceholder: 'Entrez votre courriel', motto: 'Nous, nous prêchons Christ crucifié.', explore: 'Explorer', support: 'Soutien', getInTouch: 'Contactez-nous', copyright: 'Tous Droits Réservés', home: 'Accueil', aboutUs: 'À Propos de Nous', events: 'Événements', gallery: 'Galerie', mediaAndTech: 'Média & Tech', ourClasses: 'Nos Cours', newsUpdates: 'Nouvelles et Mises à Jour', contactUs: 'Contactez-nous' },
  ar: { churchName: 'كاتدرائية القديسة مريم', churchLocation: 'جيما، إثيوبيا', stayConnected: 'ابق على اطلاع', newsletterPrompt: 'احصل على آخر الأخبار والفعاليات في بريدك الوارد.', emailPlaceholder: 'أدخل بريدك الإلكتروني', motto: 'ولكننا نحن نكرز بالمسيح مصلوبا.', explore: 'استكشف', support: 'الدعم', getInTouch: 'تواصل معنا', copyright: 'كل الحقوق محفوظة', home: 'الرئيسية', aboutUs: 'من نحن', events: 'الفعاليات', gallery: 'المعرض', mediaAndTech: 'إعلام وتقنية', ourClasses: 'فصولنا', newsUpdates: 'الأخبار والتحديثات', contactUs: 'اتصل بنا' },
};

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
