import React, { useState, useEffect } from 'react';
import { parseISO, isFuture } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Button, Container,
} from '@mui/material';
import { alpha } from '@mui/system';
import SEO from '../components/layout/SEO';

import api from '../api/axiosConfig';
import {
  HomeHero, PageSection, SectionHeader, GoldDivider,
  SpiritualServices, LivingGeneration, AnnouncementsBand,
  AppPromoBand,
} from '../components/ui';
import { brand } from '../brand';
import { localizePosts } from '../utils/localizePost';
import { localizeEvents } from '../utils/localizeEvent';
import { PLAY_STORE_URL } from '../config/links';

import heroImage from '../assets/hero-image.jpg';
import bibleStudy from '../assets/classes-hero.jpg';
import community from '../assets/community.jpg';
import teacherWithKids from '../assets/teacher-with-kids.jpg';
import mediaServicesImage from '../assets/media service.jpg';
import crestLogo from '../assets/logo.png';
import heroPortrait from '../assets/hero-portrait.png';

import {
  Book, Groups, MusicNote, LocalLibrary, CameraAlt,
} from '@mui/icons-material';

const brandTitles = {
  en: 'Amde Haymanot',
  am: 'ዓምደ ሃይማኖት',
  om: 'Amde Haayimaanot',
  ti: 'ዓምደ ሃይማኖት',
  ge: 'ዓምደ ሃይማኖት',
  es: 'Amde Haymanot',
  fr: 'Amdehaymanot',
  ar: 'عمود الإيمان',
};

const brandTaglines = {
  en: 'Sunday School',
  am: 'ሰንበት ትምህርት ቤት',
  om: 'Mana Barumsaa Dilbataa',
  ti: 'ቤት ትምህርቲ ሰንበት',
  ge: 'ቤተ ትምህርት ሰንበት',
  es: 'Escuela Dominical',
  fr: 'École du Dimanche',
  ar: 'مدرسة الأحد',
};


