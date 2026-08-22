import { Box, Typography, Container, Grid, Tabs, Tab, CircularProgress, Button } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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

const translations = {
    en: { pageTitle: 'Online Classes & Learning', pageDescription: "Explore online courses from Amdehaymanot Sunday School in Jimma. We offer classes on Orthodox instruments, Hymn Studies (Zema), Abinet Education, and spiritual development.", heroTitle: 'Online Learning', heroSubtitle: "Redeeming the time, for the days are evil (Eph 5:16). Using the technological advancement of the age, we preach Christ crucified (1 Cor 1:23).", tabAll: 'All', tabInstruments: 'Instruments', tabHymns: 'Hymns', tabAbinet: 'Abinet', tabSpiritual: 'Spiritual', tabGeneral: 'General', ctaTitle: 'Ready to Start Your Journey?', ctaSubtitle: 'Sign up today to get access to all our video playlists and live sessions.', ctaButton: 'Create an Account', viewPlaylistButton: 'View Course', joinLiveButton: 'View Course', allTitle: "All Courses", allDesc: "Browse our complete catalog of courses across all categories.", instrumentsTitle: "Orthodox Instruments", instrumentsDesc: "Learn to play sacred instruments used in the Orthodox worship. Our courses cater to all levels, from absolute beginners to advanced players.", hymnsTitle: "Hymn Studies", hymnsDesc: "Join live group sessions to learn the melodies, lyrics, and spiritual significance of Orthodox hymns for various seasons and feasts.", abinetTitle: "Abinet Education", abinetDesc: "Engage in traditional, in-depth church education. This section is dedicated to foundational studies like Ge'ez, Zema, and Qine (Poetry).", spiritualTitle: "Spiritual Courses", spiritualDesc: "Deepen your understanding of the Orthodox faith, theology, and tradition through engaging video series and live discussions.", generalTitle: "General Courses", generalDesc: "Develop practical skills for modern life, taught from a perspective of faith and holistic well-being." },
    am: { pageTitle: 'የኦንላይን ትምህርቶች እና ስልጠና', pageDescription: 'ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት የኦንላይን ትምህርቶችን ያስሱ። በኦርቶዶክሳዊ የዜማ መሳሪያዎች፣ የዝማሬ ጥናቶች (ዜማ)፣ የአብነት ትምህርት እና መንፈሳዊ እድገት ላይ ክፍሎችን እናቀርባለን።', heroTitle: 'የኦንላይን ትምህርት', heroSubtitle: 'ቀኖቹ ክፉዎች ናቸውና ዘመኑን ዋጁ። (ኤፌ 5፡16)። እንደተባልን ዘመኑ በደረሰበት የቴክኖሎጂ ልህቀት ተጠቅመን、 እኛ ግን የተሰቀለውን ክርስቶስን እንሰብካለን (1ኛ ቆሮ 1፡23)።', tabAll: 'ሁሉም', tabInstruments: 'የዜማ መሳሪያዎች', tabHymns: 'ዝማሬዎች', tabAbinet: 'አብነት', tabSpiritual: 'መንፈሳዊ', tabGeneral: 'አጠቃላይ', ctaTitle: 'ጉዞዎን ለመጀመር ዝግጁ ነዎት?', ctaSubtitle: 'ሁሉንም የቪዲዮ ዝርዝሮቻችንን እና የቀጥታ ስርጭቶችን ለማግኘት ዛሬውኑ ይመዝገቡ።', ctaButton: 'መለያ ይፍጠሩ', viewPlaylistButton: 'ትምህርቱን ይመልከቱ', joinLiveButton: 'ትምህርቱን ይመልከቱ', allTitle: "ሁሉም ትምህርቶች", allDesc: "የሁሉንም ትምህርቶች ዝርዝር ይመልከቱ።", instrumentsTitle: "የኦርቶዶክስ የዜማ መሳሪያዎች", instrumentsDesc: "በኦርቶዶክስ አምልኮ ውስጥ አገልግሎት ላይ የሚውሉትን ቅዱሳት የዜማ መሣሪያዎችን መጫወት ይማሩ። ትምህርቶቻችን ከጀማሪዎች እስከ ከፍተኛ ደረጃ ላሉ ተማሪዎች የተዘጋጁ ናቸው።", hymnsTitle: "የዝማሬ ጥናቶች", hymnsDesc: "የተለያዩ ወቅቶች እና በዓላት የኦርቶዶክስ ዝማሬዎችን ዜማ、 ግጥም እና መንፈሳዊ ጠቀሜታ ለመማር የኦንላይን ክፍለ ጊዜዎችን ይቀላቀሉ።", abinetTitle: "አብነት ትምህርት", abinetDesc: "ቀዳማዊ እና ጥልቅ በሆነው የቤተክርስቲያን ትምህርት ይሳተፉ። ይህ ክፍል እንደ ግእዝ、 ዜማ እና ቅኔ ላሉ መሰረታዊ ጥናቶች የተዘጋጀ ነው።", spiritualTitle: "መንፈሳዊ ትምህርቶች", spiritualDesc: "በአሳታፊ የቪዲዮ ተከታታዮች እና የቀጥታ ውይይቶች በኦርቶዶክስ እምነት、 ሥነ-መለኮት እና ትውፊት ላይ ያለዎትን ግንዛቤ ያሳድጉ።", generalTitle: "አጠቃላይ ትምህርቶች", generalDesc: "ከእምነት እና ከአጠቃላይ ህይወት አንጻር ለዘመናዊ ህይወት ተግባራዊ ክህሎቶችን ያዳብሩ።" },
    ar: { pageTitle: 'دورات عبر الإنترنت', pageDescription: 'استكشف الدورات عبر الإنترنت من مدرسة الأحد عماد الإيمان في جيما. نقدم دروسًا في الآلات الأرثوذكسية ، ودراسات الترانيم (زيما) ، وتعليم الأبينيت ، والتطور الروحي.', heroTitle: 'التعلم عبر الإنترنت', heroSubtitle: "مفتدين الوقت لأن الأيام شريرة (أفسس 5:16). وباستخدام التقدم التكنولوجي للعصر، نكرز بالمسيح مصلوبًا (1 كورنثوس 1:23).", tabAll: 'الكل', tabInstruments: 'الآلات', tabHymns: 'الترانيم', tabAbinet: 'أبينيت', tabSpiritual: 'روحي', tabGeneral: 'عام', ctaTitle: 'هل أنت مستعد لبدء رحلتك؟', ctaSubtitle: 'سجل اليوم للحصول على وصول إلى جميع قوائم تشغيل الفيديو والجلسات المباشرة.', ctaButton: 'إنشاء حساب', viewPlaylistButton: 'عرض الدورة', joinLiveButton: 'عرض الدورة', allTitle: "جميع الدورات", allDesc: "تصفح كتالوجنا الكامل للدورات في جميع الفئات.", instrumentsTitle: "الآلات الأرثوذكسية", instrumentsDesc: "تعلم العزف على الآلات المقدسة المستخدمة في العبادة الأرثوذكسية. دوراتنا تلبي جميع المستويات، من المبتدئين تمامًا إلى اللاعبين المتقدمين.", hymnsTitle: "دراسات الترانيم", hymnsDesc: "انضم إلى جلسات جماعية مباشرة لتعلم الألحان والكلمات والأهمية الروحية للترانيم الأرثوذكسية لمختلف المواسم والأعياد.", abinetTitle: "تعليم أبينيت", abinetDesc: "انخرط في تعليم كنسي تقليدي ومتعمق. هذا القسم مخصص للدراسات التأسيسية مثل الجعزية والزيما والقኔ (الشعر).", spiritualTitle: "دورات روحية", spiritualDesc: "عمّق فهمك للإيمان الأرثوذكسي واللاهوت والتقاليد من خلال سلاسل الفيديو الجذابة والمناقشات المباشرة.", generalTitle: "دورات عامة", generalDesc: "طور مهارات عملية للحياة العصرية، تُدرس من منظور الإيمان والرفاهية الشاملة." },
    es: { pageTitle: 'Clases y Aprendizaje en Línea', pageDescription: 'Explora los cursos en línea de la Escuela Dominical Amdehayimanot en Jimma. Ofrecemos clases de instrumentos ortodoxos, estudios de himnos (Zema), educación Abinet y desarrollo espiritual.', heroTitle: 'Aprendizaje en Línea', heroSubtitle: "Aprovechando bien el tiempo, porque los días son malos (Efesios 5:16). Usando el avance tecnológico de la era, predicamos a Cristo crucificado (1 Corintios 1:23).", tabAll: 'Todos', tabInstruments: 'Instrumentos', tabHymns: 'Himnos', tabAbinet: 'Abinet', tabSpiritual: 'Espiritual', tabGeneral: 'General', ctaTitle: '¿Listo para Comenzar tu Viaje?', ctaSubtitle: 'Regístrate hoy para obtener acceso a todas nuestras listas de reproducción de videos y sesiones en vivo.', ctaButton: 'Crear una Cuenta', viewPlaylistButton: 'Ver Curso', joinLiveButton: 'Ver Curso', allTitle: "Todos los Cursos", allDesc: "Navega por nuestro catálogo completo de cursos en todas las categorías.", instrumentsTitle: "Instrumentos Ortodoxos", instrumentsDesc: "Aprende a tocar instrumentos sagrados utilizados en el culto ortodoxo. Nuestros cursos se adaptan a todos los niveles, desde principiantes absolutos hasta músicos avanzados.", hymnsTitle: "Estudios de Himnos", hymnsDesc: "Únete a sesiones grupales en vivo para aprender las melodías, letras y significado espiritual de los himnos ortodoxos para diversas temporadas y festividades.", abinetTitle: "Educación Abinet", abinetDesc: "Participa en la educación eclesiástica tradicional y profunda. Esta sección está dedicada a estudios fundamentales como Ge'ez, Zema y Qine (Poesía).", spiritualTitle: "Cursos Espirituales", spiritualDesc: "Profundiza tu comprensión de la fe, la teología y la tradición ortodoxas a través de series de videos atractivas y discusiones en vivo.", generalTitle: "Cursos Generales", generalDesc: "Desarrolla habilidades prácticas para la vida moderna, enseñadas desde una perspectiva de fe y bienestar integral." },
    fr: { pageTitle: 'Cours et Apprentissage en Ligne', pageDescription: 'Découvrez les cours en ligne de l\'école du dimanche Amdehayimanot à Jimma. Nous proposons des cours sur les instruments orthodoxes, des études d\'hymnes (Zema), l\'éducation Abinet et le développement spirituel.', heroTitle: 'Apprentissage en Ligne', heroSubtitle: "Rachetez le temps, car les jours sont mauvais (Éphésiens 5:16). En utilisant les avancées technologiques de notre époque, nous prêchons le Christ crucifié (1 Corinthiens 1:23).", tabAll: 'Tous', tabInstruments: 'Instruments', tabHymns: 'Hymnes', tabAbinet: 'Abinet', tabSpiritual: 'Spirituel', tabGeneral: 'Général', ctaTitle: 'Prêt à Commencer Votre Voyage ?', ctaSubtitle: 'Inscrivez-vous aujourd\'hui pour accéder à toutes nos playlists vidéo et sessions en direct.', ctaButton: 'Créer un Compte', viewPlaylistButton: 'Voir le Cours', joinLiveButton: 'Voir le Cours', allTitle: "Tous les Cours", allDesc: "Parcourez notre catalogue complet de cours dans toutes les catégories.", instrumentsTitle: "Instruments Orthodoxes", instrumentsDesc: "Apprenez à jouer des instruments sacrés utilisés dans le culte orthodoxe. Nos cours s'adressent à tous les niveaux, des débutants absolus aux joueurs avancés.", hymnsTitle: "Études d'Hymnes", hymnsDesc: "Rejoignez des sessions de groupe en direct pour apprendre les mélodies, les paroles et la signification spirituelle des hymnes orthodoxes pour différentes saisons et fêtes.", abinetTitle: "Éducation Abinet", abinetDesc: "Participez à une éducation ecclésiastique traditionnelle et approfondie. Cette section est dédiée aux études fondamentales comme le Ge'ez, le Zema et le Qine (Poésie).", spiritualTitle: "Cours Spirituels", spiritualDesc: "Approfondissez votre compréhension de la foi, de la théologie et de la tradition orthodoxes grâce à des séries de vidéos captivantes et des discussions en direct.", generalTitle: "Cours Généraux", generalDesc: "Développez des compétences pratiques pour la vie moderne, enseignées dans une perspective de foi et de bien-être holistique." },
    ti: { pageTitle: 'ናይ ኦንላይን ክፍለ-ትምህርትን ትምህርትን', pageDescription: 'ናይ ኦንላይን ኮርሳት ካብ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ኣብ ጅማ ዳህሰሱ። ኣብ ኦርቶዶክሳዊ መሳርሒታት፡ መጽናዕቲ መዛሙር (ዜማ)፡ ትምህርቲ ኣብነትን መንፈሳዊ ምዕባለን ክፍለ-ትምህርቲ ንህብ።', heroTitle: 'ናይ ኦንላይን ትምህርቲ', heroSubtitle: "መዓልትታት ክፉኣት እየን እሞ፡ ንዘመንኩም ተዋጀውዎ (ኤፌ 5፡16)። ናይዚ ዘመን'ዚ ምዕባለ ቴክኖሎጂ ተጠቒምና፡ ንሕና ግና ነቲ እተሰቕለ ክርስቶስ ንሰብኽ (1 ቈረ 1፡23)።", tabAll: 'ኩሉ', tabInstruments: 'መ ఆధ్యా', tabHymns: 'መዛሙር', tabAbinet: 'ኣብነት', tabSpiritual: 'መንፈሳዊ', tabGeneral: 'ሓፈሻዊ', ctaTitle: 'ጉዕዞኹም ክትጅምሩ ድሉዋት ዲኹም?', ctaSubtitle: 'ንኹሉ ናይ ቪድዮታትናን ቀጥታዊ መደባትናን ንምርካብ ሎሚ ተመዝገቡ።', ctaButton: 'ኣካውንት ፍጠር', viewPlaylistButton: 'ነቲ ኮርስ ርኣይዎ', joinLiveButton: 'ነቲ ኮርስ ርኣይዎ', allTitle: "ኩሎም ኮርሳት", allDesc: "ናይ ኩሎም ኮርሳት ካታሎግና ኣብ ኩሉ ምድባት ርአ።", instrumentsTitle: "ናይ ኦርቶዶክስ መ ఆధ్యా", instrumentsDesc: "ኣብ ኣምልኾ ኦርቶዶክስ ዘገልግሉ ቅዱሳት መ ఆధ్యా ምውቃዕ ተማሃሩ። ኮርሳትና ንኹሉ ደረጃታት፡ ካብ ፍጹም ጀመርቲ ክሳብ ዕቡያት ተጻወትቲ የገልግል።", hymnsTitle: "ናይ መዝሙር መጽናዕትታት", hymnsDesc: "ዜማታት፡ ቃላትን መንፈሳዊ ትርጉምን ናይ ኦርቶዶክሳዊ መዛሙር ንፈላለዩ እዋናትን በዓላትን ንምምሃር፡ ቀጥታዊ ጉጅለኣዊ ክፍለ-ጊዜታት ተጸንበሩ።", abinetTitle: "ትምህርቲ ኣብነት", abinetDesc: "ኣብ ባህላዊ፡ ዓሚቝ ትምህርቲ ቤተ-ክርስትያን ተሳተፉ። እዚ ክፍሊ'ዚ ንመሰረታዊ መጽናዕትታት ከም ግእዝ፡ ዜማን ቅኔን (ግጥሚ) ዝተወፈየ እዩ።", spiritualTitle: "መንፈሳዊ ኮርሳት", spiritualDesc: "ብመንገዲ ኣሳታፊ ተኸታታሊ ቪድዮታትን ቀጥታዊ ምይይጣትን፡ ንርድኢትኩም ኣብ እምነት ኦርቶዶክስ፡ ስነ-መለኮትን ትውፊትን ኣዕምቑ።", generalTitle: "ሓፈሻዊ ኮርሳት", generalDesc: "ንዘመናዊ ህይወት ተግባራዊ ክእለት ኣማዕብሉ፡ ካብ ኣረኣእያ እምነትን ምሉእ-ህይወታዊ ድሕንነትን ዝተማህረ።" },
    om: { pageTitle: 'Barnoota Tooraan', pageDescription: 'Koorsiiwwan tooraan kan Mana Barumsaa Dilbataa Amdehayimanot Jimmaa irraa qophaa\'an ilaalaa. Barnoota meezeroota Ortoodoksii, qo\'annoo faarfannaa (Zeemaa), barnoota Abineet, fi guddina hafuuraa irratti ni kennina.', heroTitle: 'Barnoota Tooraan', heroSubtitle: "Bara hamaadhaaf, yeroo keessan bitadhaa (Efe 5:16). Guddina teeknooloojii bara kanaa fayyadamuudhaan, nuti Kiristoos isa fannifame lallabna (1 Qor 1:23).", tabAll: 'Hunda', tabInstruments: 'Meezeroota', tabHymns: 'Faarfannaa', tabAbinet: 'Abineet', tabSpiritual: 'Hafuuraa', tabGeneral: 'Waliigalaa', ctaTitle: 'Imala Keessan Jalqabuuf Qophii Dha?', ctaSubtitle: 'Tarree vidiyoo keenyaa fi tamsaasa kallattii argachuuf har\'a galmaa\'aa.', ctaButton: 'Akkaawuntii Uumi', viewPlaylistButton: 'Koorsii Ilaali', joinLiveButton: 'Koorsii Ilaali', allTitle: "Koorsiiwwan Hunda", allDesc: "Katalogii koorsiiwwan keenya guutuu ramaddii hundaan ilaalaa.", instrumentsTitle: "Meezeroota Ortoodoksii", instrumentsDesc: "Waaqeffannaa Ortoodoksii keessatti kan fayyadan meezeroota qulqulluu taphachuu baradhaa. Koorsiin keenya sadarkaa hundumaaf, jalqabaa irraa hanga sadarkaa olaanaatti kan qophaa'edha.", hymnsTitle: "Qo'annoo Faarfannaa", hymnsDesc: "Yeedaloo, walaloo, fi hiika hafuuraa faarfannaawwan Ortoodoksii yeroo fi ayyaanota adda addaaf barachuuf sagantaa garee kallattiin hirmaadhaa.", abinetTitle: "Barnoota Abineet", abinetDesc: "Barnoota amantii aadaa fi gad-fageenyaa qabu hirmaadhaa. Kutaan kun qo'annoowwan bu'uuraa kan akka Gi'izii, Zeemaa, fi Qinee (Wallee) irratti xiyyeeffata.", spiritualTitle: "Koorsiiwwan Hafuuraa", spiritualDesc: "Hubannoo keessan amantii, ti'ooloojii, fi aadaa Ortoodoksii irratti tarree vidiyoo fi marii kallattiiwwan nama hirmaachisaniin gadi fageessaa.", generalTitle: "Koorsiiwwan Waliigalaa", generalDesc: "Jireenya ammayyaatiif dandeettiiwwan hojiirra oolan, ilaalcha amantii fi fayyabulummaa guutuurraa kan barsiifaman guddifadhaa." },
    ge: { pageTitle: 'ትምህርት በመስመር', pageDescription: 'ኮርሳት በመስመር እምቤት ትምህርት ሰንበት ዓምደሃይማኖት በጅማ ርአዩ። ንሕነ ንመሀር በመሳርያተ ኦርቶዶክስ፣ መጽናዕተ መዝሙራት (ዜማ)፣ ትምህርተ አብነት፣ ወመንፈሳዊ ዕቤት።', heroTitle: 'ትምህርት በመስመር', heroSubtitle: "መዋዕል ክፉአን እሙንቱ፡ ተዋጀውዎ ለጊዜክሙ (ኤፌ 5፡16)። በምዕባለ ቴክኖሎጂ ዘዝየ፣ ንሕነሰ ንሰብክ ክርስቶስሃ ዘተሰቅለ (1 ቆሮ 1፡23)።", tabAll: 'ኵሉ', tabInstruments: 'መሳርያ', tabHymns: 'መዝሙራት', tabAbinet: 'አብነት', tabSpiritual: 'መንፈሳዊ', tabGeneral: 'ኵለንታዌ', ctaTitle: 'ለአጀማመር ጉዞክሙ ድልዋን አንትሙ?', ctaSubtitle: 'ለመሳካት ኵሎ ታክሲሳተ ቪድዮ ወቀጥታ ስርጭታት፣ ተመዝገቡ ዮም።', ctaButton: 'ፍጠር መለያ', viewPlaylistButton: 'ርአይ ኮርስ', joinLiveButton: 'ርአይ ኮርስ', allTitle: "ኵሎም ኮርሳት", allDesc: "ካታሎግነ ኵሎ ኮርሳት በኵሉ ምድባት ርአ።", instrumentsTitle: "መሳርያተ ኦርቶዶክስ", instrumentsDesc: "ተመሀሩ መውቃዕተ ቅዱሳት መሳርያት ውስተ አምልኮተ ኦርቶዶክስ። ኮርሳትነ ለኵሉ ደረጃት፣ እምጀማሪ እስከ ልሂቅ ተጫዋች ያገለግላሉ።", hymnsTitle: "መጽናዕተ መዝሙራት", hymnsDesc: "ተጸንበሩ ቀጥታ ጉባኤያት ለትምህርተ ዜማ፣ ቃላት፣ ወመንፈሳዊ ትርጉመ መዝሙራተ ኦርቶዶክስ ለልዩ ልዩ ጊዜያት ወበዓላት።", abinetTitle: "ትምህርተ አብነት", abinetDesc: "ተሳተፉ በባህላዊ፣ ዓሚቅ ትምህርተ ቤተ ክርስቲያን። ዝ ክፍሊ ለትንሣኤ መጽናዕት ከም ግእዝ፣ ዜማ፣ ወቅኔ (ግጥሚ) ተወፈየ።", spiritualTitle: "መንፈሳዊ ኮርሳት", spiritualDesc: "አዕምቁ ርድኢተክሙ በእምነተ ኦርቶዶክስ፣ ሥነ-መለኮት፣ ወትውፊት በታክሲሳተ ቪድዮ ወቀጥታ ምይይጣት።", generalTitle: "ኵለንታዌ ኮርሳት", generalDesc: "አማዕብሉ ተግባራዊ ክህሎታት ለዘመናዊ ሕይወት፣ እምነጽረ እምነት ወምሉእ-ሕይወታዊ ድኅነት ዘተማህረ።" }
}

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
      <Helmet>
        <html lang={language} />
        <title>{`${t.pageTitle} | ${brandName}`}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>

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
