import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Button,
} from '@mui/material';
import { alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/layout/SEO';
import {
  CameraAltOutlined,
  VideocamOutlined,
  ShareOutlined,
  DevicesOutlined,
  OpenInNew,
  ArrowForward,
  Telegram,
} from '@mui/icons-material';

import { AboutHero, PageSection, GoldDivider } from '../components/ui';
import { brand } from '../brand';
import { PLAY_STORE_URL } from '../config/links';
import heroBackground from '../assets/gallery.jpg';
import mediaTechHero from '../assets/media-tech-hero.svg';
import crestLogo from '../assets/logo.png';

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

const translations = {
  "en": {
    "pageTitle": "Media and Tech Religion column",
    "pageDescription": "Digital service, imaging and orthodox technology from Jimma Pillar Religion Sunday School.",
    "heroTitle": "Media and technology services",
    "heroSubtitle": "Connecting our community and sharing our religion through media and technology.",
    "leadLabel": "Our call to service",
    "leadText": "We serve God and the people by combining our ancient religion with modern technology. From photographing special spiritual celebrations of families to building digital platforms that enhance the spiritual life of our community; Our goal is to document the history of our church and connect generations with God's Word.",
    "servicesLabel": "Our digital service",
    "featuredLabel": "A separate project",
    "moreLabel": "Those who come by God's will",
    "openApp": "Get it on Google Play",
    "soon": "coming soon",
    "ctaTitle": "Work with us",
    "ctaText": "If you need a photographer for your next spiritual event, or want to work with the Sunday School on a new project, we'd love to hear from you.",
    "ctaButton": "Contact us",
    "services": [
      {
        "key": "imaging",
        "title": "Photography service",
        "text": "Professional photography services to beautifully capture baby baptisms, weddings, engagements, births, graduations and all special Christian events.",
        "icon": "imaging"
      },
      {
        "key": "video",
        "title": "Video recording",
        "text": "High quality video recording and editing packages to preserve the memories of baptisms, weddings, engagements and all your special events for a lifetime.",
        "icon": "video"
      },
      {
        "key": "social",
        "title": "social media",
        "text": "Sharing spiritual teachings, hymns and updates on all of our Sunday School pages to connect our community together.",
        "icon": "social"
      },
      {
        "key": "tech",
        "title": "Technology",
        "text": "Building apps and digital tools that help our community to persevere, learn and pray in the Orthodox faith.",
        "icon": "tech"
      }
    ],
    "featured": {
      "title": "Religious hymn",
      "text": "A collection of Ethiopian Orthodox Tewahedo hymns for the season, fasting and festivals — offline, for practice and spiritual growth.",
      "tag": "Mobile application"
    },
    "moreProjects": [
      {
        "title": "A spiritual archive",
        "text": "Preserving the history and sacred moments of our ministry."
      },
      {
        "title": "Introduction to orthodox education",
        "text": "Systematic theological and spiritual lessons for young people."
      }
    ],
    "telegramBot": {
      "tag": "Telegram bot",
      "title": "Student support bot",
      "text": "Develop your spiritual education anytime and anywhere. This unique Telegram bot provides Sunday school students with easy access to national curriculum books, helpful PDF books, and over 100 practice questions with answers. This will help you stick to your orthodoxy and prepare better for exams."
    },
    "openBot": "Open with Telegram"
  },
  "om": {
    "pageTitle": "Tarree Amantii Miidiyaa fi Teeknooloojii",
    "pageDescription": "Tajaajila dijitaalaa, suuraa fi teknooloojii ortodoksii Mana Barumsaa Sanbataa Amantii Utubaa Jimmaa irraa.",
    "heroTitle": "Tajaajila miidiyaa fi teeknooloojii",
    "heroSubtitle": "Hawaasa keenya walitti hidhuu fi amantii keenya karaa miidiyaa fi teeknooloojii waliif qooduun.",
    "leadLabel": "Waamicha keenya tajaajilaaf",
    "leadText": "Amantii keenya durii fi teknooloojii ammayyaa walitti makuun Waaqayyoo fi ummata tajaajilla. Ayyaana hafuuraa addaa maatii suuraa kaasuun hanga waltajjiiwwan dijitaalaa jireenya hafuuraa hawaasa keenyaa guddisan ijaaruutti; Kaayyoon keenya seenaa waldaa keenyaa galmeessuun dhaloota sagalee Waaqayyoo wajjin wal qunnamsiisuudha.",
    "servicesLabel": "Tajaajila dijitaalaa keenya",
    "featuredLabel": "Pirojektii addaa",
    "moreLabel": "Warra fedha Waaqayyootiin dhufan",
    "openApp": "Google Play irratti argadhaa",
    "soon": "yeroo dhiyootti",
    "ctaTitle": "Nu waliin hojjedhu",
    "ctaText": "Yoo taatee hafuuraa itti aanuuf ogeessa suuraa barbaaddan, ykn Mana Barumsaa Sanbataa waliin pirojektii haaraa irratti hojjechuu yoo barbaaddan, isin irraa dhaga'uu ni barbaanna.",
    "ctaButton": "Nu qunnamaa",
    "services": [
      {
        "key": "imaging",
        "title": "Tajaajila suuraa ka'uu",
        "text": "Tajaajila suuraa ogummaa cuuphaa daa’immanii, cidha, kaadhimummaa, dhaloota, eebbaa fi taateewwan addaa kiristaanaa hunda bareedanii qabachuuf.",
        "icon": "imaging"
      },
      {
        "key": "video",
        "title": "Viidiyoo waraabuu",
        "text": "Paakeejii viidiyoo waraabuu fi gulaaluu qulqullina olaanaa qabu yaadannoo cuuphaa, cidha, kaadhimummaa fi taateewwan addaa keessan hunda umurii guutuu eeguuf.",
        "icon": "video"
      },
      {
        "key": "social",
        "title": "miidiyaa hawaasaa",
        "text": "Barumsa hafuuraa, faarfannaa fi odeeffannoo haaraa fuula Mana Barumsaa Sanbataa keenya hunda irratti qooduun hawaasa keenya walitti hidhuu.",
        "icon": "social"
      },
      {
        "key": "tech",
        "title": "Teeknooloojii",
        "text": "Appii fi meeshaalee dijitaalaa hawaasni keenya amantaa Ortodoksii keessatti cichee, barachuu fi kadhachuuf gargaaran ijaaruu.",
        "icon": "tech"
      }
    ],
    "featured": {
      "title": "Faarfannaa amantii",
      "text": "Kuusaa faaruu Ortodoksii Tewaahidoo Itoophiyaa waqtii, soomaa fi ayyaana — toora ala, shaakala fi guddina afuuraa.",
      "tag": "Appilikeeshinii mobaayilaa"
    },
    "moreProjects": [
      {
        "title": "Kuusaa hafuuraa",
        "text": "Seenaa fi yeroo qulqulluu tajaajila keenyaa kunuunsuu."
      },
      {
        "title": "Seensa barnoota ortodoksii",
        "text": "Barnoota ti’ooloojii fi afuuraa sirnaa dargaggootaaf."
      }
    ],
    "telegramBot": {
      "tag": "Telegiraamii bot",
      "title": "Deeggarsa barattootaa bot",
      "text": "Barumsa hafuuraa kee yeroo kamittuu fi bakka barbaaddetti guddifadhu. Botiin Telegram adda ta’e kun barattoonni mana barumsaa Sanbataa kitaabota kaarikulamii biyyoolessaa, kitaabota PDF gargaaran, fi gaaffilee shaakala 100 ol deebii qaban salphaatti akka argatan ni taasisa. Kunis ortodoksii keetti cichuu fi qormaataaf akka gaariitti akka of qopheessitu si gargaara."
    },
    "openBot": "Telegramiin banaa"
  },
  "ti": {
    "pageTitle": "ዓምዲ ሃይማኖት ሚድያን ቴክን።",
    "pageDescription": "ዲጂታል ኣገልግሎት፡ ምስልን ኦርቶዶክሳዊ ቴክኖሎጂን ካብ ቤት ትምህርቲ ሰንበት ሃይማኖት ጅማ ዓንዲ።",
    "heroTitle": "ኣገልግሎት ሚድያን ቴክኖሎጅን።",
    "heroSubtitle": "ሕብረተሰብና ምትእስሳርን ብሚድያን ቴክኖሎጅን ሃይማኖትና ምክፋል።",
    "leadLabel": "ጻውዒትና ናብ ኣገልግሎት",
    "leadText": "ጥንታዊ ሃይማኖትና ምስ ዘመናዊ ቴክኖሎጂ ብምውህሃድ ንኣምላኽን ንህዝብን ነገልግል። ፍሉይ መንፈሳዊ ጽምብል ስድራቤታት ካብ ምስኣል ክሳብ መንፈሳዊ ህይወት ሕብረተሰብና ዘዕብዩ ዲጂታላዊ መድረኻት ምህናጽ፤ ዕላማና ታሪኽ ቤተ ክርስቲያንና ምስናድ ንወለዶታት ምስ ቃል ኣምላኽ ምትእስሳር እዩ።",
    "servicesLabel": "ዲጂታላዊ ኣገልግሎትና",
    "featuredLabel": "ፍሉይ ፕሮጀክት",
    "moreLabel": "እቶም ብፍቓድ ኣምላኽ ዝመጹ",
    "openApp": "ኣብ Google Play ረኸብዎ።",
    "soon": "ኣብዚ ቐረባ እዋን",
    "ctaTitle": "ምሳና ስራሕ",
    "ctaText": "ንዝቕጽል መንፈሳዊ ፍጻመኹም ሰኣላይ እንተድኣ ደሊኹም፡ ወይ ምስ ቤት ትምህርቲ ሰንበት ኣብ ሓድሽ ፕሮጀክት ክትሰርሑ ምስ እትደልዩ፡ ካባኹም ክንሰምዕ ንፈቱ።",
    "ctaButton": "ርኸቡና",
    "services": [
      {
        "key": "imaging",
        "title": "ኣገልግሎት ስእሊ",
        "text": "ንጥምቀት ህጻናት፡ መርዓ፡ ሕጸ፡ ልደት፡ ምረቓን ኩሉ ፍሉይ ክርስትያናዊ ፍጻሜታትን ብጽቡቕ ንምቕራጽ ሞያዊ ኣገልግሎት ስእሊ።",
        "icon": "imaging"
      },
      {
        "key": "video",
        "title": "ቪድዮ ምቕራጽ",
        "text": "ንዝኽሪ ጥምቀት፡ መርዓ፡ ሕጸን ኩሉ ፍሉይ ፍጻመታትኩምን ንዕድመ ምሉእ ንምዕቃብ ልዑል ጽሬት ዘለዎ ናይ ቪድዮ ምቕራጽን ኣርትዖትን ፓኬጃት።",
        "icon": "video"
      },
      {
        "key": "social",
        "title": "ማሕበራዊ መራኸቢታት",
        "text": "ንማሕበረሰብና ብሓባር ንምትእስሳር ኣብ ኩሉ ገጻት ትምህርቲ ሰንበትና መንፈሳዊ ትምህርቲ፡ መዝሙርን እዋናዊ ሓበሬታን ምክፋል።",
        "icon": "social"
      },
      {
        "key": "tech",
        "title": "ቴክኖሎጂ",
        "text": "ሕብረተሰብና ብኦርቶዶክሳዊ እምነት ክጸንዕን ክመሃርን ክጽልን ዝሕግዙ ኣፕን ዲጂታላዊ መሳርሕታትን ምህናጽ።",
        "icon": "tech"
      }
    ],
    "featured": {
      "title": "ሃይማኖታዊ መዝሙር",
      "text": "እኩብ ናይ ኢትዮጵያ ኦርቶዶክስ ተዋህዶ መዝሙር ንወቕቲ፡ ጾምን በዓላትን — ካብ መስመር ወጻኢ፡ ንልምምድን መንፈሳዊ ዕብየትን።",
      "tag": "ሞባይል ኣፕሊኬሽን"
    },
    "moreProjects": [
      {
        "title": "መንፈሳዊ ማህደር",
        "text": "ታሪኽን ቅዱስ ህሞታትን ኣገልግሎትና ምዕቃብ።"
      },
      {
        "title": "ሌላ ምስ ኦርቶዶክሳዊ ትምህርቲ",
        "text": "ስርዓታዊ ስነ-መለኮታውን መንፈሳውን ትምህርቲ ንመንእሰያት።"
      }
    ],
    "telegramBot": {
      "tag": "ቴሌግራም ቦት",
      "title": "ናይ ተማሃሮ ደገፍ ቦት።",
      "text": "ኣብ ዝኾነ እዋንን ኣብ ዝኾነ ቦታን መንፈሳዊ ትምህርትኻ ኣማዕብል። እዚ ፍሉይ ናይ ቴሌግራም ቦት ንተማሃሮ ቤት ትምህርቲ ሰንበት ሃገራዊ መጻሕፍቲ ስርዓተ ትምህርቲ፡ ሓገዝቲ መጻሕፍቲ ፒዲኤፍ፡ ከምኡ’ውን ልዕሊ 100 ናይ ልምምድ ሕቶታት ምስ መልሲ ብቐሊሉ ክረኽቡ ይገብር። እዚ ድማ ኣብ ኦርቶዶክስካ ክትጸንዕን ንፈተና ብዝበለጸ ክትዳሎን ይሕግዘካ።"
    },
    "openBot": "ብቴሌግራም ክፈት"
  },
  "es": {
    "pageTitle": "Columna sobre religión en medios y tecnología",
    "pageDescription": "Servicio digital, imágenes y tecnología ortodoxa de la Escuela Dominical Jimma Pillar Religion.",
    "heroTitle": "Servicios de medios y tecnología.",
    "heroSubtitle": "Conectando a nuestra comunidad y compartiendo nuestra religión a través de los medios y la tecnología.",
    "leadLabel": "Nuestro llamado al servicio",
    "leadText": "Servimos a Dios y al pueblo combinando nuestra antigua religión con la tecnología moderna. Desde fotografiar celebraciones espirituales especiales de familias hasta construir plataformas digitales que mejoren la vida espiritual de nuestra comunidad; Nuestro objetivo es documentar la historia de nuestra iglesia y conectar generaciones con la Palabra de Dios.",
    "servicesLabel": "Nuestro servicio digital",
    "featuredLabel": "Un proyecto separado",
    "moreLabel": "Los que vienen por la voluntad de Dios.",
    "openApp": "Consíguelo en Google Play",
    "soon": "muy pronto",
    "ctaTitle": "Trabaja con nosotros",
    "ctaText": "Si necesita un fotógrafo para su próximo evento espiritual o desea trabajar con la Escuela Dominical en un nuevo proyecto, nos encantaría saber de usted.",
    "ctaButton": "Contáctenos",
    "services": [
      {
        "key": "imaging",
        "title": "Servicio de fotografía",
        "text": "Servicios de fotografía profesional para capturar bellamente bautismos de bebés, bodas, compromisos, nacimientos, graduaciones y todos los eventos cristianos especiales.",
        "icon": "imaging"
      },
      {
        "key": "video",
        "title": "Grabación de vídeo",
        "text": "Paquetes de grabación y edición de video de alta calidad para preservar los recuerdos de bautizos, bodas, compromisos y todos sus eventos especiales para toda la vida.",
        "icon": "video"
      },
      {
        "key": "social",
        "title": "redes sociales",
        "text": "Compartir enseñanzas espirituales, himnos y actualizaciones en todas nuestras páginas de la Escuela Dominical para conectar a nuestra comunidad.",
        "icon": "social"
      },
      {
        "key": "tech",
        "title": "Tecnología",
        "text": "Crear aplicaciones y herramientas digitales que ayuden a nuestra comunidad a perseverar, aprender y orar en la fe ortodoxa.",
        "icon": "tech"
      }
    ],
    "featured": {
      "title": "himno religioso",
      "text": "Una colección de himnos tewahedo ortodoxos etíopes para la temporada, el ayuno y los festivales, sin conexión, para la práctica y el crecimiento espiritual.",
      "tag": "Aplicación móvil"
    },
    "moreProjects": [
      {
        "title": "Un archivo espiritual",
        "text": "Preservando la historia y los momentos sagrados de nuestro ministerio."
      },
      {
        "title": "Introducción a la educación ortodoxa.",
        "text": "Lecciones teológicas y espirituales sistemáticas para jóvenes."
      }
    ],
    "telegramBot": {
      "tag": "robot de telegrama",
      "title": "Bot de apoyo al estudiante",
      "text": "Desarrolla tu educación espiritual en cualquier momento y lugar. Este exclusivo bot de Telegram brinda a los estudiantes de escuela dominical fácil acceso a libros del plan de estudios nacional, útiles libros en PDF y más de 100 preguntas de práctica con respuestas. Esto le ayudará a cumplir con su ortodoxia y prepararse mejor para los exámenes."
    },
    "openBot": "Abrir con Telegram"
  },
  "fr": {
    "pageTitle": "Chronique Médias et religion technologique",
    "pageDescription": "Service numérique, imagerie et technologie orthodoxe de l'école du dimanche Jimma Pillar Religion.",
    "heroTitle": "Services médiatiques et technologiques",
    "heroSubtitle": "Connecter notre communauté et partager notre religion à travers les médias et la technologie.",
    "leadLabel": "Notre appel au service",
    "leadText": "Nous servons Dieu et le peuple en combinant notre ancienne religion avec la technologie moderne. De la photographie de célébrations spirituelles spéciales des familles à la création de plateformes numériques qui améliorent la vie spirituelle de notre communauté ; Notre objectif est de documenter l'histoire de notre église et de connecter les générations avec la Parole de Dieu.",
    "servicesLabel": "Notre service numérique",
    "featuredLabel": "Un projet à part",
    "moreLabel": "Ceux qui viennent selon la volonté de Dieu",
    "openApp": "Obtenez-le sur Google Play",
    "soon": "à venir",
    "ctaTitle": "Travaillez avec nous",
    "ctaText": "Si vous avez besoin d'un photographe pour votre prochain événement spirituel ou si vous souhaitez travailler avec l'École du Dimanche sur un nouveau projet, nous serions ravis de vous entendre.",
    "ctaButton": "Contactez-nous",
    "services": [
      {
        "key": "imaging",
        "title": "Service de photographie",
        "text": "Services de photographie professionnels pour capturer magnifiquement les baptêmes de bébés, les mariages, les fiançailles, les naissances, les remises de diplômes et tous les événements chrétiens spéciaux.",
        "icon": "imaging"
      },
      {
        "key": "video",
        "title": "Enregistrement vidéo",
        "text": "Forfaits d'enregistrement et de montage vidéo de haute qualité pour préserver toute une vie les souvenirs de baptêmes, mariages, fiançailles et tous vos événements spéciaux.",
        "icon": "video"
      },
      {
        "key": "social",
        "title": "réseaux sociaux",
        "text": "Partager des enseignements spirituels, des hymnes et des mises à jour sur toutes nos pages de l'École du dimanche pour connecter notre communauté.",
        "icon": "social"
      },
      {
        "key": "tech",
        "title": "Technologie",
        "text": "Créer des applications et des outils numériques qui aident notre communauté à persévérer, apprendre et prier dans la foi orthodoxe.",
        "icon": "tech"
      }
    ],
    "featured": {
      "title": "Hymne religieux",
      "text": "Une collection d'hymnes orthodoxes éthiopiens Tewahedo pour la saison, le jeûne et les festivals – hors ligne, pour la pratique et la croissance spirituelle.",
      "tag": "Application mobile"
    },
    "moreProjects": [
      {
        "title": "Une archive spirituelle",
        "text": "Préserver l’histoire et les moments sacrés de notre ministère."
      },
      {
        "title": "Introduction à l'éducation orthodoxe",
        "text": "Cours théologiques et spirituels systématiques pour les jeunes."
      }
    ],
    "telegramBot": {
      "tag": "Bot de télégramme",
      "title": "Bot de soutien aux étudiants",
      "text": "Développez votre éducation spirituelle à tout moment et en tout lieu. Ce robot Telegram unique offre aux élèves de l'école du dimanche un accès facile aux manuels du programme national, aux livres PDF utiles et à plus de 100 questions pratiques avec réponses. Cela vous aidera à rester fidèle à votre orthodoxie et à mieux vous préparer aux examens."
    },
    "openBot": "Ouvrir avec Telegram"
  },
  "ar": {
    "pageTitle": "عمود الدين الإعلامي والتقني",
    "pageDescription": "الخدمة الرقمية والتصوير والتكنولوجيا التقليدية من مدرسة Jimma Pillar Religion Sunday School.",
    "heroTitle": "خدمات الإعلام والتكنولوجيا",
    "heroSubtitle": "ربط مجتمعنا ومشاركة ديننا من خلال وسائل الإعلام والتكنولوجيا.",
    "leadLabel": "دعوتنا للخدمة",
    "leadText": "نحن نخدم الله والشعب من خلال الجمع بين ديننا القديم والتكنولوجيا الحديثة. من تصوير الاحتفالات الروحية الخاصة للعائلات إلى بناء منصات رقمية تعزز الحياة الروحية لمجتمعنا؛ هدفنا هو توثيق تاريخ كنيستنا وربط الأجيال بكلمة الله.",
    "servicesLabel": "خدمتنا الرقمية",
    "featuredLabel": "مشروع منفصل",
    "moreLabel": "الذين يأتون بأمر الله",
    "openApp": "احصل عليه على جوجل بلاي",
    "soon": "قريباً",
    "ctaTitle": "العمل معنا",
    "ctaText": "إذا كنت بحاجة إلى مصور لحدثك الروحي القادم، أو ترغب في العمل مع مدرسة الأحد في مشروع جديد، فنحن نحب أن نسمع منك.",
    "ctaButton": "اتصل بنا",
    "services": [
      {
        "key": "imaging",
        "title": "خدمة التصوير الفوتوغرافي",
        "text": "خدمات التصوير الفوتوغرافي الاحترافية لالتقاط صور رائعة لحفلات تعميد الأطفال وحفلات الزفاف والخطوبة والولادات والتخرج وجميع المناسبات المسيحية الخاصة.",
        "icon": "imaging"
      },
      {
        "key": "video",
        "title": "تسجيل الفيديو",
        "text": "باقات تسجيل وتحرير فيديو عالية الجودة للحفاظ على ذكريات التعميد وحفلات الزفاف والخطوبة وجميع المناسبات الخاصة بك مدى الحياة.",
        "icon": "video"
      },
      {
        "key": "social",
        "title": "وسائل التواصل الاجتماعي",
        "text": "مشاركة التعاليم الروحية والتراتيل والتحديثات على جميع صفحات مدرسة الأحد الخاصة بنا لربط مجتمعنا ببعضه البعض.",
        "icon": "social"
      },
      {
        "key": "tech",
        "title": "تكنولوجيا",
        "text": "بناء التطبيقات والأدوات الرقمية التي تساعد مجتمعنا على المثابرة والتعلم والصلاة في الإيمان الأرثوذكسي.",
        "icon": "tech"
      }
    ],
    "featured": {
      "title": "نشيد ديني",
      "text": "مجموعة من ترانيم التوحيد الأرثوذكسية الإثيوبية للموسم والصوم والمهرجانات - بدون اتصال بالإنترنت، للممارسة والنمو الروحي.",
      "tag": "تطبيق الهاتف المحمول"
    },
    "moreProjects": [
      {
        "title": "أرشيف روحاني",
        "text": "الحفاظ على التاريخ واللحظات المقدسة لخدمتنا."
      },
      {
        "title": "مقدمة في التربية الأرثوذكسية",
        "text": "دروس لاهوتية وروحية منهجية للشباب."
      }
    ],
    "telegramBot": {
      "tag": "بوت برقية",
      "title": "بوت دعم الطلاب",
      "text": "طور تعليمك الروحي في أي وقت وفي أي مكان. يوفر روبوت Telegram الفريد هذا لطلاب مدارس الأحد سهولة الوصول إلى كتب المناهج الوطنية وكتب PDF المفيدة وأكثر من 100 سؤال تدريبي مع إجابات. سيساعدك هذا على الالتزام بمبادئك والاستعداد بشكل أفضل للامتحانات."
    },
    "openBot": "افتح باستخدام تيليجرام"
  },
  "am": {
    "pageTitle": "ሚዲያ እና ቴክ | ዓምደ ሃይማኖት",
    "pageDescription": "ከጅማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት የዲጂታል አገልግሎት፣ ምስልና የኦርቶዶክሳዊ ቴክኖሎጂ።",
    "heroTitle": "ሚዲያ እና ቴክኖሎጂ አገልግሎት",
    "heroSubtitle": "በሚዲያ እና በቴክኖሎጂ ማኅበረሰባችንን ማገናኘት እና ሃይማኖታችንን ማካፈል።",
    "leadLabel": "የአገልግሎት ጥሪያችን",
    "leadText": "ጥንታዊውን ሃይማኖታችንን ከዘመኑ ቴክኖሎጂ ጋር በማዋሃድ እግዚአብሔርን እና ሕዝቡን እናገለግላለን። የቤተሰቦትን ልዩ መንፈሳዊ በዓላት በፎቶግራፍ ከማስቀረት ጀምሮ የማኅበረሰባችንን መንፈሳዊ ሕይወት የሚያሳድጉ ዲጂታል መድረኮችን እስከ መገንባት ድረስ፤ ዓላማችን የቤተ ክርስቲያናችንን ታሪክ መሰነድ እና ትውልዱን ከእግዚአብሔር ቃል ጋር ማገናኘት ነው።",
    "servicesLabel": "የዲጂታል አገልግሎታችን",
    "featuredLabel": "የተለየ ፕሮጀክት",
    "moreLabel": "በእግዚአብሔር ፈቃድ የሚመጡ",
    "openApp": "በጉግል ፕሌይ ያግኙ",
    "soon": "በቅርቡ",
    "ctaTitle": "ከእኛ ጋር ይስሩ",
    "ctaText": "ለቀጣይ መንፈሳዊ ዝግጅትዎ ፎቶግራፈር ቢፈልጉ፣ ወይም ከሰንበት ትምህርት ቤቱ ጋር በአዲስ ፕሮጀክት ላይ አብረው መሥራት ቢፈልጉ፣ እኛን ቢያነጋግሩን ደስ ይለናል።",
    "ctaButton": "ያግኙን",
    "services": [
      {
        "key": "imaging",
        "title": "የፎቶግራፍ አገልግሎት",
        "text": "የሕፃናት ጥምቀት፣ ጋብቻ፣ ሽምግልና፣ ልደት፣ ምረቃ እና ሁሉንም ልዩ ክርስቲያናዊ ዝግጅቶች በሚያምር ሁኔታ ለማስቀረት ሙያዊ የፎቶግራፍ አገልግሎት።",
        "icon": "imaging"
      },
      {
        "key": "video",
        "title": "የቪዲዮ ቀረጻ",
        "text": "የጥምቀት፣ የጋብቻ፣ የሽምግልና እና የሁሉንም ልዩ ዝግጅቶችዎ ትዝታዎች ለዕድሜ ልክ ጠብቀው ለማቆየት ከፍተኛ ጥራት ያላቸው የቪዲዮ ቀረጻ እና አርትዖት ፓኬጆች።",
        "icon": "video"
      },
      {
        "key": "social",
        "title": "ማህበራዊ ሚዲያ",
        "text": "ማኅበረሰባችንን እርስ በርስ ለማገናኘት መንፈሳዊ ትምህርቶችን፣ መዝሙራትን እና አዳዲስ መረጃዎችን በሁሉም የሰንበት ትምህርት ቤታችን ገጾች ላይ ማጋራት።",
        "icon": "social"
      },
      {
        "key": "tech",
        "title": "ቴክኖሎጂ",
        "text": "ማኅበረሰባችን በኦርቶዶክስ እምነት እንዲጸና፣ እንዲማር እና እንዲጸልይ የሚረዱ መተግበሪያዎችን እና ዲጂታል መሣሪያዎችን መገንባት።",
        "icon": "tech"
      }
    ],
    "featured": {
      "title": "ዓምደሃይማኖት ዝማሬ",
      "text": "ለየወቅቱ፣ ለጾማት እና ለበዓላት የተዘጋጁ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መዝሙራት ስብስብ — ከመስመር ውጭ፣ ለልምምድ እና ለመንፈሳዊ ዕድገት የተዘጋጀ።",
      "tag": "የሞባይል መተግበሪያ"
    },
    "moreProjects": [
      {
        "title": "መንፈሳዊ ማህደር",
        "text": "የአገልግሎታችንን ታሪክ እና ቅዱሳን ጊዜያት ጠብቆ ማቆየት።"
      },
      {
        "title": "የኦርቶዶክስ ትምህርት መግቢያ",
        "text": "ለወጣቶች የተዘጋጁ ሥርዓታዊ የነገረ መለኮት እና መንፈሳዊ ትምህርቶች።"
      }
    ],
    "telegramBot": {
      "tag": "የቴሌግራም ቦት",
      "title": "የተማሪዎች ድጋፍ ቦት",
      "text": "መንፈሳዊ ትምህርትዎን በማንኛውም ጊዜ እና ቦታ ያዳብሩ። ይህ ልዩ የቴሌግራም ቦት ለሰንበት ትምህርት ቤት ተማሪዎች በሀገር አቀፍ ደረጃ የሚሰጠውን ሥርዓተ ትምህርት መጻሕፍት፣ አጋዥ የፒዲኤፍ (PDF) መጻሕፍት፣ እንዲሁም ከ100 በላይ የሙከራ ጥያቄዎችን ከመልሳቸው ጋር በቀላሉ እንዲያገኙ ያስችላል። ይህም በኦርቶዶክሳዊ እምነትዎ እንዲጸኑ እና ለፈተናዎች በተሻለ ሁኔታ እንዲዘጋጁ ይረዳዎታል።"
    },
    "openBot": "በቴሌግራም ይክፈቱ"
  },
  "ge": {
    "pageTitle": "ሚዲያ እና ቴክ | ዓምደ ሃይማኖት",
    "pageDescription": "ከጅማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት የዲጂታል አገልግሎት፣ ምስልና የኦርቶዶክሳዊ ቴክኖሎጂ።",
    "heroTitle": "ሚዲያ እና ቴክኖሎጂ አገልግሎት",
    "heroSubtitle": "በሚዲያ እና በቴክኖሎጂ ማኅበረሰባችንን ማገናኘት እና ሃይማኖታችንን ማካፈል።",
    "leadLabel": "የአገልግሎት ጥሪያችን",
    "leadText": "ጥንታዊውን ሃይማኖታችንን ከዘመኑ ቴክኖሎጂ ጋር በማዋሃድ እግዚአብሔርን እና ሕዝቡን እናገለግላለን። የቤተሰቦትን ልዩ መንፈሳዊ በዓላት በፎቶግራፍ ከማስቀረት ጀምሮ የማኅበረሰባችንን መንፈሳዊ ሕይወት የሚያሳድጉ ዲጂታል መድረኮችን እስከ መገንባት ድረስ፤ ዓላማችን የቤተ ክርስቲያናችንን ታሪክ መሰነድ እና ትውልዱን ከእግዚአብሔር ቃል ጋር ማገናኘት ነው።",
    "servicesLabel": "የዲጂታል አገልግሎታችን",
    "featuredLabel": "የተለየ ፕሮጀክት",
    "moreLabel": "በእግዚአብሔር ፈቃድ የሚመጡ",
    "openApp": "በጉግል ፕሌይ ያግኙ",
    "soon": "በቅርቡ",
    "ctaTitle": "ከእኛ ጋር ይስሩ",
    "ctaText": "ለቀጣይ መንፈሳዊ ዝግጅትዎ ፎቶግራፈር ቢፈልጉ፣ ወይም ከሰንበት ትምህርት ቤቱ ጋር በአዲስ ፕሮጀክት ላይ አብረው መሥራት ቢፈልጉ፣ እኛን ቢያነጋግሩን ደስ ይለናል።",
    "ctaButton": "ያግኙን",
    "services": [
      {
        "key": "imaging",
        "title": "የፎቶግራፍ አገልግሎት",
        "text": "የሕፃናት ጥምቀት፣ ጋብቻ፣ ሽምግልና፣ ልደት፣ ምረቃ እና ሁሉንም ልዩ ክርስቲያናዊ ዝግጅቶች በሚያምር ሁኔታ ለማስቀረት ሙያዊ የፎቶግራፍ አገልግሎት።",
        "icon": "imaging"
      },
      {
        "key": "video",
        "title": "የቪዲዮ ቀረጻ",
        "text": "የጥምቀት፣ የጋብቻ፣ የሽምግልና እና የሁሉንም ልዩ ዝግጅቶችዎ ትዝታዎች ለዕድሜ ልክ ጠብቀው ለማቆየት ከፍተኛ ጥራት ያላቸው የቪዲዮ ቀረጻ እና አርትዖት ፓኬጆች።",
        "icon": "video"
      },
      {
        "key": "social",
        "title": "ማህበራዊ ሚዲያ",
        "text": "ማኅበረሰባችንን እርስ በርስ ለማገናኘት መንፈሳዊ ትምህርቶችን፣ መዝሙራትን እና አዳዲስ መረጃዎችን በሁሉም የሰንበት ትምህርት ቤታችን ገጾች ላይ ማጋራት።",
        "icon": "social"
      },
      {
        "key": "tech",
        "title": "ቴክኖሎጂ",
        "text": "ማኅበረሰባችን በኦርቶዶክስ እምነት እንዲጸና፣ እንዲማር እና እንዲጸልይ የሚረዱ መተግበሪያዎችን እና ዲጂታል መሣሪያዎችን መገንባት።",
        "icon": "tech"
      }
    ],
    "featured": {
      "title": "ዓምደሃይማኖት ዝማሬ",
      "text": "ለየወቅቱ፣ ለጾማት እና ለበዓላት የተዘጋጁ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መዝሙራት ስብስብ — ከመስመር ውጭ፣ ለልምምድ እና ለመንፈሳዊ ዕድገት የተዘጋጀ።",
      "tag": "የሞባይል መተግበሪያ"
    },
    "moreProjects": [
      {
        "title": "መንፈሳዊ ማህደር",
        "text": "የአገልግሎታችንን ታሪክ እና ቅዱሳን ጊዜያት ጠብቆ ማቆየት።"
      },
      {
        "title": "የኦርቶዶክስ ትምህርት መግቢያ",
        "text": "ለወጣቶች የተዘጋጁ ሥርዓታዊ የነገረ መለኮት እና መንፈሳዊ ትምህርቶች።"
      }
    ],
    "telegramBot": {
      "tag": "የቴሌግራም ቦት",
      "title": "የተማሪዎች ድጋፍ ቦት",
      "text": "መንፈሳዊ ትምህርትዎን በማንኛውም ጊዜ እና ቦታ ያዳብሩ። ይህ ልዩ የቴሌግራም ቦት ለሰንበት ትምህርት ቤት ተማሪዎች በሀገር አቀፍ ደረጃ የሚሰጠውን ሥርዓተ ትምህርት መጻሕፍት፣ አጋዥ የፒዲኤፍ (PDF) መጻሕፍት፣ እንዲሁም ከ100 በላይ የሙከራ ጥያቄዎችን ከመልሳቸው ጋር በቀላሉ እንዲያገኙ ያስችላል። ይህም በኦርቶዶክሳዊ እምነትዎ እንዲጸኑ እና ለፈተናዎች በተሻለ ሁኔታ እንዲዘጋጁ ይረዳዎታል።"
    },
    "openBot": "በቴሌግራም ይክፈቱ"
  }
};;

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.2 };

