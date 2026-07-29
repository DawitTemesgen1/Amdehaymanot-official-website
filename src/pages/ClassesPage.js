import { Box, Typography, Container, Grid, Paper, Avatar, Tabs, Tab, CardContent, CardMedia, CardActions, Chip, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo, useCallback } from 'react';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import { PageHero, PageSection, SectionHeader, OrthCard } from '../components/ui';
import brand from '../brand';

import AppsIcon from '@mui/icons-material/Apps';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SchoolIcon from '@mui/icons-material/School';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import platformHero from '../assets/classes-hero.jpg';
import defaultCourseImg from '../assets/spiritual-course.jpg';

const translations = {
    en: { pageTitle: 'Online Classes & Learning', pageDescription: "Explore online courses from Amdehaymanot Sunday School in Jimma. We offer classes on Orthodox instruments, Hymn Studies (Zema), Abinet Education, and spiritual development.", heroTitle: 'Online Learning', heroSubtitle: "Redeeming the time, for the days are evil (Eph 5:16). Using the technological advancement of the age, we preach Christ crucified (1 Cor 1:23).", tabAll: 'All', tabInstruments: 'Instruments', tabHymns: 'Hymns', tabAbinet: 'Abinet', tabSpiritual: 'Spiritual', tabGeneral: 'General', ctaTitle: 'Ready to Start Your Journey?', ctaSubtitle: 'Sign up today to get access to all our video playlists and live sessions.', ctaButton: 'Create an Account', viewPlaylistButton: 'View Course', joinLiveButton: 'View Course', allTitle: "All Courses", allDesc: "Browse our complete catalog of courses across all categories.", instrumentsTitle: "Orthodox Instruments", instrumentsDesc: "Learn to play sacred instruments used in the Orthodox worship. Our courses cater to all levels, from absolute beginners to advanced players.", hymnsTitle: "Hymn Studies", hymnsDesc: "Join live group sessions to learn the melodies, lyrics, and spiritual significance of Orthodox hymns for various seasons and feasts.", abinetTitle: "Abinet Education", abinetDesc: "Engage in traditional, in-depth church education. This section is dedicated to foundational studies like Ge'ez, Zema, and Qine (Poetry).", spiritualTitle: "Spiritual Courses", spiritualDesc: "Deepen your understanding of the Orthodox faith, theology, and tradition through engaging video series and live discussions.", generalTitle: "General Courses", generalDesc: "Develop practical skills for modern life, taught from a perspective of faith and holistic well-being." },
    am: { pageTitle: 'የኦንላይን ትምህርቶች እና ስልጠና', pageDescription: 'ከጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት የኦንላይን ትምህርቶችን ያስሱ። በኦርቶዶክሳዊ የዜማ መሳሪያዎች፣ የዝማሬ ጥናቶች (ዜማ)፣ የአብነት ትምህርት እና መንፈሳዊ እድገት ላይ ክፍሎችን እናቀርባለን።', heroTitle: 'የኦንላይን ትምህርት', heroSubtitle: 'ቀኖቹ ክፉዎች ናቸውና ዘመኑን ዋጁ። (ኤፌ 5፡16)። እንደተባልን ዘመኑ በደረሰበት የቴክኖሎጂ ልህቀት ተጠቅመን、 እኛ ግን የተሰቀለውን ክርስቶስን እንሰብካለን (1ኛ ቆሮ 1፡23)።', tabAll: 'ሁሉም', tabInstruments: 'የዜማ መሳሪያዎች', tabHymns: 'ዝማሬዎች', tabAbinet: 'አብነት', tabSpiritual: 'መንፈሳዊ', tabGeneral: 'አጠቃላይ', ctaTitle: 'ጉዞዎን ለመጀመር ዝግጁ ነዎት?', ctaSubtitle: 'ሁሉንም የቪዲዮ ዝርዝሮቻችንን እና የቀጥታ ስርጭቶችን ለማግኘት ዛሬውኑ ይመዝገቡ።', ctaButton: 'መለያ ይፍጠሩ', viewPlaylistButton: 'ትምህርቱን ይመልከቱ', joinLiveButton: 'ትምህርቱን ይመልከቱ', allTitle: "ሁሉም ትምህርቶች", allDesc: "የሁሉንም ትምህርቶች ዝርዝር ይመልከቱ።", instrumentsTitle: "የኦርቶዶክስ የዜማ መሳሪያዎች", instrumentsDesc: "በኦርቶዶክስ አምልኮ ውስጥ አገልግሎት ላይ የሚውሉትን ቅዱሳት የዜማ መሣሪያዎችን መጫወት ይማሩ። ትምህርቶቻችን ከጀማሪዎች እስከ ከፍተኛ ደረጃ ላሉ ተማሪዎች የተዘጋጁ ናቸው።", hymnsTitle: "የዝማሬ ጥናቶች", hymnsDesc: "የተለያዩ ወቅቶች እና በዓላት የኦርቶዶክስ ዝማሬዎችን ዜማ、 ግጥም እና መንፈሳዊ ጠቀሜታ ለመማር የኦንላይን ክፍለ ጊዜዎችን ይቀላቀሉ።", abinetTitle: "አብነት ትምህርት", abinetDesc: "ቀዳማዊ እና ጥልቅ በሆነው የቤተክርስቲያን ትምህርት ይሳተፉ። ይህ ክፍል እንደ ግእዝ、 ዜማ እና ቅኔ ላሉ መሰረታዊ ጥናቶች የተዘጋጀ ነው።", spiritualTitle: "መንፈሳዊ ትምህርቶች", spiritualDesc: "በአሳታፊ የቪዲዮ ተከታታዮች እና የቀጥታ ውይይቶች በኦርቶዶክስ እምነት、 ሥነ-መለኮት እና ትውፊት ላይ ያለዎትን ግንዛቤ ያሳድጉ።", generalTitle: "አጠቃላይ ትምህርቶች", generalDesc: "ከእምነት እና ከአጠቃላይ ህይወት አንጻር ለዘመናዊ ህይወት ተግባራዊ ክህሎቶችን ያዳብሩ።" },
    ar: { pageTitle: 'دورات عبر الإنترنت', pageDescription: 'استكشف الدورات عبر الإنترنت من مدرسة الأحد عماد الإيمان في جيما. نقدم دروسًا في الآلات الأرثوذكسية ، ودراسات الترانيم (زيما) ، وتعليم الأبينيت ، والتطور الروحي.', heroTitle: 'التعلم عبر الإنترنت', heroSubtitle: "مفتدين الوقت لأن الأيام شريرة (أفسس 5:16). وباستخدام التقدم التكنولوجي للعصر، نكرز بالمسيح مصلوبًا (1 كورنثوس 1:23).", tabAll: 'الكل', tabInstruments: 'الآلات', tabHymns: 'الترانيم', tabAbinet: 'أبينيت', tabSpiritual: 'روحي', tabGeneral: 'عام', ctaTitle: 'هل أنت مستعد لبدء رحلتك؟', ctaSubtitle: 'سجل اليوم للحصول على وصول إلى جميع قوائم تشغيل الفيديو والجلسات المباشرة.', ctaButton: 'إنشاء حساب', viewPlaylistButton: 'عرض الدورة', joinLiveButton: 'عرض الدورة', allTitle: "جميع الدورات", allDesc: "تصفح كتالوجنا الكامل للدورات في جميع الفئات.", instrumentsTitle: "الآلات الأرثوذكسية", instrumentsDesc: "تعلم العزف على الآلات المقدسة المستخدمة في العبادة الأرثوذكسية. دوراتنا تلبي جميع المستويات، من المبتدئين تمامًا إلى اللاعبين المتقدمين.", hymnsTitle: "دراسات الترانيم", hymnsDesc: "انضم إلى جلسات جماعية مباشرة لتعلم الألحان والكلمات والأهمية الروحية للترانيم الأرثوذكسية لمختلف المواسم والأعياد.", abinetTitle: "تعليم أبينيت", abinetDesc: "انخرط في تعليم كنسي تقليدي ومتعمق. هذا القسم مخصص للدراسات التأسيسية مثل الجعزية والزيما والقኔ (الشعر).", spiritualTitle: "دورات روحية", spiritualDesc: "عمّق فهمك للإيمان الأرثوذكسي واللاهوت والتقاليد من خلال سلاسل الفيديو الجذابة والمناقشات المباشرة.", generalTitle: "دورات عامة", generalDesc: "طور مهارات عملية للحياة العصرية، تُدرس من منظور الإيمان والرفاهية الشاملة." },
    es: { pageTitle: 'Clases y Aprendizaje en Línea', pageDescription: 'Explora los cursos en línea de la Escuela Dominical Amdehayimanot en Jimma. Ofrecemos clases de instrumentos ortodoxos, estudios de himnos (Zema), educación Abinet y desarrollo espiritual.', heroTitle: 'Aprendizaje en Línea', heroSubtitle: "Aprovechando bien el tiempo, porque los días son malos (Efesios 5:16). Usando el avance tecnológico de la era, predicamos a Cristo crucificado (1 Corintios 1:23).", tabAll: 'Todos', tabInstruments: 'Instrumentos', tabHymns: 'Himnos', tabAbinet: 'Abinet', tabSpiritual: 'Espiritual', tabGeneral: 'General', ctaTitle: '¿Listo para Comenzar tu Viaje?', ctaSubtitle: 'Regístrate hoy para obtener acceso a todas nuestras listas de reproducción de videos y sesiones en vivo.', ctaButton: 'Crear una Cuenta', viewPlaylistButton: 'Ver Curso', joinLiveButton: 'Ver Curso', allTitle: "Todos los Cursos", allDesc: "Navega por nuestro catálogo completo de cursos en todas las categorías.", instrumentsTitle: "Instrumentos Ortodoxos", instrumentsDesc: "Aprende a tocar instrumentos sagrados utilizados en el culto ortodoxo. Nuestros cursos se adaptan a todos los niveles, desde principiantes absolutos hasta músicos avanzados.", hymnsTitle: "Estudios de Himnos", hymnsDesc: "Únete a sesiones grupales en vivo para aprender las melodías, letras y significado espiritual de los himnos ortodoxos para diversas temporadas y festividades.", abinetTitle: "Educación Abinet", abinetDesc: "Participa en la educación eclesiástica tradicional y profunda. Esta sección está dedicada a estudios fundamentales como Ge'ez, Zema y Qine (Poesía).", spiritualTitle: "Cursos Espirituales", spiritualDesc: "Profundiza tu comprensión de la fe, la teología y la tradición ortodoxas a través de series de videos atractivas y discusiones en vivo.", generalTitle: "Cursos Generales", generalDesc: "Desarrolla habilidades prácticas para la vida moderna, enseñadas desde una perspectiva de fe y bienestar integral." },
    fr: { pageTitle: 'Cours et Apprentissage en Ligne', pageDescription: 'Découvrez les cours en ligne de l\'école du dimanche Amdehayimanot à Jimma. Nous proposons des cours sur les instruments orthodoxes, des études d\'hymnes (Zema), l\'éducation Abinet et le développement spirituel.', heroTitle: 'Apprentissage en Ligne', heroSubtitle: "Rachetez le temps, car les jours sont mauvais (Éphésiens 5:16). En utilisant les avancées technologiques de notre époque, nous prêchons le Christ crucifié (1 Corinthiens 1:23).", tabAll: 'Tous', tabInstruments: 'Instruments', tabHymns: 'Hymnes', tabAbinet: 'Abinet', tabSpiritual: 'Spirituel', tabGeneral: 'Général', ctaTitle: 'Prêt à Commencer Votre Voyage ?', ctaSubtitle: 'Inscrivez-vous aujourd\'hui pour accéder à toutes nos playlists vidéo et sessions en direct.', ctaButton: 'Créer un Compte', viewPlaylistButton: 'Voir le Cours', joinLiveButton: 'Voir le Cours', allTitle: "Tous les Cours", allDesc: "Parcourez notre catalogue complet de cours dans toutes les catégories.", instrumentsTitle: "Instruments Orthodoxes", instrumentsDesc: "Apprenez à jouer des instruments sacrés utilisés dans le culte orthodoxe. Nos cours s'adressent à tous les niveaux, des débutants absolus aux joueurs avancés.", hymnsTitle: "Études d'Hymnes", hymnsDesc: "Rejoignez des sessions de groupe en direct pour apprendre les mélodies, les paroles et la signification spirituelle des hymnes orthodoxes pour différentes saisons et fêtes.", abinetTitle: "Éducation Abinet", abinetDesc: "Participez à une éducation ecclésiastique traditionnelle et approfondie. Cette section est dédiée aux études fondamentales comme le Ge'ez, le Zema et le Qine (Poésie).", spiritualTitle: "Cours Spirituels", spiritualDesc: "Approfondissez votre compréhension de la foi, de la théologie et de la tradition orthodoxes grâce à des séries de vidéos captivantes et des discussions en direct.", generalTitle: "Cours Généraux", generalDesc: "Développez des compétences pratiques pour la vie moderne, enseignées dans une perspective de foi et de bien-être holistique." },
    ti: { pageTitle: 'ናይ ኦንላይን ክፍለ-ትምህርትን ትምህርትን', pageDescription: 'ናይ ኦንላይን ኮርሳት ካብ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ኣብ ጅማ ዳህሰሱ። ኣብ ኦርቶዶክሳዊ መሳርሒታት፡ መጽናዕቲ መዛሙር (ዜማ)፡ ትምህርቲ ኣብነትን መንፈሳዊ ምዕባለን ክፍለ-ትምህርቲ ንህብ።', heroTitle: 'ናይ ኦንላይን ትምህርቲ', heroSubtitle: "መዓልትታት ክፉኣት እየን እሞ፡ ንዘመንኩም ተዋጀውዎ (ኤፌ 5፡16)። ናይዚ ዘመን'ዚ ምዕባለ ቴክኖሎጂ ተጠቒምና፡ ንሕና ግና ነቲ እተሰቕለ ክርስቶስ ንሰብኽ (1 ቈረ 1፡23)።", tabAll: 'ኩሉ', tabInstruments: 'መ ఆధ్యా', tabHymns: 'መዛሙር', tabAbinet: 'ኣብነት', tabSpiritual: 'መንፈሳዊ', tabGeneral: 'ሓፈሻዊ', ctaTitle: 'ጉዕዞኹም ክትጅምሩ ድሉዋት ዲኹም?', ctaSubtitle: 'ንኹሉ ናይ ቪድዮታትናን ቀጥታዊ መደባትናን ንምርካብ ሎሚ ተመዝገቡ።', ctaButton: 'ኣካውንት ፍጠር', viewPlaylistButton: 'ነቲ ኮርስ ርኣይዎ', joinLiveButton: 'ነቲ ኮርስ ርኣይዎ', allTitle: "ኩሎም ኮርሳት", allDesc: "ናይ ኩሎም ኮርሳት ካታሎግና ኣብ ኩሉ ምድባት ርአ።", instrumentsTitle: "ናይ ኦርቶዶክስ መ ఆధ్యా", instrumentsDesc: "ኣብ ኣምልኾ ኦርቶዶክስ ዘገልግሉ ቅዱሳት መ ఆధ్యా ምውቃዕ ተማሃሩ። ኮርሳትና ንኹሉ ደረጃታት፡ ካብ ፍጹም ጀመርቲ ክሳብ ዕቡያት ተጻወትቲ የገልግል።", hymnsTitle: "ናይ መዝሙር መጽናዕትታት", hymnsDesc: "ዜማታት፡ ቃላትን መንፈሳዊ ትርጉምን ናይ ኦርቶዶክሳዊ መዛሙር ንፈላለዩ እዋናትን በዓላትን ንምምሃር፡ ቀጥታዊ ጉጅለኣዊ ክፍለ-ጊዜታት ተጸንበሩ።", abinetTitle: "ትምህርቲ ኣብነት", abinetDesc: "ኣብ ባህላዊ፡ ዓሚቝ ትምህርቲ ቤተ-ክርስትያን ተሳተፉ። እዚ ክፍሊ'ዚ ንመሰረታዊ መጽናዕትታት ከም ግእዝ፡ ዜማን ቅኔን (ግጥሚ) ዝተወፈየ እዩ።", spiritualTitle: "መንፈሳዊ ኮርሳት", spiritualDesc: "ብመንገዲ ኣሳታፊ ተኸታታሊ ቪድዮታትን ቀጥታዊ ምይይጣትን፡ ንርድኢትኩም ኣብ እምነት ኦርቶዶክስ፡ ስነ-መለኮትን ትውፊትን ኣዕምቑ።", generalTitle: "ሓፈሻዊ ኮርሳት", generalDesc: "ንዘመናዊ ህይወት ተግባራዊ ክእለት ኣማዕብሉ፡ ካብ ኣረኣእያ እምነትን ምሉእ-ህይወታዊ ድሕንነትን ዝተማህረ።" },
    om: { pageTitle: 'Barnoota Tooraan', pageDescription: 'Koorsiiwwan tooraan kan Mana Barumsaa Dilbataa Amdehayimanot Jimmaa irraa qophaa\'an ilaalaa. Barnoota meezeroota Ortoodoksii, qo\'annoo faarfannaa (Zeemaa), barnoota Abineet, fi guddina hafuuraa irratti ni kennina.', heroTitle: 'Barnoota Tooraan', heroSubtitle: "Bara hamaadhaaf, yeroo keessan bitadhaa (Efe 5:16). Guddina teeknooloojii bara kanaa fayyadamuudhaan, nuti Kiristoos isa fannifame lallabna (1 Qor 1:23).", tabAll: 'Hunda', tabInstruments: 'Meezeroota', tabHymns: 'Faarfannaa', tabAbinet: 'Abineet', tabSpiritual: 'Hafuuraa', tabGeneral: 'Waliigalaa', ctaTitle: 'Imala Keessan Jalqabuuf Qophii Dha?', ctaSubtitle: 'Tarree vidiyoo keenyaa fi tamsaasa kallattii argachuuf har\'a galmaa\'aa.', ctaButton: 'Akkaawuntii Uumi', viewPlaylistButton: 'Koorsii Ilaali', joinLiveButton: 'Koorsii Ilaali', allTitle: "Koorsiiwwan Hunda", allDesc: "Katalogii koorsiiwwan keenya guutuu ramaddii hundaan ilaalaa.", instrumentsTitle: "Meezeroota Ortoodoksii", instrumentsDesc: "Waaqeffannaa Ortoodoksii keessatti kan fayyadan meezeroota qulqulluu taphachuu baradhaa. Koorsiin keenya sadarkaa hundumaaf, jalqabaa irraa hanga sadarkaa olaanaatti kan qophaa'edha.", hymnsTitle: "Qo'annoo Faarfannaa", hymnsDesc: "Yeedaloo, walaloo, fi hiika hafuuraa faarfannaawwan Ortoodoksii yeroo fi ayyaanota adda addaaf barachuuf sagantaa garee kallattiin hirmaadhaa.", abinetTitle: "Barnoota Abineet", abinetDesc: "Barnoota amantii aadaa fi gad-fageenyaa qabu hirmaadhaa. Kutaan kun qo'annoowwan bu'uuraa kan akka Gi'izii, Zeemaa, fi Qinee (Wallee) irratti xiyyeeffata.", spiritualTitle: "Koorsiiwwan Hafuuraa", spiritualDesc: "Hubannoo keessan amantii, ti'ooloojii, fi aadaa Ortoodoksii irratti tarree vidiyoo fi marii kallattiiwwan nama hirmaachisaniin gadi fageessaa.", generalTitle: "Koorsiiwwan Waliigalaa", generalDesc: "Jireenya ammayyaatiif dandeettiiwwan hojiirra oolan, ilaalcha amantii fi fayyabulummaa guutuurraa kan barsiifaman guddifadhaa." },
    ge: { pageTitle: 'ትምህርት በመስመር', pageDescription: 'ኮርሳት በመስመር እምቤት ትምህርት ሰንበት ዓምደሃይማኖት በጅማ ርአዩ። ንሕነ ንመሀር በመሳርያተ ኦርቶዶክስ፣ መጽናዕተ መዝሙራት (ዜማ)፣ ትምህርተ አብነት፣ ወመንፈሳዊ ዕቤት።', heroTitle: 'ትምህርት በመስመር', heroSubtitle: "መዋዕል ክፉአን እሙንቱ፡ ተዋጀውዎ ለጊዜክሙ (ኤፌ 5፡16)። በምዕባለ ቴክኖሎጂ ዘዝየ፣ ንሕነሰ ንሰብክ ክርስቶስሃ ዘተሰቅለ (1 ቆሮ 1፡23)።", tabAll: 'ኵሉ', tabInstruments: 'መሳርያ', tabHymns: 'መዝሙራት', tabAbinet: 'አብነት', tabSpiritual: 'መንፈሳዊ', tabGeneral: 'ኵለንታዌ', ctaTitle: 'ለአጀማመር ጉዞክሙ ድልዋን አንትሙ?', ctaSubtitle: 'ለመሳካት ኵሎ ታክሲሳተ ቪድዮ ወቀጥታ ስርጭታት፣ ተመዝገቡ ዮም።', ctaButton: 'ፍጠር መለያ', viewPlaylistButton: 'ርአይ ኮርስ', joinLiveButton: 'ርአይ ኮርስ', allTitle: "ኵሎም ኮርሳት", allDesc: "ካታሎግነ ኵሎ ኮርሳት በኵሉ ምድባት ርአ።", instrumentsTitle: "መሳርያተ ኦርቶዶክስ", instrumentsDesc: "ተመሀሩ መውቃዕተ ቅዱሳት መሳርያት ውስተ አምልኮተ ኦርቶዶክስ። ኮርሳትነ ለኵሉ ደረጃት፣ እምጀማሪ እስከ ልሂቅ ተጫዋች ያገለግላሉ።", hymnsTitle: "መጽናዕተ መዝሙራት", hymnsDesc: "ተጸንበሩ ቀጥታ ጉባኤያት ለትምህርተ ዜማ፣ ቃላት፣ ወመንፈሳዊ ትርጉመ መዝሙራተ ኦርቶዶክስ ለልዩ ልዩ ጊዜያት ወበዓላት።", abinetTitle: "ትምህርተ አብነት", abinetDesc: "ተሳተፉ በባህላዊ፣ ዓሚቅ ትምህርተ ቤተ ክርስቲያን። ዝ ክፍሊ ለትንሣኤ መጽናዕት ከም ግእዝ፣ ዜማ፣ ወቅኔ (ግጥሚ) ተወፈየ።", spiritualTitle: "መንፈሳዊ ኮርሳት", spiritualDesc: "አዕምቁ ርድኢተክሙ በእምነተ ኦርቶዶክስ፣ ሥነ-መለኮት፣ ወትውፊት በታክሲሳተ ቪድዮ ወቀጥታ ምይይጣት።", generalTitle: "ኵለንታዌ ኮርሳት", generalDesc: "አማዕብሉ ተግባራዊ ክህሎታት ለዘመናዊ ሕይወት፣ እምነጽረ እምነት ወምሉእ-ሕይወታዊ ድኅነት ዘተማህረ።" }
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (<div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>{value === index && (<Box sx={{ pt: 3 }}>{children}</Box>)}</div>);
}

