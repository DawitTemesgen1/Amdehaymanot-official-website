import React, { useState } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Avatar, Button,
  styled, useMediaQuery, Chip, List, ListItem, ListItemIcon, useTheme, alpha, Collapse
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async'; // <-- SEO: IMPORT HELMET

// --- IMAGE IMPORTS ---
import historyImage from '../assets/history.jpg';
import missionImage from '../assets/mission.jpg';
import priestImage from '../assets/image.jpeg';
import heroImage from '../assets/about-us.jpg';
import {
  Book, Favorite, School, Handshake, VolunteerActivism,
   Church, ExpandMore as ExpandMoreIcon,
  History, Flag, Gavel as GavelIcon
} from '@mui/icons-material';

// --- BRANDING COLORS ---
import brand from '../brand';

const kBrandedPrimary = brand.navy;
const kBrandedAccent = brand.gold;

// --- MODIFICATION: Added 'pageDescription' to all languages for dynamic SEO ---
const translations = {
    en: { appName: 'Amdehayimanot', ourStory: 'Our Story', pageTitle: 'About Amdehayimanot Sunday School', pageDescription: "Learn about the rich history, mission, and core values of Amdehayimanot Sunday School in Jimma. Founded in 1964, we are dedicated to spiritual education for youth.", pageSubtitle: 'History, Vision, Mission & Values', historyTitle: 'Our History', historyShort: 'The Amde Haymanot Sunday School of Jimma Debre Ephrata St. Mary Church was founded in 1973 E.C. by fathers and brothers who were zealous for spiritual service.', historyFull: [ 'Though services were temporarily suspended in 1973 due to the political climate, they were revived in 1977 through the efforts of two deacons. Since then, the Sunday School expanded its ministry to rural churches, organizing into departments such as Choir, Literature, and Education.', 'In the 1990s, student-led initiatives strengthened the school by establishing service departments and fostering experience-sharing with other parishes, like the Genete Tsige Sunday School. Development projects, such as collecting clothes for the needy and selling religious items, were also initiated during this period.', 'Over the past decade, its structure has grown to six levels, including adult and preparatory classes, organized across 13 service departments. It has developed its own curriculum and launched income-generating projects like a religious goods shop and candle manufacturing to fund its apostolic missions.' ], learnMore: 'Read Full History', showLess: 'Show Less', missionTitle: 'Our Vision & Mission', missionSubtitle: 'To see a wise generation raised with strong faith and exemplary character, ready to inherit the kingdom of heaven.', missionP1: 'Our mission is to uphold the dogmas, canons, and traditions of the Church, ensuring they are passed on to future generations.', missionAim: 'Our objectives are:', missionPoints: [ 'To provide holistic Church education that qualifies one for the kingdom of heaven.', 'To contribute to the spiritual and humanitarian prosperity of the country and community.', 'To nurture members in faith and ethics, preparing them to be the future custodians of the Church.' ], valuesTitle: 'Our Core Values', values: [ { icon: <GavelIcon />, title: 'Faith', description: 'Belief demonstrated through good deeds and unwavering doctrine.' }, { icon: <Favorite />, title: 'Love', description: 'The love of God and the love of one\'s neighbor.' }, { icon: <VolunteerActivism />, title: 'Compassion', description: 'Living out the six humanitarian acts of the Gospel.' }, { icon: <School />, title: 'Education', description: 'Spiritual and secular knowledge, as St. Paul advised Timothy.' }, { icon: <Church />, title: 'Service', description: 'Serving the Church and the community with humility.' }, { icon: <Handshake />, title: 'Humility', description: 'Following the example of our holy fathers and mothers.' }, { icon: <Book />, title: 'Holy Communion', description: 'Cleansing oneself through penance and renewing life through the Eucharist.' } ], leadershipTitle: 'Our Leadership', leaderName: 'Youth Brook Fikadu', leaderRole: 'Chairman of the Sunday School', leaderQuote: "Guiding the next generation with faith, wisdom, and compassion.", ctaTitle: 'Ready to Join Our Community?', ctaSubtitle: 'Explore our classes and events to see how your child can grow in faith and fellowship with us.', ctaButton: 'Explore Our Classes', },
    am: { appName: 'ዓምደሃይማኖት', ourStory: 'ታሪካችን', pageTitle: 'ስለ ዓምደሃይማኖት ሰንበት ትምህርት ቤት', pageDescription: "ስለ ጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት የበለጸገ ታሪክ፣ ተልዕኮ እና ዋና እሴቶች ይወቁ። በ1964 ዓ.ም የተመሰረተ ሲሆን ለወጣቶች መንፈሳዊ ትምህርት ለመስጠት ቁርጠኛ ነን።", pageSubtitle: 'ታሪክ፣ ራዕይ፣ ተልዕኮና ዕሴት', historyTitle: 'የእኛ ታሪክ', historyShort: 'የጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ቤተ ክርስቲያን አምደ ሃይማኖት ሰንበት ትምህርት ቤት በ፲፱፻፷፭ ዓ.ም ለመንፈሳዊ አገልግሎት ይፋጠኑ በነበሩ አባቶችና ወንድሞች የተመሠረተ ነው።', historyFull: [ 'በ1973 ዓ.ም በነበረው አብዮታዊ ሥርዓት ምክንያት አገልግሎቱ ለጊዜው ቢቋረጥም፣ በ1977 ዓ.ም በሁለት ዲያቆናት አማካኝነት እንደገና ተጀምሯል። ከዚያን ጊዜ ጀምሮ፣ ሰንበት ትምህርት ቤቱ እንደ መዝሙር፣ ሥነ ጽሑፍና ትምህርት ባሉ ክፍሎች ተደራጅቶ ወደ ገጠር አብያተ ክርስቲያናት እየተጓዘ በስፋት አገልግሏል።', 'በ1990ዎቹ የተማሪዎች ተነሳሽነት ትምህርት ቤቱን በማጠናከር የአገልግሎት ክፍሎችን በማቋቋም እና ከሌሎች አጥቢያዎች ጋር እንደ ገነተ ጽጌ ሰንበት ትምህርት ቤት ያሉ ልምዶችን በመለዋወጥ ረድቷል። ለችግረኞች ልብስ መሰብሰብ እና የሃይማኖት ቁሳቁሶችን መሸጥ ያሉ የልማት ፕሮጀክቶች በዚህ ወቅት ተጀምረዋል።', 'ባለፉት አስር ዓመታት ውስጥ፣ አወቃቀሩ የጎልማሶች እና የመሰናዶ ክፍሎችን ጨምሮ ወደ ስድስት ደረጃዎች አድጓል፤ በ13 የአገልግሎት ክፍሎች ተደራጅቷል። የራሱን የትምህርት ካሪኩለም በማዘጋጀት እና ገቢ የሚያስገኙ ፕሮጀክቶችን (እንደ ንዋያተ ቅዱሳት መሸጫ እና የጧፍ ማምረቻ) በመጀመር ሐዋርያዊ ተልዕኮዎቹን በገንዘብ ለመደገፍ ችሏል።' ], learnMore: 'ሙሉውን ታሪክ ያንብቡ', showLess: 'በสังเขป አሳይ', missionTitle: 'ራዕይ እና ተልዕኮ', missionSubtitle: 'ቅዱሳን አባቶች ጠብቀው ያስረከቡንን የቤተ ክርስቲያን ዶግማና ቀኖና እንዲሁም ትውፊት አክብሮና አስከብሮ ተስፋ የምናደርገውን መንግስተ ሰማያት ለመውረስ የሚያበቃ የጸና ሃይማኖትና ምሳሌ የሆነ ምግባር ይዞ የሚገኝ ጥበበኛ ትውልድ ተፈጥሮ ማየት ነው።', missionP1: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ሃይማኖትና ሥርዓት እንዲጠበቅ እና ሳይለወጥ እንዲሁም ሳይበረዝ በቀጥታ ለትውልድ እንዲተላለፍ ማድረግ።', missionAim: 'ዓላማዎቻችን፡', missionPoints: [ 'ለመንግስተ ሰማያት የሚያበቃ ሁለንተናዊ የቤተ ክርስቲያን ትምህርት መማርና ማስተማር።', 'ቤተ ክርስቲያን ለሀገርና ለማኅበረሰቡ መንፈሳዊና ሰብአዊ ብልጽግና ልትወጣ የሚገባትን አስተዋጽኦ ማበርከት።', 'የሰንበት ትምህርት ቤቱን አባላት በሃይማኖትና በምግባር ኰትኩቶ በማሳደግ የነገይቱ ቤተ ክርስቲያን ተረካቢ መሆን በሚያስችላቸው ደረጃ ማብቃት።' ], valuesTitle: 'የእኛ እሴቶች', values: [ { icon: <GavelIcon />, title: 'ሃይማኖት', description: 'በምግባር የተገለጠ እምነት፤ የማንደራደርበት የቤተ ክርስቲያን አስተምህሮ።' }, { icon: <Favorite />, title: 'ፍቅር', description: 'ፍቅረ እግዚአብሔርና ፍቅረ ቢጽ።' }, { icon: <VolunteerActivism />, title: 'ርህራሄ', description: 'ስድስቱ ቃላተ ወንጌልን መፈጸም።' }, { icon: <School />, title: 'ትምህርት', description: 'መንፈሳዊና ሰብአዊ ጥበብ።' }, { icon: <Church />, title: 'አገልግሎት', description: 'ለቤተ ክርስቲያንና ለማኅበረሰቡ በትህትና ማገልገል።' }, { icon: <Handshake />, title: 'ትህትና', description: 'እንደ ቅዱሳን አባቶቻችንና እናቶቻችን መሆን።' }, { icon: <Book />, title: 'ሥጋ ወደሙ', description: 'በንስሃ እየታጠቡ ራስን በቁርባን ማደስ።' } ], leadershipTitle: 'የሰንበት ትምህርት ቤቱ ሰብሳቢ', leaderName: 'ወጣት ብሩክ ፍቃዱ', leaderRole: 'የሰንበት ትምህርት ቤቱ ሰብሳቢ እና የጅማ ሰንበት ትምህርት ቤቶች አንድነት ምክትል ሰብሳቢ', leaderQuote: 'ቀጣዩን ትውልድ በእምነት፣ በጥበብና በርህራሄ መምራት።', ctaTitle: 'የማህበረሰባችን አካል ለመሆን ዝግጁ ኖት?', ctaSubtitle: 'ልጅዎ በእምነትና በኅብረት ከእኛ ጋር እንዴት እንደሚያድግ ለማየት ክፍሎቻችንንና ዝግጅቶቻችንን ይጎብኙ።', ctaButton: 'ክፍሎቻችንን ያስሱ', },
    ti: { appName: 'ዓምደሃይማኖት', ourStory: 'ዛንታና', pageTitle: 'ብዛዕባ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት', pageDescription: "ብዛዕባ ናይ ጅማ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ሃብታም ታሪኽ፡ ተልእኾን ቀንዲ ክብርታትን ተማሃሩ። ኣብ 1964 ዝተመስረተ ኮይኑ፡ ንመንእሰያት መንፈሳዊ ትምህርቲ ንምሃብ ቆሪጽና ንርከብ።", pageSubtitle: 'ታሪኽ፣ ራእይ፣ ተልእኾን ክብርታትን', historyTitle: 'ታሪኽና', historyShort: 'ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ናይ ጅማ ደብረ ኤፍራታ ቅድስት ማርያም ቤተ ክርስቲያን ኣብ 1964 ዓ.ም. ብመንፈሳዊ ኣገልግሎት ዝተበገሱ ኣቦታትን ኣሕዋትን ተመስሪቱ።', historyFull: [ 'ኣገልግሎት ብሰንኪ ናይቲ ግዜ ፖለቲካዊ ኩነታት ኣብ 1973 ግዝያዊ ደው እኳ እንተበለ፡ ብጻዕሪ ክልተ ዲያቆናት ኣብ 1977 ዳግማይ ተጀሚሩ። እቲ ቤት ትምህርቲ ድማ ኣገልግሎቱ ናብ ገጠራት ብምስፋሕ፡ ከም መዘምራን፡ ስነ-ጽሑፍን ትምህርትን ዝኣመሰሉ ክፍልታት ተወዲቡ።', 'ኣብ 1990ታት፡ ብተምሃሮ ዝተበገሱ ተበግሶታት ነቲ ቤት ትምህርቲ ብምድልዳል ናይ ኣገልግሎት ክፍልታት መስሪቶምን ምስ ካልኦት ኣብያተ-ክርስትያን ምትእስሳር ፈጢሮምን። ከም ንዝተጸገሙ ሰባት ክዳውንቲ ምእካብን ሃይማኖታዊ ኣቕሑት ምሻጥን ዝኣመሰሉ ናይ ልምዓት ፕሮጀክትታት ኣብዚ እዋን’ዚ ተጀሚሮም።', 'ኣብ ዝሓለፈ ዓሰርተ ዓመታት፡ እቲ ኣወዳድባ ናብ ሽዱሽተ ደረጃታት ዓብዩ፡ እዚ ድማ ናይ ዓበይትን ምድላውን ክፍሊታት ዘጠቓልል ኮይኑ፡ ኣብ 13 ናይ ኣገልግሎት ክፍልታት ተወዲቡ። ናይ ገዛእ ርእሱ ስርዓተ-ትምህርቲ ኣዳልዩን ከም ናይ ሃይማኖታዊ ኣቕሑት መሸጥን ሽምዓ ምፍራይን ዝኣመሰሉ እቶት ዘመንጭዉ ፕሮጀክትታት ብምጅማር ንሃዋርያዊ ተልእኾታቱ ፋይናንስ ይገብር ኣሎ።' ], learnMore: 'ሙሉእ ታሪኽ ኣንብብ', showLess: 'ኣሕጽር ኣቢልካ ኣርእይ', missionTitle: 'ራእይናን ተልእኾናን', missionSubtitle: 'ብጽኑዕ እምነትን ኣብነታዊ ጠባይን ዝዓበየ፡ መንግስተ ሰማያት ንምውራስ ድልዊ ዝኾነ ለባም ወለዶ ምርኣይ።', missionP1: 'ተልእኾና፡ ዶግማ፡ ቀኖናን ትውፊትን ቤተ ክርስቲያን ምሕላው ኮይኑ፡ ናብ ዝመጽእ ወለዶ ምትሕልላፍ የረጋግጽ።', missionAim: 'ዕላማታትና፡', missionPoints: [ 'ንምንግስተ ሰማያት ዘብቅዕ ሁለንተናዊ ትምህርቲ ቤተ ክርስቲያን ምሃብ።', 'ንመንፈሳውን ሰብኣውን ብልጽግና ሃገርን ማሕበረሰብን ኣበርክቶ ምግባር።', 'ኣባላት ብእምነትን ስነ-ምግባርን ምዕባይ፡ ንመጻኢ ናይ ቤተ ክርስቲያን ተረከብቲ ምድላው።' ], valuesTitle: ' ቀንዲ ክብርታትና', values: [ { icon: <GavelIcon />, title: 'እምነት', description: 'ብስሩሕ ግብርን ዘይናወጽ ትምህርትን ዝግለጽ እምነት።' }, { icon: <Favorite />, title: 'ፍቕሪ', description: 'ፍቕሪ ኣምላኽን ፍቕሪ ብጻይን።' }, { icon: <VolunteerActivism />, title: 'ርህራሀ', description: 'ነቶም ሽዱሽተ ሰብኣዊ ተግባራት ወንጌል ምንባር።' }, { icon: <School />, title: 'ትምህርቲ', description: 'መንፈሳውን ስጋውን ፍልጠት፡ ከምቲ ቅዱስ ጳውሎስ ንጢሞቴዎስ ዝመኸሮ።' }, { icon: <Church />, title: 'ኣገልግሎት', description: 'ንቤተ ክርስቲያንን ንማሕበረሰብን ብትሕትና ምግልጋል።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'ኣሰር ቅዱሳን ኣቦታትናን ኣዴታትናን ምስዓብ።' }, { icon: <Book />, title: 'ቁርባን', description: 'ብንስሓ ምጽራይን ብቁርባን ህይወት ምሕዳስን።' } ], leadershipTitle: 'መሪሕነትና', leaderName: 'ወጣት ብሩክ ፍቃዱ', leaderRole: 'ሰብሳቢ ቤት ትምህርቲ ሰንበት', leaderQuote: 'ንዝመጽእ ወለዶ ብእምነት፡ ጥበብን ርህራሀን ምምራሕ።', ctaTitle: 'ኣባል ማሕበረሰብና ክትከውን ድልዊ ዲኻ?', ctaSubtitle: 'ውሉድኩም ብእምነትን ሕብረትን ምሳና ከመይ ከም ዝዓቢ ንምርኣይ፡ ክፍለ-ትምህርትታትናን ፍጻሜታትናን መርምሩ።', ctaButton: 'ክፍለ-ትምህርትታትና መርምሩ', },
    om: { appName: 'Amdehayimanot', ourStory: 'Seenaa Keenya', pageTitle: 'Waa\'ee Mana Barumsaa Dilbataa Amdehayimanot', pageDescription: "Seenaa, ergama, fi duudhaalee bu'uuraa Mana Barumsaa Dilbataa Amdehayimanot kan Jimmaa baradhaa. Bara 1973 kan hundeeffame, dargaggootaaf barnoota hafuuraa kennuuf of kennee jira.", pageSubtitle: 'Seenaa, Mul’ata, Ergamaa fi Duudhaalee', historyTitle: 'Seenaa Keenya', historyShort: 'Manni Barumsaa Dilbataa Amdehayimanot kan Waldaa Qulqulleettii Maariyaam Jimmaa Dabra Efraataa bara 1973 abbootii fi obboleeyyan tajaajila hafuuraatiif ariifataniin hundeeffame.', historyFull: [ 'Tajaajilli sababa siyaasaa yeroo sanaatiin bara 1981 yeroof addaan citus, bara 1985 carraaqqii diyaaqonoota lamaatiin irra deebi\'ee jalqabame. Sana booda, manni barumsichaa damee akka Kooyarii, Ogbarruu, fi Barnootaatti gurmaa\'uun tajaajila isaa gara waldaalee baadiyyaatti babal\'iseera.', 'Bara 1990n keessa, sochii barattootaan durfamuun damee tajaajilaa hundeessuun fi waldaalee biroo waliin muuxannoo waljijjiiruun mana barumsichaa cimseera. Piroojektiin guddinaa kan akka uffata harka qalleeyyiif walitti qabuu fi meeshaalee amantaa gurguruun yeroo sanatti jalqabame.', 'Kurnan waggaa darbe keessatti, caasaan isaa gara sadarkaa ja\'atti guddate, kutaa ga\'eessotaa dabalatee, damee tajaajilaa 13 jalatti gurmaa\'eera. Sirna barnootaa mataa isaa baafatee fi piroojektii galii madda ta\'an kan akka suuqii meeshaalee amantaa fi oomisha shamaa jalqabuun ergama isaa raawwachaa jira.' ], learnMore: 'Seenaa Guutuu Dubbisi', showLess: 'Gabaabsi', missionTitle: 'Mul\'ata fi Ergama Keenya', missionSubtitle: 'Dhaloota ogummaa qabu, amantaa cimaa fi amala fakkeenya ta\'een guddate, mootummaa samii dhaaluuf qophaa\'e arguu.', missionP1: 'Ergamni keenya dogmaa, qajeelfama, fi duudhaa Waldaa tiksuudhaan, dhaloota dhufuuf akka darbu gochuudha.', missionAim: 'Kaayyoon keenya:', missionPoints: [ 'Barnoota Waldaa guutuu kan mootummaa samiitiif nama geessu kennuu.', 'Guddina hafuuraa fi namoomaa biyyaa fi hawaasaatiif gumaachuu.', 'Miseensota amantaa fi naamusaan kunuunsuun, fuulduraaf Waldaa kan dhaalan gochuu.' ], valuesTitle: 'Duudhaalee Bu\'uuraa Keenya', values: [ { icon: <GavelIcon />, title: 'Amantaa', description: 'Amantaa gocha gaarii fi barsiisa hin raafamneen mul\'atu.' }, { icon: <Favorite />, title: 'Jaalala', description: 'Jaalala Waaqayyoo fi jaalala namaa.' }, { icon: <VolunteerActivism />, title: 'Garaa Laafina', description: 'Gochaalee namoomaa Wangeelaa jahan hojiirra oolchuu.' }, { icon: <School />, title: 'Barnoota', description: 'Beekumsa hafuuraa fi addunyaa, akka Phaawuloos Ximotewoos gorse.' }, { icon: <Church />, title: 'Tajaajila', description: 'Waldaa fi hawaasa gad-of-deebisuun tajaajiluu.' }, { icon: <Handshake />, title: 'Gad-of-deebisuu', description: 'Fakkeenya abboottii fi haadholii qulqulluu hordofuu.' }, { icon: <Book />, title: 'Qulqulleettii Qurbanaa', description: 'Qalbii diddiirrannaan of qulqulleessuu fi Qurbaanaan jireenya haaressuu.' } ], leadershipTitle: 'Hoggansa Keenya', leaderName: 'Dargaggoo Biruuk Fiqaaduu', leaderRole: 'Dura Taa\'aa Mana Barumsaa Dilbataa', leaderQuote: 'Dhaloota dhufu amantaa, ogummaa, fi garaa laafinaan gaggeessuu.', ctaTitle: 'Hawaasa Keenyaatti Dabalamuuf Qophiidhaa?', ctaSubtitle: 'Ijoolleen keessan amantaa fi walitti dhufeenyaan nu wajjin akkamitti akka guddatan arguuf kutaa barnootaa fi sagantaawwan keenya daawwadhaa.', ctaButton: 'Kutaa Barnootaa Keenya Daawwadhaa', },
    es: { appName: 'Amdehayimanot', ourStory: 'Nuestra Historia', pageTitle: 'Sobre la Escuela Dominical Amdehayimanot', pageDescription: "Conozca la rica historia, misión y valores fundamentales de la Escuela Dominical Amdehayimanot en Jimma. Fundada en 1973, nos dedicamos a la educación espiritual para jóvenes.", pageSubtitle: 'Historia, Visión, Misión y Valores', historyTitle: 'Nuestra Historia', historyShort: 'La Escuela Dominical Amde Haymanot de la Iglesia de Santa María de Jimma Debre Ephrata fue fundada en 1973 por padres y hermanos celosos del servicio espiritual.', historyFull: [ 'Aunque los servicios se interrumpieron temporalmente en 1981 debido al clima político, se reanudaron en 1985 gracias a los esfuerzos de dos diáconos. Desde entonces, la Escuela Dominical expandió su ministerio a las iglesias rurales, organizándose en departamentos como Coro, Literatura y Educación.', 'En la década de 1990, las iniciativas estudiantiles fortalecieron la escuela estableciendo departamentos de servicio y fomentando intercambios de experiencias con otras parroquias, como la Escuela Dominical Genete Tsige. También se iniciaron proyectos de desarrollo, como la recolección de ropa para los necesitados y la venta de artículos religiosos.', 'Durante la última década, su estructura ha crecido a seis niveles, incluyendo clases para adultos y preparatorias, organizadas en 13 departamentos de servicio. Ha desarrollado su propio currículo y ha lanzado proyectos generadores de ingresos, como una tienda de artículos religiosos y la fabricación de velas, para financiar sus misiones apostólicas.' ], learnMore: 'Leer Historia Completa', showLess: 'Mostrar Menos', missionTitle: 'Nuestra Visión y Misión', missionSubtitle: 'Ver una generación sabia, criada con fe sólida y carácter ejemplar, lista para heredar el reino de los cielos.', missionP1: 'Nuestra misión es defender los dogmas, cánones y tradiciones de la Iglesia, asegurando que se transmitan a las generaciones futuras.', missionAim: 'Nuestros objetivos son:', missionPoints: [ 'Proporcionar una educación eclesiástica integral que califique para el reino de los cielos.', 'Contribuir a la prosperidad espiritual y humanitaria del país y la comunidad.', 'Formar a los miembros en la fe y la ética, preparándolos para ser los futuros custodios de la Iglesia.' ], valuesTitle: 'Nuestros Valores Fundamentales', values: [ { icon: <GavelIcon />, title: 'Fe', description: 'Creencia demostrada a través de buenas obras y una doctrina inquebrantable.' }, { icon: <Favorite />, title: 'Amor', description: 'El amor a Dios y el amor al prójimo.' }, { icon: <VolunteerActivism />, title: 'Compasión', description: 'Vivir los seis actos humanitarios del Evangelio.' }, { icon: <School />, title: 'Educación', description: 'Conocimiento espiritual y secular, como aconsejó San Pablo a Timoteo.' }, { icon: <Church />, title: 'Servicio', description: 'Servir a la Iglesia y a la comunidad con humildad.' }, { icon: <Handshake />, title: 'Humildad', description: 'Siguiendo el ejemplo de nuestros santos padres y madres.' }, { icon: <Book />, title: 'Santa Comunión', description: 'Purificarse mediante la penitencia y renovar la vida mediante la Eucaristía.' } ], leadershipTitle: 'Nuestro Liderazgo', leaderName: 'Joven Brook Fikadu', leaderRole: 'Presidente de la Escuela Dominical', leaderQuote: 'Guiando a la próxima generación con fe, sabiduría y compasión.', ctaTitle: '¿Listo para Unirte a Nuestra Comunidad?', ctaSubtitle: 'Explora nuestras clases y eventos para ver cómo tu hijo puede crecer en fe y compañerismo con nosotros.', ctaButton: 'Explora Nuestras Clases', },
    fr: { appName: 'Amdehayimanot', ourStory: 'Notre Histoire', pageTitle: 'À propos de l\'École du Dimanche Amdehayimanot', pageDescription: "Découvrez la riche histoire, la mission et les valeurs fondamentales de l'École du Dimanche Amdehayimanot à Jimma. Fondée en 1973, nous nous consacrons à l'éducation spirituelle des jeunes.", pageSubtitle: 'Histoire, Vision, Mission et Valeurs', historyTitle: 'Notre Histoire', historyShort: 'L\'école du dimanche Amde Haymanot de l\'église Sainte-Marie de Jimma Debre Ephrata a été fondée en 1973 par des pères et des frères zélés pour le service spirituel.', historyFull: [ 'Bien que les services aient été temporairement suspendus en 1981 en raison du climat politique, ils ont été relancés en 1985 grâce aux efforts de deux diacres. Depuis lors, l\'école du dimanche a étendu son ministère aux églises rurales, en s\'organisant en départements tels que la chorale, la littérature et l\'éducation.', 'Dans les années 1990, des initiatives étudiantes ont renforcé l\'école en créant des départements de service et en favorisant les échanges d\'expériences avec d\'autres paroisses, comme l\'école du dimanche de Genete Tsige. Des projets de développement, tels que la collecte de vêtements pour les nécessiteux et la vente d\'articles religieux, ont également été lancés à cette période.', 'Au cours de la dernière décennie, sa structure s\'est développée sur six niveaux, y compris des cours pour adultes et préparatoires, organisés en 13 départements de service. Elle a développé son propre programme et lancé des projets générateurs de revenus, comme une boutique d\'articles religieux et la fabrication de bougies, pour financer ses missions apostoliques.' ], learnMore: 'Lire l\'Histoire Complète', showLess: 'Afficher Moins', missionTitle: 'Notre Vision & Mission', missionSubtitle: 'Voir une génération sage, élevée avec une foi solide et un caractère exemplaire, prête à hériter du royaume des cieux.', missionP1: 'Notre mission est de défendre les dogmes, canons et traditions de l\'Église, en veillant à ce qu\'ils soient transmis aux generations futures.', missionAim: 'Nos objectifs sont :', missionPoints: [ 'Fournir une éducation ecclésiale holistique qui qualifie pour le royaume des cieux.', 'Contribuer à la prospérité spirituelle et humanitaire du pays et de la communauté.', 'Former les membres dans la foi et l\'éthique, les préparant à être les futurs gardiens de l\'Église.' ], valuesTitle: 'Nos Valeurs Fondamentales', values: [ { icon: <GavelIcon />, title: 'Foi', description: 'Croyance démontrée par de bonnes œuvres et une doctrine inébranlable.' }, { icon: <Favorite />, title: 'Amour', description: 'L\'amour de Dieu et l\'amour du prochain.' }, { icon: <VolunteerActivism />, title: 'Compassion', description: 'Vivre les six actes humanitaires de l\'Évangile.' }, { icon: <School />, title: 'Éducation', description: 'Connaissance spirituelle et séculière, comme l\'a conseillé Saint Paul à Timothée.' }, { icon: <Church />, title: 'Service', description: 'Servir l\'Église et la communauté avec humilité.' }, { icon: <Handshake />, title: 'Humilité', description: 'Suivre l\'exemple de nos saints pères et mères.' }, { icon: <Book />, title: 'Sainte Communion', description: 'Se purifier par la pénitence et renouveler sa vie par l\'Eucharistie.' } ], leadershipTitle: 'Notre Direction', leaderName: 'Jeune Brook Fikadu', leaderRole: 'Président de l\'École du Dimanche', leaderQuote: 'Guider la prochaine génération avec foi, sagesse et compassion.', ctaTitle: 'Prêt à Rejoindre Notre Communauté ?', ctaSubtitle: 'Explorez nos cours et événements pour voir comment votre enfant peut grandir dans la foi et la fraternité avec nous.', ctaButton: 'Explorez Nos Cours', },
    ar: { appName: 'عماد الإيمان', ourStory: 'قصتنا', pageTitle: 'حول مدرسة الأحد عماد الإيمان', pageDescription: "تعرف على التاريخ الغني والرسالة والقيم الأساسية لمدرسة الأحد عماد الإيمان في جيما. تأسست عام 1964، ونحن ملتزمون بالتعليم الروحي للشباب.", pageSubtitle: 'تاريخ، رؤية، رسالة، وقيم', historyTitle: 'تاريخنا', historyShort: 'تأسست مدرسة الأحد "عماد الإيمان" التابعة لكنيسة السيدة مريم العذراء في جيما دير إفراتا عام 1973 على يد آباء وإخوة غيورين على الخدمة الروحية.', historyFull: [ 'على الرغم من توقف الخدمات مؤقتًا في عام 1981 بسبب المناخ السياسي، إلا أنها استؤنفت في عام 1985 بجهود اثنين من الشمامسة. منذ ذلك الحين، وسعت مدرسة الأحد خدمتها لتشمل الكنائس الريفية، وتم تنظيمها في أقسام مثل الكورال والأدب والتعليم.', 'في التسعينيات، عززت المبادرات الطلابية المدرسة من خلال إنشاء أقسام خدمية وتعزيز تبادل الخبرات مع الرعايا الأخرى، مثل مدرسة الأحد في جينات تسيج. كما بدأت مشاريع تنموية، مثل جمع الملابس للمحتاجين وبيع المواد الدينية، خلال هذه الفترة.', 'على مدى العقد الماضي، نما هيكلها إلى ستة مستويات، بما في ذلك فصول للبالغين والتحضيرية، منظمة عبر 13 قسمًا خدميًا. وقد طورت منهجها الخاص وأطلقت مشاريع مدرة للدخل مثل متجر للسلع الدينية ومصنع للشموع لتمويل مهامها الرسولية.' ], learnMore: 'اقرأ التاريخ الكامل', showLess: 'عرض أقل', missionTitle: 'رؤيتنا ورسالتنا', missionSubtitle: 'رؤية جيل حكيم، نشأ على إيمان قوي وشخصية مثالية، ومستعد لوراثة ملكوت السماوات.', missionP1: 'رسالتنا هي التمسك بعقائد الكنيسة وقوانينها وتقاليدها، وضمان نقلها إلى الأجيال القادمة.', missionAim: 'أهدافنا هي:', missionPoints: [ 'توفير تعليم كنسي شامل يؤهل لملكوت السماوات.', 'المساهمة في الازدهار الروحي والإنساني للبلاد والمجتمع.', 'تنشئة الأعضاء في الإيمان والأخلاق، وإعدادهم ليكونوا أمناء الكنيسة في المستقبل.' ], valuesTitle: 'قيمنا الأساسية', values: [ { icon: <GavelIcon />, title: 'الإيمان', description: 'الإيمان الذي يظهر من خلال الأعمال الصالحة والعقيدة الراسخة.' }, { icon: <Favorite />, title: 'المحبة', description: 'محبة الله ومحبة القريب.' }, { icon: <VolunteerActivism />, title: 'الرحمة', description: 'تطبيق أعمال الإنجيل الإنسانية الستة.' }, { icon: <School />, title: 'التعليم', description: 'المعرفة الروحية والدنيوية، كما نصح القديس بولس تيموثاوس.' }, { icon: <Church />, title: 'الخدمة', description: 'خدمة الكنيسة والمجتمع بتواضع.' }, { icon: <Handshake />, title: 'التواضع', description: 'اتباع مثال آبائنا وأمهاتنا القديسين.' }, { icon: <Book />, title: 'المناولة المقدسة', description: 'تطهير النفس من خلال التوبة وتجديد الحياة من خلال القربان المقدس.' } ], leadershipTitle: 'قيادتنا', leaderName: 'الشاب بروك فيكادو', leaderRole: 'رئيس مدرسة الأحد', leaderQuote: 'قيادة الجيل القادم بالإيمان والحكمة والرحمة.', ctaTitle: 'هل أنت مستعد للانضمام إلى مجتمعنا؟', ctaSubtitle: 'استكشف فصولنا وفعالياتنا لترى كيف يمكن لطفلك أن ينمو في الإيمان والزمالة معنا.', ctaButton: 'استكشف فصولنا', },
    ge: { appName: 'ዓምደ ሃይማኖት', ourStory: 'ዜናነ', pageTitle: 'ስለ ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት', pageDescription: "ስለ ታሪከነ፣ ተልእኮነ、 ወቁምነገርነ ዘቤት ትምህርት ሰንበት ዓምደ ሃይማኖት በጅማ ተመሀሩ። በዓመተ ፲፱፻፷ወ፭ ተመሥረተ、 ወንሕነ ለትምህርተ መንፈስ ለኖሎት ቆምና።", pageSubtitle: 'ታሪክ፣ ራእይ、 ተልእኮ ወቁምነገር', historyTitle: 'ታሪከነ', historyShort: 'ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት ዘደብረ ኤፍራታ ቅድስት ማርያም በጅማ በዓመተ ፲፱፻፷ወ፭ በአበው ወአኃው እለ መጽኡ ለተግባረ መንፈስ ተመሥረተ።', historyFull: [ 'አገልግሎቱ በዓመተ ፲፱፻፹ወ፩ በምክንያተ ፖለቲካ ለጊዜሁ ተዐገተ፣ ወበዓመተ ፲፱፻፹ወ፭ በክልኤቱ ዲያቆናት ዳግመ ተጀመረ። እምዝ ጊዜ ጀሚሮ፣ ቤት ትምህርቱ በአገልግሎተ ገጠር ተስፍሐ፣ ወበክፍላተ መዝሙር፣ ስነ ጽሑፍ፣ ወትምህርት ተወደበ።', 'በዓመተ ፲፱፻፺፣ ተነሳሒነ ተማሪሃ ለቤት ትምህርቱ አጽንዕዎ፣ ወክፍላተ አገልግሎተ መሥረቱ ወምስለ ካልኣን አድባራት ተላውጦ ገብሩ። ግብረ ልማት፣ ከመ አልባስ ለነዳያን ወመሸጠ ንዋያተ ቅድሳት፣ በዝየ ጊዜ ተጀመረ።', 'በዝ ዐሥርቱ ዓመታት፣ ሥርዓቱ እስከ ስድስቱ ደረጃታት ዐቢየ፣ ወበ ፲፫ ክፍላተ አገልግሎት ተወደበ። ሥርዓተ ትምህርቶ ወለገቢ ዘየዐውድ ግብራት፣ ከመ ሱቀ ንዋያተ ቅድሳት ወምፍራየ ጧፍ፣ ለሐዋርያዊ ተልእኮሁ ገብረ።' ], learnMore: 'ምንባበ ኵሉ ታሪክ', showLess: 'አሕጽር', missionTitle: 'ራእይነ ወተልእኮነ', missionSubtitle: 'ራእይነ ውእቱ ምልአተ ትውልድ ጠቢብ፣ በጽኑዕ ሃይማኖት ወበምግባር ምሳሌ、 ለርስዓተ መንግሥተ ሰማያት ዝግጁ።', missionP1: 'ተልእኮነ ውእቱ ዐቂበ ዶግማ፣ ቀኖና፣ ወትውፊት ዘቤተ ክርስቲያን፣ ወለተከታሊ ትውልድ አውርሶቶሙ።', missionAim: 'ዓላማቲነ፡', missionPoints: [ 'ትምህርተ ቤተ ክርስቲያን ፍጹመ ለርስዓተ መንግሥተ ሰማያት ምሃብ።', 'ለበረከተ ሀገር ወማኅበረሰብ መንፈሳዊ ወሰብአዊ አስተዋጽኦ ምግባር።', 'ለአባላት በሃይማኖት ወበምግባር ምዕባይ፣ ወለተከታሊተ ቤተ ክርስቲያን አበጋዝ ምድላዎሙ።' ], valuesTitle: 'ቁምነገርነ', values: [ { icon: <GavelIcon />, title: 'ሃይማኖት', description: 'እምነት በግብረ ሠናይ ወበኢየኃልቅ ትምህርት ዘይትከሠት።' }, { icon: <Favorite />, title: 'ፍቅር', description: 'ፍቅረ እግዚአብሔር ወፍቅረ ቢጽ።' }, { icon: <VolunteerActivism />, title: 'ምሕረት', description: 'ሕይወተ በስድስቱ ቃላተ ወንጌል ሰብአዊያን።' }, { icon: <School />, title: 'ትምህርት', description: 'ጥበበ መንፈሳዊ ወዓለማዊ፣ ከመ መከረ ቅዱስ ጳውሎስ ለጢሞቴዎስ።' }, { icon: <Church />, title: 'አገልግሎት', description: 'አገልግሎተ ቤተ ክርስቲያን ወማኅበረሰብ በትሕትና።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'ተክህሎተ አበዊነ ወእማቲነ ቅዱሳን።' }, { icon: <Book />, title: 'ቁርባን', description: 'ተሐድሶ ነፍስ በንስሓ ወበቁርባን።' } ], leadershipTitle: 'መሪሕነትነ', leaderName: 'ወጣት ብሩክ ፍቃዱ', leaderRole: 'ሊቀ መንበር ዘቤት ትምህርት ሰንበት', leaderQuote: 'ምርሐተ ለተከታሊ ትውልድ በሃይማኖት、 በጥበብ ወበምሕረት።', ctaTitle: 'ትፈቅዱኑ ተሳተፎተ በማኅበርነ?', ctaSubtitle: 'ርእዩ ክፍላተነ ወበዓላተነ ከመ ትርአዩ እፎ ውሉድክሙ ይትፌሥሑ በሃይማኖት ወበኅብረት ምስሌነ።', ctaButton: 'አስሱ ክፍላተነ', },
};


// --- (All your STYLED COMPONENTS remain exactly as they are) ---
const HeroSection = styled(Box)(({ theme }) => ({ backgroundImage: `linear-gradient(135deg, ${alpha(kBrandedPrimary, 0.85)} 0%, ${alpha(kBrandedPrimary, 0.7)} 100%), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: theme.palette.common.white, textAlign: 'center', padding: theme.spacing(4), position: 'relative', overflow: 'hidden', '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at 20% 80%, ${alpha(kBrandedAccent, 0.3)} 0%, transparent 50%)`, } }));
const Section = styled(Box)(({ theme }) => ({ padding: theme.spacing(12, 0), position: 'relative', [theme.breakpoints.down('md')]: { padding: theme.spacing(8, 0), }, }));
const GradientSection = styled(Section)(({ theme }) => ({ background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(kBrandedPrimary, 0.03)} 100%)`, }));
const CardSection = styled(Section)(({ theme }) => ({ background: `radial-gradient(circle at top right, ${alpha(kBrandedAccent, 0.08)} 0%, transparent 50%)`, }));
const AboutCard = styled(Paper)(({ theme }) => ({ padding: theme.spacing(5), height: '100%', borderRadius: 24, background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(kBrandedPrimary, 0.02)} 100%)`, border: `1px solid ${alpha(kBrandedPrimary, 0.1)}`, boxShadow: '0 20px 40px -20px rgba(0, 65, 121, 0.1)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(10px)', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 40px 60px -20px rgba(0, 65, 121, 0.15)', borderColor: alpha(kBrandedPrimary, 0.2), }, }));
const LargeAvatar = styled(Avatar)(({ theme }) => ({ width: theme.spacing(24), height: theme.spacing(24), margin: '0 auto', marginBottom: theme.spacing(4), border: `6px solid ${kBrandedAccent}`, boxShadow: '0 20px 40px rgba(255, 207, 0, 0.2)', transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 25px 50px rgba(255, 207, 0, 0.25)', } }));
const ValueIcon = styled(Box)(({ theme }) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${kBrandedAccent} 0%, ${alpha(kBrandedAccent, 0.8)} 100%)`, color: kBrandedPrimary, marginBottom: theme.spacing(3), boxShadow: '0 10px 30px rgba(255, 207, 0, 0.25)', transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.1) rotate(5deg)', boxShadow: '0 15px 40px rgba(255, 207, 0, 0.3)', } }));
const AboutImage = styled(motion.img)(({ theme }) => ({ borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0, 65, 121, 0.25)', width: '100%', height: 'auto', transition: 'all 0.4s ease', filter: 'brightness(0.95) contrast(1.05)', '&:hover': { filter: 'brightness(1) contrast(1.1)', } }));
const SectionTitle = styled(Typography)(({ theme }) => ({ position: 'relative', display: 'inline-block', marginBottom: theme.spacing(6), '&:after': { content: '""', position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', width: 80, height: 4, background: `linear-gradient(90deg, ${kBrandedPrimary} 0%, ${kBrandedAccent} 100%)`, borderRadius: 4, } }));
const TimelineDot = styled(Box)(({ theme }) => ({ width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg, ${kBrandedPrimary} 0%, ${kBrandedAccent} 100%)`, border: `4px solid ${theme.palette.background.paper}`, boxShadow: '0 4px 15px rgba(0, 65, 121, 0.3)', }));
const FloatingShape = styled(Box)(({ theme, position }) => ({ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(kBrandedPrimary, 0.1)} 0%, transparent 70%)`, ...position, zIndex: 0, }));


// --- MAIN COMPONENT ---
const AboutPage = ({ language = 'en' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const t = translations[language] || translations.en;
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const handleToggleHistory = () => {
    setIsHistoryExpanded(!isHistoryExpanded);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <>
      {/* --- MODIFICATION: Updated Helmet with dynamic translations and expanded keywords --- */}
      <Helmet>
        <html lang={language} />
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDescription} />
        <meta 
          name="keywords" 
          content="about amdehaymanot, sunday school history, ዓምደሃይማኖት ታሪክ, jimma church, ethiopian orthodox mission, ጂማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት, የሰንበት ትምህርት ቤት ታሪክ, ስለ ዓምደሃይማኖት, seenaa amdehaayimaanot, ዛንታ ቤት ትምህርቲ ሰንበት, our values, our mission, spiritual education Ethiopia"
        />
      </Helmet>

      {/* --- NO OTHER CHANGES ARE NEEDED BELOW THIS LINE --- */}
      <HeroSection>
        <FloatingShape position={{ top: '-10%', left: '-10%' }} />
        <FloatingShape position={{ bottom: '-10%', right: '-10%' }} />
        
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Chip
              icon={<History />}
              label={t.ourStory}
              sx={{ mb: 4, px: 3, py: 1, fontSize: '0.9rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: `linear-gradient(135deg, ${kBrandedAccent} 0%, ${alpha(kBrandedAccent, 0.9)} 100%)`, color: kBrandedPrimary, boxShadow: '0 10px 30px rgba(255, 207, 0, 0.3)', }}
            />
            <Typography 
              variant="h1" 
              sx={{ fontWeight: 800, lineHeight: 1.1, mb: 3, textShadow: '0 4px 8px rgba(0, 65, 121, 0.3)', fontSize: isSmall ? '2.5rem' : isMobile ? '3.5rem' : '4.5rem', background: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', }}
            >
              {t.pageTitle}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ opacity: 0.9, textShadow: '0 2px 4px rgba(0, 65, 121, 0.3)', fontSize: isSmall ? '1.1rem' : '1.4rem', maxWidth: 600, margin: '0 auto', fontWeight: 300, letterSpacing: 0.5, }}
            >
              {t.pageSubtitle}
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>

      <GradientSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10, position: 'relative', zIndex: 1 }}>
            <SectionTitle variant="h2" sx={{ color: kBrandedPrimary }}>
              {t.historyTitle}
            </SectionTitle>
          </Box>
          
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <AboutCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TimelineDot />
                    <Typography variant="h5" sx={{ ml: 2, fontWeight: 700, color: kBrandedPrimary }}>
                      1973
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'text.secondary' }}>
                    {t.historyShort}
                  </Typography>
                  
                  <Collapse in={isHistoryExpanded} timeout="auto" unmountOnExit>
                    <AnimatePresence>
                      {t.historyFull.map((paragraph, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Typography variant="body1" paragraph sx={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'text.secondary', mt: 2 }}>
                            {paragraph}
                          </Typography>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Collapse>
                  
                  <Button
                    onClick={handleToggleHistory}
                    variant="outlined"
                    endIcon={
                      <motion.div
                        animate={{ rotate: isHistoryExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ExpandMoreIcon />
                      </motion.div>
                    }
                    sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 50, borderWidth: 2, borderColor: kBrandedPrimary, color: kBrandedPrimary, '&:hover': { borderWidth: 2, borderColor: kBrandedPrimary, backgroundColor: alpha(kBrandedPrimary, 0.04), transform: 'translateY(-2px)', } }}
                  >
                    {isHistoryExpanded ? t.showLess : t.learnMore}
                  </Button>
                </AboutCard>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <AboutImage 
                  src={historyImage} 
                  alt="Sunday School History"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </GradientSection>

      <CardSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10, position: 'relative', zIndex: 1 }}>
            <SectionTitle variant="h2" sx={{ color: kBrandedPrimary }}>
              {t.missionTitle}
            </SectionTitle>
          </Box>
          
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} lg={6} order={{ xs: 2, lg: 1 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <AboutImage 
                  src={missionImage} 
                  alt="Sunday School Mission"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </Grid>
            
            <Grid item xs={12} lg={6} order={{ xs: 1, lg: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <AboutCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Flag sx={{ fontSize: 32, color: kBrandedPrimary, mr: 2 }} />
                    <Typography variant="h4" sx={{ color: kBrandedPrimary, fontWeight: 700 }}>
                      {t.missionSubtitle}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'text.secondary' }}>
                    {t.missionP1}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: kBrandedPrimary }}>
                    {t.missionAim}
                  </Typography>
                  
                  <List sx={{ mt: 2 }}>
                    {t.missionPoints.map((item, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box
                            sx={{ width: 8, height: 8, borderRadius: '50%', background: `linear-gradient(135deg, ${kBrandedPrimary} 0%, ${kBrandedAccent} 100%)`, }}
                          />
                        </ListItemIcon>
                        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                          {item}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </AboutCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </CardSection>

      <Section>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <SectionTitle variant="h2" sx={{ color: kBrandedPrimary }}>
              {t.valuesTitle}
            </SectionTitle>
          </Box>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <Grid container spacing={4}>
              {t.values.map((value, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={itemVariants} style={{height: '100%'}}>
                    <AboutCard sx={{ textAlign: 'center' }}>
                      <ValueIcon>
                        {React.cloneElement(value.icon, { sx: { fontSize: 32 } })}
                      </ValueIcon>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: kBrandedPrimary }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {value.description}
                      </Typography>
                    </AboutCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Section>

      <GradientSection>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <SectionTitle variant="h2" sx={{ color: kBrandedPrimary }}>
              {t.leadershipTitle}
            </SectionTitle>
          </Box>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <AboutCard sx={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
              <LargeAvatar alt="Leader" src={priestImage} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: kBrandedPrimary }}>
                {t.leaderName}
              </Typography>
              <Typography variant="h6" sx={{ color: kBrandedPrimary, mb: 3, fontWeight: 600, backgroundColor: alpha(kBrandedAccent, 0.2), px: 2, py: 1, borderRadius: 2, display: 'inline-block' }}>
                {t.leaderRole}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.6 }}>
                "{t.leaderQuote}"
              </Typography>
            </AboutCard>
          </motion.div>
        </Container>
      </GradientSection>

      <Section>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <AboutCard sx={{ textAlign: 'center', background: `linear-gradient(135deg, ${alpha(kBrandedPrimary, 0.05)} 0%, ${alpha(kBrandedAccent, 0.05)} 100%)` }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: kBrandedPrimary }}>
                {t.ctaTitle}
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.2rem', color: 'text.secondary', mb: 4, maxWidth: 600, margin: '0 auto' }}>
                {t.ctaSubtitle}
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                href="/classes"
                sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 700, borderRadius: 50, background: `linear-gradient(135deg, ${kBrandedPrimary} 0%, ${alpha(kBrandedPrimary, 0.9)} 100%)`, boxShadow: '0 10px 30px rgba(0, 65, 121, 0.3)', '&:hover': { background: `linear-gradient(135deg, ${alpha(kBrandedPrimary, 0.9)} 0%, ${kBrandedPrimary} 100%)`, transform: 'translateY(-3px)', boxShadow: '0 15px 40px rgba(0, 65, 121, 0.4)', }, transition: 'all 0.3s ease' }}
              >
                {t.ctaButton}
              </Button>
            </AboutCard>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

export default AboutPage;