const serviceIcons = {
  imaging: CameraAltOutlined,
  video: VideocamOutlined,
  social: ShareOutlined,
  tech: DevicesOutlined,
};

const MediaAndTechPage = ({ language = 'en' }) => {
  const t = translations[language] || translations.en;
  const brandName = brandTitles[language] || brandTitles.en;
  const reduceMotion = useReducedMotion();

  return (
    <>
      <SEO title={t.pageTitle} description={t.pageDescription} language={language} />

      <Box sx={{ bgcolor: brand.white }}>
        <AboutHero
          subjectImage={mediaTechHero}
          subjectFit="contain"
          backgroundImage={heroBackground}
          brandName={brandName}
          tagline={t.heroTitle}
          storyTitle={t.heroSubtitle}
          placeLabel={placeLabels[language] || placeLabels.en}
          yearCaption={yearCaptions[language] || yearCaptions.en}
          foundedYear="1964"
          lineClamp={3}
          mobileLineClamp={3}
        />

        {/* Lead statement */}
        <Box
          component="section"
          sx={{
            py: { xs: 7, md: 10 },
            px: 2,
            bgcolor: brand.stone,
            borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
          }}
        >
          <Container maxWidth="md">
            <Typography
              sx={{
                m: 0,
                mb: 2.5,
                textAlign: 'center',
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: brand.goldDark,
              }}
            >
              {t.leadLabel}
            </Typography>
            <Typography
              component={motion.p}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewOpts}
              transition={{ duration: 0.65, ease: easeOut }}
              sx={{
                m: 0,
                textAlign: 'center',
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 500,
                fontStyle: 'italic',
                fontSize: 'clamp(1.35rem, 2.8vw, 1.85rem)',
                lineHeight: 1.55,
                color: brand.navyInk,
              }}
            >
              {t.leadText}
            </Typography>
            <Box aria-hidden sx={{ width: 48, height: 2, mx: 'auto', mt: 4, bgcolor: brand.gold }} />
          </Container>
        </Box>

        {/* Services — open grid, no heavy cards */}
        <PageSection variant="white" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="lg">
            <Typography
              component="h2"
              sx={{
                m: 0,
                mb: { xs: 4, md: 5.5 },
                textAlign: 'center',
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                color: brand.navyInk,
              }}
            >
              {t.servicesLabel}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: { xs: 0, md: 0 },
                borderTop: `1px solid ${alpha(brand.navy, 0.12)}`,
                borderBottom: `1px solid ${alpha(brand.navy, 0.12)}`,
              }}
            >
              {t.services.map((service, i) => {
                const Icon = serviceIcons[service.icon];
                return (
                  <Box
                    key={service.key}
                    component={motion.article}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewOpts}
                    transition={{ duration: 0.5, ease: easeOut, delay: i * 0.06 }}
                    sx={{
                      position: 'relative',
                      px: { xs: 0, md: 3 },
                      py: { xs: 3.5, md: 4.5 },
                      borderBottom: {
                        xs: i === t.services.length - 1 ? 'none' : `1px solid ${alpha(brand.navy, 0.1)}`,
                        sm: (i < 2 ? `1px solid ${alpha(brand.navy, 0.1)}` : 'none'),
                        md: 'none',
                      },
                      borderRight: {
                        xs: 'none',
                        sm: i % 2 === 0 ? `1px solid ${alpha(brand.navy, 0.1)}` : 'none',
                        md: i < 3 ? `1px solid ${alpha(brand.navy, 0.1)}` : 'none',
                      },
                      textAlign: { xs: 'left', md: 'center' },
                      display: 'flex',
                      flexDirection: { xs: 'row', md: 'column' },
                      alignItems: { xs: 'flex-start', md: 'center' },
                      gap: { xs: 2, md: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: { md: 2.5 },
                        color: brand.navy,
                        border: `1px solid ${alpha(brand.gold, 0.55)}`,
                        bgcolor: brand.stone,
                      }}
                    >
                      <Icon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography
                        component="h3"
                        sx={{
                          m: 0,
                          mb: 1.15,
                          fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                          fontWeight: 700,
                          fontSize: { xs: '1.35rem', md: '1.4rem' },
                          color: brand.navyInk,
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        sx={{
                          m: 0,
                          fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                          fontSize: '0.92rem',
                          lineHeight: 1.7,
                          color: alpha(brand.ink, 0.7),
                          maxWidth: 220,
                          mx: { md: 'auto' },
                        }}
                      >
                        {service.text}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Container>
        </PageSection>

        {/* Featured project */}
        <PageSection variant="white" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="lg">
            <Typography
              sx={{
                m: 0,
                mb: 3,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: brand.goldDark,
              }}
            >
              {t.featuredLabel}
            </Typography>

            <Box
              component={motion.article}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewOpts}
              transition={{ duration: 0.6, ease: easeOut }}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
                minHeight: { md: 340 },
                overflow: 'hidden',
                bgcolor: brand.navyInk,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  minHeight: { xs: 220, md: 'auto' },
                  background: `
                    radial-gradient(ellipse 70% 60% at 30% 40%, ${alpha(brand.gold, 0.16)} 0%, transparent 55%),
                    linear-gradient(145deg, ${brand.navyDark} 0%, ${brand.navy} 100%)
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                }}
              >
                <Box
                  component="img"
                  src={crestLogo}
                  alt=""
                  sx={{
                    width: { xs: 100, md: 128 },
                    height: { xs: 100, md: 128 },
                    objectFit: 'contain',
                    bgcolor: brand.white,
                    borderRadius: '50%',
                    border: `2px solid ${brand.gold}`,
                    p: 1.5,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: { xs: 3, md: 5 },
                  py: { xs: 4, md: 5 },
                  borderLeft: { md: `3px solid ${brand.gold}` },
                }}
              >
                <Typography
                  sx={{
                    m: 0,
                    mb: 1.5,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: brand.gold,
                  }}
                >
                  {t.featured.tag}
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    m: 0,
                    mb: 2,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                    lineHeight: 1.15,
                    color: brand.white,
                  }}
                >
                  {t.featured.title}
                </Typography>
                <Typography
                  sx={{
                    m: 0,
                    mb: 3.5,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontSize: '1.02rem',
                    lineHeight: 1.75,
                    color: alpha(brand.white, 0.78),
                    maxWidth: 420,
                  }}
                >
                  {t.featured.text}
                </Typography>
                <Button
                  component="a"
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="secondary"
                  endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                  sx={{
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 1,
                    px: 3,
                    py: 1.2,
                    boxShadow: 'none',
                  }}
                >
                  {t.openApp}
                </Button>
              </Box>
            </Box>

            
            <Box
              component={motion.article}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewOpts}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
                minHeight: { md: 340 },
                overflow: 'hidden',
                bgcolor: brand.navyInk,
                mt: 4,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  minHeight: { xs: 220, md: 'auto' },
                  background: `
                    radial-gradient(ellipse 70% 60% at 30% 40%, ${alpha(brand.navy, 0.16)} 0%, transparent 55%),
                    linear-gradient(145deg, ${brand.gold} 0%, ${brand.goldDark} 100%)
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    width: { xs: 100, md: 128 },
                    height: { xs: 100, md: 128 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: brand.white,
                    borderRadius: '50%',
                    border: `2px solid ${brand.navy}`,
                    p: 1.5,
                  }}
                >
                  <Telegram sx={{ fontSize: { xs: 60, md: 80 }, color: brand.navy }} />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: { xs: 3, md: 5 },
                  py: { xs: 4, md: 5 },
                  borderLeft: { md: `3px solid ${brand.navy}` },
                }}
              >
                <Typography
                  sx={{
                    m: 0,
                    mb: 1.5,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: brand.gold,
                  }}
                >
                  {t.telegramBot?.tag || 'Telegram Bot'}
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    m: 0,
                    mb: 2,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                    lineHeight: 1.15,
                    color: brand.white,
                  }}
                >
                  {t.telegramBot?.title || 'Student Support Bot'}
                </Typography>
                <Typography
                  sx={{
                    m: 0,
                    mb: 3.5,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontSize: '1.02rem',
                    lineHeight: 1.75,
                    color: alpha(brand.white, 0.78),
                    maxWidth: 420,
                  }}
                >
                  {t.telegramBot?.text || 'Access a wealth of spiritual resources anytime, anywhere. Our dedicated Telegram bot provides Sunday School students with downloadable national curriculum books, supplementary PDF materials, and over 100 interactive practice questions with answers to help deepen your Orthodox faith and prepare for exams.'}
                </Typography>
                <Button
                  component="a"
                  href="https://t.me/Amde_haymanot_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="secondary"
                  endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                  sx={{
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 1,
                    px: 3,
                    py: 1.2,
                    boxShadow: 'none',
                  }}
                >
                  {t.openBot || 'Open in Telegram'}
                </Button>
              </Box>
            </Box>