const CourseCard = ({ course, t }) => (
    <Grid item xs={12} sm={6} md={4}>
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <OrthCard>
        <CardMedia component="img" height="180" image={course.image_url ? `${API_ROOT_URL}${course.image_url}` : defaultCourseImg} alt={course.title} />
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Chip label={course.category} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
            <Box display="flex" alignItems="center">
              <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>{course.instructor_name ? course.instructor_name.charAt(0) : 'T'}</Avatar>
              <Typography variant="caption" color="text.secondary">{course.instructor_name || 'Instructor'}</Typography>
            </Box>
          </Box>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>{course.title}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>{course.description}</Typography>
        </CardContent>
        <CardActions sx={{ p: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.action.hover }}>
          <Button component={Link} to={`/classes/course/${course.id}`} fullWidth variant="contained" color={course.course_type === 'PLAYLIST' ? 'secondary' : 'primary'}>{course.course_type === 'PLAYLIST' ? t.viewPlaylistButton : t.joinLiveButton}</Button>
        </CardActions>
      </OrthCard>
    </motion.div>
  </Grid>
);

const ClassesPage = ({ language = 'en' }) => {
  const [tabValue, setTabValue] = useState(0);
  const t = translations[language] || translations.en;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
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
      all: { title: t.allTitle, description: t.allDesc, courses: courses },
      instruments: { title: t.instrumentsTitle, description: t.instrumentsDesc, courses: groupedCourses.instruments || [] },
      hymns: { title: t.hymnsTitle, description: t.hymnsDesc, courses: groupedCourses.hymns || [] },
      abinet: { title: t.abinetTitle, description: t.abinetDesc, courses: groupedCourses.abinet || [] },
      spiritual: { title: t.spiritualTitle, description: t.spiritualDesc, courses: groupedCourses.spiritual || [] },
      general: { title: t.generalTitle, description: t.generalDesc, courses: groupedCourses.general || [] },
    };
  }, [courses, t]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const sections = [ { label: t.tabAll, icon: <AppsIcon />, data: platformData.all }, { label: t.tabInstruments, icon: <MusicNoteIcon />, data: platformData.instruments }, { label: t.tabHymns, icon: <LibraryMusicIcon />, data: platformData.hymns }, { label: t.tabAbinet, icon: <MenuBookIcon />, data: platformData.abinet }, { label: t.tabSpiritual, icon: <SelfImprovementIcon />, data: platformData.spiritual }, { label: t.tabGeneral, icon: <SchoolIcon />, data: platformData.general } ];

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{t.pageTitle} | Amdehaymanot Sunday School</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>
      <PageHero
        backgroundImage={platformHero}
        brandName={t.heroTitle}
        headline={t.heroSubtitle}
        minHeight="65vh"
      />
      <PageSection>
      <Container maxWidth="lg">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile textColor="primary" indicatorColor="primary">
              {sections.map((sec, index) => ( <Tab key={index} icon={sec.icon} iconPosition="start" label={sec.label} id={`tab-${index}`} /> ))}
            </Tabs>
          </Box>
          {loading ? ( <Box display="flex" justifyContent="center" sx={{ minHeight: '300px' }}><CircularProgress size={60} /></Box> ) : (
            sections.map((sec, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                  <SectionHeader title={sec.data.title} subtitle={sec.data.description} animated={false} />
                </Box>
                <Grid container spacing={4}>
                    {sec.data.courses.length > 0 ? (
                      sec.data.courses.map(course => <CourseCard key={course.id} course={course} t={t} />)
                    ) : (
                      <Typography sx={{ width: '100%', textAlign: 'center', mt: 4 }}>Courses for this category will be available soon.</Typography>
                    )}
                </Grid>
              </TabPanel>
            ))
          )}
        </Box>
        <Paper elevation={0} sx={{ mt: 8, p: { xs: 3, sm: 5 }, textAlign: 'center', borderRadius: 4, background: `linear-gradient(135deg, ${brand.navy}, ${brand.navyDark})`, color: 'white' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '2.5rem' } }}>{t.ctaTitle}</Typography>
            <Typography sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>{t.ctaSubtitle}</Typography>
            <Button variant="contained" color="secondary" size="large" component={Link} to="/register" sx={{ borderRadius: 50, px: 5, py: 1.5 }}>{t.ctaButton}</Button>
          </motion.div>
        </Paper>
      </Container>
      </PageSection>
    </>
  );
};

export default ClassesPage;