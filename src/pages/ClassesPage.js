import { Box, Typography, Container, Grid, Tabs, Tab, CircularProgress, Button } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/layout/SEO';
import { useState, useEffect, useMemo, useCallback } from 'react';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import { AboutHero, PageSection, GoldDivider } from '../components/ui';
import { brand } from '../brand';
import { getSpiritualServices } from '../content/spiritualServices';

import AppsIcon from '@mui/icons-material/Apps';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PhoneIcon from '@mui/icons-material/Phone';
import classesFallback from '../assets/classes-hero.jpg';
import heroBackground from '../assets/spiritual-course.jpg';
import defaultCourseImg from '../assets/spiritual-course.jpg';
import crestLogo from '../assets/logo.png';

const LEARNING_PHONE = '0996090739';
const INSTRUMENTS_PHONE = '0946251312';

const contactLabels = {
  en: 'For more information, call',
  am: 'ለበለጠ መረጃ ይደውሉ',
  om: 'Odeeffannoo dabalataaf bilbilaa',
  ti: 'ንዝያዳ ሓበሬታ ደውሉ',
  ge: 'ለበለጠ መረጃ ይደውሉ',
  es: 'Para más información, llame',
  fr: 'Pour plus d’informations, appelez',
  ar: 'للمزيد من المعلومات، اتصل',
};

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
  en: {
    "pageTitle": "Online lessons and training",
    "pageDescription": "Explore online lessons from Jimma's Sunday School. We offer classes on orthodox zema instruments, chant studies (Zema), model teaching and spiritual development.",
    "heroTitle": "Online education",
    "heroSubtitle": "Redeem the times, for the days are evil. (Eph 5:16). As we have been told, using the technological excellence of the time, we preach Christ crucified (1 Cor 1:23).",
    "tabAll": "all of them",
    "tabInstruments": "Musical instruments",
    "tabHymns": "Chants",
    "tabAbinet": "Template",
    "tabSpiritual": "Spiritual",
    "tabGeneral": "General",
    "ctaTitle": "Are you ready to start your journey?",
    "ctaSubtitle": "Subscribe today to access all our video listings and live streams.",
    "ctaButton": "Create an account",
    "viewPlaylistButton": "See the lesson",
    "joinLiveButton": "See the lesson",
    "allTitle": "All lessons",
    "allDesc": "View a list of all lessons.",
    "instrumentsTitle": "Orthodox musical instruments",
    "instrumentsDesc": "Learn to play the sacred musical instruments used in Orthodox worship. Our courses are designed for beginners to advanced students.",
    "hymnsTitle": "Singing studies",
    "hymnsDesc": "Join online sessions to learn the melody, poetry and spiritual significance of Orthodox hymns for various seasons and holidays.",
    "abinetTitle": "Model education",
    "abinetDesc": "Engage in early and deep church teaching. This section is dedicated to basic studies like Geez, Rhyme and Poetry.",
    "spiritualTitle": "Spiritual teachings",
    "spiritualDesc": "Enhance your understanding of Orthodox faith, theology, and tradition through engaging video series and live discussions.",
    "generalTitle": "General lessons",
    "generalDesc": "Develop practical skills for modern life in terms of faith and life in general."
},
  om: {
    "pageTitle": "Barnoota fi leenjii toora interneetii",
    "pageDescription": "Barnoota onlaayinii Mana Barumsaa Sanbataa Jimmaa irraa qoradhaa. Meeshaalee zeemaa ortodoksii, qo’annoo faaruu (Zema), barsiisa moodeela fi guddina hafuuraa irratti barnoota ni kennina.",
    "heroTitle": "Barnoota toora interneetii",
    "heroSubtitle": "Guyyoonni hamaa waan ta’aniif, bara furii. (Efe 5:16). Akkuma nutti himame olaantummaa teeknooloojii yeroo sanaa fayyadamnee Kiristoos fannifame lallabna (1Qor 1:23).",
    "tabAll": "hunda isaanii",
    "tabInstruments": "Meeshaalee muuziqaa",
    "tabHymns": "Faarfannaa",
    "tabAbinet": "Unkaa",
    "tabSpiritual": "Kan hafuuraa",
    "tabGeneral": "Waliigala",
    "ctaTitle": "Imala keessan jalqabuuf qophiidhaa?",
    "ctaSubtitle": "Tarreefama viidiyoo fi tamsaasa kallattiin keenya hunda argachuuf har'a subscribe godhaa.",
    "ctaButton": "Akkaawuntii uumuu",
    "viewPlaylistButton": "Barumsa isaa ilaalaa",
    "joinLiveButton": "Barumsa isaa ilaalaa",
    "allTitle": "Barnoota hunda",
    "allDesc": "Tarree barnoota hunda ilaali.",
    "instrumentsTitle": "Meeshaalee muuziqaa Ortodoksii",
    "instrumentsDesc": "Meeshaalee muuziqaa qulqulluu waaqeffannaa Ortodoksii keessatti fayyadaman taphachuu baradhu. Koorsii keenya barattoota jalqabaa hanga sadarkaa olaanaatti kan qophaa'edha.",
    "hymnsTitle": "Qo'annoo sirbaa",
    "hymnsDesc": "Faarfannaa, walaloo fi hiika afuuraa faarfannaa Ortodoksii waqtiilee fi ayyaanota adda addaatiif barachuuf waltajjii toora interneetii irratti hirmaadhaa.",
    "abinetTitle": "Barnoota moodeela ta’e",
    "abinetDesc": "Barumsa waldaa jalqabaa fi gadi fagoo irratti bobba’aa. Kutaan kun qo’annoo bu’uuraa kan akka Geez, Rhyme fi Walaloo irratti kan xiyyeeffatedha.",
    "spiritualTitle": "Barumsa hafuuraa",
    "spiritualDesc": "Hubannoo keessan waa’ee amantii, ti’ooloojii fi duudhaa Ortodoksii karaa viidiyoo walduraa duubaan fi marii kallattiin bobba’aa ta’een guddifadhaa.",
    "generalTitle": "Barnoota waliigalaa",
    "generalDesc": "Jireenya ammayyaatiif dandeettii qabatamaa gama amantii fi walumaa galatti jireenyaa horachuu."
},
  ti: {
    "pageTitle": "ብኢንተርነት ትምህርትን ስልጠናን",
    "pageDescription": "ካብ ቤት ትምህርቲ ሰንበት ጅማ ብኢንተርነት ዝወሃብ ትምህርቲ ዳህሰሱ። ብዛዕባ ኦርቶዶክሳዊ መሳርሒታት ዘማ፡ መጽናዕቲ መዝሙር (ዘማ)፡ ሞዴል ኣስተምህሮን መንፈሳዊ ምዕባለን ዝምልከት ትምህርቲ ንህብ።",
    "heroTitle": "ብኢንተርነት ትምህርቲ",
    "heroSubtitle": "መዓልትታት ክፉኣት እየን እሞ፡ ነቲ ዘመን ተበጀውዎ። (ኤፌ 5፡16)። ከምቲ ዝተነግረና፡ ነቲ ናይቲ እዋን ቴክኖሎጂካዊ ብሉጽነት ተጠቒምና፡ ዝተሰቕለ ክርስቶስ ንሰብኽ (1ቆሮ 1፡23)።",
    "tabAll": "ኩሎም",
    "tabInstruments": "መሳርሒታት ሙዚቃ",
    "tabHymns": "ጭርሖታት",
    "tabAbinet": "ቅጥዒ",
    "tabSpiritual": "መንፈሳዊ",
    "tabGeneral": "ሓፈሻዊ",
    "ctaTitle": "ጉዕዞኻ ክትጅምር ድሉው ዲኻ?",
    "ctaSubtitle": "ኩሉ ዝርዝር ቪድዮታትናን ቀጥታዊ ስትሪምናን ንምርካብ ሎሚ ሳብስክራይብ ግበሩ።",
    "ctaButton": "ኣካውንት ምፍጣር",
    "viewPlaylistButton": "ትምህርቲ ርአ",
    "joinLiveButton": "ትምህርቲ ርአ",
    "allTitle": "ኩሉ ትምህርቲ",
    "allDesc": "ዝርዝር ናይ ኩሉ ትምህርትታት ርአ።",
    "instrumentsTitle": "ኦርቶዶክሳዊ መሳርሒ ሙዚቃ",
    "instrumentsDesc": "ኣብ ኦርቶዶክሳዊ ኣምልኾ ዝጥቀሙሉ ቅዱሳን መሳርሒታት ሙዚቃ ምጽዋት ተማሃሩ። ኮርሳትና ንጀመርቲ ክሳብ ምዕቡላት ተምሃሮ ዝተዳለወ እዩ።",
    "hymnsTitle": "መጽናዕቲ ደርፊ",
    "hymnsDesc": "ዜማ፣ ግጥምን መንፈሳዊ ትርጉምን መዝሙር ኦርቶዶክሳውያን ንዝተፈላለዩ ወቕትታትን በዓላትን ንምፍላጥ ኣብ ናይ ኦንላይን መደባት ተጸንበሩ።",
    "abinetTitle": "ሞዴል ትምህርቲ",
    "abinetDesc": "ኣብ ቀዳሞትን ዓሚቝን ትምህርቲ ቤተ ክርስቲያን ተጸምዱ። እዚ ክፍሊ እዚ ንመሰረታዊ መጽናዕትታት ከም ግዕዝ፡ ቅኒትን ግጥምን ዝውፈ እዩ።",
    "spiritualTitle": "መንፈሳዊ ትምህርቲ",
    "spiritualDesc": "ብዛዕባ ኦርቶዶክሳዊ እምነት፡ ስነ-መለኮትን ትውፊትን ዘለኩም ርድኢት ብመሳጢ ተኸታታሊ ቪድዮን ቀጥታዊ ዘተን ኣዕብዩ።",
    "generalTitle": "ሓፈሻዊ ትምህርቲ",
    "generalDesc": "ንዘመናዊ ህይወት ብመንጽር እምነትን ብሓፈሻ ህይወትን ዝኸውን ግብራዊ ክእለት ምምዕባል።"
},
  es: {
    "pageTitle": "Lecciones y formación en línea.",
    "pageDescription": "Explore las lecciones en línea de la escuela dominical de Jimma. Ofrecemos clases sobre instrumentos ortodoxos zema, estudios de canto (Zema), enseñanza modelo y desarrollo espiritual.",
    "heroTitle": "educación en línea",
    "heroSubtitle": "Redime los tiempos, porque los días son malos. (Efesios 5:16). Como nos han dicho, utilizando las excelencias tecnológicas de la época, predicamos a Cristo crucificado (1 Cor 1,23).",
    "tabAll": "todos",
    "tabInstruments": "Instrumentos musicales",
    "tabHymns": "Cantos",
    "tabAbinet": "Plantilla",
    "tabSpiritual": "Espiritual",
    "tabGeneral": "General",
    "ctaTitle": "¿Estás listo para comenzar tu viaje?",
    "ctaSubtitle": "Suscríbase hoy para acceder a todos nuestros listados de videos y transmisiones en vivo.",
    "ctaButton": "Crea una cuenta",
    "viewPlaylistButton": "ver la lección",
    "joinLiveButton": "ver la lección",
    "allTitle": "Todas las lecciones",
    "allDesc": "Ver una lista de todas las lecciones.",
    "instrumentsTitle": "instrumentos musicales ortodoxos",
    "instrumentsDesc": "Aprenda a tocar los instrumentos musicales sagrados utilizados en el culto ortodoxo. Nuestros cursos están diseñados para principiantes y estudiantes avanzados.",
    "hymnsTitle": "estudios de canto",
    "hymnsDesc": "Únase a sesiones en línea para aprender la melodía, la poesía y el significado espiritual de los himnos ortodoxos para diversas estaciones y días festivos.",
    "abinetTitle": "Educación modelo",
    "abinetDesc": "Participar en la enseñanza temprana y profunda de la iglesia. Esta sección está dedicada a estudios básicos como Caray, Rima y Poesía.",
    "spiritualTitle": "Enseñanzas espirituales",
    "spiritualDesc": "Mejore su comprensión de la fe, la teología y la tradición ortodoxas a través de interesantes series de videos y debates en vivo.",
    "generalTitle": "lecciones generales",
    "generalDesc": "Desarrollar habilidades prácticas para la vida moderna en términos de fe y vida en general."
},
  fr: {
    "pageTitle": "Cours et formations en ligne",
    "pageDescription": "Explorez les leçons en ligne de l'école du dimanche de Jimma. Nous proposons des cours sur les instruments zema orthodoxes, des études de chant (Zema), un enseignement modèle et un développement spirituel.",
    "heroTitle": "Éducation en ligne",
    "heroSubtitle": "Rachetez les temps, car les jours sont mauvais. (Ep 5:16). Comme on nous l'a dit, en utilisant l'excellence technologique de l'époque, nous prêchons le Christ crucifié (1 Co 1, 23).",
    "tabAll": "tous",
    "tabInstruments": "Instruments de musique",
    "tabHymns": "Chants",
    "tabAbinet": "Modèle",
    "tabSpiritual": "Spirituel",
    "tabGeneral": "Général",
    "ctaTitle": "Êtes-vous prêt à commencer votre voyage ?",
    "ctaSubtitle": "Abonnez-vous aujourd'hui pour accéder à toutes nos listes de vidéos et diffusions en direct.",
    "ctaButton": "Créer un compte",
    "viewPlaylistButton": "Voir la leçon",
    "joinLiveButton": "Voir la leçon",
    "allTitle": "Tous les cours",
    "allDesc": "Afficher une liste de toutes les leçons.",
    "instrumentsTitle": "Instruments de musique orthodoxes",
    "instrumentsDesc": "Apprenez à jouer des instruments de musique sacrés utilisés dans le culte orthodoxe. Nos cours sont conçus pour les étudiants débutants à avancés.",
    "hymnsTitle": "Etudes de chant",
    "hymnsDesc": "Rejoignez des sessions en ligne pour apprendre la mélodie, la poésie et la signification spirituelle des hymnes orthodoxes pour différentes saisons et jours fériés.",
    "abinetTitle": "Éducation modèle",
    "abinetDesc": "Participez à l’enseignement précoce et approfondi de l’Église. Cette section est dédiée aux études de base comme Geez, Rime et Poésie.",
    "spiritualTitle": "Enseignements spirituels",
    "spiritualDesc": "Améliorez votre compréhension de la foi, de la théologie et de la tradition orthodoxes grâce à des séries de vidéos engageantes et des discussions en direct.",
    "generalTitle": "Cours généraux",
    "generalDesc": "Développer des compétences pratiques pour la vie moderne en termes de foi et de vie en général."
},
  ar: {
    "pageTitle": "الدروس والتدريب عبر الإنترنت",
    "pageDescription": "استكشف الدروس عبر الإنترنت من مدرسة Jimma's Sunday School. نحن نقدم دروسًا حول آلات الزيما الأرثوذكسية ودراسات الترنيم (زيما) والتدريس النموذجي والتنمية الروحية.",
    "heroTitle": "التعليم عبر الإنترنت",
    "heroSubtitle": "افتدوا الأوقات فإن الأيام شريرة. (أفسس 5: 16). وكما قيل لنا، باستخدام التميز التكنولوجي في ذلك الوقت، فإننا نبشر بالمسيح مصلوبًا (1 كو 1: 23).",
    "tabAll": "كل منهم",
    "tabInstruments": "الآلات الموسيقية",
    "tabHymns": "أناشيد",
    "tabAbinet": "نموذج",
    "tabSpiritual": "روحي",
    "tabGeneral": "عام",
    "ctaTitle": "هل أنت مستعد لبدء رحلتك؟",
    "ctaSubtitle": "اشترك اليوم للوصول إلى جميع قوائم الفيديو والبث المباشر.",
    "ctaButton": "إنشاء حساب",
    "viewPlaylistButton": "انظر الدرس",
    "joinLiveButton": "انظر الدرس",
    "allTitle": "جميع الدروس",
    "allDesc": "عرض قائمة بجميع الدروس.",
    "instrumentsTitle": "الآلات الموسيقية الأرثوذكسية",
    "instrumentsDesc": "تعلم العزف على الآلات الموسيقية المقدسة المستخدمة في العبادة الأرثوذكسية. تم تصميم دوراتنا للمبتدئين للطلاب المتقدمين.",
    "hymnsTitle": "دراسات الغناء",
    "hymnsDesc": "انضم إلى جلسات عبر الإنترنت لتتعلم اللحن والشعر والأهمية الروحية للتراتيل الأرثوذكسية لمختلف المواسم والأعياد.",
    "abinetTitle": "التعليم النموذجي",
    "abinetDesc": "الانخراط في تعليم الكنيسة المبكر والعميق. هذا القسم مخصص للدراسات الأساسية مثل الجيز والقافية والشعر.",
    "spiritualTitle": "تعاليم روحية",
    "spiritualDesc": "عزز فهمك للعقيدة واللاهوت والتقاليد الأرثوذكسية من خلال سلسلة مقاطع فيديو جذابة ومناقشات حية.",
    "generalTitle": "دروس عامة",
    "generalDesc": "تنمية المهارات العملية للحياة العصرية من الناحية الإيمانية والحياة بشكل عام."
},
  am: {
    "pageTitle": "የኦንላይን ትምህርቶች እና ስልጠና",
    "pageDescription": "ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት የኦንላይን ትምህርቶችን ያስሱ። በኦርቶዶክሳዊ የዜማ መሳሪያዎች፣ የዝማሬ ጥናቶች (ዜማ)፣ የአብነት ትምህርት እና መንፈሳዊ እድገት ላይ ክፍሎችን እናቀርባለን።",
    "heroTitle": "የኦንላይን ትምህርት",
    "heroSubtitle": "ቀኖቹ ክፉዎች ናቸውና ዘመኑን ዋጁ። (ኤፌ 5፡16)። እንደተባልን ዘመኑ በደረሰበት የቴክኖሎጂ ልህቀት ተጠቅመን、 እኛ ግን የተሰቀለውን ክርስቶስን እንሰብካለን (1ኛ ቆሮ 1፡23)።",
    "tabAll": "ሁሉም",
    "tabInstruments": "የዜማ መሳሪያዎች",
    "tabHymns": "ዝማሬዎች",
    "tabAbinet": "አብነት",
    "tabSpiritual": "መንፈሳዊ",
    "tabGeneral": "አጠቃላይ",
    "ctaTitle": "ጉዞዎን ለመጀመር ዝግጁ ነዎት?",
    "ctaSubtitle": "ሁሉንም የቪዲዮ ዝርዝሮቻችንን እና የቀጥታ ስርጭቶችን ለማግኘት ዛሬውኑ ይመዝገቡ።",
    "ctaButton": "መለያ ይፍጠሩ",
    "viewPlaylistButton": "ትምህርቱን ይመልከቱ",
    "joinLiveButton": "ትምህርቱን ይመልከቱ",
    "allTitle": "ሁሉም ትምህርቶች",
    "allDesc": "የሁሉንም ትምህርቶች ዝርዝር ይመልከቱ።",
    "instrumentsTitle": "የኦርቶዶክስ የዜማ መሳሪያዎች",
    "instrumentsDesc": "በኦርቶዶክስ አምልኮ ውስጥ አገልግሎት ላይ የሚውሉትን ቅዱሳት የዜማ መሣሪያዎችን መጫወት ይማሩ። ትምህርቶቻችን ከጀማሪዎች እስከ ከፍተኛ ደረጃ ላሉ ተማሪዎች የተዘጋጁ ናቸው።",
    "hymnsTitle": "የዝማሬ ጥናቶች",
    "hymnsDesc": "የተለያዩ ወቅቶች እና በዓላት የኦርቶዶክስ ዝማሬዎችን ዜማ、 ግጥም እና መንፈሳዊ ጠቀሜታ ለመማር የኦንላይን ክፍለ ጊዜዎችን ይቀላቀሉ።",
    "abinetTitle": "አብነት ትምህርት",
    "abinetDesc": "ቀዳማዊ እና ጥልቅ በሆነው የቤተክርስቲያን ትምህርት ይሳተፉ። ይህ ክፍል እንደ ግእዝ、 ዜማ እና ቅኔ ላሉ መሰረታዊ ጥናቶች የተዘጋጀ ነው።",
    "spiritualTitle": "መንፈሳዊ ትምህርቶች",
    "spiritualDesc": "በአሳታፊ የቪዲዮ ተከታታዮች እና የቀጥታ ውይይቶች በኦርቶዶክስ እምነት、 ሥነ-መለኮት እና ትውፊት ላይ ያለዎትን ግንዛቤ ያሳድጉ።",
    "generalTitle": "አጠቃላይ ትምህርቶች",
    "generalDesc": "ከእምነት እና ከአጠቃላይ ህይወት አንጻር ለዘመናዊ ህይወት ተግባራዊ ክህሎቶችን ያዳብሩ።"
},
  ge: {
    "pageTitle": "የኦንላይን ትምህርቶች እና ስልጠና",
    "pageDescription": "ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት የኦንላይን ትምህርቶችን ያስሱ። በኦርቶዶክሳዊ የዜማ መሳሪያዎች፣ የዝማሬ ጥናቶች (ዜማ)፣ የአብነት ትምህርት እና መንፈሳዊ እድገት ላይ ክፍሎችን እናቀርባለን።",
    "heroTitle": "የኦንላይን ትምህርት",
    "heroSubtitle": "ቀኖቹ ክፉዎች ናቸውና ዘመኑን ዋጁ። (ኤፌ 5፡16)። እንደተባልን ዘመኑ በደረሰበት የቴክኖሎጂ ልህቀት ተጠቅመን、 እኛ ግን የተሰቀለውን ክርስቶስን እንሰብካለን (1ኛ ቆሮ 1፡23)።",
    "tabAll": "ሁሉም",
    "tabInstruments": "የዜማ መሳሪያዎች",
    "tabHymns": "ዝማሬዎች",
    "tabAbinet": "አብነት",
    "tabSpiritual": "መንፈሳዊ",
    "tabGeneral": "አጠቃላይ",
    "ctaTitle": "ጉዞዎን ለመጀመር ዝግጁ ነዎት?",
    "ctaSubtitle": "ሁሉንም የቪዲዮ ዝርዝሮቻችንን እና የቀጥታ ስርጭቶችን ለማግኘት ዛሬውኑ ይመዝገቡ።",
    "ctaButton": "መለያ ይፍጠሩ",
    "viewPlaylistButton": "ትምህርቱን ይመልከቱ",
    "joinLiveButton": "ትምህርቱን ይመልከቱ",
    "allTitle": "ሁሉም ትምህርቶች",
    "allDesc": "የሁሉንም ትምህርቶች ዝርዝር ይመልከቱ።",
    "instrumentsTitle": "የኦርቶዶክስ የዜማ መሳሪያዎች",
    "instrumentsDesc": "በኦርቶዶክስ አምልኮ ውስጥ አገልግሎት ላይ የሚውሉትን ቅዱሳት የዜማ መሣሪያዎችን መጫወት ይማሩ። ትምህርቶቻችን ከጀማሪዎች እስከ ከፍተኛ ደረጃ ላሉ ተማሪዎች የተዘጋጁ ናቸው።",
    "hymnsTitle": "የዝማሬ ጥናቶች",
    "hymnsDesc": "የተለያዩ ወቅቶች እና በዓላት የኦርቶዶክስ ዝማሬዎችን ዜማ、 ግጥም እና መንፈሳዊ ጠቀሜታ ለመማር የኦንላይን ክፍለ ጊዜዎችን ይቀላቀሉ።",
    "abinetTitle": "አብነት ትምህርት",
    "abinetDesc": "ቀዳማዊ እና ጥልቅ በሆነው የቤተክርስቲያን ትምህርት ይሳተፉ። ይህ ክፍል እንደ ግእዝ、 ዜማ እና ቅኔ ላሉ መሰረታዊ ጥናቶች የተዘጋጀ ነው።",
    "spiritualTitle": "መንፈሳዊ ትምህርቶች",
    "spiritualDesc": "በአሳታፊ የቪዲዮ ተከታታዮች እና የቀጥታ ውይይቶች በኦርቶዶክስ እምነት、 ሥነ-መለኮት እና ትውፊት ላይ ያለዎትን ግንዛቤ ያሳድጉ።",
    "generalTitle": "አጠቃላይ ትምህርቶች",
    "generalDesc": "ከእምነት እና ከአጠቃላይ ህይወት አንጻር ለዘመናዊ ህይወት ተግባራዊ ክህሎቶችን ያዳብሩ።"
},
};

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.15 };

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

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