<Typography
              sx={{
                m: 0,
                mt: { xs: 5, md: 6 },
                mb: 2.5,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: brand.goldDark,
              }}
            >
              {t.moreLabel}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 0,
                borderTop: `1px solid ${alpha(brand.navy, 0.12)}`,
              }}
            >
              {t.moreProjects.map((project, i) => (
                <Box
                  key={project.title}
                  sx={{
                    py: 3.25,
                    pr: { md: i === 0 ? 4 : 0 },
                    pl: { md: i === 1 ? 4 : 0 },
                    borderBottom: `1px solid ${alpha(brand.navy, 0.12)}`,
                    borderRight: {
                      md: i === 0 ? `1px solid ${alpha(brand.navy, 0.12)}` : 'none',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                      component="h3"
                      sx={{
                        m: 0,
                        fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                        fontWeight: 700,
                        fontSize: '1.4rem',
                        color: brand.navyInk,
                      }}
                    >
                      {project.title}
                    </Typography>
                    <Typography
                      sx={{
                        m: 0,
                        fontFamily: '"Source Sans 3", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: alpha(brand.navy, 0.45),
                      }}
                    >
                      {t.soon}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      m: 0,
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      color: alpha(brand.ink, 0.7),
                    }}
                  >
                    {project.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </PageSection>

        <PageSection variant="ink" pattern sx={{ textAlign: 'center', py: { xs: 8, md: 10 } }}>
          <Container maxWidth="sm">
            <Typography
              component="h2"
              sx={{
                m: 0,
                mb: 1.5,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)',
                color: brand.white,
              }}
            >
              {t.ctaTitle}
            </Typography>
            <GoldDivider />
            <Typography
              sx={{
                m: 0,
                mt: 1.75,
                mb: 3.25,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: '1.02rem',
                lineHeight: 1.7,
                color: alpha(brand.white, 0.75),
              }}
            >
              {t.ctaText}
            </Typography>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: 1,
                px: 5,
                py: 1.35,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: 'none',
              }}
            >
              {t.ctaButton}
            </Button>
          </Container>
        </PageSection>
      </Box>
    </>
  );
};

export default MediaAndTechPage;
