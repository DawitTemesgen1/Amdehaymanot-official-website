import { Box, Typography, Container, Grid, Tabs, Tab, CircularProgress, Button } from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo, useCallback } from 'react';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import { AboutHero, PageSection, GoldDivider } from '../components/ui';
import { brand } from '../brand';

import AppsIcon from '@mui/icons-material/Apps';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SchoolIcon from '@mui/icons-material/School';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import classesFallback from '../assets/classes-hero.jpg';
import heroBackground from '../assets/spiritual-course.jpg';
import defaultCourseImg from '../assets/spiritual-course.jpg';
import crestLogo from '../assets/logo.png';

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
  minHeight: 48,
  '& .MuiTabs-indicator': {
    height: 2,
    backgroundColor: brand.gold,
  },
  '& .MuiTabs-flexContainer': {
    gap: 4,
  },
});

const FilterTab = styled(Tab)({
  minHeight: 48,
  textTransform: 'uppercase',
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  color: alpha(brand.navy, 0.5),
  padding: '12px 14px',
  '&.Mui-selected': {
    color: brand.navy,
  },
  '& .MuiTab-iconWrapper': {
    marginRight: 6,
    marginBottom: '0 !important',
  },
});

const CourseTile = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${alpha(brand.navy, 0.1)}`,
  background: brand.white,
  overflow: 'hidden',
  transition: 'border-color 0.2s ease',
  '&:hover': {
    borderColor: alpha(brand.gold, 0.65),
  },
  '&:hover .course-cover img': {
    transform: 'scale(1.04)',
  },
});

const CourseCard = ({ course, t, reduceMotion }) => (
  <Grid item xs={12} sm={6} md={4}>
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewOpts}
      transition={{ duration: 0.45, ease: easeOut }}
      style={{ height: '100%' }}
    >
      <CourseTile>
        <Box
          className="course-cover"
          sx={{
            overflow: 'hidden',
            borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
          }}
        >
          <Box
            component="img"
            src={course.image_url ? `${API_ROOT_URL}${course.image_url}` : defaultCourseImg}
            alt=""
            sx={{
              width: '100%',
              height: 180,
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.45s ease',
            }}
          />
        </Box>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 1 }}>
            <Typography
              sx={{
                fontFamily: '"Source Sans 3", sans-serif',
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: brand.goldDark,
              }}
            >
              {course.category}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: '0.75rem',
                color: alpha(brand.ink, 0.55),
              }}
            >
              {course.instructor_name || 'Instructor'}
            </Typography>
          </Box>
          <Typography
            component="h3"
            sx={{
              m: 0,
              mb: 1,
              fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
              fontWeight: 700,
              fontSize: '1.35rem',
              lineHeight: 1.2,
              color: brand.navy,
            }}
          >
            {course.title}
          </Typography>
          <Typography
            sx={{
              m: 0,
              mb: 2.5,
              flexGrow: 1,
              fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
              fontSize: '0.9rem',
              lineHeight: 1.55,
              color: alpha(brand.ink, 0.6),
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
              py: 1.1,
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
  const brandName = brandTitles[language] || brandTitles.en;
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
      instruments: { title: t.instrumentsTitle, description: t.instrumentsDesc, courses: groupedCourses.instruments || [] },
      hymns: { title: t.hymnsTitle, description: t.hymnsDesc, courses: groupedCourses.hymns || [] },
      abinet: { title: t.abinetTitle, description: t.abinetDesc, courses: groupedCourses.abinet || [] },
      spiritual: { title: t.spiritualTitle, description: t.spiritualDesc, courses: groupedCourses.spiritual || [] },
      general: { title: t.generalTitle, description: t.generalDesc, courses: groupedCourses.general || [] },
    };
  }, [courses, t]);

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

  const sections = [
    { label: t.tabAll, icon: <AppsIcon sx={{ fontSize: 16 }} />, data: platformData.all },
    { label: t.tabInstruments, icon: <MusicNoteIcon sx={{ fontSize: 16 }} />, data: platformData.instruments },
    { label: t.tabHymns, icon: <LibraryMusicIcon sx={{ fontSize: 16 }} />, data: platformData.hymns },
    { label: t.tabAbinet, icon: <MenuBookIcon sx={{ fontSize: 16 }} />, data: platformData.abinet },
    { label: t.tabSpiritual, icon: <SelfImprovementIcon sx={{ fontSize: 16 }} />, data: platformData.spiritual },
    { label: t.tabGeneral, icon: <SchoolIcon sx={{ fontSize: 16 }} />, data: platformData.general },
  ];

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

        <PageSection variant="white">
          <Container maxWidth="lg">
            <Box
              sx={{
                borderBottom: `1px solid ${alpha(brand.navy, 0.1)}`,
                mb: 1,
              }}
            >
              <FilterTabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                {sections.map((sec, index) => (
                  <FilterTab
                    key={sec.label}
                    icon={sec.icon}
                    iconPosition="start"
                    label={sec.label}
                    id={`tab-${index}`}
                    aria-controls={`tabpanel-${index}`}
                  />
                ))}
              </FilterTabs>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" sx={{ minHeight: 280, py: 8 }}>
                <CircularProgress size={36} sx={{ color: brand.navy }} />
              </Box>
            ) : (
              sections.map((sec, index) => (
                <TabPanel key={sec.label} value={tabValue} index={index}>
                  <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 560, mx: 'auto' }}>
                    <Box
                      aria-hidden
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.25,
                        mb: 2.5,
                      }}
                    >
                      <Box sx={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(brand.goldDark, 0.7)})` }} />
                      <EthiopicCross size={12} />
                      <Box sx={{ width: 40, height: 1, background: `linear-gradient(90deg, ${alpha(brand.goldDark, 0.7)}, transparent)` }} />
                    </Box>
                    <Typography
                      component="h2"
                      sx={{
                        m: 0,
                        fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                        fontWeight: 700,
                        fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                        color: brand.navy,
                      }}
                    >
                      {sec.data.title}
                    </Typography>
                    <Box aria-hidden sx={{ width: 48, height: 2, mx: 'auto', my: 2, bgcolor: brand.gold }} />
                    <Typography
                      sx={{
                        m: 0,
                        fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                        fontSize: '0.98rem',
                        lineHeight: 1.7,
                        color: alpha(brand.ink, 0.62),
                      }}
                    >
                      {sec.data.description}
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {sec.data.courses.length > 0 ? (
                      sec.data.courses.map((course) => (
                        <CourseCard key={course.id} course={course} t={t} reduceMotion={reduceMotion} />
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography sx={{ textAlign: 'center', color: alpha(brand.ink, 0.55), py: 4 }}>
                          Courses for this category will be available soon.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </TabPanel>
              ))
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