const FilterTabs = styled(Tabs)({
  minHeight: 52,
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: 8,
    flexWrap: 'nowrap',
  },
  '& .MuiTabs-scrollButtons': {
    color: brand.navy,
    '&.Mui-disabled': { opacity: 0.25 },
  },
});

const FilterTab = styled(Tab)({
  minHeight: 44,
  minWidth: 'auto',
  textTransform: 'none',
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 600,
  fontSize: '0.88rem',
  letterSpacing: '0.01em',
  color: alpha(brand.navy, 0.62),
  padding: '10px 18px',
  borderRadius: 999,
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  background: alpha(brand.white, 0.72),
  transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
  '&.Mui-selected': {
    color: brand.navyDark,
    background: `linear-gradient(180deg, ${brand.white} 0%, ${alpha(brand.gold, 0.18)} 100%)`,
    borderColor: alpha(brand.goldDark, 0.55),
    boxShadow: `0 6px 20px ${alpha(brand.navyInk, 0.08)}`,
  },
  '&:hover': {
    borderColor: alpha(brand.gold, 0.55),
    background: alpha(brand.white, 0.95),
  },
  '& .MuiTab-iconWrapper': {
    marginRight: 8,
    marginBottom: '0 !important',
    color: 'inherit',
  },
});

const CourseTile = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${alpha(brand.navy, 0.1)}`,
  background: brand.white,
  overflow: 'hidden',
  borderRadius: 2,
  boxShadow: brand.shadowSoft,
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
  '&:hover': {
    borderColor: alpha(brand.gold, 0.7),
    boxShadow: brand.shadowCard,
    transform: 'translateY(-4px)',
  },
  '&:hover .course-cover img': {
    transform: 'scale(1.06)',
  },
});

const CourseCard = ({ course, t, reduceMotion, index = 0 }) => (
  <Grid item xs={12} sm={6} md={4}>
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewOpts}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.24), ease: easeOut }}
      style={{ height: '100%' }}
    >
      <CourseTile>
        <Box
          className="course-cover"
          sx={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={course.image_url ? `${API_ROOT_URL}${course.image_url}` : defaultCourseImg}
            alt=""
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.55s ease',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent 45%, ${alpha(brand.navyInk, 0.45)} 100%)`,
              pointerEvents: 'none',
            }}
          />
          <Typography
            sx={{
              position: 'absolute',
              left: 14,
              bottom: 14,
              px: 1.25,
              py: 0.4,
              fontFamily: '"Source Sans 3", sans-serif',
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: brand.navyDark,
              bgcolor: alpha(brand.gold, 0.92),
              borderRadius: 1,
            }}
          >
            {course.category}
          </Typography>
        </Box>
        <Box sx={{ p: 2.75, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography
            sx={{
              mb: 1,
              fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
              fontSize: '0.78rem',
              color: alpha(brand.ink, 0.5),
            }}
          >
            {course.instructor_name || 'Instructor'}
          </Typography>
          <Typography
            component="h3"
            sx={{
              m: 0,
              mb: 1.25,
              fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
              fontWeight: 700,
              fontSize: '1.4rem',
              lineHeight: 1.2,
              color: brand.navy,
            }}
          >
            {course.title}
          </Typography>
          <Typography
            sx={{
              m: 0,
              mb: 2.75,
              flexGrow: 1,
              fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              color: alpha(brand.ink, 0.62),
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {course.description}
          </Typography>
          <Button
            component={Link}
            to={`/classes/course/${course.id}`}
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              py: 1.15,
              '&:hover': { boxShadow: 'none' },
            }}
          >
            {course.course_type === 'PLAYLIST' ? t.viewPlaylistButton : t.joinLiveButton}
          </Button>
        </Box>
      </CourseTile>
    </motion.div>
  </Grid>
);

const ClassesPage = ({ language = 'en' }) => {
  const [tabValue, setTabValue] = useState(0);
  const t = translations[language] || translations.en;
  const services = getSpiritualServices(language);
  const brandName = brandTitles[language] || brandTitles.en;
  const contactLabel = contactLabels[language] || contactLabels.en;
  const reduceMotion = useReducedMotion();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const platformData = useMemo(() => {
    const groupedCourses = courses.reduce((acc, course) => {
      const category = course.category?.toLowerCase() || 'general';
      if (!acc[category]) acc[category] = [];
      acc[category].push(course);
      return acc;
    }, {});
    return {
      all: { title: t.allTitle, description: t.allDesc, courses },
      instruments: {
        title: services.instruments.title,
        description: services.instruments.description,
        courses: groupedCourses.instruments || [],
      },
      hymns: {
        title: services.hymnody.title,
        description: services.hymnody.description,
        courses: groupedCourses.hymns || [],
      },
      abinet: { title: t.abinetTitle, description: t.abinetDesc, courses: groupedCourses.abinet || [] },
      spiritual: {
        title: services.teachings.title,
        description: services.teachings.description,
        courses: groupedCourses.spiritual || [],
      },
      general: { title: t.generalTitle, description: t.generalDesc, courses: groupedCourses.general || [] },
    };
  }, [courses, t, services]);

  const heroSubject = useMemo(() => {
    const withCover = courses.find((course) => course.image_url);
    if (!withCover?.image_url) {
      return { src: classesFallback, fit: 'cover', position: 'center 42%' };
    }
    const path = String(withCover.image_url);
    return {
      src: path.startsWith('http') ? path : `${API_ROOT_URL}${path}`,
      fit: 'cover',
      position: 'center center',
    };
  }, [courses]);

  const sections = useMemo(() => {
    // Keep service-backed tabs even with 0 courses (copy still matters).
    // Hide catalog-only tabs that have nothing to show.
    const keepWithoutCourses = new Set(['instruments', 'hymns', 'spiritual']);
    const allSections = [
      { id: 'all', label: t.tabAll, icon: <AppsIcon sx={{ fontSize: 18 }} />, data: platformData.all },
      { id: 'spiritual', label: services.teachings.title, icon: <BookIcon sx={{ fontSize: 18 }} />, data: platformData.spiritual, phone: LEARNING_PHONE },
      { id: 'instruments', label: t.tabInstruments, icon: <MusicNoteIcon sx={{ fontSize: 18 }} />, data: platformData.instruments, phone: INSTRUMENTS_PHONE },
      { id: 'hymns', label: t.tabHymns, icon: <LibraryMusicIcon sx={{ fontSize: 18 }} />, data: platformData.hymns },
      { id: 'abinet', label: t.tabAbinet, icon: <MenuBookIcon sx={{ fontSize: 18 }} />, data: platformData.abinet },
      { id: 'general', label: t.tabGeneral, icon: <SchoolIcon sx={{ fontSize: 18 }} />, data: platformData.general },
    ];
    return allSections.filter((sec) => {
      const hasCourses = (sec.data.courses?.length || 0) > 0;
      return hasCourses || keepWithoutCourses.has(sec.id);
    });
  }, [platformData, services, t]);

  useEffect(() => {
    if (tabValue >= sections.length) {
      setTabValue(0);
    }
  }, [sections.length, tabValue]);

  return (
    <>
      <SEO title={t.pageTitle} description={t.pageDescription} language={language} />

      <Box sx={{ bgcolor: brand.stone }}>
        <AboutHero
          subjectImage={heroSubject.src}
          subjectFit={heroSubject.fit}
          subjectPosition={heroSubject.position}
          backgroundImage={heroBackground}
          brandName={brandName}
          tagline={t.heroTitle}
          storyTitle={t.allTitle}
          storyLead={t.heroSubtitle}
          placeLabel={placeLabels[language] || placeLabels.en}
          yearCaption={yearCaptions[language] || yearCaptions.en}
          foundedYear="1964"
          lineClamp={4}
          mobileLineClamp={3}
        />

        <PageSection
          variant="stone"
          pattern
          sx={{
            background: `linear-gradient(180deg, ${brand.stone} 0%, ${brand.white} 32%, #F7FAFC 72%, ${brand.stone} 100%)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.5,
              backgroundImage: `
                radial-gradient(ellipse 70% 42% at 50% 0%, ${alpha(brand.gold, 0.14)} 0%, transparent 55%),
                radial-gradient(ellipse 50% 35% at 100% 60%, ${alpha(brand.navy, 0.06)} 0%, transparent 60%),
                repeating-linear-gradient(60deg, transparent 0 18px, ${alpha(brand.navy, 0.025)} 18px 19px),
                repeating-linear-gradient(-60deg, transparent 0 18px, ${alpha(brand.navy, 0.018)} 18px 19px)
              `,
            },
          }}
        >
          <Container maxWidth="lg">
            {loading ? (
              <Box display="flex" justifyContent="center" sx={{ minHeight: 280, py: 8 }}>
                <CircularProgress size={36} sx={{ color: brand.navy }} />
              </Box>
            ) : sections.length === 0 ? (
              <Typography sx={{ textAlign: 'center', color: alpha(brand.ink, 0.55), py: 8 }}>
                {t.allDesc}
              </Typography>
            ) : (
              <>
                <Box sx={{ textAlign: 'center', mb: { xs: 3.5, md: 5 }, maxWidth: 640, mx: 'auto' }}>
                  <Typography
                    sx={{
                      m: 0,
                      mb: 1.5,
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: brand.navy,
                    }}
                  >
                    {t.heroTitle}
                  </Typography>
                  <Typography
                    component="h2"
                    sx={{
                      m: 0,
                      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                      fontWeight: 700,
                      fontSize: 'clamp(1.85rem, 3.2vw, 2.55rem)',
                      lineHeight: 1.15,
                      color: brand.navyDark,
                    }}
                  >
                    {t.pageTitle}
                  </Typography>
                  <Box
                    aria-hidden
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.25,
                      my: 2.25,
                    }}
                  >
                    <Box sx={{ width: 56, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(brand.goldDark, 0.75)})` }} />
                    <EthiopicCross size={13} />
                    <Box sx={{ width: 56, height: 1, background: `linear-gradient(90deg, ${alpha(brand.goldDark, 0.75)}, transparent)` }} />
                  </Box>
                  <Button
                    component="a"
                    href={`tel:${LEARNING_PHONE}`}
                    startIcon={<PhoneIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      mt: 0.5,
                      px: 2.25,
                      py: 1,
                      borderRadius: 999,
                      textTransform: 'none',
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      color: brand.navyDark,
                      bgcolor: alpha(brand.gold, 0.16),
                      border: `1px solid ${alpha(brand.goldDark, 0.45)}`,
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: alpha(brand.gold, 0.28),
                        borderColor: alpha(brand.goldDark, 0.65),
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {contactLabel} {LEARNING_PHONE}
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: { xs: 3, md: 4 },
                    px: { xs: 0.5, sm: 0 },
                  }}
                >
                  <FilterTabs
                    value={Math.min(tabValue, Math.max(sections.length - 1, 0))}
                    onChange={(_, v) => setTabValue(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label={t.pageTitle}
                  >
                    {sections.map((sec, index) => (
                      <FilterTab
                        key={sec.id}
                        icon={sec.icon}
                        iconPosition="start"
                        label={sec.label}
                        id={`tab-${index}`}
                        aria-controls={`tabpanel-${index}`}
                      />
                    ))}
                  </FilterTabs>
                </Box>

                {sections.map((sec, index) => {
                  const active = Math.min(tabValue, sections.length - 1) === index;
                  const courseCount = sec.data.courses?.length || 0;
                  return (
                    <TabPanel key={sec.id} value={Math.min(tabValue, sections.length - 1)} index={index}>
                      <AnimatePresence mode="wait">
                        {active && (
                          <motion.div
                            key={sec.id}
                            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: easeOut }}
                          >
                            <Box
                              sx={{
                                position: 'relative',
                                mb: { xs: 4, md: 5 },
                                px: { xs: 2.5, md: 5 },
                                py: { xs: 3.5, md: 4.5 },
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: `1px solid ${alpha(brand.navy, 0.1)}`,
                                background: `linear-gradient(145deg, ${brand.white} 0%, ${alpha(brand.stone, 0.65)} 100%)`,
                                boxShadow: brand.shadowSoft,
                              }}
                            >
                              <Box
                                aria-hidden
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  height: 3,
                                  background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
                                }}
                              />
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: { xs: 'column', md: 'row' },
                                  alignItems: { xs: 'flex-start', md: 'center' },
                                  gap: { xs: 2.5, md: 3.5 },
                                  mb: 2.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    flexShrink: 0,
                                    display: 'grid',
                                    placeItems: 'center',
                                    borderRadius: '50%',
                                    color: brand.navy,
                                    bgcolor: alpha(brand.gold, 0.18),
                                    border: `1px solid ${alpha(brand.goldDark, 0.4)}`,
                                    '& .MuiSvgIcon-root': { fontSize: 26 },
                                  }}
                                >
                                  {sec.icon}
                                </Box>
                                <Typography
                                  component="h3"
                                  sx={{
                                    m: 0,
                                    minWidth: 0,
                                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                                    fontWeight: 700,
                                    fontSize: 'clamp(1.65rem, 2.8vw, 2.2rem)',
                                    lineHeight: 1.2,
                                    color: brand.navyDark,
                                  }}
                                >
                                  {sec.data.title}
                                </Typography>
                              </Box>
                              <Box
                                aria-hidden
                                sx={{
                                  width: 44,
                                  height: 2,
                                  mb: 2.25,
                                  bgcolor: brand.gold,
                                  borderRadius: 1,
                                }}
                              />
                              <Typography
                                sx={{
                                  m: 0,
                                  maxWidth: 820,
                                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                                  fontSize: { xs: '0.98rem', md: '1.05rem' },
                                  lineHeight: 1.85,
                                  color: alpha(brand.ink, 0.78),
                                  whiteSpace: 'pre-line',
                                  overflowWrap: 'anywhere',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {sec.data.description}
                              </Typography>
                              {sec.phone && (
                                <Button
                                  component="a"
                                  href={`tel:${sec.phone}`}
                                  startIcon={<PhoneIcon sx={{ fontSize: 18 }} />}
                                  sx={{
                                    mt: 3,
                                    px: 2.25,
                                    py: 1,
                                    borderRadius: 999,
                                    textTransform: 'none',
                                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                                    fontWeight: 600,
                                    fontSize: '0.92rem',
                                    color: brand.navyDark,
                                    bgcolor: alpha(brand.gold, 0.16),
                                    border: `1px solid ${alpha(brand.goldDark, 0.45)}`,
                                    boxShadow: 'none',
                                    '&:hover': {
                                      bgcolor: alpha(brand.gold, 0.28),
                                      borderColor: alpha(brand.goldDark, 0.65),
                                      boxShadow: 'none',
                                    },
                                  }}
                                >
                                  {contactLabel} {sec.phone}
                                </Button>
                              )}
                            </Box>

                            {courseCount > 0 && (
                              <Grid container spacing={3}>
                                {sec.data.courses.map((course, courseIndex) => (
                                  <CourseCard
                                    key={course.id}
                                    course={course}
                                    t={t}
                                    reduceMotion={reduceMotion}
                                    index={courseIndex}
                                  />
                                ))}
                              </Grid>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TabPanel>
                  );
                })}
              </>
            )}
          </Container>
        </PageSection>

        <PageSection variant="ink" pattern sx={{ textAlign: 'center' }}>
          <Container maxWidth="sm">
            <Box
              component="img"
              src={crestLogo}
              alt=""
              sx={{
                width: 72,
                height: 72,
                objectFit: 'contain',
                bgcolor: '#fff',
                borderRadius: '50%',
                border: `2px solid ${brand.gold}`,
                p: 0.75,
                mb: 3,
                mx: 'auto',
                display: 'block',
              }}
            />
            <Typography
              component="h2"
              sx={{
                m: 0,
                mb: 2,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                color: brand.white,
              }}
            >
              {t.ctaTitle}
            </Typography>
            <GoldDivider />
            <Typography
              sx={{
                m: 0,
                mt: 2,
                mb: 4,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: '1.02rem',
                lineHeight: 1.7,
                color: alpha(brand.white, 0.75),
              }}
            >
              {t.ctaSubtitle}
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: 1,
                px: 6,
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

export default ClassesPage;