const translations = {
  en: {
    "pageTitle": "Column Religion Sunday School Spiritual education at Jima",
    "pageDescription": "Jim's Pillar Religion Sunday School Official Website. We offer Orthodox Tewahedo lessons, singing lessons and spiritual guidance for youth and children. Find out about our latest news and events.",
    "heroChip": "Acts 6:4",
    "headline": "If you are worried about the appearance of the church tomorrow, keep the Sunday school service in your heart today.",
    "heroQuoteAuthor": "Abune Gregory Kal",
    "heroQuoteRole": "Archbishop",
    "subheadline": "Go therefore and make disciples of all nations, baptizing them in the name of the Father, the Son, and the Holy Spirit, and teaching them to observe all that I have commanded you. And behold, I am with you always until the end of the world. Matthew 28:19",
    "enrollNow": "Register now",
    "learnMore": "Click to know more",
    "corePillars": "Our Spiritual Services",
    "pillarsSub": "Services provided by our Sunday school",
    "faithFormation": "Orthodox teachings",
    "faithDesc": "We are teaching the new curriculum (Church System, Christian Ethics, Scripture Study, Fundamental Religion and Church History) from pre-school (KG) to 12th grade that was issued by the Archdiocese to be implemented in all Sunday schools nationwide. You will also receive orthodox training from our Sunday school, which will teach you how to deal with your life situation, responsibilities and current challenges and issues in a Christian life.\n\n📚 Support bot for students\nIn our Telegram site, you can easily access national level syllabus and reference books in PDF format and more than 100 test questions with their answers.",
    "botLinkText": "Open the Telegram bot",
    "christianCommunity": "Hymnody Lessons",
    "communityDesc": "We teach daily hymns, short Wereb hymns, poetic hymns, and Yaredic Wereb, along with traditional Shibsheba and Kebero lessons that preserve our Church's heritage.\n\n📱 Press the Download button to get the mobile app with over 2,400 Orthodox hymn lyrics and audio of our Lord, the saints, daily services, and feast days.",
    "religiousEducation": "Orthodox musical instrument training",
    "educationDesc": "We offer harp, clarinet and masinko musical instrument lessons from Monday to Saturday by our experienced teachers.\n\nSession Hours:\n\n• Morning: 12:00 - 2:30\n• Night: 10:00 - 1:30 pm\n• Call 0946251312 for more information.",
    "libraryService": "Library service",
    "libraryDesc": "Our Sunday school library located in the grounds of the Cathedral of the Holy Virgin Mary in Mount Ephrata; He compiled and maintained an extensive collection of theological, ecclesiastical, and devotional books. In our library, you will find the writings and essays of saints, spiritual novels, contemporary translation works, as well as deep interpretation books from early church scholars. In addition, we have provided various service and song books in print (hard copy) and digital (soft copy) form.\n\nService Days and Hours:\n\n• Hours of Operation: Sunday to Sunday (Closed on Thursday)\n• Morning session: 2:30 - 6:00\n• Afternoon session: 8:00 am - 1:00 pm\n• Call 0934426846 for more information.",
    "whyChooseUs": "What will you get if you come with us?",
    "whyChooseSub": "The foundation of faith, community and happiness",
    "ourCommitment": "With the help of God's Holy Spirit",
    "commitmentText": "We stand hard to make young people and children grow up in faith, develop strong moral values, believable, active, intelligent and influential Christians.",
    "yearsService": "Years of service",
    "activeStudents": "Active students",
    "dedicatedTeachers": "Dedicated teachers",
    "buildingFaith": "Building a living generation",
    "historyText": "Since 1964, the Orthodox Sunday School has been a beacon of spiritual growth. What started as a small group has grown into an active ministry serving hundreds of children, guiding them for life and helping them build a living relationship with Christ.",
    "quote": "\"We don't just teach Bible stories - we help people build a living relationship with Christ.\"",
    "mediaServices": "Media services",
    "mediaText": "Keep your sacred time forever. Our media team offers professional photo and video packages for all special events, creating high-quality memories that will last a lifetime.",
    "mediaContact": "Call 0903896637 for more information.",
    "baptisms": "Baptism and Christianity",
    "weddings": "Mediation and marriage",
    "specialOccasions": "Various events",
    "bookConsultation": "Contact us",
    "testimonialsNote": "From the mouth of the priest",
    "joinFamily": "Join our family",
    "joinText": "Let's serve God together",
    "registerToday": "Register today",
    "announcementsTitle": "Current announcements",
    "announcementsSub": "Check out our latest news and upcoming Sunday School events here.",
    "latestNews": "Latest news",
    "upcomingEvents": "upcoming events",
    "noNews": "No recent news. Please come back later.",
    "noEvents": "No upcoming events booked. Wait!",
    "viewAll": "See all news and events",
    "promoTitle": "Get the Amdehayimanot Zimare App!",
    "promoSubtitle": "Over 2,400 Orthodox hymn lyrics and audio of our Lord, the saints, daily services, and feast days—on your phone.",
    "promoEyebrow": "Now on Google Play",
    "promoFeature1": "2,400+ Orthodox hymns with lyrics and audio",
    "promoFeature2": "Daily, feast, Lord, and saints’ hymns",
    "promoButton": "Download",
    "testimonials": [
        {
            "quote": "If you are worried about the appearance of the church tomorrow, keep the Sunday school service in your heart today.",
            "author": "Abune Gregory Kal",
            "role": "Archbishop"
        },
        {
            "quote": "A church without youth has no future. A youth without a church has no future",
            "author": "Abune Shinoda Salsawi",
            "role": "Patriarch of Egypt"
        },
        {
            "quote": "Guide a child in the way he should go, and he will not turn aside from it when he is old.",
            "author": "Proverbs 22:6",
            "role": "The wise Solomon"
        },
        {
            "quote": "Be careful to read and advise and teach until I come.",
            "author": "1 Tim 4:13",
            "role": "Saint Paul"
        },
        {
            "quote": "Teach it to your children, play it when you sit in your house, when you walk on the road, when you sleep, and when you get up.",
            "author": "Deuteronomy 6:7",
            "role": "Prophet Moses"
        }
    ]
},
  om: {
    "pageTitle": "Utubaa Amantii Mana Barumsaa Sanbataa Barnoota afuuraa Jimaatti",
    "pageDescription": "Marsariitii Ofiisaa Mana Barumsaa Sanbataa Amantii Utubaa Jimmaa. Dargaggootaa fi daa'immaniif barnoota Ortodoksii Tewaahidoo, barnoota sirbaa fi qajeelfama hafuuraa ni dhiheessina. Waa'ee oduu fi taateewwan keenya haaraa baradhaa.",
    "heroChip": "Hojii Ergamootaa 6:4",
    "headline": "Boru mul'achuu mana kiristaanaa yoo isin yaaddesse har'a tajaajila mana barumsaa Sanbataa garaa keessan keessa kaa'aa.",
    "heroQuoteAuthor": "Abune Giriigooriyoos Kal",
    "heroQuoteRole": "Archbishop",
    "subheadline": "Kanaaf dhaqaatii maqaa Abbaa, Ilmaa fi Hafuura Qulqulluutiin cuuphaatii, waanan isin abboome hundumaa akka eegan barsiisaa, saba hundumaa duuka buutota godhaa. Kunoo, ani hamma dhuma biyya lafaatti yeroo hundumaa isin wajjin jira. Maatewos 28:19",
    "enrollNow": "Amma galmaa'aa",
    "learnMore": "Dabalata baruuf cuqaasaa",
    "corePillars": "Tajaajila hafuuraa keenya",
    "pillarsSub": "Tajaajila mana barumsaa Sanbataa keenyaan kennamu",
    "faithFormation": "Barumsa Ortodoksii",
    "faithDesc": "Kaarikulamii haaraa (Sirna Waldaa, Naamusa Kiristaanummaa, Qo’annoo Caaffata Qulqullaa’oo, Amantii Bu’uuraa fi Seenaa Waldaa) mana barumsaa duraa (KG) irraa kaasee hanga kutaa 12ffaatti kan Archdiocese baase akka guutuu biyyattiitti manneen barnootaa Sanbataa hunda keessatti hojiirra akka oolu barsiisaa jirra. Akkasumas mana barumsaa Sanbataa keenya irraa leenjii ortodoksii ni argattu, kunis haala jireenya kee, itti gaafatamummaa fi qormaata fi dhimmoota yeroo ammaa jireenya kiristaanaa keessatti akkamitti akka ilaaltu si barsiisa.\n\n📚 Deeggarsa bot barattootaaf\nMarsariitii Telegram keenya keessatti silabasii sadarkaa biyyaatti fi kitaabota wabii bifa PDF fi gaaffilee qormaataa 100 ol ta’an deebii isaanii waliin salphaatti argachuu dandeessu.",
    "botLinkText": "Telegram bot jedhu banaa",
    "christianCommunity": "Barnoota Faarfannaa",
    "communityDesc": "Faarfannaa guyyaa guyyaa, wereb gabaabaa, faarfannaa walaloo, fi Yaared wereb barsiifna; akkasumas aadaa mana kiristaanaa keenya eegu Shibshebaa fi Kebero qo'annoo ni kennina.\n\n📱 Appilikeeshinii mobaayilaa kan faarfannaa Ortodoksii 2,400 ol — walaloo fi sagalee Gooftaa keenyaa, qulqullootaa, faarfannaa guyyaa guyyaa fi ayyaanaa of keessaa qabu — buufachuuf qabduu Download cuqaasi.",
    "religiousEducation": "Leenjii meeshaa muuziqaa Ortodoksii",
    "educationDesc": "Barnoota meeshaa muuziqaa harp, clarinet fi masinko Wiixata hanga Sanbata Duraatti barsiisota keenya muuxannoo qabaniin ni kennina.\n\nSa'aatii Walgahii:\n\n• Ganama: sa'aatii 12:00 - 2:30\n• Halkan: Sa'aatii 10:00 - 1:30 pm\n• Odeeffannoo dabalataaf 0946251312 bilbilaa.",
    "libraryService": "Tajaajila mana kitaabaa",
    "libraryDesc": "Manni kitaabaa mana barumsaa Sanbataa keenyaa kan mooraa Kaatediraala Qulqulleettii Dubroo Maariyaam gaara Efraataa keessatti argamu; Kitaabota ti’ooloojii, mana kiristaanaa fi waaqeffannaa bal’aa walitti qabee kunuunseera. Mana kitaabaa keenya keessatti, barreeffamootaa fi barreeffamoota qulqullootaa, asoosama hafuuraa, hojiiwwan hiikkaa yeroo ammaa, akkasumas kitaabota hiikkaa gadi fagoo hayyoota waldaa jalqabaa irraa ni argattu. Kana malees, tajaajila adda addaa fi kitaabota sirbaa bifa maxxansaa (hard copy) fi dijiitaala (soft copy) tiin dhiheessinee jirra.\n\nGuyyoota Tajaajilaa fi Sa’aatii:\n\n• Sa’aatii Hojii: Dilbata hanga Dilbataatti (Kamisa cufama) .\n• Kutaa ganama: sa'aatii 2:30 - 6:00\n• Kutaa waaree booda: ganama sa'aatii 8:00 - galgala sa'aatii 1:00\n• Odeeffannoo dabalataaf 0934426846 bilbilaa.",
    "whyChooseUs": "Yoo nu waliin dhufte maal argatta?",
    "whyChooseSub": "Bu'uura amantii, hawaasaa fi gammachuu",
    "ourCommitment": "Gargaarsa Hafuura Qulqulluu Waaqayyootiin",
    "commitmentText": "Dargaggoonni fi daa’imman amantiidhaan akka guddatan, gatii naamusaa cimaa akka horatan, kiristaana amansiisaa, sochii, sammuu fi dhiibbaa uumuu danda’an gochuuf cimnee dhaabbanna.",
    "yearsService": "Waggoota tajaajila",
    "activeStudents": "Barattoota sochii qaban",
    "dedicatedTeachers": "Barsiisota of kennanii hojjetan",
    "buildingFaith": "Dhaloota lubbuu qabu ijaaruu",
    "historyText": "Bara 1964 irraa eegalee Manni Barumsaa Sanbataa Ortodoksii ibsaa guddina hafuuraa ta’ee jira. Wanti akka garee xiqqaatti jalqabe gara tajaajila cimaatti guddateera ijoollee dhibbaan lakkaa’aman tajaajilu, jireenyaaf isaan qajeelchuu fi Kiristoosiin hariiroo jiraataa akka ijaaran isaan gargaaru.",
    "quote": "\"Seenaa Macaafa Qulqulluu qofa hin barsiifnu - namoonni Kiristoosii wajjin hariiroo jiraataa akka ijaaran gargaarra.\"",
    "mediaServices": "Tajaajila miidiyaa",
    "mediaText": "Yeroo qulqulluu kee bara baraan eegi. Gareen miidiyaa keenyaa taateewwan addaa hundaaf paakeejii suuraa fi viidiyoo ogeessaa kan dhiyeessu yoo ta'u, yaadannoo qulqullina olaanaa qabu kan umurii guutuu turu uuma.",
    "mediaContact": "Odeeffannoo dabalataaf 0903896637 bilbilaa.",
    "baptisms": "Cuuphaa fi Kiristaanummaa",
    "weddings": "Jidduu seenummaa fi fuudhaa fi heeruma",
    "specialOccasions": "Taateewwan adda addaa",
    "bookConsultation": "Nu qunnamaa",
    "testimonialsNote": "Afaan luba irraa",
    "joinFamily": "Maatii keenya waliin ta'aa",
    "joinText": "Waaqa waliin haa tajaajillu",
    "registerToday": "Har'a galmaa'aa",
    "announcementsTitle": "Beeksisa yeroo ammaa",
    "announcementsSub": "Oduu keenya haaraa fi taateewwan Mana Barumsaa Sanbataa dhufan as ilaalaa.",
    "latestNews": "Oduu haaraa",
    "upcomingEvents": "taateewwan dhufan",
    "noNews": "Oduu dhiheenya kanaa hin jiru. Mee booda deebi'aa.",
    "noEvents": "Taateewwan dhufan tokkollee hin buufamne. Eegi!",
    "viewAll": "Oduu fi taateewwan hunda ilaalaa",
    "promoTitle": "Appilikeeshinii Amdehayimanot Zimare Instool Godhaa!",
    "promoSubtitle": "Faarfannaa Ortodoksii 2,400 ol — walaloo fi sagalee Gooftaa, qulqullootaa, guyyaa guyyaa fi ayyaanaa — mobaayila keessan irratti.",
    "promoEyebrow": "Amma Google Play irratti",
    "promoFeature1": "Faarfannaa 2,400+ walaloo fi sagalee waliin",
    "promoFeature2": "Gooftaa, qulqullootaa, guyyaa guyyaa fi ayyaana",
    "promoButton": "Buusi",
    "testimonials": [
        {
            "quote": "Boru mul'achuu mana kiristaanaa yoo isin yaaddesse har'a tajaajila mana barumsaa Sanbataa garaa keessan keessa kaa'aa.",
            "author": "Abune Giriigooriyoos Kal",
            "role": "Archbishop"
        },
        {
            "quote": "Waldaan qeerroo hin qabne egeree hin qabdu. Dargaggeessi waldaa hin qabne egeree hin qabu",
            "author": "Abune Shinoodaa Salsaawii",
            "role": "Paatriyaarkii Gibxii"
        },
        {
            "quote": "Mucaa karaa irra deemuu qabu qajeelchi, gaafa dulloome irraa hin garagalu.",
            "author": "Fakkeenya 22:6",
            "role": "Ogeessa Solomoon"
        },
        {
            "quote": "Hangan dhufutti dubbisuu fi gorsuu fi barsiisuu irraa of eeggadhaa.",
            "author": "1Xim 4:13",
            "role": "Qulqulluu Phaawuloos"
        },
        {
            "quote": "Ijoollee keessan barsiisaa, yeroo mana keessan teesse, yeroo karaa irra deemtan, yeroo raftan, yeroo kaatan taphadhaa.",
            "author": "Keessa Deebii 6:7",
            "role": "Nabi Muusaa"
        }
    ]
},
  ti: {
    "pageTitle": "ዓምዲ ሃይማኖት ቤት ትምህርቲ ሰንበት መንፈሳዊ ትምህርቲ ኣብ ጂማ",
    "pageDescription": "ጂምስ ዓንዲ ሃይማኖት ቤት ትምህርቲ ሰንበት ወግዓዊ መርበብ ሓበሬታ። ትምህርቲ ኦርቶዶክስ ተዋህዶ፡ ትምህርቲ ደርፍን መንፈሳዊ መምርሕን ንመንእሰያትን ህጻናትን ነቕርብ። ብዛዕባ እዋናዊ ዜናናን ፍጻሜታትናን ፍለጥ።",
    "heroChip": "ግብሪ ሃዋርያት 6፡4",
    "headline": "ጽባሕ ብዛዕባ መልክዕ ቤተ ክርስቲያን ትጭነቕ እንተ ዄንካ ሎሚ ኣገልግሎት ትምህርቲ ሰንበት ኣብ ልብኻ ሓዝ።",
    "heroQuoteAuthor": "ኣቡነ ጎርጎርዮስ ካል",
    "heroQuoteRole": "ሊቀ ጳጳስ",
    "subheadline": "እምበኣርከስ ኪዱ ንዅሎም ኣህዛብ ደቀ መዛሙርቲ ግበሩ፣ ብስም ኣብን ወድን መንፈስ ቅዱስን ኣጥሚቕኩም፣ ነቲ ዝኣዘዝኩኹም ዅሉ ኺሕልዉ ድማ ምሃርዎም። እንሆ ድማ ክሳዕ መወዳእታ ዓለም ወትሩ ምሳኻትኩም እየ። ማቴ 28፡19",
    "enrollNow": "ሕጂ ተመዝገቡ።",
    "learnMore": "ንዝያዳ ሓበሬታ ኣብዚ ጠውቑ",
    "corePillars": "መንፈሳዊ ኣገልግሎትና",
    "pillarsSub": "ብቤት ትምህርቲ ሰንበትና ዝወሃብ ኣገልግሎት",
    "faithFormation": "ናይ ኦርቶዶክሳዊ ትምህርቲ",
    "faithDesc": "ብሊቀ ጳጳሳት ዝወጸ ሓድሽ ስርዓተ ትምህርቲ (ስርዓት ቤተ ክርስቲያን፣ ክርስትያናዊ ስነ ምግባር፣ መጽናዕቲ ቅዱሳት መጻሕፍቲ፣ መሰረታዊ ሃይማኖትን ታሪኽ ቤተ ክርስቲያንን) ካብ ቅድመ ትምህርቲ (KG) ክሳብ 12 ክፍሊ ብሊቀ ጳጳሳት ኣብ መላእ ሃገር ኣብ ኩለን ኣብያተ ትምህርቲ ሰንበት ተግባራዊ ክኸውን ንመሃር ኣለና። ከምኡ’ውን ካብ ቤት ትምህርቲ ሰንበትና ኦርቶዶክሳዊ ስልጠና ክትወስዱ ኢኹም፡ እዚ ድማ ኣብ ክርስትያናዊ ሕይወት ንኹነታት ህይወትኩምን ሓላፍነትኩምን እዋናዊ ብድሆታትን ጉዳያትን ብኸመይ ከም እትገጥሙ ዝምህረኩም እዩ።\n\n📚 ንተማሃሮ ዝኸውን ናይ ደገፍ ቦት።\nኣብ መርበብ ሓበሬታና ቴሌግራም ብደረጃ ሃገር ዝቐርቡ ሲለባስን መወከሲ መጻሕፍትን ብመልክዕ PDFን ልዕሊ 100 ናይ ፈተና ሕቶታትን ምስ መልሶም ብቐሊሉ ክትረኽብዎ ትኽእሉ ኢኹም።",
    "botLinkText": "ቴሌግራም ቦት ክፈት",
    "christianCommunity": "ትምህርቲ ዝማሬ",
    "communityDesc": "ናይ ዕለት ዘወትር ዝማሬታት፡ ሓጻር ወረብ፡ ግጥማዊ ዝማሬታትን ያሬዳዊ ወረብን ነምህር፡ ከምኡ’ውን ትውፊት ቤተ ክርስቲያንና ዝሓለወ ትምህርቲ ሽብሸባን ከበሮን ነቕርብ።\n\n📱 ልዕሊ 2,400 ናይ ጐይታና፡ ቅዱሳን፡ ዘወትርን በዓላትን ኦርቶዶክሳዊ ዝማሬ ግጥምን ኦዲዮን ዝሓዘ ናይ ሞባይል መተግበሪ ንምውራድ ንቁልፊ Download ጠውቑ።",
    "religiousEducation": "ስልጠና መሳርሒ ሙዚቃ ኦርቶዶክሳዊ",
    "educationDesc": "ካብ ሰኑይ ክሳብ ቀዳም ብሙኩራት መምህራንና ትምህርቲ በገና፣ ክላሪኔትን ማሲንኮን መሳርሒ ሙዚቃ ነቕርብ።\n\nሰዓታት ክፍለ ግዜ፤\n\n• ንግሆ፡ ካብ ሰዓት 12፡00 - 2፡30\n• ለይቲ፡ ካብ ሰዓት 10፡00 - 1፡30 ድሕሪ ቀትሪ\n• ንዝያዳ ሓበሬታ ብ 0946251312 ደውሉ።",
    "libraryService": "ኣገልግሎት ቤተ መጻሕፍቲ",
    "libraryDesc": "ኣብ ደብረ ኤፍራታ ኣብ ቀጽሪ ካቴድራል ቅድስት ድንግል ማርያም ዝርከብ ቤተ መጻሕፍቲ ቤት ትምህርቲ ሰንበትና፤ ሰፊሕ እኽብካብ ስነ-መለኮታውን ቤተ ክርስቲያናውን ውፉይነትን መጻሕፍቲ ኣዳልዩን ዓቂቡን እዩ። ኣብ ቤተ-መጻሕፍትና፡ ጽሑፋትን ድርሰታትን ቅዱሳን፡ መንፈሳዊ ልብ-ወለድ፡ እዋናዊ ስርሓት ትርጉም፡ ከምኡ’ውን ካብ ቀዳሞት ሊቃውንቲ ቤተ-ክርስቲያን ዝመጹ ዓሚቝ ትርጉም መጻሕፍቲ ክትረኽቡ ኢኹም። ካብዚ ብተወሳኺ ዝተፈላለዩ ናይ ኣገልግሎትን ደርፍ መፃሕፍትን ብሕትመት (ሃርድ ኮፒ) ከምኡ እውን ብዲጂታል (ሶፍት ኮፒ) መልክዕ ኣቕሪብና ኣለና።\n\nናይ ኣገልግሎት መዓልታትን ሰዓታትን፤\n\n• ሰዓታት ስራሕ፡ ካብ ሰንበት ክሳብ ሰንበት (ሓሙስ ዕጹው)\n• ናይ ንግሆ መደብ፡ ካብ ሰዓት 2፡30 - 6፡00\n• ናይ ድሕሪ ቀትሪ መደብ፡ ካብ ሰዓት 8፡00 ንግሆ - 1፡00 ድሕሪ ቀትሪ\n• ንዝያዳ ሓበሬታ ብስልኪ ቁጽሪ 0934426846 ደውሉ።",
    "whyChooseUs": "ምሳና እንተመጺእካ እንታይ ክትረክብ ኢኻ?",
    "whyChooseSub": "መሰረት እምነትን ማሕበረሰብን ሓጎስን እዩ።",
    "ourCommitment": "ብሓገዝ መንፈስ ቅዱስ ኣምላኽ",
    "commitmentText": "መንእሰያትን ህጻናትን ብእምነት ክዓብዩ፣ ድልዱል ሞራላዊ ክብርታት ከማዕብሉ፣ ክእመኑ፣ ንጡፋት፣ በላሕቲን ጽልዋ ዘለዎምን ክርስትያን ክንገብር ኣበርቲዕና ደው ንብል።",
    "yearsService": "ናይ ዓመታት ኣገልግሎት",
    "activeStudents": "ንጡፋት ተምሃሮ",
    "dedicatedTeachers": "ውፉያት መምህራን",
    "buildingFaith": "ህያው ወለዶ ምህናጽ",
    "historyText": "ካብ 1964 ኣትሒዙ ናይ ኦርቶዶክሳዊት ቤት ትምህርቲ ሰንበት መብራህቲ መንፈሳዊ ዕብየት ኮይኑ ኣሎ። እቲ ከም ንእሽቶ ጉጅለ ዝጀመረ ናብ ንጡፍ ኣገልግሎት ዓብዩ ንኣማኢት ህጻናት ዘገልግል፣ ንህይወት ዝመርሖምን ምስ ክርስቶስ ህያው ዝምድና ክሃንጹ ዝሕግዞምን እዩ።",
    "quote": "\"ንሕና ዛንታታት መጽሓፍ ቅዱስ ጥራይ ኣይኮናን ንመሃር - ሰባት ምስ ክርስቶስ ህያው ዝምድና ክሃንጹ ንሕግዞም።\"",
    "mediaServices": "ኣገልግሎት ሚድያ",
    "mediaText": "ቅዱስ ግዜኻ ንዘልኣለም ሓልዎ። ናይ ሚድያ ጉጅለና ንኹሎም ፍሉያት ፍጻመታት ፕሮፌሽናል ስእልን ቪድዮን ፓኬጃት የቕርብ፣ ንዕድመ ምሉእ ዝጸንሕ ልዑል ጽሬት ዘለዎ ተዘክሮታት ይፈጥር።",
    "mediaContact": "ንዝያዳ ሓበሬታ ብ 0903896637 ደውሉ።",
    "baptisms": "ጥምቀትን ክርስትናን እዩ።",
    "weddings": "ሽምግልናን ሓዳርን",
    "specialOccasions": "ዝተፈላለዩ ፍጻመታት",
    "bookConsultation": "ርኸቡና",
    "testimonialsNote": "ካብ ኣፍ ካህን።",
    "joinFamily": "ምስ ስድራና ተጸንበሩ",
    "joinText": "ብሓባር ንኣምላኽ ነገልግሎ",
    "registerToday": "ሎሚ ተመዝገቡ።",
    "announcementsTitle": "እዋናዊ ምልክታታት",
    "announcementsSub": "እዋናዊ ዜናታትናን ኣብ ዝመጽእ መደባት ቤት ትምህርቲ ሰንበትናን ኣብዚ ርኣዩ።",
    "latestNews": "እዋናዊ ዜና",
    "upcomingEvents": "ኣብ ዝመጽእ ፍጻመታት",
    "noNews": "ናይ ቀረባ ዜና የለን። በጃኹም ድሒርኩም ተመለሱ።",
    "noEvents": "ዝመጽእ ፍጻመታት ኣይተሓዝን። ፅናሕ!",
    "viewAll": "ኩሉ ዜናን ፍጻሜታትን ርአ",
    "promoTitle": "ናይ ዓምደሃይማኖት ዝማሬ መተግበሪ ጽዓኑ!",
    "promoSubtitle": "ልዕሊ 2,400 ናይ ጐይታና፡ ቅዱሳን፡ ዘወትርን በዓላትን ኦርቶዶክሳዊ ዝማሬ ግጥምን ኦዲዮን ኣብ ሞባይልኩም።",
    "promoEyebrow": "ሕጂ ኣብ Google Play",
    "promoFeature1": "ልዕሊ 2,400 ዝማሬ ምስ ግጥምን ኦዲዮን",
    "promoFeature2": "ጐይታና፡ ቅዱሳን፡ ዘወትርን በዓላትን",
    "promoButton": "ኣውርድ",
    "testimonials": [
        {
            "quote": "ጽባሕ ብዛዕባ መልክዕ ቤተ ክርስቲያን ትጭነቕ እንተ ዄንካ ሎሚ ኣገልግሎት ትምህርቲ ሰንበት ኣብ ልብኻ ሓዝ።",
            "author": "ኣቡነ ጎርጎርዮስ ካል",
            "role": "ሊቀ ጳጳስ"
        },
        {
            "quote": "መንእሰይ ዘይብላ ቤተ ክርስቲያን መጻኢ የብላን። ቤተ ክርስቲያን ዘይብሉ መንእሰይ መጻኢ የብሉን",
            "author": "ኣቡነ ሽኖዳ ሳልሳዊ",
            "role": "ፓትርያርክ ግብጺ"
        },
        {
            "quote": "ልጅን በሚሄድበት መንገድ ምራው፥ በሸመገለም ጊዜ ከእርሱ ፈቀቅ አይልም።",
            "author": "ምሳሌ 22፡6",
            "role": "ለባም ሰሎሞን"
        },
        {
            "quote": "እስክመጣ ድረስ ለማንበብና ለመምከር ለማስተማርም ተጠንቀቅ።",
            "author": "1ጢሞ 4፡13",
            "role": "ቅዱስ ጳውሎስ"
        },
        {
            "quote": "ንደቅኻ ምሃሮ፡ ኣብ ገዛኻ ኮፍ ምስ በልካ፡ ኣብ መንገዲ ክትከይድ ከለኻ፡ ክትድቅስ ከለኻ፡ ክትትንስእ ከለኻ ተጻወቶ።",
            "author": "ዘዳግም 6፡7",
            "role": "ነቢይ ሙሴ"
        }
    ]
},
  es: {
    "pageTitle": "Columna Religión Escuela Dominical Educación espiritual en Jima",
    "pageDescription": "Sitio web oficial de la escuela dominical de Jim's Pillar Religion. Ofrecemos lecciones de Tewahedo ortodoxo, lecciones de canto y orientación espiritual para jóvenes y niños. Entérate de nuestras últimas noticias y eventos.",
    "heroChip": "Hechos 6:4",
    "headline": "Si está preocupado por el aspecto de la iglesia mañana, mantenga hoy el servicio de la escuela dominical en su corazón.",
    "heroQuoteAuthor": "Abune Gregory Kal",
    "heroQuoteRole": "Arzobispo",
    "subheadline": "Id, pues, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, del Hijo y del Espíritu Santo, y enseñándoles a guardar todo lo que os he mandado. Y he aquí, yo estaré con vosotros siempre hasta el fin del mundo. Mateo 28:19",
    "enrollNow": "Regístrate ahora",
    "learnMore": "Haga clic para saber más",
    "corePillars": "Nuestros servicios espirituales",
    "pillarsSub": "Servicios proporcionados por nuestra escuela dominical",
    "faithFormation": "Enseñanzas ortodoxas",
    "faithDesc": "Estamos enseñando el nuevo plan de estudios (Sistema Eclesiástico, Ética Cristiana, Estudio de las Escrituras, Religión Fundamental e Historia de la Iglesia) desde preescolar (KG) hasta el grado 12 que fue emitido por la Arquidiócesis para ser implementado en todas las escuelas dominicales a nivel nacional. También recibirá capacitación ortodoxa de nuestra escuela dominical, que le enseñará cómo lidiar con la situación de su vida, sus responsabilidades y los desafíos y problemas actuales en una vida cristiana.\n\n📚 Bot de soporte para estudiantes\nEn nuestro sitio de Telegram, puede acceder fácilmente a programas de estudios y libros de referencia a nivel nacional en formato PDF y a más de 100 preguntas de examen con sus respuestas.",
    "botLinkText": "Abre el robot de Telegram",
    "christianCommunity": "Lecciones de Himnodia",
    "communityDesc": "Enseñamos himnos diarios, cortos Wereb, himnos poéticos y Wereb yaredico, junto con lecciones tradicionales de Shibsheba y Kebero que preservan la herencia de nuestra Iglesia.\n\n📱 Pulsa el botón Download para obtener la aplicación móvil con más de 2.400 letras y audios de himnos ortodoxos de nuestro Señor, los santos, el ciclo diario y las fiestas.",
    "religiousEducation": "Entrenamiento de instrumentos musicales ortodoxos.",
    "educationDesc": "Ofrecemos clases de instrumentos musicales de arpa, clarinete y masinko de lunes a sábado a cargo de nuestros profesores experimentados.\n\nHoras de sesión:\n\n• Mañana: 12:00 - 2:30\n• Noche: 10:00 - 13:30\n• Llame al 0946251312 para más información.",
    "libraryService": "Servicio de biblioteca",
    "libraryDesc": "Nuestra biblioteca de escuela dominical ubicada en los terrenos de la Catedral de la Santísima Virgen María en Mount Ephrata; Compiló y mantuvo una extensa colección de libros teológicos, eclesiásticos y devocionales. En nuestra biblioteca encontrará escritos y ensayos de santos, novelas espirituales, obras de traducción contemporáneas, así como libros de interpretación profunda de los eruditos de la iglesia primitiva. Además, hemos proporcionado varios servicios y cancioneros en formato impreso (copia impresa) y digital (copia electrónica).\n\nDías y Horarios de Servicio:\n\n• Horario de atención: domingo a domingo (cerrado los jueves)\n• Sesión de mañana: 2:30 - 6:00\n• Sesión de tarde: 8:00 am - 1:00 pm\n• Llame al 0934426846 para más información.",
    "whyChooseUs": "¿Qué conseguirás si vienes con nosotros?",
    "whyChooseSub": "El fundamento de la fe, la comunidad y la felicidad",
    "ourCommitment": "Con la ayuda del Espíritu Santo de Dios",
    "commitmentText": "Nos esforzamos por hacer que los jóvenes y los niños crezcan en la fe, desarrollen fuertes valores morales y sean cristianos creíbles, activos, inteligentes e influyentes.",
    "yearsService": "Años de servicio",
    "activeStudents": "Estudiantes activos",
    "dedicatedTeachers": "Maestros dedicados",
    "buildingFaith": "Construyendo una generación viva",
    "historyText": "Desde 1964, la Escuela Dominical Ortodoxa ha sido un faro de crecimiento espiritual. Lo que comenzó como un grupo pequeño se ha convertido en un ministerio activo que sirve a cientos de niños, guiándolos de por vida y ayudándolos a construir una relación viva con Cristo.",
    "quote": "\"No sólo enseñamos historias bíblicas: ayudamos a las personas a construir una relación viva con Cristo\".",
    "mediaServices": "Servicios de medios",
    "mediaText": "Mantén tu tiempo sagrado para siempre. Nuestro equipo de medios ofrece paquetes de fotografía y video profesionales para todos los eventos especiales, creando recuerdos de alta calidad que durarán toda la vida.",
    "mediaContact": "Llama al 0903896637 para más información.",
    "baptisms": "Bautismo y cristianismo",
    "weddings": "Mediación y matrimonio",
    "specialOccasions": "Varios eventos",
    "bookConsultation": "Contáctenos",
    "testimonialsNote": "De boca del sacerdote",
    "joinFamily": "Únete a nuestra familia",
    "joinText": "sirvamos a Dios juntos",
    "registerToday": "Regístrese hoy",
    "announcementsTitle": "Anuncios actuales",
    "announcementsSub": "Consulte nuestras últimas noticias y los próximos eventos de la Escuela Dominical aquí.",
    "latestNews": "Últimas noticias",
    "upcomingEvents": "próximos eventos",
    "noNews": "Ninguna noticia reciente. Por favor vuelve más tarde.",
    "noEvents": "No hay eventos próximos reservados. ¡Esperar!",
    "viewAll": "Ver todas las noticias y eventos",
    "promoTitle": "¡Obtén la aplicación Amdehayimanot Zimare!",
    "promoSubtitle": "Más de 2.400 letras y audios de himnos ortodoxos de nuestro Señor, los santos, el ciclo diario y las fiestas—en tu móvil.",
    "promoEyebrow": "Ya en Google Play",
    "promoFeature1": "Más de 2.400 himnos con letra y audio",
    "promoFeature2": "Señor, santos, diario y fiestas",
    "promoButton": "Descargar",
    "testimonials": [
        {
            "quote": "Si está preocupado por el aspecto de la iglesia mañana, mantenga hoy el servicio de la escuela dominical en su corazón.",
            "author": "Abune Gregory Kal",
            "role": "Arzobispo"
        },
        {
            "quote": "Una iglesia sin jóvenes no tiene futuro. Un joven sin iglesia no tiene futuro",
            "author": "Abune Shinoda Salsawi",
            "role": "Patriarca de Egipto"
        },
        {
            "quote": "Guía al niño por el camino que debe seguir, y no se desviará de él cuando sea viejo.",
            "author": "Proverbios 22:6",
            "role": "El sabio Salomón"
        },
        {
            "quote": "Tened cuidado de leer y aconsejar y enseñar hasta que yo venga.",
            "author": "1 Timoteo 4:13",
            "role": "San Pablo"
        },
        {
            "quote": "Enséñalo a tus hijos, tócalo cuando estés sentado en tu casa, cuando camines por el camino, cuando duermas y cuando te levantes.",
            "author": "Deuteronomio 6:7",
            "role": "Profeta Moisés"
        }
    ]
},
  fr: {
    "pageTitle": "Chronique Religion École du dimanche Éducation spirituelle à Jima",
    "pageDescription": "Site officiel de l'école du dimanche de la religion Jim's Pillar. Nous proposons des cours de Tewahedo orthodoxe, des cours de chant et des conseils spirituels pour les jeunes et les enfants. Découvrez nos dernières actualités et événements.",
    "heroChip": "Actes 6:4",
    "headline": "Si vous vous inquiétez de l’apparence de l’église demain, gardez le service de l’école du dimanche dans votre cœur aujourd’hui.",
    "heroQuoteAuthor": "Abune Gregory Kal",
    "heroQuoteRole": "Archevêque",
    "subheadline": "Allez donc et faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit, et apprenez-leur à observer tout ce que je vous ai commandé. Et voici, je suis avec vous toujours jusqu'à la fin du monde. Matthieu 28:19",
    "enrollNow": "Inscrivez-vous maintenant",
    "learnMore": "Cliquez pour en savoir plus",
    "corePillars": "Nos services spirituels",
    "pillarsSub": "Services fournis par notre école du dimanche",
    "faithFormation": "Enseignements orthodoxes",
    "faithDesc": "Nous enseignons le nouveau programme (système ecclésial, éthique chrétienne, étude des Écritures, religion fondamentale et histoire de l'Église) de la maternelle (KG) à la 12e année, qui a été publié par l'archidiocèse pour être mis en œuvre dans toutes les écoles du dimanche du pays. Vous recevrez également une formation orthodoxe de notre école du dimanche, qui vous apprendra à gérer votre situation de vie, vos responsabilités et les défis et problèmes actuels de la vie chrétienne.\n\n📚 Bot de support pour les étudiants\nSur notre site Telegram, vous pouvez facilement accéder aux programmes et ouvrages de référence au niveau national au format PDF et à plus de 100 questions de test avec leurs réponses.",
    "botLinkText": "Ouvrez le robot Telegram",
    "christianCommunity": "Leçons d’Hymnodie",
    "communityDesc": "Nous enseignons les hymnes quotidiens, les courts Wereb, les hymnes poétiques et les Wereb yarédiques, ainsi que les leçons traditionnelles de Shibsheba et de Kebero qui préservent le patrimoine de notre Église.\n\n📱 Appuyez sur le bouton Download pour obtenir l’application mobile contenant plus de 2 400 paroles et audios d’hymnes orthodoxes de notre Seigneur, des saints, du cycle quotidien et des fêtes.",
    "religiousEducation": "Formation aux instruments de musique orthodoxe",
    "educationDesc": "Nous proposons des cours de harpe, clarinette et instruments de musique masinko du lundi au samedi par nos professeurs expérimentés.\n\nHoraires des séances :\n\n• Matin : de 12h00 à 14h30\n• Nuit : de 10h00 à 13h30\n• Appelez le 0946251312 pour plus d'informations.",
    "libraryService": "Service de bibliothèque",
    "libraryDesc": "Notre bibliothèque de l'école du dimanche située dans l'enceinte de la cathédrale de la Sainte Vierge Marie au Mont Ephrata ; Il a compilé et entretenu une vaste collection de livres théologiques, ecclésiastiques et dévotionnels. Dans notre bibliothèque, vous trouverez des écrits et des essais de saints, des romans spirituels, des traductions contemporaines, ainsi que des livres d'interprétation approfondie rédigés par des érudits de l'Église primitive. De plus, nous avons fourni divers recueils de chants et de service sous forme imprimée (copie papier) et numérique (copie électronique).\n\nJours et heures de service :\n\n• Heures d'ouverture : du dimanche au dimanche (fermé le jeudi)\n• Séance du matin : de 14h30 à 18h00\n• Séance de l'après-midi : de 8h00 à 13h00\n• Appelez le 0934426846 pour plus d'informations.",
    "whyChooseUs": "Qu'obtiendrez-vous si vous venez avec nous ?",
    "whyChooseSub": "Le fondement de la foi, de la communauté et du bonheur",
    "ourCommitment": "Avec l'aide du Saint-Esprit de Dieu",
    "commitmentText": "Nous nous efforçons de faire grandir les jeunes et les enfants dans la foi, de développer des valeurs morales fortes et de devenir des chrétiens crédibles, actifs, intelligents et influents.",
    "yearsService": "Années de service",
    "activeStudents": "Étudiants actifs",
    "dedicatedTeachers": "Des enseignants dévoués",
    "buildingFaith": "Construire une génération vivante",
    "historyText": "Depuis 1964, l’École du dimanche orthodoxe est un phare de croissance spirituelle. Ce qui a commencé comme un petit groupe est devenu un ministère actif au service de centaines d'enfants, les guidant pour la vie et les aidant à construire une relation vivante avec le Christ.",
    "quote": "\"Nous ne nous contentons pas d'enseigner des histoires bibliques : nous aidons les gens à construire une relation vivante avec le Christ.\"",
    "mediaServices": "Services médias",
    "mediaText": "Gardez votre temps sacré pour toujours. Notre équipe média propose des forfaits photo et vidéo professionnels pour tous les événements spéciaux, créant ainsi des souvenirs de haute qualité qui dureront toute une vie.",
    "mediaContact": "Appelez le 0903896637 pour plus d’informations.",
    "baptisms": "Baptême et christianisme",
    "weddings": "Médiation et mariage",
    "specialOccasions": "Divers événements",
    "bookConsultation": "Contactez-nous",
    "testimonialsNote": "De la bouche du prêtre",
    "joinFamily": "Rejoignez notre famille",
    "joinText": "Servissons Dieu ensemble",
    "registerToday": "Inscrivez-vous aujourd'hui",
    "announcementsTitle": "Annonces actuelles",
    "announcementsSub": "Consultez nos dernières nouvelles et les prochains événements de l’école du dimanche ici.",
    "latestNews": "Dernières nouvelles",
    "upcomingEvents": "événements à venir",
    "noNews": "Aucune nouvelle récente. S'il vous plaît, revenez plus tard.",
    "noEvents": "Aucun événement à venir réservé. Attendez!",
    "viewAll": "Voir toutes les actualités et événements",
    "promoTitle": "Obtenez l’application Amdehayimanot Zimare !",
    "promoSubtitle": "Plus de 2 400 paroles et audios d’hymnes orthodoxes de notre Seigneur, des saints, du cycle quotidien et des fêtes—sur votre téléphone.",
    "promoEyebrow": "Maintenant sur Google Play",
    "promoFeature1": "Plus de 2 400 hymnes avec paroles et audio",
    "promoFeature2": "Seigneur, saints, quotidien et fêtes",
    "promoButton": "Télécharger",
    "testimonials": [
        {
            "quote": "Si vous vous inquiétez de l’apparence de l’église demain, gardez le service de l’école du dimanche dans votre cœur aujourd’hui.",
            "author": "Abune Gregory Kal",
            "role": "Archevêque"
        },
        {
            "quote": "Une Église sans jeunesse n'a pas d'avenir. Une jeunesse sans église n’a pas d’avenir",
            "author": "Abune Shinoda Salsawi",
            "role": "Patriarche d'Egypte"
        },
        {
            "quote": "Guidez un enfant dans la voie qu'il doit suivre, et il ne s'en détournera pas quand il sera vieux.",
            "author": "Proverbes 22:6",
            "role": "Le sage Salomon"
        },
        {
            "quote": "Faites attention à lire, conseiller et enseigner jusqu'à mon arrivée.",
            "author": "1 Tim 4:13",
            "role": "Saint-Paul"
        },
        {
            "quote": "Apprenez-le à vos enfants, jouez-y lorsque vous êtes assis dans votre maison, lorsque vous marchez sur la route, lorsque vous dormez et lorsque vous vous levez.",
            "author": "Deutéronome 6:7",
            "role": "Prophète Moïse"
        }
    ]
},
  ar: {
    "pageTitle": "عمود الدين مدرسة الأحد التربية الروحية في جيما",
    "pageDescription": "الموقع الرسمي لمدرسة الأحد الدينية في عمود جيم. نقدم دروس التوحيد الأرثوذكسية ودروس الغناء والإرشاد الروحي للشباب والأطفال. تعرف على آخر الأخبار والأحداث لدينا.",
    "heroChip": "أعمال 6: 4",
    "headline": "إذا كنت قلقًا بشأن ظهور الكنيسة غدًا، فاحتفظ بخدمة مدارس الأحد في قلبك اليوم.",
    "heroQuoteAuthor": "أبو جريجوري كال",
    "heroQuoteRole": "رئيس الأساقفة",
    "subheadline": "فاذهبوا وتلمذوا جميع الأمم وعمدوهم باسم الآب والابن والروح القدس وعلموهم أن يحفظوا جميع ما أوصيتكم به. وها أنا معك كل الأيام إلى انقضاء الدهر. متى 28:19",
    "enrollNow": "سجل الآن",
    "learnMore": "انقر لمعرفة المزيد",
    "corePillars": "خدماتنا الروحية",
    "pillarsSub": "الخدمات التي تقدمها مدرسة الأحد لدينا",
    "faithFormation": "التعاليم الأرثوذكسية",
    "faithDesc": "نقوم بتدريس المنهج الجديد (نظام الكنيسة، الأخلاق المسيحية، دراسة الكتاب المقدس، الدين الأساسي وتاريخ الكنيسة) من مرحلة ما قبل المدرسة (KG) إلى الصف الثاني عشر الذي أصدرته الأبرشية ليتم تنفيذه في جميع مدارس الأحد على الصعيد الوطني. ستتلقى أيضًا تدريبًا أرثوذكسيًا من مدرسة الأحد لدينا، والذي سيعلمك كيفية التعامل مع وضع حياتك ومسؤولياتك والتحديات والقضايا الحالية في الحياة المسيحية.\n\n📚 بوت الدعم للطلاب\nفي موقع Telegram الخاص بنا، يمكنك الوصول بسهولة إلى المنهج الدراسي والكتب المرجعية على المستوى الوطني بتنسيق PDF وأكثر من 100 سؤال اختبار مع إجاباتها.",
    "botLinkText": "افتح بوت تيليجرام",
    "christianCommunity": "دروس الألحان",
    "communityDesc": "نعلّم الترانيم اليومية، وترانيم الوريّب القصيرة، والترانيم الشعرية، والوريّب الياريدي، إلى جانب دروس الشبشبا والكهبر التقليدية التي تحفظ تراث كنيستنا.\n\n📱 اضغط زر Download لتنزيل تطبيق الجوال الذي يحتوي على أكثر من 2400 من كلمات وأصوات الترانيم الأرثوذكسية لسيدنا والقديسين والترانيم اليومية والأعياد.",
    "religiousEducation": "التدريب على الآلات الموسيقية الأرثوذكسية",
    "educationDesc": "نحن نقدم دروسًا في الآلات الموسيقية القيثارة والكلارينيت والماسينكو من الاثنين إلى السبت على يد مدرسينا ذوي الخبرة.\n\nساعات الجلسة:\n\n• الصباح: 12:00 - 2:30\n• ليلاً: 10:00 – 1:30 ظهراً\n• اتصل على 0946251312 لمزيد من المعلومات.",
    "libraryService": "خدمة المكتبة",
    "libraryDesc": "مكتبة مدرسة الأحد الخاصة بنا تقع في أراضي كاتدرائية السيدة العذراء مريم في جبل أفراتا؛ قام بتجميع وصيانة مجموعة واسعة من الكتب اللاهوتية والكنسية والتعبدية. ستجد في مكتبتنا كتابات ومقالات القديسين، والروايات الروحية، وأعمال الترجمة المعاصرة، بالإضافة إلى كتب التفسير العميق لعلماء الكنيسة الأوائل. بالإضافة إلى ذلك، قمنا بتوفير العديد من كتب الخدمات والأغاني في شكل مطبوع (نسخة ورقية) ورقمية (نسخة إلكترونية).\n\nأيام وساعات الخدمة:\n\n• ساعات العمل: من الأحد إلى الأحد (مغلق يوم الخميس)\n• الفترة الصباحية: 2:30 - 6:00\n• فترة ما بعد الظهر: 8:00 صباحاً – 1:00 ظهراً\n• اتصل على 0934426846 لمزيد من المعلومات.",
    "whyChooseUs": "ماذا ستحصل إذا أتيت معنا؟",
    "whyChooseSub": "أساس الإيمان والمجتمع والسعادة",
    "ourCommitment": "بمعونة روح الله القدوس",
    "commitmentText": "نحن نبذل قصارى جهدنا لجعل الشباب والأطفال يكبرون في الإيمان، ويطورون قيمًا أخلاقية قوية، ومسيحيين قابلين للتصديق، ونشطين، وأذكياء، ومؤثرين.",
    "yearsService": "سنوات الخدمة",
    "activeStudents": "الطلاب النشطين",
    "dedicatedTeachers": "المعلمين المتفانين",
    "buildingFaith": "بناء جيل حي",
    "historyText": "منذ عام 1964، أصبحت مدرسة الأحد الأرثوذكسية منارة للنمو الروحي. ما بدأ كمجموعة صغيرة تطور إلى خدمة نشطة تخدم مئات الأطفال، وترشدهم مدى الحياة وتساعدهم على بناء علاقة حية مع المسيح.",
    "quote": "\"نحن لا نعلم فقط قصص الكتاب المقدس - بل نساعد الناس على بناء علاقة حية مع المسيح.\"",
    "mediaServices": "خدمات إعلامية",
    "mediaText": "حافظ على وقتك المقدس إلى الأبد. يقدم فريقنا الإعلامي حزم صور وفيديو احترافية لجميع المناسبات الخاصة، مما يخلق ذكريات عالية الجودة تدوم مدى الحياة.",
    "mediaContact": "اتصل بالرقم 0903896637 لمزيد من المعلومات.",
    "baptisms": "المعمودية والمسيحية",
    "weddings": "الوساطة والزواج",
    "specialOccasions": "أحداث مختلفة",
    "bookConsultation": "اتصل بنا",
    "testimonialsNote": "من فم الكاهن",
    "joinFamily": "انضم إلى عائلتنا",
    "joinText": "دعونا نخدم الله معا",
    "registerToday": "سجل اليوم",
    "announcementsTitle": "الإعلانات الحالية",
    "announcementsSub": "اطلع على آخر أخبارنا وفعاليات مدرسة الأحد القادمة هنا.",
    "latestNews": "آخر الأخبار",
    "upcomingEvents": "الأحداث القادمة",
    "noNews": "لا توجد أخبار حديثة. يرجى العودة لاحقا.",
    "noEvents": "لم يتم حجز أي أحداث قادمة. انتظر!",
    "viewAll": "رؤية جميع الأخبار والأحداث",
    "promoTitle": "حمّل تطبيق عمدهيمانوت زماري!",
    "promoSubtitle": "أكثر من 2400 من كلمات وأصوات الترانيم الأرثوذكسية لسيدنا والقديسين واليومية والأعياد—على هاتفك.",
    "promoEyebrow": "الآن على Google Play",
    "promoFeature1": "أكثر من 2400 ترنيمة مع كلمات وصوت",
    "promoFeature2": "سيدنا، القديسون، اليومية والأعياد",
    "promoButton": "تنزيل",
    "testimonials": [
        {
            "quote": "إذا كنت قلقًا بشأن ظهور الكنيسة غدًا، فاحتفظ بخدمة مدارس الأحد في قلبك اليوم.",
            "author": "أبو جريجوري كال",
            "role": "رئيس الأساقفة"
        },
        {
            "quote": "الكنيسة بدون شباب ليس لها مستقبل. الشاب بدون كنيسة ليس له مستقبل",
            "author": "أبو شنودة سلساوي",
            "role": "بطريرك مصر"
        },
        {
            "quote": "أرشد الطفل إلى الطريق الذي يجب أن يسلكه، فلا يحيد عنه إذا كبر.",
            "author": "أمثال 22: 6",
            "role": "سليمان الحكيم"
        },
        {
            "quote": "فاحرص على القراءة والنصح والتعليم حتى أجيء.",
            "author": "1 تي 4: 13",
            "role": "القديس بولس"
        },
        {
            "quote": "علموها أولادكم، والعبوها إذا جلستم في بيتكم، وإذا مشيتم في الطريق، وإذا نمتم، وإذا قمتم.",
            "author": "تثنية 6: 7",
            "role": "النبي موسى"
        }
    ]
},
  am: {
    "pageTitle": "ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት | መንፈሳዊ ትምህርት በጂማ",
    "pageDescription": "የጂማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ይፋዊ ድረ-ገጽ። ለወጣቶችና ህጻናት የኦርቶዶክስ ተዋሕዶ ትምህርቶችን፣ የዝማሬ ትምህርቶችን እና መንፈሳዊ ምሪትን እናቀርባለን። ወቅታዊ ዜናዎቻችንን እና ዝግጅቶቻችንን ያግኙ።",
    "heroChip": "የሐዋርያት ሥራ 6፡4",
    "headline": "ለነገ የቤተ ክርስትያን ገጽታ የምትጨነቁ ከሆነ ዛሬ ላይ የሰንበት ትምህርት ቤትን አገልግሎት በልባቹህ አኑሩ።",
    "heroQuoteAuthor": "አቡነ ጎርጎርዮስ ካልዕ",
    "heroQuoteRole": "ሊቀ ጳጳስ",
    "subheadline": "እንግዲህ ሂዱና አሕዛብን ሁሉ በአብ በወልድና በመንፈስ ቅዱስ ስም እያጠመቃችኋቸው፥ ያዘዝኋችሁንም ሁሉ እንዲጠብቁ እያስተማራችኋቸው ደቀ መዛሙርት አድርጓቸው፤ እነሆም እኔ እስከ ዓለም ፍጻሜ ድረስ ሁልጊዜ ከእናንተ ጋር ነኝ ማቴ 28፡19",
    "enrollNow": "አሁን ይመዝገቡ",
    "learnMore": "የበለጠ ለማወቅ ይጫኑ",
    "corePillars": "Our Spiritual Services",
    "pillarsSub": "በሰንበት ትምህርት ቤታችን የሚሰጡ አገልግሎቶች",
    "faithFormation": "ኦርቶዶክሳዊ ትምህርቶች",
    "faithDesc": "በሀገር አቀፍ ደረጃ ከጠቅላይ ቤተ ክህነት በሁሉም ሰንበት ትምህርት ቤቶች እንዲተገበር የወጣውን አዲሱን ሥርዓተ ትምህርት (ሥርዓተ ቤተ ክርስቲያን፣ ክርስቲያናዊ ሥነ ምግባር፣ ቅዱሳት መጻሕፍት ጥናት፣ መሠረተ ሃይማኖት እና የቤተ ክርስቲያን ታሪክ) ከቅድመ መደበኛ (ኬጂ) እስከ 12ኛ ክፍል ድረስ እያስተማርን እንገኛለን። እንዲሁም ያሉበትን የሕይወት ሁኔታ፣ ኃላፊነት እና ወቅታዊ ፈተናዎችን እና ጉዳዮችን እንዴት በክርስቲያናዊ ሕይወት መወጣት እንደሚገባ የሚያስተምሩ ኦርቶዶክሳዊ ሥልጠናዎችን ከሰንበት ትምህርት ቤታችን ያገኛሉ።\n\n📚 ለተማሪዎች የድጋፍ ቦት\nበቴሌግራም ቦታችን በሀገር አቀፍ ደረጃ የሚሰጠውን ሥርዓተ ትምህርት መጻሕፍት እና አጋዥ መጻሕፍትን በፒዲኤፍ እና ከ100 በላይ የሙከራ ጥያቄዎችን ከመልሳቸው ጋር በቀላሉ ማግኘት ይችላሉ።",
    "botLinkText": "ቴሌግራም ቦት ይክፈቱ",
    "christianCommunity": "ትምህርተ ዝማሬ",
    "communityDesc": "በየዕለቱ የሚዘመሩ የዘወትር ዝማሬዎችን፣ አጭር የወረብ ዝማሬዎችን፣ የግጥም ዝማሬዎችን እና ያሬዳዊ ወረብ ዝማሬዎችን፣ እንዲሁም የቤተ ክርስቲያናችንን ትውፊት የጠበቀ የሽብሸባ እና የከበሮ ጥናት ትምህርቶችን እናስተምራለን።\n\n📱 ከ2400 በላይ የጌታችን ፣ የቅዱሳን ፣ የዘወትር እና የበዓላት ኦርቶዶክሳዊ የዝማሬ ግጥም እና ኦዲዮ የያዘውን የሞባይል መተግበሪያ ለማውረድ የ download ቁልፉን ይጫኑ",
    "religiousEducation": "ኦርቶዶክሳዊ የዜማ መሳሪያ ሥልጠና",
    "educationDesc": "በቤተክርስቲያናችን በአገልግሎት ላይ ያሉ የበገና፣ ክራር እና ማሲንቆ የዜማ መሳሪያ ትምህርቶችን ልምዱ ባላቸው መምህራን ዘወትር ከሰኞ እስከ ቅዳሜ እንሰጣለን።\n\nየክፍለ ጊዜ ሰዓታት፦\n\n• ጠዋት፦ ከ 12፡00 - 2፡30\n• ማታ፦ ከ 10፡00 - ምሽቱ 1፡30\n• ለበለጠ መረጃ በዚህ ስልክ 0946251312 ይደውሉ።",
    "libraryService": "የቤተ መጻሕፍት አገልግሎት",
    "libraryDesc": "በደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ግቢ ውስጥ የሚገኘው የሰንበት ትምህርት ቤታችን ቤተ-መጻሕፍት፤ ሰፊ የሆኑ የነገረ-መለኮት፣ የሥርዓተ-ቤተክርስቲያን እና የአምልኮ መጻሕፍት ስብስብን አዘጋጅቶ ይጠብቆታል። በቤተ-መጻሕፍታችን የቅዱሳን ገድላትና ድርሳናት፣ መንፈሳዊ ልብ ወለዶች፣ ወቅታዊ የትርጉም ሥራዎች፣ እንዲሁም ከቀደምት የቤተክርስቲያን ሊቃውንት ሲወርድ ሲዋረድ የመጡ ጥልቅ የትርጓሜ መጻሕፍትን ያገኛሉ። በተጨማሪም የተለያዩ የአገልግሎት እና የዜማ መጻሕፍትን በህትመት (hard copy) እና በዲጂታል (soft copy) መልክ አቅርበናል።\n\nየአገልግሎት ቀናት እና ሰዓታት፦\n\n• የአገልግሎት ቀናት፦ ከእሁድ እስከ እሁድ (ሐሙስ ዝግ ነው)\n• የጠዋት ክፍለ ጊዜ፦ ከ 2፡30 - 6፡00\n• ከሰዓት በኋላ ክፍለ ጊዜ፦ ከ 8፡00 - ምሽቱ 1፡00\n• ለበለጠ መረጃ በ 0934426846 ይደውሉ።",
    "whyChooseUs": "እኛጋ ቢመጡ ምን ያገኛሉ",
    "whyChooseSub": "የእምነት፣ የማህበረሰብ እና የደስታ መሰረት",
    "ourCommitment": "በእግዚአሄር መንፈስቅዱስ ዕርዳታ",
    "commitmentText": "ወጣቶችና ልጆችን በእምነት የሚያድጉበት፣ ጠንካራ የሞራል እሴቶችን የሚያዳብሩበት አማኝ፣ ንቁ፣ አስተዋይና ተፅዕኖ ፈጣሪ ክርስትያን ለማድረግ በትጋት እንቆማለን ።",
    "yearsService": "የአገልግሎት ዓመታት",
    "activeStudents": "ንቁ ተማሪዎች",
    "dedicatedTeachers": "ቁርጠኛ መምህራን",
    "buildingFaith": "ህያው ትዉልድን በመገንባት ላይ",
    "historyText": "ከ1964 ጀምሮ የዓምደሃይማኖት ሰንበት ትምህርት ቤት የመንፈሳዊ እድገት ብርሃን ሆኖ ቆይቷል። በትንሽ ስብስብ የጀመረው በመቶዎች የሚቆጠሩ ህጻናትን የሚያገለግል ንቁ አገልግሎት ሆኖ አድጓል፣ ለህይወት መመሪያ ከክርስቶስ ጋር ህያው ግንኙነት እንዲገነቡ ይረዳቸዋል።",
    "quote": "\"የመጽሐፍ ቅዱስ ታሪኮችን ብቻ አናስተምርም - ይልቁን ሰዎች ከክርስቶስ ጋር ህያው ግንኙነት እንዲገነቡ እንረዳቸዋለን እንጂ።\"",
    "mediaServices": "የሚዲያ አገልግሎቶች",
    "mediaText": "ቅዱስ ጊዜያችሁን ለዘላለም ያዙ። የእኛ የሚዲያ ቡድን ለሁሉም ልዩ ዝግጅቶች ሙያዊ የፎቶ እና የቪዲዮ ፓኬጆችን ያቀርባል፣ ይህም ለህይወት ዘመን የሚቆዩ ከፍተኛ ጥራት ያላቸውን ትዝታዎች ያስቀምጣል",
    "mediaContact": "ለበለጠ መረጃ በ 0903896637 ይደውሉ።",
    "baptisms": "ጥምቀት እና ክርስትና",
    "weddings": "ሽምግልና እና ጋብቻ",
    "specialOccasions": "ልዩ ልዩ ዝግጅቶች",
    "bookConsultation": "ያግኙን",
    "testimonialsNote": "ከአበው አንደበት",
    "joinFamily": "ቤተሰባችንን ይቀላቀሉ",
    "joinText": "ኑ እግዚአብሄርን አብረን እናገልግል",
    "registerToday": "ዛሬ ይመዝገቡ",
    "announcementsTitle": "ወቅታዊ ማስታወቂያዎች",
    "announcementsSub": "አዳዲስ ዜናዎቻችንን እና የሚቀጥሉ የሰንበት ትምህርት ቤት ክስተቶችን እዚህ ይመልከቱ።",
    "latestNews": "የቅርብ ጊዜ ዜና",
    "upcomingEvents": "መጪ ክስተቶች",
    "noNews": "ምንም የቅርብ ጊዜ ዜና የለም። እባክዎ ቆይተው ተመልሰው ይምጡ።",
    "noEvents": "ምንም መጪ ዝግጅቶች አልተያዙም። ይጠብቁ!",
    "viewAll": "ሁሉንም ዜናዎች እና ክስተቶች ይመልከቱ",
    "promoTitle": "የዓምደሃይማኖት ዝማሬ መተግበሪያን ይጫኑ!",
    "promoSubtitle": "ከ2400 በላይ የጌታችን፣ የቅዱሳን፣ የዘወትር እና የበዓላት ኦርቶዶክሳዊ የዝማሬ ግጥም እና ኦዲዮ በሞባይልዎ።",
    "promoEyebrow": "አሁን በ Google Play",
    "promoFeature1": "ከ2,400 በላይ ዝማሬ ግጥም እና ኦዲዮ",
    "promoFeature2": "የጌታችን፣ ቅዱሳን፣ ዘወትር እና በዓላት",
    "promoButton": "አውርድ",
    "testimonials": [
        {
            "quote": "ለነገ የቤተ ክርስትያን ገጽታ የምትጨነቁ ከሆነ ዛሬ ላይ የሰንበት ትምህርት ቤትን አገልግሎት በልባቹህ አኑሩ።",
            "author": "አቡነ ጎርጎርዮስ ካልዕ",
            "role": "ሊቀ ጳጳስ"
        },
        {
            "quote": "ወጣት የሌላት ቤተክርስትያን የነገ ህይወት የላትም በቤተክርስትያን የሌለ ወጣት የነገ ህይወት የለዉም",
            "author": "አቡነ ሺኖዳ ሳልሣዊ",
            "role": "የግብጽ ፓትሪያርክ"
        },
        {
            "quote": "ልጅን በሚሄድበት መንገድ ምራው፥ በሸመገለም ጊዜ ከእርሱ ፈቀቅ አይልም።",
            "author": "ምሳ 22፡6",
            "role": "ጠቢቡ ሰለሞን"
        },
        {
            "quote": "እስክመጣ ድረስ ለማንበብና ለመምከር ለማስተማርም ተጠንቀቅ።",
            "author": "1ኛ ጢሞ 4፡13 ",
            "role": "ቅዱስ ጳውሎስ"
        },
        {
            "quote": "ለልጆችህም አስተምረው፥ በቤትህም ስትቀመጥ፥ በመንገድም ስትሄድ፥ ስትተኛም፥ ስትነሣም ተጫወተው።",
            "author": "ዘዳ 6፡7",
            "role": "ሊቀ ነቢያት ሙሴ"
        }
    ]
},
  ge: {
    "pageTitle": "ቤተ ትምህርት ሰንበት ዓምደሃይማኖት | ትምህርተ መንፈስ በጂማ",
    "pageDescription": "ወግዓዊ ድረ-ገጽ ዘቤተ ትምህርት ሰንበት ዓምደሃይማኖት በጂማ። ንሕነ ንህብ ትምህርተ ኦርቶዶክስ ተዋሕዶ፣ ትምህርተ ዝማሬ ወመንፈሳዊ ምሪት ለወጣቶች ወለሕፃናት።",
    "heroChip": "ግብረ ሐዋርያት ፮፡፬",
    "headline": "ለገጸ ቤተ ክርስቲያን ዘነገ እመ ትሔልዩ፣ ዮም ለቤተ ትምህርት ሰንበት ውስተ ልብክሙ አኑሩ።",
    "heroQuoteAuthor": "አቡነ ጎርጎርዮስ ካልዕ",
    "heroQuoteRole": "ሊቀ ጳጳስ",
    "subheadline": "ሑሩ እንከ ወመሀሩ ኵሎ አሕዛበ ወአጥምቅዎሙ በስመ አብ ወወልድ ወመንፈስ ቅዱስ፤ ወምሀርዎሙ ይዕቀቡ ኵሎ ዘአዘዝኩክሙ፤ ወናሁ አነ እሄሉ ምስሌክሙ በኵሉ መዋዕል እስከ ኅልቀተ ዓለም። ማቴ ፳፰፡፲፱",
    "enrollNow": "ይእዜ ተመዝገቡ",
    "learnMore": "ለተወሳኺ ይጽቀጡ",
    "corePillars": "መንፈሳዊ አገልግሎታትነ",
    "pillarsSub": "በቤተ ትምህርት ሰንበትነ ዝውሀቡ አገልግሎታት",
    "faithFormation": "ትምህርተ ኦርቶዶክስ",
    "faithDesc": "እምጠቅላይ ቤተ ክህነት በሀገር አቀፍ ደረጃ ለኵሉ ቤተ ትምህርት ሰንበት ዘወፅአ ሐዲስ ሥርዓተ ትምህርት (ሥርዓተ ቤተ ክርስቲያን፣ ክርስቲያናዊ ሥነ ምግባር፣ ቅዱሳት መጻሕፍት ጥናት፣ መሠረተ ሃይማኖት ወታሪከ ቤተ ክርስቲያን) እምቅድመ መደበኛ (ኬጂ) እስከ ፲፪ ክፍል ንሕነ ንመሀር። ወከማሁ ኦርቶዶክሳዊ ሥልጠና ዘየመሀር ከመ ይወጽኡ ኅላዌ ሕይወቶሙ ወኃላፊነቶሙ ወፈተናተ ዘመን በክርስቲያናዊ ሕይወት እምቤተ ትምህርት ሰንበትነ ትረክቡ።\n\n📚 ድጋፈ ቦት ለተማሪያን\nበቴሌግራም ቦትነ መጻሕፍተ ሥርዓተ ትምህርት ወአጋዥ መጻሕፍት በፒዲኤፍ ወልዕለ ፻ ሙከራ ጥያቄያት ምስለ መልሳቶሙ በቀሊሉ ትረክቡ።",
    "botLinkText": "ቴሌግራም ቦት ክፈቱ",
    "christianCommunity": "ትምህርተ ዝማሬ",
    "communityDesc": "ንሕነ ንመሀር ዝማሬያተ ዘወትር ወወረባተ ንኡሳነ ወዝማሬያተ ግጥም ወያሬዳዊ ወረብ፤ ወከማሁ ትምህርተ ሽብሸባ ወከበሮ ዘየዐቅብ ትውፊተ ቤተ ክርስቲያንነ።\n\n📱 ንአውርዶ መተግበሪያ ሞባይል ዘይሄሉ ልዕለ ፪፻፬፻ ግጥመ ወድምጸ ዝማሬ ኦርቶዶክስ ዘእግዚእነ ወቅዱሳን ወዘወትር ወበዓላት፤ ግበር ኁልፈ Download።",
    "religiousEducation": "ሥልጠነ መሳርያተ ዜማ ኦርቶዶክስ",
    "educationDesc": "ትምህርተ በገና ወክራር ወማሲንቆ ዘውስተ አገልግሎተ ቤተ ክርስቲያንነ በመምህራን ልሙዳን እምሰኑይ እስከ ቀዳም ንሕነ ንህብ።\n\nሰዓታተ ክፍለ ጊዜ፦\n\n• ነግህ፦ እም ፲፪፡፻ - ፪፡፴\n• ሌሊት፦ እም ፲፡፻ - ፩፡፴ ዘምሴት\n• ለበለጠ መረጃ በ 0946251312 ይደውሉ።",
    "libraryService": "አገልግሎተ ቤተ መጻሕፍት",
    "libraryDesc": "ቤተ መጻሕፍት ዘቤተ ትምህርት ሰንበትነ፣ ዘይረከብ ውስተ ዐጸደ ካቴድራል ደብረ ኤፍራታ ቅድስት ድንግል ማርያም፣ ያቀርብ ብዙኃነ መጻሕፍተ ነገረ ሃይማኖት፣ ሥርዓተ ቤተ ክርስቲያን ወአምልኮ። ትረክቡ ገድላተ ወድርሳናተ፣ ልብወለደ መንፈሳዊ፣ ትርጓሜያተ ዘመናውያነ፣ ወዓሚቀ ትርጓሜ ዘተመኃለፈ እምቀደምት ሊቃውንተ ቤተ ክርስቲያን። ከማሁኒ ናቀርብ መጻሕፍተ አገልግሎት ወዜማ በሕትመት ወበዲጂታል።\n\nመዋዕለ አገልግሎት ወሰዓታት፦\n\n• መዋዕለ አገልግሎት፦ እምእሁድ እስከ እሁድ (ሐሙስ ዕፁው)\n• ዘነግህ፦ እም ፪፡፴ - ፮፡፻\n• ዘድሕረ ቀትር፦ እም ፰፡፻ - ፩፡፻ ዘምሴት\n• ለበለጠ መረጃ በ 0934426846 ይደውሉ።",
    "whyChooseUs": "ምንተ ትረክቡ ኀቤነ",
    "whyChooseSub": "መሠረተ ሃይማኖት፣ ማኅበር ወፍሥሐ",
    "ourCommitment": "በረድኤተ መንፈስ ቅዱስ",
    "commitmentText": "ንሕነ ንተግህ ከመ ንግበር ሕፃናተ ወወጣንያነ ክርስቲያነ ዘአማኒ፣ ነቃሕ፣ ጠቢብ ወገባሬ ሠናይ፣ ዘይዐብዩ በሃይማኖት ወያፈሪ ሠናየ ምግባረ።",
    "yearsService": "ዓመታተ አገልግሎት",
    "activeStudents": "ንቁኃን ተማሪያን",
    "dedicatedTeachers": "ትጉሃን መምህራን",
    "buildingFaith": "ንሐንጽ ትውልደ ሕያወ",
    "historyText": "እም ፲፱፻፷፬ ዓ.ም. አኀዘ ቤተ ትምህርት ሰንበት ዓምደሃይማኖት ይኩን ብርሃነ ዕብየት መንፈሳዊ። እምንዑስ ማኅበር ጀሚሮ፣ ዐብየ ወኮነ አገልግሎተ ዘይረድእ ምእተ ሕፃናተ፣ ከመ ይሕነፁ ሕያወ ግንኙነት ምስለ ክርስቶስ።",
    "quote": "\"አኮ ታሪከ መጽሐፍ ቅዱስ ባሕቲቶ ዘንመሀር - አላ ንረድእ ሰብአ ከመ ይሕነፁ ሕያወ ግንኙነት ምስለ ክርስቶስ።\"",
    "mediaServices": "አገልግሎተ ሚድያ",
    "mediaText": "አኀዙ ቅዱሳተ ጊዜያቲክሙ ለዓለም። ጉባኤ ሚድያነ ያቀርብ ሙያዊ ፎቶ ወቪድዮ ለኵሉ ልዩ ዝግጅት፣ ከመ የኅድግ ተዝካረ ልዑል ጽሬት ለዘመነ ሕይወት።",
    "mediaContact": "ለተወሳኺ ሓበሬታ በ 0903896637 ይደውሉ።",
    "baptisms": "ጥምቀት ወክርስትና",
    "weddings": "ሽምግልና ወመርዓ",
    "specialOccasions": "ልዩ ልዩ ዝግጅታት",
    "bookConsultation": "ርከቡነ",
    "testimonialsNote": "እምአፈ አበው",
    "joinFamily": "ተሓወሱ ማኅበረነ",
    "joinText": "ንዑ ንትገነይ ለእግዚአብሔር ኅቡረ",
    "registerToday": "ዮም ተመዝገቡ",
    "announcementsTitle": "ዜናዋተ መዋዕል",
    "announcementsSub": "ርአዩ ሐዲሰ ዜናነ ወዘይመጽእ ክንውናተ ቤተ ትምህርት ሰንበት በዝየ።",
    "latestNews": "ሐዲስ ዜና",
    "upcomingEvents": "ዘይመጽእ ክንውናት",
    "noNews": "አልቦ ሐዲስ ዜና። ናሁ ግቡ ድኅረ።",
    "noEvents": "አልቦ ዘይመጽእ ክንውናት። ተጸበዩ!",
    "viewAll": "ርአዩ ኵሎ ዜና ወክንውናተ",
    "promoTitle": "መተግበሪያ ፡ ዓምደሃይማኖት ፡ ዝማሬ ፡ አውርዱ!",
    "promoSubtitle": "ልዕለ ፪፻፬፻ ግጥመ ወድምጸ ዝማሬ ኦርቶዶክስ ዘእግዚእነ ወቅዱሳን ወዘወትር ወበዓላት ውስተ ሞባይልክሙ።",
    "promoEyebrow": "ይእዜ በ Google Play",
    "promoFeature1": "ልዕለ ፪፻፬፻ ዝማሬ ምስለ ግጥም ወድምጽ",
    "promoFeature2": "እግዚእነ፣ ቅዱሳን፣ ዘወትር ወበዓላት",
    "promoButton": "አውርድ",
    "testimonials": [
        {
            "quote": "ለገጸ ቤተ ክርስቲያን ዘነገ እመ ትሔልዩ፣ ዮም ለቤተ ትምህርት ሰንበት ውስተ ልብክሙ አኑሩ።",
            "author": "አቡነ ጎርጎርዮስ ካልዕ",
            "role": "ሊቀ ጳጳስ"
        },
        {
            "quote": "ቤተ ክርስቲያን ዘአልባቲ ወጣንያን አልባቲ ሕይወተ ነገ፤ ወወጣኒ ዘአልቦ ውስተ ቤተ ክርስቲያን አልቦቱ ሕይወተ ነገ።",
            "author": "አቡነ ሺኖዳ ሳልሣዊ",
            "role": "የግብጽ ፓትሪያርክ"
        },
        {
            "quote": "ምሀሮ ለሕፃን ፍኖተ ጽድቅ፤ ወሶበኒ ልኅቀ ኢይርሕቅ እምኔሃ።",
            "author": "ምሳ ፳፪፡፮",
            "role": "ጠቢቡ ሰለሞን"
        },
        {
            "quote": "እስከ እመጽእ ተገሀሥ ለአንብቦ ወለመምከር ወለተምህሮ።",
            "author": "፩ጢሞ ፬፡፲፫",
            "role": "ቅዱስ ጳውሎስ"
        },
        {
            "quote": "ወምሀሮሙ ለደቂቅከ፣ ወተናገሮሙ ሶበ ትነብር ውስተ ቤትከ፣ ወሶበ ትሐውር ፍኖተ፣ ወሶበ ትነውም ወሶበ ትትነሣእ።",
            "author": "ዘዳ ፮፡፯",
            "role": "ሊቀ ነቢያት ሙሴ"
        }
    ]
},
};;



