import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Button, Collapse,
} from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Book, Favorite, School, Handshake, VolunteerActivism,
  Church, ExpandMore as ExpandMoreIcon, Gavel as GavelIcon,
} from '@mui/icons-material';

import historyImage from '../assets/history.jpg';
import priestImage from '../assets/image.jpeg';
import heroImage from '../assets/about-us.jpg';
import crestLogo from '../assets/logo.png';
import heroPortrait from '../assets/hero-portrait.png';

import {
  HomeHero, PageSection, GoldDivider, LivingGeneration, CommitmentBand,
} from '../components/ui';
import { brand } from '../brand';

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

const translations = {
    en: { appName: 'Amdehayimanot', ourStory: 'Our Story', pageTitle: 'About Amdehayimanot Sunday School', pageDescription: "Learn about the rich history, mission, and core values of Amdehayimanot Sunday School in Jimma. Founded in 1964, we are dedicated to spiritual education for youth.", pageSubtitle: 'History, Vision, Mission & Values', historyTitle: 'Our History', historyShort: 'The Amde Haymanot Sunday School of Jimma Debre Ephrata St. Mary Church was founded in 1973 E.C. by fathers and brothers who were zealous for spiritual service.', historyFull: [ 'Though services were temporarily suspended in 1973 due to the political climate, they were revived in 1977 through the efforts of two deacons. Since then, the Sunday School expanded its ministry to rural churches, organizing into departments such as Choir, Literature, and Education.', 'In the 1990s, student-led initiatives strengthened the school by establishing service departments and fostering experience-sharing with other parishes, like the Genete Tsige Sunday School. Development projects, such as collecting clothes for the needy and selling religious items, were also initiated during this period.', 'Over the past decade, its structure has grown to six levels, including adult and preparatory classes, organized across 13 service departments. It has developed its own curriculum and launched income-generating projects like a religious goods shop and candle manufacturing to fund its apostolic missions.' ], learnMore: 'Read Full History', showLess: 'Show Less', missionTitle: 'Our Vision & Mission', missionSubtitle: 'To see a wise generation raised with strong faith and exemplary character, ready to inherit the kingdom of heaven.', missionP1: 'Our mission is to uphold the dogmas, canons, and traditions of the Church, ensuring they are passed on to future generations.', missionAim: 'Our objectives are:', missionPoints: [ 'To provide holistic Church education that qualifies one for the kingdom of heaven.', 'To contribute to the spiritual and humanitarian prosperity of the country and community.', 'To nurture members in faith and ethics, preparing them to be the future custodians of the Church.' ], valuesTitle: 'Our Core Values', values: [ { icon: <GavelIcon />, title: 'Faith', description: 'Belief demonstrated through good deeds and unwavering doctrine.' }, { icon: <Favorite />, title: 'Love', description: 'The love of God and the love of one\'s neighbor.' }, { icon: <VolunteerActivism />, title: 'Compassion', description: 'Living out the six humanitarian acts of the Gospel.' }, { icon: <School />, title: 'Education', description: 'Spiritual and secular knowledge, as St. Paul advised Timothy.' }, { icon: <Church />, title: 'Service', description: 'Serving the Church and the community with humility.' }, { icon: <Handshake />, title: 'Humility', description: 'Following the example of our holy fathers and mothers.' }, { icon: <Book />, title: 'Holy Communion', description: 'Cleansing oneself through penance and renewing life through the Eucharist.' } ], leadershipTitle: 'Our Leadership', leaderName: 'Youth Brook Fikadu', leaderRole: 'Chairman of the Sunday School', leaderQuote: "Guiding the next generation with faith, wisdom, and compassion.", ctaTitle: 'Ready to Join Our Community?', ctaSubtitle: 'Explore our classes and events to see how your child can grow in faith and fellowship with us.', ctaButton: 'Explore Our Classes', },
    am: { appName: 'ዓምደሃይማኖት', ourStory: 'ታሪካችን', pageTitle: 'ስለ ዓምደሃይማኖት ሰንበት ትምህርት ቤት', pageDescription: "ስለ ጅማ ዓምደሃይማኖት ሰንበት ትምህርት ቤት የበለጸገ ታሪክ፣ ተልዕኮ እና ዋና እሴቶች ይወቁ። በ1964 ዓ.ም የተመሰረተ ሲሆን ለወጣቶች መንፈሳዊ ትምህርት ለመስጠት ቁርጠኛ ነን።", pageSubtitle: 'ታሪክ፣ ራዕይ፣ ተልዕኮና ዕሴት', historyTitle: 'የእኛ ታሪክ', historyShort: 'የጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ቤተ ክርስቲያን አምደ ሃይማኖት ሰንበት ትምህርት ቤት በ፲፱፻፷፭ ዓ.ም ለመንፈሳዊ አገልግሎት ይፋጠኑ በነበሩ አባቶችና ወንድሞች የተመሠረተ ነው።', historyFull: [ 'በ1973 ዓ.ም በነበረው አብዮታዊ ሥርዓት ምክንያት አገልግሎቱ ለጊዜው ቢቋረጥም፣ በ1977 ዓ.ም በሁለት ዲያቆናት አማካኝነት እንደገና ተጀምሯል። ከዚያን ጊዜ ጀምሮ፣ ሰንበት ትምህርት ቤቱ እንደ መዝሙር፣ ሥነ ጽሑፍና ትምህርት ባሉ ክፍሎች ተደራጅቶ ወደ ገጠር አብያተ ክርስቲያናት እየተጓዘ በስፋት አገልግሏል።', 'በ1990ዎቹ የተማሪዎች ተነሳሽነት ትምህርት ቤቱን በማጠናከር የአገልግሎት ክፍሎችን በማቋቋም እና ከሌሎች አጥቢያዎች ጋር እንደ ገነተ ጽጌ ሰንበት ትምህርት ቤት ያሉ ልምዶችን በመለዋወጥ ረድቷል። ለችግረኞች ልብስ መሰብሰብ እና የሃይማኖት ቁሳቁሶችን መሸጥ ያሉ የልማት ፕሮጀክቶች በዚህ ወቅት ተጀምረዋል።', 'ባለፉት አስር ዓመታት ውስጥ፣ አወቃቀሩ የጎልማሶች እና የመሰናዶ ክፍሎችን ጨምሮ ወደ ስድስት ደረጃዎች አድጓል፤ በ13 የአገልግሎት ክፍሎች ተደራጅቷል። የራሱን የትምህርት ካሪኩለም በማዘጋጀት እና ገቢ የሚያስገኙ ፕሮጀክቶችን (እንደ ንዋያተ ቅዱሳት መሸጫ እና የጧፍ ማምረቻ) በመጀመር ሐዋርያዊ ተልዕኮዎቹን በገንዘብ ለመደገፍ ችሏል።' ], learnMore: 'ሙሉውን ታሪክ ያንብቡ', showLess: 'በสังเขป አሳይ', missionTitle: 'ራዕይ እና ተልዕኮ', missionSubtitle: 'ቅዱሳን አባቶች ጠብቀው ያስረከቡንን የቤተ ክርስቲያን ዶግማና ቀኖና እንዲሁም ትውፊት አክብሮና አስከብሮ ተስፋ የምናደርገውን መንግስተ ሰማያት ለመውረስ የሚያበቃ የጸና ሃይማኖትና ምሳሌ የሆነ ምግባር ይዞ የሚገኝ ጥበበኛ ትውልድ ተፈጥሮ ማየት ነው።', missionP1: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ሃይማኖትና ሥርዓት እንዲጠበቅ እና ሳይለወጥ እንዲሁም ሳይበረዝ በቀጥታ ለትውልድ እንዲተላለፍ ማድረግ።', missionAim: 'ዓላማዎቻችን፡', missionPoints: [ 'ለመንግስተ ሰማያት የሚያበቃ ሁለንተናዊ የቤተ ክርስቲያን ትምህርት መማርና ማስተማር።', 'ቤተ ክርስቲያን ለሀገርና ለማኅበረሰቡ መንፈሳዊና ሰብአዊ ብልጽግና ልትወጣ የሚገባትን አስተዋጽኦ ማበርከት።', 'የሰንበት ትምህርት ቤቱን አባላት በሃይማኖትና በምግባር ኰትኩቶ በማሳደግ የነገይቱ ቤተ ክርስቲያን ተረካቢ መሆን በሚያስችላቸው ደረጃ ማብቃት።' ], valuesTitle: 'የእኛ እሴቶች', values: [ { icon: <GavelIcon />, title: 'ሃይማኖት', description: 'በምግባር የተገለጠ እምነት፤ የማንደራደርበት የቤተ ክርስቲያን አስተምህሮ።' }, { icon: <Favorite />, title: 'ፍቅር', description: 'ፍቅረ እግዚአብሔርና ፍቅረ ቢጽ።' }, { icon: <VolunteerActivism />, title: 'ርህራሄ', description: 'ስድስቱ ቃላተ ወንጌልን መፈጸም።' }, { icon: <School />, title: 'ትምህርት', description: 'መንፈሳዊና ሰብአዊ ጥበብ።' }, { icon: <Church />, title: 'አገልግሎት', description: 'ለቤተ ክርስቲያንና ለማኅበረሰቡ በትህትና ማገልገል።' }, { icon: <Handshake />, title: 'ትህትና', description: 'እንደ ቅዱሳን አባቶቻችንና እናቶቻችን መሆን።' }, { icon: <Book />, title: 'ሥጋ ወደሙ', description: 'በንስሃ እየታጠቡ ራስን በቁርባን ማደስ።' } ], leadershipTitle: 'የሰንበት ትምህርት ቤቱ ሰብሳቢ', leaderName: 'ወጣት ብሩክ ፍቃዱ', leaderRole: 'የሰንበት ትምህርት ቤቱ ሰብሳቢ እና የጅማ ሰንበት ትምህርት ቤቶች አንድነት ምክትል ሰብሳቢ', leaderQuote: 'ቀጣዩን ትውልድ በእምነት፣ በጥበብና በርህራሄ መምራት።', ctaTitle: 'የማህበረሰባችን አካል ለመሆን ዝግጁ ኖት?', ctaSubtitle: 'ልጅዎ በእምነትና በኅብረት ከእኛ ጋር እንዴት እንደሚያድግ ለማየት ክፍሎቻችንንና ዝግጅቶቻችንን ይጎብኙ።', ctaButton: 'ክፍሎቻችንን ያስሱ', },
    ti: { appName: 'ዓምደሃይማኖት', ourStory: 'ዛንታና', pageTitle: 'ብዛዕባ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት', pageDescription: "ብዛዕባ ናይ ጅማ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ሃብታም ታሪኽ፡ ተልእኾን ቀንዲ ክብርታትን ተማሃሩ። ኣብ 1964 ዝተመስረተ ኮይኑ፡ ንመንእሰያት መንፈሳዊ ትምህርቲ ንምሃብ ቆሪጽና ንርከብ።", pageSubtitle: 'ታሪኽ፣ ራእይ፣ ተልእኾን ክብርታትን', historyTitle: 'ታሪኽና', historyShort: 'ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ናይ ጅማ ደብረ ኤፍራታ ቅድስት ማርያም ቤተ ክርስቲያን ኣብ 1964 ዓ.ም. ብመንፈሳዊ ኣገልግሎት ዝተበገሱ ኣቦታትን ኣሕዋትን ተመስሪቱ።', historyFull: [ 'ኣገልግሎት ብሰንኪ ናይቲ ግዜ ፖለቲካዊ ኩነታት ኣብ 1973 ግዝያዊ ደው እኳ እንተበለ፡ ብጻዕሪ ክልተ ዲያቆናት ኣብ 1977 ዳግማይ ተጀሚሩ። እቲ ቤት ትምህርቲ ድማ ኣገልግሎቱ ናብ ገጠራት ብምስፋሕ፡ ከም መዘምራን፡ ስነ-ጽሑፍን ትምህርትን ዝኣመሰሉ ክፍልታት ተወዲቡ።', 'ኣብ 1990ታት፡ ብተምሃሮ ዝተበገሱ ተበግሶታት ነቲ ቤት ትምህርቲ ብምድልዳል ናይ ኣገልግሎት ክፍልታት መስሪቶምን ምስ ካልኦት ኣብያተ-ክርስትያን ምትእስሳር ፈጢሮምን። ከም ንዝተጸገሙ ሰባት ክዳውንቲ ምእካብን ሃይማኖታዊ ኣቕሑት ምሻጥን ዝኣመሰሉ ናይ ልምዓት ፕሮጀክትታት ኣብዚ እዋን’ዚ ተጀሚሮም።', 'ኣብ ዝሓለፈ ዓሰርተ ዓመታት፡ እቲ ኣወዳድባ ናብ ሽዱሽተ ደረጃታት ዓብዩ፡ እዚ ድማ ናይ ዓበይትን ምድላውን ክፍሊታት ዘጠቓልል ኮይኑ፡ ኣብ 13 ናይ ኣገልግሎት ክፍልታት ተወዲቡ። ናይ ገዛእ ርእሱ ስርዓተ-ትምህርቲ ኣዳልዩን ከም ናይ ሃይማኖታዊ ኣቕሑት መሸጥን ሽምዓ ምፍራይን ዝኣመሰሉ እቶት ዘመንጭዉ ፕሮጀክትታት ብምጅማር ንሃዋርያዊ ተልእኾታቱ ፋይናንስ ይገብር ኣሎ።' ], learnMore: 'ሙሉእ ታሪኽ ኣንብብ', showLess: 'ኣሕጽር ኣቢልካ ኣርእይ', missionTitle: 'ራእይናን ተልእኾናን', missionSubtitle: 'ብጽኑዕ እምነትን ኣብነታዊ ጠባይን ዝዓበየ፡ መንግስተ ሰማያት ንምውራስ ድልዊ ዝኾነ ለባም ወለዶ ምርኣይ።', missionP1: 'ተልእኾና፡ ዶግማ፡ ቀኖናን ትውፊትን ቤተ ክርስቲያን ምሕላው ኮይኑ፡ ናብ ዝመጽእ ወለዶ ምትሕልላፍ የረጋግጽ።', missionAim: 'ዕላማታትና፡', missionPoints: [ 'ንምንግስተ ሰማያት ዘብቅዕ ሁለንተናዊ ትምህርቲ ቤተ ክርስቲያን ምሃብ።', 'ንመንፈሳውን ሰብኣውን ብልጽግና ሃገርን ማሕበረሰብን ኣበርክቶ ምግባር።', 'ኣባላት ብእምነትን ስነ-ምግባርን ምዕባይ፡ ንመጻኢ ናይ ቤተ ክርስቲያን ተረከብቲ ምድላው።' ], valuesTitle: ' ቀንዲ ክብርታትና', values: [ { icon: <GavelIcon />, title: 'እምነት', description: 'ብስሩሕ ግብርን ዘይናወጽ ትምህርትን ዝግለጽ እምነት።' }, { icon: <Favorite />, title: 'ፍቕሪ', description: 'ፍቕሪ ኣምላኽን ፍቕሪ ብጻይን።' }, { icon: <VolunteerActivism />, title: 'ርህራሀ', description: 'ነቶም ሽዱሽተ ሰብኣዊ ተግባራት ወንጌል ምንባር።' }, { icon: <School />, title: 'ትምህርቲ', description: 'መንፈሳውን ስጋውን ፍልጠት፡ ከምቲ ቅዱስ ጳውሎስ ንጢሞቴዎስ ዝመኸሮ።' }, { icon: <Church />, title: 'ኣገልግሎት', description: 'ንቤተ ክርስቲያንን ንማሕበረሰብን ብትሕትና ምግልጋል።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'ኣሰር ቅዱሳን ኣቦታትናን ኣዴታትናን ምስዓብ።' }, { icon: <Book />, title: 'ቁርባን', description: 'ብንስሓ ምጽራይን ብቁርባን ህይወት ምሕዳስን።' } ], leadershipTitle: 'መሪሕነትና', leaderName: 'ወጣት ብሩክ ፍቃዱ', leaderRole: 'ሰብሳቢ ቤት ትምህርቲ ሰንበት', leaderQuote: 'ንዝመጽእ ወለዶ ብእምነት፡ ጥበብን ርህራሀን ምምራሕ።', ctaTitle: 'ኣባል ማሕበረሰብና ክትከውን ድልዊ ዲኻ?', ctaSubtitle: 'ውሉድኩም ብእምነትን ሕብረትን ምሳና ከመይ ከም ዝዓቢ ንምርኣይ፡ ክፍለ-ትምህርትታትናን ፍጻሜታትናን መርምሩ።', ctaButton: 'ክፍለ-ትምህርትታትና መርምሩ', },
    om: { appName: 'Amdehayimanot', ourStory: 'Seenaa Keenya', pageTitle: 'Waa\'ee Mana Barumsaa Dilbataa Amdehayimanot', pageDescription: "Seenaa, ergama, fi duudhaalee bu'uuraa Mana Barumsaa Dilbataa Amdehayimanot kan Jimmaa baradhaa. Bara 1973 kan hundeeffame, dargaggootaaf barnoota hafuuraa kennuuf of kennee jira.", pageSubtitle: 'Seenaa, Mul’ata, Ergamaa fi Duudhaalee', historyTitle: 'Seenaa Keenya', historyShort: 'Manni Barumsaa Dilbataa Amdehayimanot kan Waldaa Qulqulleettii Maariyaam Jimmaa Dabra Efraataa bara 1973 abbootii fi obboleeyyan tajaajila hafuuraatiif ariifataniin hundeeffame.', historyFull: [ 'Tajaajilli sababa siyaasaa yeroo sanaatiin bara 1981 yeroof addaan citus, bara 1985 carraaqqii diyaaqonoota lamaatiin irra deebi\'ee jalqabame. Sana booda, manni barumsichaa damee akka Kooyarii, Ogbarruu, fi Barnootaatti gurmaa\'uun tajaajila isaa gara waldaalee baadiyyaatti babal\'iseera.', 'Bara 1990n keessa, sochii barattootaan durfamuun damee tajaajilaa hundeessuun fi waldaalee biroo waliin muuxannoo waljijjiiruun mana barumsichaa cimseera. Piroojektiin guddinaa kan akka uffata harka qalleeyyiif walitti qabuu fi meeshaalee amantaa gurguruun yeroo sanatti jalqabame.', 'Kurnan waggaa darbe keessatti, caasaan isaa gara sadarkaa ja\'atti guddate, kutaa ga\'eessotaa dabalatee, damee tajaajilaa 13 jalatti gurmaa\'eera. Sirna barnootaa mataa isaa baafatee fi piroojektii galii madda ta\'an kan akka suuqii meeshaalee amantaa fi oomisha shamaa jalqabuun ergama isaa raawwachaa jira.' ], learnMore: 'Seenaa Guutuu Dubbisi', showLess: 'Gabaabsi', missionTitle: 'Mul\'ata fi Ergama Keenya', missionSubtitle: 'Dhaloota ogummaa qabu, amantaa cimaa fi amala fakkeenya ta\'een guddate, mootummaa samii dhaaluuf qophaa\'e arguu.', missionP1: 'Ergamni keenya dogmaa, qajeelfama, fi duudhaa Waldaa tiksuudhaan, dhaloota dhufuuf akka darbu gochuudha.', missionAim: 'Kaayyoon keenya:', missionPoints: [ 'Barnoota Waldaa guutuu kan mootummaa samiitiif nama geessu kennuu.', 'Guddina hafuuraa fi namoomaa biyyaa fi hawaasaatiif gumaachuu.', 'Miseensota amantaa fi naamusaan kunuunsuun, fuulduraaf Waldaa kan dhaalan gochuu.' ], valuesTitle: 'Duudhaalee Bu\'uuraa Keenya', values: [ { icon: <GavelIcon />, title: 'Amantaa', description: 'Amantaa gocha gaarii fi barsiisa hin raafamneen mul\'atu.' }, { icon: <Favorite />, title: 'Jaalala', description: 'Jaalala Waaqayyoo fi jaalala namaa.' }, { icon: <VolunteerActivism />, title: 'Garaa Laafina', description: 'Gochaalee namoomaa Wangeelaa jahan hojiirra oolchuu.' }, { icon: <School />, title: 'Barnoota', description: 'Beekumsa hafuuraa fi addunyaa, akka Phaawuloos Ximotewoos gorse.' }, { icon: <Church />, title: 'Tajaajila', description: 'Waldaa fi hawaasa gad-of-deebisuun tajaajiluu.' }, { icon: <Handshake />, title: 'Gad-of-deebisuu', description: 'Fakkeenya abboottii fi haadholii qulqulluu hordofuu.' }, { icon: <Book />, title: 'Qulqulleettii Qurbanaa', description: 'Qalbii diddiirrannaan of qulqulleessuu fi Qurbaanaan jireenya haaressuu.' } ], leadershipTitle: 'Hoggansa Keenya', leaderName: 'Dargaggoo Biruuk Fiqaaduu', leaderRole: 'Dura Taa\'aa Mana Barumsaa Dilbataa', leaderQuote: 'Dhaloota dhufu amantaa, ogummaa, fi garaa laafinaan gaggeessuu.', ctaTitle: 'Hawaasa Keenyaatti Dabalamuuf Qophiidhaa?', ctaSubtitle: 'Ijoolleen keessan amantaa fi walitti dhufeenyaan nu wajjin akkamitti akka guddatan arguuf kutaa barnootaa fi sagantaawwan keenya daawwadhaa.', ctaButton: 'Kutaa Barnootaa Keenya Daawwadhaa', },
    es: { appName: 'Amdehayimanot', ourStory: 'Nuestra Historia', pageTitle: 'Sobre la Escuela Dominical Amdehayimanot', pageDescription: "Conozca la rica historia, misión y valores fundamentales de la Escuela Dominical Amdehayimanot en Jimma. Fundada en 1973, nos dedicamos a la educación espiritual para jóvenes.", pageSubtitle: 'Historia, Visión, Misión y Valores', historyTitle: 'Nuestra Historia', historyShort: 'La Escuela Dominical Amde Haymanot de la Iglesia de Santa María de Jimma Debre Ephrata fue fundada en 1973 por padres y hermanos celosos del servicio espiritual.', historyFull: [ 'Aunque los servicios se interrumpieron temporalmente en 1981 debido al clima político, se reanudaron en 1985 gracias a los esfuerzos de dos diáconos. Desde entonces, la Escuela Dominical expandió su ministerio a las iglesias rurales, organizándose en departamentos como Coro, Literatura y Educación.', 'En la década de 1990, las iniciativas estudiantiles fortalecieron la escuela estableciendo departamentos de servicio y fomentando intercambios de experiencias con otras parroquias, como la Escuela Dominical Genete Tsige. También se iniciaron proyectos de desarrollo, como la recolección de ropa para los necesitados y la venta de artículos religiosos.', 'Durante la última década, su estructura ha crecido a seis niveles, incluyendo clases para adultos y preparatorias, organizadas en 13 departamentos de servicio. Ha desarrollado su propio currículo y ha lanzado proyectos generadores de ingresos, como una tienda de artículos religiosos y la fabricación de velas, para financiar sus misiones apostólicas.' ], learnMore: 'Leer Historia Completa', showLess: 'Mostrar Menos', missionTitle: 'Nuestra Visión y Misión', missionSubtitle: 'Ver una generación sabia, criada con fe sólida y carácter ejemplar, lista para heredar el reino de los cielos.', missionP1: 'Nuestra misión es defender los dogmas, cánones y tradiciones de la Iglesia, asegurando que se transmitan a las generaciones futuras.', missionAim: 'Nuestros objetivos son:', missionPoints: [ 'Proporcionar una educación eclesiástica integral que califique para el reino de los cielos.', 'Contribuir a la prosperidad espiritual y humanitaria del país y la comunidad.', 'Formar a los miembros en la fe y la ética, preparándolos para ser los futuros custodios de la Iglesia.' ], valuesTitle: 'Nuestros Valores Fundamentales', values: [ { icon: <GavelIcon />, title: 'Fe', description: 'Creencia demostrada a través de buenas obras y una doctrina inquebrantable.' }, { icon: <Favorite />, title: 'Amor', description: 'El amor a Dios y el amor al prójimo.' }, { icon: <VolunteerActivism />, title: 'Compasión', description: 'Vivir los seis actos humanitarios del Evangelio.' }, { icon: <School />, title: 'Educación', description: 'Conocimiento espiritual y secular, como aconsejó San Pablo a Timoteo.' }, { icon: <Church />, title: 'Servicio', description: 'Servir a la Iglesia y a la comunidad con humildad.' }, { icon: <Handshake />, title: 'Humildad', description: 'Siguiendo el ejemplo de nuestros santos padres y madres.' }, { icon: <Book />, title: 'Santa Comunión', description: 'Purificarse mediante la penitencia y renovar la vida mediante la Eucaristía.' } ], leadershipTitle: 'Nuestro Liderazgo', leaderName: 'Joven Brook Fikadu', leaderRole: 'Presidente de la Escuela Dominical', leaderQuote: 'Guiando a la próxima generación con fe, sabiduría y compasión.', ctaTitle: '¿Listo para Unirte a Nuestra Comunidad?', ctaSubtitle: 'Explora nuestras clases y eventos para ver cómo tu hijo puede crecer en fe y compañerismo con nosotros.', ctaButton: 'Explora Nuestras Clases', },
    fr: { appName: 'Amdehayimanot', ourStory: 'Notre Histoire', pageTitle: 'À propos de l\'École du Dimanche Amdehayimanot', pageDescription: "Découvrez la riche histoire, la mission et les valeurs fondamentales de l'École du Dimanche Amdehayimanot à Jimma. Fondée en 1973, nous nous consacrons à l'éducation spirituelle des jeunes.", pageSubtitle: 'Histoire, Vision, Mission et Valeurs', historyTitle: 'Notre Histoire', historyShort: 'L\'école du dimanche Amde Haymanot de l\'église Sainte-Marie de Jimma Debre Ephrata a été fondée en 1973 par des pères et des frères zélés pour le service spirituel.', historyFull: [ 'Bien que les services aient été temporairement suspendus en 1981 en raison du climat politique, ils ont été relancés en 1985 grâce aux efforts de deux diacres. Depuis lors, l\'école du dimanche a étendu son ministère aux églises rurales, en s\'organisant en départements tels que la chorale, la littérature et l\'éducation.', 'Dans les années 1990, des initiatives étudiantes ont renforcé l\'école en créant des départements de service et en favorisant les échanges d\'expériences avec d\'autres paroisses, comme l\'école du dimanche de Genete Tsige. Des projets de développement, tels que la collecte de vêtements pour les nécessiteux et la vente d\'articles religieux, ont également été lancés à cette période.', 'Au cours de la dernière décennie, sa structure s\'est développée sur six niveaux, y compris des cours pour adultes et préparatoires, organisés en 13 départements de service. Elle a développé son propre programme et lancé des projets générateurs de revenus, comme une boutique d\'articles religieux et la fabrication de bougies, pour financer ses missions apostoliques.' ], learnMore: 'Lire l\'Histoire Complète', showLess: 'Afficher Moins', missionTitle: 'Notre Vision & Mission', missionSubtitle: 'Voir une génération sage, élevée avec une foi solide et un caractère exemplaire, prête à hériter du royaume des cieux.', missionP1: 'Notre mission est de défendre les dogmes, canons et traditions de l\'Église, en veillant à ce qu\'ils soient transmis aux generations futures.', missionAim: 'Nos objectifs sont :', missionPoints: [ 'Fournir une éducation ecclésiale holistique qui qualifie pour le royaume des cieux.', 'Contribuer à la prospérité spirituelle et humanitaire du pays et de la communauté.', 'Former les membres dans la foi et l\'éthique, les préparant à être les futurs gardiens de l\'Église.' ], valuesTitle: 'Nos Valeurs Fondamentales', values: [ { icon: <GavelIcon />, title: 'Foi', description: 'Croyance démontrée par de bonnes œuvres et une doctrine inébranlable.' }, { icon: <Favorite />, title: 'Amour', description: 'L\'amour de Dieu et l\'amour du prochain.' }, { icon: <VolunteerActivism />, title: 'Compassion', description: 'Vivre les six actes humanitaires de l\'Évangile.' }, { icon: <School />, title: 'Éducation', description: 'Connaissance spirituelle et séculière, comme l\'a conseillé Saint Paul à Timothée.' }, { icon: <Church />, title: 'Service', description: 'Servir l\'Église et la communauté avec humilité.' }, { icon: <Handshake />, title: 'Humilité', description: 'Suivre l\'exemple de nos saints pères et mères.' }, { icon: <Book />, title: 'Sainte Communion', description: 'Se purifier par la pénitence et renouveler sa vie par l\'Eucharistie.' } ], leadershipTitle: 'Notre Direction', leaderName: 'Jeune Brook Fikadu', leaderRole: 'Président de l\'École du Dimanche', leaderQuote: 'Guider la prochaine génération avec foi, sagesse et compassion.', ctaTitle: 'Prêt à Rejoindre Notre Communauté ?', ctaSubtitle: 'Explorez nos cours et événements pour voir comment votre enfant peut grandir dans la foi et la fraternité avec nous.', ctaButton: 'Explorez Nos Cours', },
    ar: { appName: 'عماد الإيمان', ourStory: 'قصتنا', pageTitle: 'حول مدرسة الأحد عماد الإيمان', pageDescription: "تعرف على التاريخ الغني والرسالة والقيم الأساسية لمدرسة الأحد عماد الإيمان في جيما. تأسست عام 1964، ونحن ملتزمون بالتعليم الروحي للشباب.", pageSubtitle: 'تاريخ، رؤية، رسالة، وقيم', historyTitle: 'تاريخنا', historyShort: 'تأسست مدرسة الأحد "عماد الإيمان" التابعة لكنيسة السيدة مريم العذراء في جيما دير إفراتا عام 1973 على يد آباء وإخوة غيورين على الخدمة الروحية.', historyFull: [ 'على الرغم من توقف الخدمات مؤقتًا في عام 1981 بسبب المناخ السياسي، إلا أنها استؤنفت في عام 1985 بجهود اثنين من الشمامسة. منذ ذلك الحين، وسعت مدرسة الأحد خدمتها لتشمل الكنائس الريفية، وتم تنظيمها في أقسام مثل الكورال والأدب والتعليم.', 'في التسعينيات، عززت المبادرات الطلابية المدرسة من خلال إنشاء أقسام خدمية وتعزيز تبادل الخبرات مع الرعايا الأخرى، مثل مدرسة الأحد في جينات تسيج. كما بدأت مشاريع تنموية، مثل جمع الملابس للمحتاجين وبيع المواد الدينية، خلال هذه الفترة.', 'على مدى العقد الماضي، نما هيكلها إلى ستة مستويات، بما في ذلك فصول للبالغين والتحضيرية، منظمة عبر 13 قسمًا خدميًا. وقد طورت منهجها الخاص وأطلقت مشاريع مدرة للدخل مثل متجر للسلع الدينية ومصنع للشموع لتمويل مهامها الرسولية.' ], learnMore: 'اقرأ التاريخ الكامل', showLess: 'عرض أقل', missionTitle: 'رؤيتنا ورسالتنا', missionSubtitle: 'رؤية جيل حكيم، نشأ على إيمان قوي وشخصية مثالية، ومستعد لوراثة ملكوت السماوات.', missionP1: 'رسالتنا هي التمسك بعقائد الكنيسة وقوانينها وتقاليدها، وضمان نقلها إلى الأجيال القادمة.', missionAim: 'أهدافنا هي:', missionPoints: [ 'توفير تعليم كنسي شامل يؤهل لملكوت السماوات.', 'المساهمة في الازدهار الروحي والإنساني للبلاد والمجتمع.', 'تنشئة الأعضاء في الإيمان والأخلاق، وإعدادهم ليكونوا أمناء الكنيسة في المستقبل.' ], valuesTitle: 'قيمنا الأساسية', values: [ { icon: <GavelIcon />, title: 'الإيمان', description: 'الإيمان الذي يظهر من خلال الأعمال الصالحة والعقيدة الراسخة.' }, { icon: <Favorite />, title: 'المحبة', description: 'محبة الله ومحبة القريب.' }, { icon: <VolunteerActivism />, title: 'الرحمة', description: 'تطبيق أعمال الإنجيل الإنسانية الستة.' }, { icon: <School />, title: 'التعليم', description: 'المعرفة الروحية والدنيوية، كما نصح القديس بولس تيموثاوس.' }, { icon: <Church />, title: 'الخدمة', description: 'خدمة الكنيسة والمجتمع بتواضع.' }, { icon: <Handshake />, title: 'التواضع', description: 'اتباع مثال آبائنا وأمهاتنا القديسين.' }, { icon: <Book />, title: 'المناولة المقدسة', description: 'تطهير النفس من خلال التوبة وتجديد الحياة من خلال القربان المقدس.' } ], leadershipTitle: 'قيادتنا', leaderName: 'الشاب بروك فيكادو', leaderRole: 'رئيس مدرسة الأحد', leaderQuote: 'قيادة الجيل القادم بالإيمان والحكمة والرحمة.', ctaTitle: 'هل أنت مستعد للانضمام إلى مجتمعنا؟', ctaSubtitle: 'استكشف فصولنا وفعالياتنا لترى كيف يمكن لطفلك أن ينمو في الإيمان والزمالة معنا.', ctaButton: 'استكشف فصولنا', },
    ge: { appName: 'ዓምደ ሃይማኖት', ourStory: 'ዜናነ', pageTitle: 'ስለ ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት', pageDescription: "ስለ ታሪከነ፣ ተልእኮነ、 ወቁምነገርነ ዘቤት ትምህርት ሰንበት ዓምደ ሃይማኖት በጅማ ተመሀሩ። በዓመተ ፲፱፻፷ወ፭ ተመሥረተ、 ወንሕነ ለትምህርተ መንፈስ ለኖሎት ቆምና።", pageSubtitle: 'ታሪክ፣ ራእይ、 ተልእኮ ወቁምነገር', historyTitle: 'ታሪከነ', historyShort: 'ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት ዘደብረ ኤፍራታ ቅድስት ማርያም በጅማ በዓመተ ፲፱፻፷ወ፭ በአበው ወአኃው እለ መጽኡ ለተግባረ መንፈስ ተመሥረተ።', historyFull: [ 'አገልግሎቱ በዓመተ ፲፱፻፹ወ፩ በምክንያተ ፖለቲካ ለጊዜሁ ተዐገተ፣ ወበዓመተ ፲፱፻፹ወ፭ በክልኤቱ ዲያቆናት ዳግመ ተጀመረ። እምዝ ጊዜ ጀሚሮ፣ ቤት ትምህርቱ በአገልግሎተ ገጠር ተስፍሐ፣ ወበክፍላተ መዝሙር፣ ስነ ጽሑፍ፣ ወትምህርት ተወደበ።', 'በዓመተ ፲፱፻፺፣ ተነሳሒነ ተማሪሃ ለቤት ትምህርቱ አጽንዕዎ፣ ወክፍላተ አገልግሎተ መሥረቱ ወምስለ ካልኣን አድባራት ተላውጦ ገብሩ። ግብረ ልማት፣ ከመ አልባስ ለነዳያን ወመሸጠ ንዋያተ ቅድሳት፣ በዝየ ጊዜ ተጀመረ።', 'በዝ ዐሥርቱ ዓመታት፣ ሥርዓቱ እስከ ስድስቱ ደረጃታት ዐቢየ፣ ወበ ፲፫ ክፍላተ አገልግሎት ተወደበ። ሥርዓተ ትምህርቶ ወለገቢ ዘየዐውድ ግብራት፣ ከመ ሱቀ ንዋያተ ቅድሳት ወምፍራየ ጧፍ፣ ለሐዋርያዊ ተልእኮሁ ገብረ።' ], learnMore: 'ምንባበ ኵሉ ታሪክ', showLess: 'አሕጽር', missionTitle: 'ራእይነ ወተልእኮነ', missionSubtitle: 'ራእይነ ውእቱ ምልአተ ትውልድ ጠቢብ፣ በጽኑዕ ሃይማኖት ወበምግባር ምሳሌ、 ለርስዓተ መንግሥተ ሰማያት ዝግጁ።', missionP1: 'ተልእኮነ ውእቱ ዐቂበ ዶግማ፣ ቀኖና፣ ወትውፊት ዘቤተ ክርስቲያን፣ ወለተከታሊ ትውልድ አውርሶቶሙ።', missionAim: 'ዓላማቲነ፡', missionPoints: [ 'ትምህርተ ቤተ ክርስቲያን ፍጹመ ለርስዓተ መንግሥተ ሰማያት ምሃብ።', 'ለበረከተ ሀገር ወማኅበረሰብ መንፈሳዊ ወሰብአዊ አስተዋጽኦ ምግባር።', 'ለአባላት በሃይማኖት ወበምግባር ምዕባይ፣ ወለተከታሊተ ቤተ ክርስቲያን አበጋዝ ምድላዎሙ።' ], valuesTitle: 'ቁምነገርነ', values: [ { icon: <GavelIcon />, title: 'ሃይማኖት', description: 'እምነት በግብረ ሠናይ ወበኢየኃልቅ ትምህርት ዘይትከሠት።' }, { icon: <Favorite />, title: 'ፍቅር', description: 'ፍቅረ እግዚአብሔር ወፍቅረ ቢጽ።' }, { icon: <VolunteerActivism />, title: 'ምሕረት', description: 'ሕይወተ በስድስቱ ቃላተ ወንጌል ሰብአዊያን።' }, { icon: <School />, title: 'ትምህርት', description: 'ጥበበ መንፈሳዊ ወዓለማዊ፣ ከመ መከረ ቅዱስ ጳውሎስ ለጢሞቴዎስ።' }, { icon: <Church />, title: 'አገልግሎት', description: 'አገልግሎተ ቤተ ክርስቲያን ወማኅበረሰብ በትሕትና።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'ተክህሎተ አበዊነ ወእማቲነ ቅዱሳን።' }, { icon: <Book />, title: 'ቁርባን', description: 'ተሐድሶ ነፍስ በንስሓ ወበቁርባን።' } ], leadershipTitle: 'መሪሕነትነ', leaderName: 'ወጣት ብሩክ ፍቃዱ', leaderRole: 'ሊቀ መንበር ዘቤት ትምህርት ሰንበት', leaderQuote: 'ምርሐተ ለተከታሊ ትውልድ በሃይማኖት、 በጥበብ ወበምሕረት።', ctaTitle: 'ትፈቅዱኑ ተሳተፎተ በማኅበርነ?', ctaSubtitle: 'ርእዩ ክፍላተነ ወበዓላተነ ከመ ትርአዩ እፎ ውሉድክሙ ይትፌሥሑ በሃይማኖት ወበኅብረት ምስሌነ።', ctaButton: 'አስሱ ክፍላተነ', },
}

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.2 };

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

const ValueRow = styled(motion.div)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '44px 1fr',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  padding: theme.spacing(2.25, 0),
  borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
  '&:last-of-type': { borderBottom: 'none' },
}));

const IndexMark = styled(Box)({
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: `1px solid ${alpha(brand.gold, 0.65)}`,
  background: brand.stone,
  color: brand.navy,
});

const AboutPage = ({ language = 'en' }) => {
  const t = translations[language] || translations.en;
  const brandName = brandTitles[language] || brandTitles.en;
  const reduceMotion = useReducedMotion();
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>

      <Box sx={{ bgcolor: brand.stone }}>
        <HomeHero
          subjectImage={heroPortrait}
          logoSrc={crestLogo}
          backgroundImage={heroImage}
          brandName={brandName}
          tagline={t.ourStory}
          headline={t.missionSubtitle}
          foundedYear="1964"
          quoteLineClamp={4}
          quoteMobileLineClamp={3}
        />

        <LivingGeneration
          backgroundImage={historyImage}
          title={t.historyTitle}
          historyText={t.historyShort}
          foundedYear="1973"
        />

        <PageSection variant="white" sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 5, md: 6 } }}>
          <Container maxWidth="md">
            <Collapse in={isHistoryExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ mb: 2 }}>
                {t.historyFull.map((paragraph, index) => (
                  <Typography
                    key={index}
                    sx={{
                      m: 0,
                      mb: 2,
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontSize: '1.02rem',
                      lineHeight: 1.8,
                      color: alpha(brand.ink, 0.68),
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>
            </Collapse>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                onClick={() => setIsHistoryExpanded((v) => !v)}
                variant="outlined"
                color="primary"
                endIcon={
                  <ExpandMoreIcon
                    sx={{
                      transform: isHistoryExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                }
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                }}
              >
                {isHistoryExpanded ? t.showLess : t.learnMore}
              </Button>
            </Box>
          </Container>
        </PageSection>

        <CommitmentBand
          title={t.missionTitle}
          subtitle={t.missionSubtitle}
          text={t.missionP1}
          aimsLabel={t.missionAim}
          aims={t.missionPoints}
        />

        <PageSection variant="stone">
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
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
                  fontSize: 'clamp(1.85rem, 3.5vw, 2.6rem)',
                  color: brand.navy,
                }}
              >
                {t.valuesTitle}
              </Typography>
              <Box aria-hidden sx={{ width: 48, height: 2, mx: 'auto', my: 2, bgcolor: brand.gold }} />
            </Box>

            <Box>
              {t.values.map((value, i) => (
                <ValueRow
                  key={value.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewOpts}
                  transition={{ duration: 0.4, ease: easeOut, delay: i * 0.04 }}
                >
                  <IndexMark>
                    {React.cloneElement(value.icon, { sx: { fontSize: 22 } })}
                  </IndexMark>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: brand.navy,
                        lineHeight: 1.2,
                        mb: 0.5,
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        color: alpha(brand.ink, 0.62),
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Box>
                </ValueRow>
              ))}
            </Box>
          </Container>
        </PageSection>

        <PageSection variant="ink" pattern>
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography
              component="h2"
              sx={{
                m: 0,
                mb: 3,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                color: brand.white,
              }}
            >
              {t.leadershipTitle}
            </Typography>
            <Box
              component="img"
              src={priestImage}
              alt=""
              sx={{
                width: 148,
                height: 148,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `2px solid ${alpha(brand.gold, 0.65)}`,
                boxShadow: `0 0 0 8px ${alpha(brand.gold, 0.12)}`,
                mb: 2.5,
              }}
            />
            <Typography
              sx={{
                m: 0,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                color: brand.white,
              }}
            >
              {t.leaderName}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                mb: 2.5,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: brand.gold,
              }}
            >
              {t.leaderRole}
            </Typography>
            <Typography
              sx={{
                m: 0,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontStyle: 'italic',
                fontSize: '1.15rem',
                lineHeight: 1.55,
                color: alpha(brand.white, 0.78),
              }}
            >
              “{t.leaderQuote}”
            </Typography>
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
              component={RouterLink}
              to="/classes"
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

export default AboutPage;