const HomePage = ({ language = 'en' }) => {
  const t = translations[language] || translations.en;
  const brandName = brandTitles[language] || brandTitles.en;
  const [notifications, setNotifications] = useState({ news: [], events: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const [newsResponse, eventsResponse] = await Promise.all([api.get('/posts'), api.get('/events')]);
        setNotifications({
          news: newsResponse.data.slice(0, 2),
          events: eventsResponse.data.filter((event) => isFuture(parseISO(event.event_date))).slice(0, 2),
        });
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const features = [
    {
      title: t.faithFormation,
      description: t.faithDesc,
      icon: <Book />,
      image: bibleStudy,
      link: { text: t.botLinkText || 'Open Telegram Bot', url: 'https://t.me/Amide1bot' }
    },
    {
      title: t.christianCommunity,
      description: t.communityDesc,
      icon: <MusicNote />,
      image: heroImage,
      link: { text: t.promoButton || 'Google Play', url: PLAY_STORE_URL }
    },
    { title: t.religiousEducation, description: t.educationDesc, icon: <Groups />, image: community },
    { title: t.libraryService, description: t.libraryDesc, icon: <LocalLibrary />, image: bibleStudy },
    {
      title: t.mediaServices,
      description: [
        t.mediaText,
        '',
        `• ${t.baptisms}`,
        `• ${t.weddings}`,
        `• ${t.specialOccasions}`,
        `• ${t.mediaContact || 'For more information, call 0903896637.'}`,
      ].join('\n'),
      icon: <CameraAlt />,
      image: mediaServicesImage,
      link: { text: t.learnMore || 'Learn more', url: '/media-and-tech' },
    },
  ];
  const testimonials = t.testimonials || [];
  const duplicated = [...testimonials, ...testimonials];

  return (
    <>
      <SEO title={t.pageTitle} description={t.pageDescription} language={language} />

      <Box sx={{ bgcolor: brand.stone }}>
        <HomeHero
          subjectImage={heroPortrait}
          logoSrc={crestLogo}
          backgroundImage={heroImage}
          brandName={brandName}
          tagline={brandTaglines[language] || brandTaglines.en}
          headline={t.headline}
          quoteAuthor={t.heroQuoteAuthor}
          quoteRole={t.heroQuoteRole}
        />

        <SpiritualServices
          eyebrow={t.pillarsSub}
          title={t.corePillars}
          features={features}
        />

        <LivingGeneration
          backgroundImage={teacherWithKids}
          title={t.buildingFaith}
          historyText={t.historyText}
          quote={t.quote}
          foundedYear="1964"
        />

        <AnnouncementsBand
          title={t.announcementsTitle}
          subtitle={t.announcementsSub}
          latestNewsLabel={t.latestNews}
          upcomingEventsLabel={t.upcomingEvents}
          noNews={t.noNews}
          noEvents={t.noEvents}
          viewAllLabel={t.viewAll}
          loading={loading}
          news={localizePosts(notifications.news, language)}
          events={localizeEvents(notifications.events, language)}
        />

        <AppPromoBand
          eyebrow={t.promoEyebrow}
          title={t.promoTitle}
          subtitle={t.promoSubtitle}
          ctaLabel={t.promoButton}
          features={[t.promoFeature1, t.promoFeature2]}
        />

        {/* Fathers' words — horizontal scroll, no star ratings clutter */}
        <PageSection variant="ink" pattern>
          <Container maxWidth="lg">
            <SectionHeader title={t.testimonialsNote} light />
          </Container>
          <Box sx={{ overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                width: 'max-content',
                maxWidth: 'none',
                animation: 'homeMarquee 55s linear infinite',
                '@keyframes homeMarquee': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(-50%)' },
                },
                '&:hover': { animationPlayState: 'paused' },
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                },
              }}
            >
              {duplicated.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    width: { xs: 300, sm: 360 },
                    mx: 2,
                    p: 3.5,
                    border: `1px solid ${alpha(brand.gold, 0.25)}`,
                    bgcolor: alpha('#fff', 0.03),
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                      fontStyle: 'italic',
                      fontSize: '1.2rem',
                      color: alpha('#fff', 0.9),
                      mb: 3,
                      lineHeight: 1.55,
                      minHeight: 120,
                    }}
                  >
                    “{item.quote}”
                  </Typography>
                  <Typography sx={{ color: brand.gold, fontWeight: 600, fontSize: '0.95rem' }}>{item.author}</Typography>
                  <Typography sx={{ color: alpha('#fff', 0.5), fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', mt: 0.5 }}>
                    {item.role}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </PageSection>

        {/* Join CTA */}
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
              }}
            />
            <Typography variant="h2" sx={{ mb: 2, color: brand.white }}>{t.joinFamily}</Typography>
            <GoldDivider />
            <Typography sx={{ mb: 4, mt: 2, color: alpha('#fff', 0.75) }}>{t.joinText}</Typography>
            <Button variant="contained" color="secondary" size="large" href="/register" sx={{ px: 6 }}>
              {t.registerToday}
            </Button>
          </Container>
        </PageSection>
      </Box>
    </>
  );
};

export default HomePage;
