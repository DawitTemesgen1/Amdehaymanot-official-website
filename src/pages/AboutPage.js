import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Button, Collapse,
} from '@mui/material';
import { alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Book, Favorite, School, Handshake, VolunteerActivism,
  Church, ExpandMore as ExpandMoreIcon, Gavel as GavelIcon,
} from '@mui/icons-material';

import historyImage from '../assets/history.jpg';
import priestImage from '../assets/leadership-portrait.png';
import crestLogo from '../assets/logo.png';

import {
  AboutHero, PageSection, GoldDivider,
} from '../components/ui';
import { fillViewportSx } from '../components/ui/viewportSection';
import { brand } from '../brand';

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

const placeLabels = {
  en: 'Jimma · Debre Ephrata St. Virgin Mary Cathedral',
  am: 'ጅማ · መንቲና · ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል',
  om: 'Jimmaa · Mantinaa · Dabra Efraataa Qulqulleettii Maariyaam',
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
    "appName": "Amdehaymanot",
    "ourStory": "Our history",
    "pageTitle": "About the religious Sunday school",
    "pageDescription": "Learn about the history, vision, mission, and values ​​of Jimma Debre Ephrata Holy Virgin Mary Cathedral Pillar of Religion Sunday School. It was founded in May 1964.",
    "pageSubtitle": "History, vision, mission and values",
    "historyTitle": "Our history",
    "historyShort": "Jimma Debre Ephrata Holy Virgin Mary Cathedral Column Religion Sunday School was established in May 1964. First, it was started under the name \"Youth Spiritual Association\" with the initiative of a few deacons and young people in the parish.",
    "historyFull": [
        "The members met two days a week on Saturday and Sunday and started the service by teaching the gospel, studying songs and performing artistic programs.",
        "It has now become one of the leading Sunday schools in Jimma City. This Sunday school embraces children, adolescents, youth and adults and provides various spiritual services.",
        "The address is located in the Oromia National Regional Government, Jimma Zone, Jimma City, Mentina Kebele."
    ],
    "learnMore": "Read the full story",
    "showLess": "Show briefly",
    "missionTitle": "Vision, mission and purpose",
    "missionSubtitle": "It is to see the nature of a wise generation with strong religion and exemplary conduct that will respect and honor the dogma, canon and tradition of the church handed down to us by the holy fathers.",
    "missionP1": "Based on the words of Matthew 28:19, it is to baptize all people in the name of the Father, the Son and the Holy Spirit and become followers of Christ.",
    "missionAim": "Our objectives:",
    "missionPoints": [
        "To preserve the dogma and canon of the Church.",
        "Learning and teaching universal church doctrine that leads to the kingdom of heaven.",
        "To contribute what the church should do to the spiritual and human prosperity of the country and society.",
        "By raising young people and children with orthodox Tewahedo beliefs and Christian virtues, to produce a strong spiritual generation that will effectively take over and serve the church tomorrow."
    ],
    "nameMeaningTitle": "The meaning of the name",
    "nameMeaningIntro": "Our name \"Pillar of Religion\" clearly reflects the spiritual foundation and purpose of our institution:",
    "nameMeaningItems": [
        {
            "title": "column",
            "description": "The main foundation that supports and stops any large building from collapsing is a pillar. When our Christian life is faced with storms and trials, it does not shake and stands firmly when it is based on the word of God."
        },
        {
            "title": "Religion",
            "description": "It is our steadfast relationship with our Creator, the love of Christ revealed on the cross, and the true path in which we have placed all our hope."
        },
        {
            "title": "Pillar Religion Sunday School",
            "description": "It means a spiritual center that helps young people and children to stand firm (strong as a pillar) on the teachings of Christ Jesus and the faith of the Orthodox Church, and builds their faith with knowledge and conduct."
        }
    ],
    "valuesTitle": "Our values",
    "valuesIntro": "These are our core values, not just a set of words, but our everyday principles of life:",
    "values": [
        {
            "icon": "<GavelIcon />",
            "title": "Religion",
            "description": "Faith is not only spoken but lived. It is our steadfastness that is manifested by maintaining the pure and non-negotiable dogmas and canons that the Holy Church taught us, accompanied by good manners."
        },
        {
            "icon": "<Favorite />",
            "title": "Love",
            "description": "Our Christian life is a story. Loving God with a perfect heart and loving all people (regardless of race, appearance, or status) as one's self is our value."
        },
        {
            "icon": "<VolunteerActivism />",
            "title": "Compassion",
            "description": "Compassion for us is our manifestation of action, which springs from pure Christian love, and turns faith into life. According to what our Lord taught, \"As you did it to one of the least of these, you did it to me\" (Matthew 25:40), we see Christ in our poor and circumcised people. Therefore, by making the six words of the gospel our daily life guide; By feeding the hungry, clothing the circumcised, comforting the grieving, and asking for the sick, it is the deep fruit of the Spirit that reflects the goodness of our God to the world."
        },
        {
            "icon": "<School />",
            "title": "Education",
            "description": "False teachings stand on a firm foundation that cannot be shaken. According to the words of the apostle, \"You know from whom you have learned and persevere\", we combine the spiritual wisdom with the knowledge of the time, it is our light to protect the generation from mistakes and enlighten the mind."
        },
        {
            "icon": "<Handshake />",
            "title": "Humility",
            "description": "Following the example of our holy fathers and mothers, it is our Christian expression to live humble and sincere."
        },
        {
            "icon": "<Church />",
            "title": "Service",
            "description": "It is sincere service that we give to the church and the community. This is the readiness to serve without pride by saying, \"We are slaves of no use\" after fulfilling the spiritual responsibility given to us."
        },
        {
            "icon": "<Book />",
            "title": "They burned the flesh",
            "description": "It is a Christian system where we renew our spiritual life by regularly washing away from sin and receiving Holy Communion."
        }
    ],
    "leadershipTitle": "The president of the Sunday school",
    "leaderName": "Deacon Job crown",
    "leaderRole": "The president of the Sunday school",
    "leaderQuote": "But God was growing. — 1 Corinthians 3:6",
    "ctaTitle": "Ready to be part of our community?",
    "ctaSubtitle": "Visit our classes and events to see how your child can grow in faith and fellowship with us.",
    "ctaButton": "Browse our rooms"
},
  om: {
    "appName": "Amdehaymanot",
    "ourStory": "Seenaa keenya",
    "pageTitle": "Waa'ee mana barumsaa Sanbataa amantii",
    "pageDescription": "Waa'ee seenaa, mul'ata, ergama, fi gatiiwwan Jimma Debre Ephrata Qulqulleettii Durbee Maariyaam Kaatediraala Utubaa Amantii Mana Barumsaa Sanbataa baradhu. Caamsaa bara 1964 hundeeffame.",
    "pageSubtitle": "Seenaa, mul’ata, ergamaa fi gatii",
    "historyTitle": "Seenaa keenya",
    "historyShort": "Jimma Debre Ephrata Qulqulleettii Dubroo Maariyaam Cathedral Column Religion Sunday School was established in May 1964. Jalqaba maqaa \"Waldaa Hafuuraa Dargaggootaa\" jedhuun kaka'umsa diyaaqonoota muraasaa fi dargaggoota waldaa amantootaatiin jalqabame.",
    "historyFull": [
        "Miseensonni kunneen torbanitti guyyaa lama Dilbataa fi Wiixata walga’anii wangeela barsiisuu, faarfannaa qo’achuu fi sagantaa aartii raawwachuudhaan tajaajila eegalaniiru.",
        "Amma manneen barnootaa Sanbataa Magaalaa Jimmaa keessatti adda duree ta'an keessaa tokko ta'eera. Manni barumsaa Sanbataa kun daa’imman, dargaggoota, dargaggootaa fi ga’eessota hammatee tajaajila hafuuraa adda addaa kenna.",
        "Teessoon kun Mootummaa Naannoo Biyyaalessaa Oromiyaa, Zoonii Jimmaa, Magaalaa Jimmaa, Mentina Kebele keessatti argama."
    ],
    "learnMore": "Guutummaa seenaa isaa dubbisaa",
    "showLess": "Gabaabumatti agarsiisi",
    "missionTitle": "Mul’ata, ergamaa fi kaayyoo",
    "missionSubtitle": "Maalummaa dhaloota ogeessa amantii cimaa fi amala fakkeenyummaa qabu kan dogmaa, qajeelfama fi duudhaa mana kiristaanaa abbooti qulqullootaan nuuf dabarsan kabajuu fi kabaju arguudha.",
    "missionP1": "Jecha Maatewos 28:19 irratti hundaa’uun namoota hunda maqaa Abbaa, Ilmaa fi Hafuura Qulqulluun cuuphuudhaan duuka buutota Kiristoos ta’uudha.",
    "missionAim": "Kaayyoon keenya:",
    "missionPoints": [
        "Dogmaa fi qajeelfama Mana Kiristaanaa eeguuf.",
        "Barumsa waldaa addunyaa maraa gara mootummaa samiitti nama geessu barachuu fi barsiisuu.",
        "Badhaadhina hafuuraa fi namummaa biyyaa fi hawaasaaf waan manni kiristaanaa gochuu qabdu gumaachuu.",
        "Dargaggootaa fi daa’imman amantaa Ortodoksii Tewaahidoo fi safuu Kiristaanummaa qaban guddisuudhaan, dhaloota hafuuraa cimaa boru waldaa bu’a qabeessa ta’een fudhatee tajaajilu oomishuuf."
    ],
    "nameMeaningTitle": "Hiika maqaa",
    "nameMeaningIntro": "Maqaan keenya \"Utubaa Amantii\" jedhu bu'uura hafuuraa fi kaayyoo dhaabbata keenyaa ifatti calaqqisiisa:",
    "nameMeaningItems": [
        {
            "title": "toora asii gadii",
            "description": "Bu’uurri guddaan gamoo guddaa kamiyyuu akka hin jigneef deggeruu fi dhaabu utubaa dha. Jireenyi kiristaanaa keenya obomboleettii fi qorumsa yeroo mudatu sagalee Waaqayyoo irratti hundaa’ee yeroo ta’u hin raafamu, jabeessee dhaabbata."
        },
        {
            "title": "Amantaa",
            "description": "Innis walitti dhufeenya cimaa Uumaa keenyaa wajjin qabnu, jaalala Kiristoos fannoo irratti mul’atee fi daandii dhugaa abdii keenya hundumaa itti kaa’anne dha."
        },
        {
            "title": "Utubaa Amantii Mana Barumsaa Sanbataa",
            "description": "Giddugala hafuuraa dargaggoonni fi daa’imman barsiisa Kiristoos Iyyesuusii fi amantii Mana Kiristaanaa Ortodoksii irratti akka jabaatan (akka utubaa jabaatanii) gargaaru, beekumsaa fi amalaan amantii isaanii ijaaru jechuudha."
        }
    ],
    "valuesTitle": "Duudhaalee keenya",
    "valuesIntro": "Kunniin gatiiwwan ijoo keenya, jechoota qofa osoo hin taane, seera bu’uuraa jireenya keenya guyyaa guyyaa ti:",
    "values": [
        {
            "icon": "<Mallattoo Gavel />",
            "title": "Amantaa",
            "description": "Amantiin kan dubbatamu qofa osoo hin taane kan jiraatudha. Dogmaa fi qajeelfama qulqulluu fi kan hin mari’atamne kan Waldaan Qulqulleettii nu barsiifte, amala gaarii wajjin kan walqabate eeguun kan mul’atu jabina keenyadha."
        },
        {
            "icon": "<Jaalatamaa />",
            "title": "Jaalala",
            "description": "Jireenyi keenya kiristaanaa seenaa dha. Waaqayyoon garaa mudaa hin qabneen jaallachuun namoota hunda (sanyii, bifa, sadarkaa osoo hin ilaalin) akka ofii keenyaatti jaallachuun gatii keenya."
        },
        {
            "icon": "<Sochii Tola Ooltummaa />",
            "title": "Namaa ho'uu",
            "description": "Gara laafinni nuuf mul’achuu gocha keenya, kan jaalala kiristaanaa qulqulluu irraa maddu, amantii gara jireenyaatti kan jijjiirudha. Akka waan Gooftaan keenya barsiiseetti, \"Akkuma warra xixiqqaa tokko irratti gootan anaafis gootan\" (Maatewos 25:40) namoota keenya hiyyeeyyii fi dhaqna qabaman keessatti Kiristoosiin argina. Kanaaf jecha wangeelaa ja’an qajeelfama jireenya keenya guyyaa guyyaa gochuudhaan; Namoota beela’an nyaachisuun, warra dhaqna qabaman uffachuudhaan, warra gaddan jajjabeessuun, warra dhukkubsatan kadhachuudhaan, gaarummaa Waaqayyo keenya biyya lafaatti kan calaqqisiisu firii hafuuraa gadi fagoodha."
        },
        {
            "icon": "<Mana Barumsaa />",
            "title": "Barumsa",
            "description": "Barumsi sobaa bu’uura jabaa raafamuu hin dandeenye irra dhaabata. Akka jecha ergamichi \"Eenyu irraa barattee cimsitee beekta\" jedhutti, ogummaa hafuuraa fi beekumsa yeroo walitti qabnee, dhaloota dogoggora irraa eeguu fi sammuu ibsinu ifa keenya."
        },
        {
            "icon": "<Harka walqabachuu />",
            "title": "Gad of qabuu",
            "description": "Fakkeenya abbootii fi haadholii keenya qulqullootaa hordofuun gad of deebisnee fi garaa qulqulluun jiraachuun ibsa kiristaanaa keenyaati."
        },
        {
            "icon": "<Waldaa />",
            "title": "Tajaajila",
            "description": "Tajaajila garaa qulqulluu kan waldaa fi hawaasaaf kenninudha. Kunis itti gaafatamummaa hafuuraa nuuf kenname erga bahanii booda \"Nuti garboota faayidaa hin qabne\" jechuun of tuulummaa malee tajaajiluuf qophaa'uudha."
        },
        {
            "icon": "<Kitaaba />",
            "title": "Foon guban",
            "description": "Sirna kiristaanaa yeroo hunda cubbuu irraa dhiqannee Irbaata Qulqulluu fudhachuun jireenya hafuuraa keenya itti haaromsinudha."
        }
    ],
    "leadershipTitle": "Pirezidaantiin mana barumsaa Sanbataa",
    "leaderName": "Diyaaqon Iyoob gonfoo",
    "leaderRole": "Pirezidaantiin mana barumsaa Sanbataa",
    "leaderQuote": "Waaqayyo garuu guddachaa ture. — 1 Qorontos 3:6",
    "ctaTitle": "Qaama hawaasa keenyaa ta'uuf qophiidhaa?",
    "ctaSubtitle": "Mucaan keessan akkamitti amantii fi waldaa nu waliin guddachuu akka danda’u ilaaluuf daree fi taateewwan keenya daawwadhaa.",
    "ctaButton": "Kutaawwan keenya daawwadhaa"
},
  ti: {
    "appName": "ዓምደሃይማኖት",
    "ourStory": "ታሪኽና",
    "pageTitle": "ብዛዕባ ሃይማኖታዊ ቤት ትምህርቲ ሰንበት",
    "pageDescription": "ብዛዕባ ታሪኽን ራእይን ተልእኾን ክብርታትን ጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓንዲ ሃይማኖት ቤት ትምህርቲ ሰንበት ተማሃሩ። ኣብ ግንቦት 1964 እዩ ተመስሪቱ።",
    "pageSubtitle": "ታሪኽ፡ ራእይ፡ ተልእኾን ክብርታትን",
    "historyTitle": "ታሪኽና",
    "historyShort": "ጅማ ደብረ ኤፍራታ ካቴድራል ቅድስት ድንግል ማርያም ዓምዲ ሃይማኖት ቤት ትምህርቲ ሰንበት ኣብ ግንቦት 1964 ዓ.ም.",
    "historyFull": [
        "እቶም ኣባላት ኣብ ሰሙን ክልተ መዓልቲ ቀዳምን ሰንበትን ተኣኪቦም ወንጌል ብምምሃርን መዝሙር ብምጽናዕን ስነ ጥበባዊ መደባት ብምፍጻምን ኣገልግሎት ጀሚሮም።",
        "ሐዚ ድማ ኣብ ከተማ ጅማ ካብ ዝፍለጣ ኣብያተ ትምህርቲ ሰንበት ሓንቲ ኮይና ኣላ። እዚ ቤት ትምህርቲ ሰንበት ንህጻናት፡ መንእሰያት፡ መንእሰያትን ዓበይትን ዝሓቖፈን ዝተፈላለየ መንፈሳዊ ኣገልግሎት ዝህብን እዩ።",
        "እቲ ኣድራሻ ኣብ ብሄራዊ ክልላዊ መንግስቲ ኦሮምያ ዞባ ጅማ ከተማ ጅማ መንጢና ቀበሌ ይርከብ።"
    ],
    "learnMore": "ምሉእ ዛንታ ኣንብቡ።",
    "showLess": "ብሕጽር ዝበለ ኣርእዩ",
    "missionTitle": "ራእይ፡ ተልእኾን ዕላማን",
    "missionSubtitle": "ብቅዱሳን ኣቦታት ዝተመሓላለፈና ዶግማ፣ ቀኖናን ትውፊትን ቤተ ክርስቲያን ዘኽብርን ዘኽብርን ድልዱል ሃይማኖትን ኣብነታዊ ኣካይዳን ዘለዎ ለባም ወለዶ ባህሪ ምርኣይ እዩ።",
    "missionP1": "ካብ ቃል ማቴ 28፡19 ተመርኲስካ ንኹሉ ሰብ ብስም ኣብን ወልድን መንፈስ ቅዱስን ኣጥሚቕካ ሰዓብቲ ክርስቶስ ምዃን እዩ።",
    "missionAim": "ዕላማታትና፤",
    "missionPoints": [
        "ዶግማን ቀኖናን ቤተ ክርስቲያን ንምዕቃብ።",
        "ናብ መንግስተ ሰማያት ዝመርሕ ኣድማሳዊ ትምህርቲ ቤተ ክርስቲያን ምምሃርን ምምሃርን።",
        "ቤተ ክርስቲያን ኣብ መንፈሳውን ሰብኣውን ብልጽግና ሃገርን ሕብረተሰብን ክትገብሮ ዝግባእ ኣበርክቶ ምግባር።",
        "ብኦርቶዶክሳዊ እምነት ተዋህዶን ክርስትያናዊ ጽቡቕ ባህርያትን ዘለዎም መንእሰያትን ህጻናትን ብምዕባይ፣ ጽባሕ ንቤተ ክርስቲያን ብኣድማዒ መንገዲ ዝሕዝን ዘገልግልን ሓያል መንፈሳዊ ወለዶ ንምፍራይ።"
    ],
    "nameMeaningTitle": "ትርጉም ናይቲ ስም",
    "nameMeaningIntro": "\"ዓንዲ ሃይማኖት\" ዝብል ስምና መንፈሳዊ መሰረትን ዕላማን ትካልና ብንጹር ዘንጸባርቕ እዩ፤",
    "nameMeaningItems": [
        {
            "title": "ሪጋ",
            "description": "ዝኾነ ዓቢ ህንጻ ከይፈርስ ዝድግፍን ዝዓግትን ቀንዲ መሰረት ዓንዲ እዩ። ክርስትያናዊ ሕይወትና ህቦብላን ፈተናን ክገጥሞ ከሎ ኣብ ቃል ኣምላኽ ዝተመስረተ ምስ ዝኸውን ኣይንቀጥቀጥን ኣጽኒዑ ደው ይብልን።"
        },
        {
            "title": "ሃይማኖት",
            "description": "ምስ ፈጣሪና ዘሎና ጽኑዕ ርክብ፡ ኣብ መስቀል ዝተገልጸ ፍቕሪ ክርስቶስ፡ ኩሉ ተስፋና ዘቐመጥናሉ ሓቀኛ መንገዲ እዩ።"
        },
        {
            "title": "ዓንዲ ሃይማኖት ቤት ትምህርቲ ሰንበት",
            "description": "መንእሰያትን ህጻናትን ኣብ ትምህርቲ ክርስቶስ ኢየሱስን እምነት ኦርቶዶክሳዊት ቤተ ክርስቲያንን ጸኒዖም (ከም ዓንዲ ድልዱል) ክጸንዑ ዝሕግዝ፡ እምነቶም ብፍልጠትን ኣካይዳን ዝሃንጽ መንፈሳዊ ማእከል ማለት እዩ።"
        }
    ],
    "valuesTitle": "ክብርታትና",
    "valuesIntro": "እዚኦም እዮም ቀንዲ ክብርታትና እምበር ስብስብ ቃላት ጥራይ ዘይኮነስ መዓልታዊ መትከላት ህይወትና እዮም፤",
    "values": [
        {
            "icon": "<ጋቨልኣይኮን />",
            "title": "ሃይማኖት",
            "description": "እምነት ብዘረባ ጥራይ ዘይኰነስ ዝነብር እዩ። ቅድስቲ ቤተ ክርስቲያን ዝመሃረትና ንጹህን ዘይደራደርን ዶግማታትን ቀኖናታትን ብጽቡቕ ስነ-ምግባር ተሰንዩ ብምዕቃብ ዝግለጽ ጽንዓትና እዩ።"
        },
        {
            "icon": "<ዝፈትዎ />",
            "title": "ፍቅሪ",
            "description": "ክርስትያናዊ ሕይወትና ዛንታ እዩ። ንኣምላኽ ብፍጹም ልቢ ምፍቃርን ንኹሎም ሰባት (ዓሌት፡ መልክዕ፡ ደረጃ ብዘየገድስ) ከም ነብስኻ ምፍቃርን ዋጋና እዩ።"
        },
        {
            "icon": "<ወለንተኛኣክቲቪዝም />",
            "title": "ልውሃት",
            "description": "ንዓና ምድንጋጽ ካብ ንጹህ ክርስትያናዊ ፍቕሪ ዝፍልፍል፡ ንእምነት ናብ ህይወት ዝቕይር ናይ ተግባር መግለጺና እዩ። ከምቲ ጐይታና ዝመሃሮ \"ከምቲ ንሓደ ካብዞም ዝነኣሱ ዝገበርካዮ፡ ንዓይ ውን ገበርካኒ\" (ማቴ 25፡40)፡ ክርስቶስ ኣብቲ ድኻን ዝተገዝረ ህዝብና ንርእዮ። ስለዚ ሽዱሽተ ቃላት ወንጌል መሪሕ ዕለታዊ ሕይወትና ብምግባር፤ ንዝጠመዩ ብምምጋብ፡ ንዝተገዝሩ ብምኽዳን፡ ንዝሓዘኑ ብምጽንናዕ፡ ንሕሙማት ብምልማን፡ ንሰናይነት ኣምላኽና ንዓለም ዘንጸባርቕ ዓሚቝ ፍረ መንፈስ እዩ።"
        },
        {
            "icon": "<ቤት ትምህርቲ />",
            "title": "ትምህርቲ",
            "description": "ናይ ሓሶት ትምህርቲ ኣብ ዘይንቀሳቐስ ጽኑዕ መሰረት ደው ይብል። ብመሰረት ቃል ሓዋርያ \"ካብ መን ከም ዝተማሃርካን ትጽዕርን ትፈልጥ ኢኻ\" ዝብል ቃል መንፈሳዊ ጥበብ ምስ ፍልጠት ናይቲ ግዜ ኣወሃሂድና ንወለዶ ካብ ጌጋታት ክንከላኸልን ኣእምሮ ከነብርህን ብርሃንና እዩ።"
        },
        {
            "icon": "<ኢድ ምጭብባጥ />",
            "title": "ትሕትና",
            "description": "ኣብነት ቅዱሳን ኣቦታትናን ኣዴታትናን ብምኽታል ትሕትናን ቅንዕናን ምንባር ክርስትያናዊ መግለጺና እዩ።"
        },
        {
            "icon": "<ቤተ ክርስቲያን />",
            "title": "ግልጋሎት",
            "description": "ንቤተ ክርስቲያንን ንማሕበረሰብን እንህቦ ልባዊ ኣገልግሎት እዩ። እዚ ድማ ነቲ ዝተዋህበና መንፈሳዊ ሓላፍነት ድሕሪ ምፍጻም \"ንሕና ባሮት ዘይንጠቅም ኢና\" ብምባል ብዘይ ትዕቢት ንምግልጋል ዝግበር ድልውነት እዩ።"
        },
        {
            "icon": "<መጽሓፍ />",
            "title": "ነቲ ስጋ ኣቃጸሉ።",
            "description": "ብስሩዕ ካብ ሓጢኣት ተሓጺብና ቅዱስ ቁርባን ብምቕባል መንፈሳዊ ሕይወትና እንሕደሰሉ ክርስትያናዊ ስርዓት እዩ።"
        }
    ],
    "leadershipTitle": "ፕረዚደንት ቤት ትምህርቲ ሰንበት",
    "leaderName": "ዲያቆን እዮብ ዘውዲ",
    "leaderRole": "ፕረዚደንት ቤት ትምህርቲ ሰንበት",
    "leaderQuote": "ኣምላኽ ግን ይዓቢ ነበረ። — 1 ቈረንቶስ 3:6",
    "ctaTitle": "ኣካል ሕብረተሰብና ንምዃን ድሉው ዲና?",
    "ctaSubtitle": "ውላድኩም ምሳና ብእምነትን ሕብረትን ብኸመይ ክዓቢ ከም ዝኽእል ንምርኣይ ኣብ ክፍልታትናን ፍጻሜታትናን ተወከሱ።",
    "ctaButton": "ክፍልታትና ዳህሰሱ"
},
  es: {
    "appName": "Amdehaymanot",
    "ourStory": "nuestra historia",
    "pageTitle": "Sobre la escuela dominical religiosa",
    "pageDescription": "Conozca la historia, la visión, la misión y los valores de la Escuela Dominical del Pilar de la Religión de la Catedral de la Santísima Virgen María Jimma Debre Ephrata. Fue fundada en mayo de 1964.",
    "pageSubtitle": "Historia, visión, misión y valores.",
    "historyTitle": "nuestra historia",
    "historyShort": "Jimma Debre Ephrata La Escuela Dominical de Religión de la Columna de la Catedral de la Santísima Virgen María se estableció en mayo de 1964. Primero, se inició bajo el nombre de \"Asociación Espiritual Juvenil\" con la iniciativa de algunos diáconos y jóvenes de la parroquia.",
    "historyFull": [
        "Los miembros se reunieron dos días a la semana, sábado y domingo, y comenzaron el servicio enseñando el evangelio, estudiando canciones y realizando programas artísticos.",
        "Ahora se ha convertido en una de las principales escuelas dominicales de Jimma City. Esta escuela dominical acoge a niños, adolescentes, jóvenes y adultos y brinda diversos servicios espirituales.",
        "La dirección está ubicada en el Gobierno Regional Nacional de Oromia, Zona Jimma, Ciudad Jimma, Mentina Kebele."
    ],
    "learnMore": "Leer la historia completa",
    "showLess": "Mostrar brevemente",
    "missionTitle": "Visión, misión y propósito",
    "missionSubtitle": "Es ver la naturaleza de una generación sabia con una religión fuerte y una conducta ejemplar que respetará y honrará el dogma, el canon y la tradición de la iglesia que nos transmitieron los santos padres.",
    "missionP1": "Basado en las palabras de Mateo 28:19, es bautizar a todas las personas en el nombre del Padre, del Hijo y del Espíritu Santo y convertirse en seguidores de Cristo.",
    "missionAim": "Nuestros objetivos:",
    "missionPoints": [
        "Preservar el dogma y canon de la Iglesia.",
        "Aprender y enseñar la doctrina de la iglesia universal que conduce al reino de los cielos.",
        "Contribuir con lo que la iglesia debe hacer a la prosperidad espiritual y humana del país y de la sociedad.",
        "Criando a jóvenes y niños con creencias ortodoxas Tewahedo y virtudes cristianas, para producir una generación espiritual fuerte que efectivamente se hará cargo y servirá a la iglesia mañana."
    ],
    "nameMeaningTitle": "El significado del nombre.",
    "nameMeaningIntro": "Nuestro nombre \"Pilar de la Religión\" refleja claramente el fundamento espiritual y el propósito de nuestra institución:",
    "nameMeaningItems": [
        {
            "title": "columna",
            "description": "La base principal que sostiene y evita que cualquier edificio grande se derrumbe es un pilar. Cuando nuestra vida cristiana se enfrenta a tormentas y pruebas, no tiembla y se mantiene firme cuando se basa en la palabra de Dios."
        },
        {
            "title": "Religión",
            "description": "Es nuestra relación firme con nuestro Creador, el amor de Cristo revelado en la cruz y el verdadero camino en el que hemos puesto toda nuestra esperanza."
        },
        {
            "title": "Pilar Religión Escuela Dominical",
            "description": "Significa un centro espiritual que ayuda a jóvenes y niños a mantenerse firmes (fuertes como un pilar) en las enseñanzas de Cristo Jesús y la fe de la Iglesia Ortodoxa, y construye su fe con conocimiento y conducta."
        }
    ],
    "valuesTitle": "Nuestros valores",
    "valuesIntro": "Estos son nuestros valores fundamentales, no sólo un conjunto de palabras, sino nuestros principios de vida cotidianos:",
    "values": [
        {
            "icon": "<Icono del mazo />",
            "title": "Religión",
            "description": "La fe no sólo se habla sino que se vive. Es nuestra firmeza la que se manifiesta en el mantenimiento de los dogmas y cánones puros e innegociables que nos enseñó la Santa Iglesia, acompañados de buenas maneras."
        },
        {
            "icon": "<Favorito/>",
            "title": "Amar",
            "description": "Nuestra vida cristiana es una historia. Amar a Dios con un corazón perfecto y amar a todas las personas (sin importar raza, apariencia o estatus) como a uno mismo es nuestro valor."
        },
        {
            "icon": "<Activismo Voluntario/>",
            "title": "Compasión",
            "description": "La compasión por nosotros es nuestra manifestación de acción, que brota del puro amor cristiano y convierte la fe en vida. Según lo que enseñó nuestro Señor: \"Todo lo que hicisteis a uno de estos más pequeños, a mí lo hicisteis\" (Mateo 25:40), vemos a Cristo en nuestro pueblo pobre y circuncidado. Por lo tanto, al hacer de las seis palabras del evangelio nuestra guía en la vida diaria; Al alimentar a los hambrientos, vestir a los circuncidados, consolar a los afligidos y pedir por los enfermos, es el fruto profundo del Espíritu que refleja la bondad de nuestro Dios para con el mundo."
        },
        {
            "icon": "<Escuela />",
            "title": "Educación",
            "description": "Las falsas enseñanzas se sostienen sobre una base firme que no puede ser sacudida. Según las palabras del apóstol, “Sabéis de quién habéis aprendido y perseverad”, combinamos la sabiduría espiritual con el conocimiento del tiempo, es nuestra luz para proteger a la generación de los errores e iluminar la mente."
        },
        {
            "icon": "<apretón de manos/>",
            "title": "Humildad",
            "description": "Siguiendo el ejemplo de nuestros santos padres y madres, es nuestra expresión cristiana vivir humildes y sinceros."
        },
        {
            "icon": "<Iglesia />",
            "title": "Servicio",
            "description": "Es un servicio sincero que brindamos a la iglesia y a la comunidad. Esta es la disposición a servir sin orgullo diciendo: \"Somos esclavos inútiles\" después de cumplir con la responsabilidad espiritual que se nos ha confiado."
        },
        {
            "icon": "<Libro />",
            "title": "Quemaron la carne",
            "description": "Es un sistema cristiano donde renovamos nuestra vida espiritual lavándonos regularmente del pecado y recibiendo la Sagrada Comunión."
        }
    ],
    "leadershipTitle": "El presidente de la escuela dominical.",
    "leaderName": "Corona de diácono Job",
    "leaderRole": "El presidente de la escuela dominical.",
    "leaderQuote": "Pero Dios estaba creciendo. — 1 Corintios 3:6",
    "ctaTitle": "¿Listo para ser parte de nuestra comunidad?",
    "ctaSubtitle": "Visite nuestras clases y eventos para ver cómo su hijo puede crecer en fe y compañerismo con nosotros.",
    "ctaButton": "Navega por nuestras habitaciones"
},
  fr: {
    "appName": "Amdehaymanot",
    "ourStory": "Notre histoire",
    "pageTitle": "À propos de l'école religieuse du dimanche",
    "pageDescription": "Découvrez l'histoire, la vision, la mission et les valeurs de l'école du dimanche du pilier de la religion de la cathédrale Sainte-Vierge-Marie de Jimma Debre Ephrata. Elle a été fondée en mai 1964.",
    "pageSubtitle": "Histoire, vision, mission et valeurs",
    "historyTitle": "Notre histoire",
    "historyShort": "Jimma Debre Ephrata Colonne de la cathédrale Sainte-Vierge-Marie Religion L'école du dimanche a été créée en mai 1964. Tout d'abord, elle a été créée sous le nom d'« Association spirituelle des jeunes » à l'initiative de quelques diacres et de jeunes de la paroisse.",
    "historyFull": [
        "Les membres se sont réunis deux jours par semaine, le samedi et le dimanche, et ont commencé le service en enseignant l'Évangile, en étudiant des chants et en présentant des programmes artistiques.",
        "Elle est désormais devenue l'une des principales écoles du dimanche de Jimma City. Cette école du dimanche accueille des enfants, des adolescents, des jeunes et des adultes et propose divers services spirituels.",
        "L'adresse est située dans le gouvernement régional national d'Oromia, zone Jimma, ville de Jimma, Mentina Kebele."
    ],
    "learnMore": "Lire l'histoire complète",
    "showLess": "Afficher brièvement",
    "missionTitle": "Vision, mission et objectif",
    "missionSubtitle": "Il s’agit de voir la nature d’une génération sage, dotée d’une religion forte et d’une conduite exemplaire, qui respectera et honorera le dogme, le canon et la tradition de l’Église que nous ont transmis les saints pères.",
    "missionP1": "Basé sur les paroles de Matthieu 28 : 19, il s’agit de baptiser tous les hommes au nom du Père, du Fils et du Saint-Esprit et de devenir des disciples du Christ.",
    "missionAim": "Nos objectifs :",
    "missionPoints": [
        "Préserver le dogme et le canon de l'Église.",
        "Apprendre et enseigner la doctrine universelle de l’Église qui mène au royaume des cieux.",
        "Contribuer ce que l'Église devrait faire à la prospérité spirituelle et humaine du pays et de la société.",
        "En élevant des jeunes et des enfants avec les croyances orthodoxes Tewahedo et les vertus chrétiennes, pour produire une génération spirituelle forte qui prendra efficacement le relais et servira l'Église de demain."
    ],
    "nameMeaningTitle": "La signification du nom",
    "nameMeaningIntro": "Notre nom « Pilier de la Religion » reflète clairement le fondement spirituel et le but de notre institution :",
    "nameMeaningItems": [
        {
            "title": "colonne",
            "description": "La principale fondation qui soutient et empêche tout grand bâtiment de s’effondrer est un pilier. Lorsque notre vie chrétienne est confrontée aux tempêtes et aux épreuves, elle ne tremble pas et tient fermement lorsqu’elle s’appuie sur la parole de Dieu."
        },
        {
            "title": "Religion",
            "description": "C’est notre relation inébranlable avec notre Créateur, l’amour du Christ révélé sur la croix et le véritable chemin dans lequel nous avons placé toute notre espérance."
        },
        {
            "title": "École du dimanche de la religion du pilier",
            "description": "Cela signifie un centre spirituel qui aide les jeunes et les enfants à rester fermes (forts comme un pilier) sur les enseignements du Christ Jésus et sur la foi de l'Église orthodoxe, et à construire leur foi par la connaissance et la conduite."
        }
    ],
    "valuesTitle": "Nos valeurs",
    "valuesIntro": "Ce sont nos valeurs fondamentales, pas seulement un ensemble de mots, mais nos principes de vie quotidiens :",
    "values": [
        {
            "icon": "<IcôneGavel />",
            "title": "Religion",
            "description": "La foi n'est pas seulement parlée mais vécue. C'est notre fermeté qui se manifeste dans le maintien des dogmes et canons purs et non négociables que la Sainte Église nous a enseignés, accompagnés des bonnes manières."
        },
        {
            "icon": "<Favori />",
            "title": "Amour",
            "description": "Notre vie chrétienne est une histoire. Aimer Dieu avec un cœur parfait et aimer tous les gens (sans distinction de race, d'apparence ou de statut) comme soi-même est notre valeur."
        },
        {
            "icon": "<Activisme bénévole />",
            "title": "Compassion",
            "description": "Pour nous, la compassion est notre manifestation d’action, qui jaillit du pur amour chrétien et transforme la foi en vie. Selon ce que notre Seigneur a enseigné : « Ce que vous avez fait à l'un d'entre eux, c'est à moi que vous l'avez fait » (Matthieu 25 :40), nous voyons le Christ dans notre peuple pauvre et circoncis. Par conséquent, en faisant des six paroles de l’Évangile notre guide de vie quotidienne ; En nourrissant les affamés, en habillant les circoncis, en réconfortant les affligés et en demandant des soins aux malades, c'est le fruit profond de l'Esprit qui reflète la bonté de notre Dieu envers le monde."
        },
        {
            "icon": "<École />",
            "title": "Éducation",
            "description": "Les faux enseignements reposent sur une base solide qui ne peut être ébranlée. Selon les paroles de l'apôtre : « Vous savez de qui vous avez appris et persévérez », nous combinons la sagesse spirituelle avec la connaissance du temps, c'est notre lumière pour protéger la génération des erreurs et éclairer l'esprit."
        },
        {
            "icon": "<Poignée de main />",
            "title": "Humilité",
            "description": "À l’instar de nos saints pères et mères, notre expression chrétienne est de vivre humblement et sincèrement."
        },
        {
            "icon": "<Église />",
            "title": "Service",
            "description": "C'est un service sincère que nous rendons à l'Église et à la communauté. C'est la volonté de servir sans orgueil en disant : « Nous sommes des esclaves inutiles » après avoir accompli la responsabilité spirituelle qui nous a été confiée."
        },
        {
            "icon": "<Livre />",
            "title": "Ils ont brûlé la chair",
            "description": "C'est un système chrétien dans lequel nous renouvelons notre vie spirituelle en nous débarrassant régulièrement du péché et en recevant la Sainte Communion."
        }
    ],
    "leadershipTitle": "Le président de l'école du dimanche",
    "leaderName": "Couronne de travail de diacre",
    "leaderRole": "Le président de l'école du dimanche",
    "leaderQuote": "Mais Dieu grandissait. — 1 Corinthiens 3:6",
    "ctaTitle": "Prêt à faire partie de notre communauté?",
    "ctaSubtitle": "Visitez nos cours et événements pour voir comment votre enfant peut grandir dans la foi et la communion fraternelle avec nous.",
    "ctaButton": "Parcourez nos chambres"
},
  ar: {
    "appName": "آمدهيمانوت",
    "ourStory": "تاريخنا",
    "pageTitle": "عن مدرسة الأحد الدينية",
    "pageDescription": "تعرف على تاريخ ورؤية ورسالة وقيم جيما ديبري إفراتا كاتدرائية مريم العذراء المقدسة عمود الدين في مدرسة الأحد. تأسست في مايو 1964.",
    "pageSubtitle": "التاريخ والرؤية والرسالة والقيم",
    "historyTitle": "تاريخنا",
    "historyShort": "جيما ديبري إفراتا عمود كاتدرائية مريم العذراء المقدسة تأسست مدرسة الأحد الدينية في مايو 1964. في البداية، بدأت تحت اسم \"جمعية الشباب الروحية\" بمبادرة من عدد قليل من الشمامسة والشباب في الرعية.",
    "historyFull": [
        "اجتمع الأعضاء يومين في الأسبوع يومي السبت والأحد وبدأوا الخدمة بتعليم الإنجيل ودراسة الأغاني وتنفيذ البرامج الفنية.",
        "لقد أصبحت الآن واحدة من مدارس الأحد الرائدة في مدينة جيما. تضم مدرسة الأحد هذه الأطفال والمراهقين والشباب والكبار وتقدم خدمات روحية متنوعة.",
        "يقع العنوان في حكومة أوروميا الإقليمية الوطنية، منطقة جيما، مدينة جيما، مينتينا كيبيلي."
    ],
    "learnMore": "إقرأ القصة كاملة",
    "showLess": "عرض لفترة وجيزة",
    "missionTitle": "الرؤية والرسالة والهدف",
    "missionSubtitle": "إنه رؤية طبيعة جيل حكيم يتمتع بدين قوي وسلوك مثالي يحترم ويكرم عقيدة الكنيسة وقانونها وتقاليدها التي سلمها إلينا الآباء القديسون.",
    "missionP1": "بناءً على كلمات متى 28: 19، فإن الهدف هو تعميد جميع الناس باسم الآب والابن والروح القدس، ويصبحون أتباعًا للمسيح.",
    "missionAim": "أهدافنا:",
    "missionPoints": [
        "- الحفاظ على عقيدة الكنيسة وقانونها.",
        "تعلم وتعليم عقيدة الكنيسة العالمية التي تؤدي إلى ملكوت السماوات.",
        "المساهمة بما يجب أن تفعله الكنيسة من أجل الرخاء الروحي والإنساني للوطن والمجتمع.",
        "من خلال تربية الشباب والأطفال على معتقدات التوحيد الأرثوذكسية والفضائل المسيحية، لإنتاج جيل روحي قوي يتولى مسؤولية الكنيسة ويخدمها غدًا بشكل فعال."
    ],
    "nameMeaningTitle": "معنى الاسم",
    "nameMeaningIntro": "إن اسمنا \"عمود الدين\" يعكس بوضوح الأساس الروحي والغرض من مؤسستنا:",
    "nameMeaningItems": [
        {
            "title": "عمود",
            "description": "الأساس الرئيسي الذي يدعم ويمنع أي مبنى كبير من الانهيار هو العمود. عندما تواجه حياتنا المسيحية العواصف والتجارب، فإنها لا تتزعزع وتثبت عندما ترتكز على كلمة الله."
        },
        {
            "title": "دِين",
            "description": "إنها علاقتنا الثابتة مع خالقنا، وهي محبة المسيح التي ظهرت على الصليب، والطريق الحقيقي الذي وضعنا فيه كل رجائنا."
        },
        {
            "title": "مدرسة عمود الدين الأحد",
            "description": "يعني مركزًا روحيًا يساعد الشباب والأطفال على الثبات (قويًا كعمود) على تعاليم المسيح يسوع وإيمان الكنيسة الأرثوذكسية، ويبني إيمانهم بالمعرفة والسلوك."
        }
    ],
    "valuesTitle": "قيمنا",
    "valuesIntro": "هذه هي قيمنا الأساسية، وليست مجرد مجموعة من الكلمات، ولكن مبادئ حياتنا اليومية:",
    "values": [
        {
            "icon": "<جافيليكون />",
            "title": "دِين",
            "description": "الإيمان لا يُقال فحسب، بل يُعاش أيضًا. إن ثباتنا هو الذي يظهر من خلال الحفاظ على العقائد والشرائع النقية وغير القابلة للتفاوض التي علمتنا إياها الكنيسة المقدسة، مصحوبة بالأخلاق الحميدة."
        },
        {
            "icon": "<المفضلة />",
            "title": "حب",
            "description": "حياتنا المسيحية هي قصة. إن محبة الله بقلب كامل وحب جميع الناس (بغض النظر عن العرق أو المظهر أو المكانة) كنفس الشخص هي قيمتنا."
        },
        {
            "icon": "<النشاط التطوعي />",
            "title": "عطف",
            "description": "والرحمة بالنسبة لنا هي مظهر عملنا الذي ينبع من المحبة المسيحية النقية، ويحول الإيمان إلى حياة. وبحسب ما علمه ربنا: \"كما فعلتموه بأحد هؤلاء الصغار فبي فعلتموه\" (متى 25: 40)، نرى المسيح في شعبنا الفقير والمختون. لذلك، بجعل كلمات الإنجيل الست مرشدًا لحياتنا اليومية؛ بإطعام الجياع، وكسوة الختان، وتعزية الحزانى، وطلب المرضى، فهو ثمر الروح العميق الذي يعكس صلاح إلهنا للعالم."
        },
        {
            "icon": "<المدرسة/>",
            "title": "تعليم",
            "description": "التعاليم الباطلة تقوم على أساس ثابت لا يتزعزع. وكما يقول الرسول \"أنتم تعلمون ممن تعلمتم وثابروا\" فنحن نجمع بين الحكمة الروحية ومعرفة العصر، فهي نورنا لحماية الجيل من الأخطاء وإنارة العقل."
        },
        {
            "icon": "<المصافحة />",
            "title": "التواضع",
            "description": "على مثال آبائنا وأمهاتنا القديسين، فإن تعبيرنا المسيحي هو أن نعيش متواضعين وصادقين."
        },
        {
            "icon": "<الكنيسة />",
            "title": "خدمة",
            "description": "إنها خدمة مخلصة نقدمها للكنيسة والمجتمع. هذا هو الاستعداد للخدمة بلا كبرياء بالقول: \"نحن عبيد بلا نفع\" بعد إتمام المسؤولية الروحية الموكلة إلينا."
        },
        {
            "icon": "<كتاب />",
            "title": "لقد أحرقوا اللحم",
            "description": "إنه نظام مسيحي حيث نقوم بتجديد حياتنا الروحية من خلال الاغتسال بانتظام من الخطيئة والحصول على المناولة المقدسة."
        }
    ],
    "leadershipTitle": "رئيس مدرسة الأحد",
    "leaderName": "تاج وظيفة الشماس",
    "leaderRole": "رئيس مدرسة الأحد",
    "leaderQuote": "لكن الله كان ينمو. — ١ كورنثوس ٣: ٦",
    "ctaTitle": "هل أنت مستعد لتكون جزءًا من مجتمعنا؟",
    "ctaSubtitle": "قم بزيارة فصولنا وفعالياتنا لترى كيف يمكن لطفلك أن ينمو في الإيمان والشركة معنا.",
    "ctaButton": "تصفح غرفنا"
},
  am: {
    "appName": "ዓምደሃይማኖት",
    "ourStory": "ታሪካችን",
    "pageTitle": "ስለ ዓምደሃይማኖት ሰንበት ትምህርት ቤት",
    "pageDescription": "ስለ ጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ታሪክ፣ ራዕይ፣ ተልዕኮ እና እሴቶች ይወቁ። በግንቦት ወር 1964 ዓ.ም ተመሠረተ።",
    "pageSubtitle": "ታሪክ፣ ራዕይ፣ ተልዕኮና እሴት",
    "historyTitle": "ታሪካችን",
    "historyShort": "የጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት በግንቦት ወር 1964 ዓ.ም ተመሠረተ። በመጀመሪያ በደብሩ ውስጥ በሚገኙ ጥቂት ዲያቆናትና ወጣቶች አነሳሽነት \"የወጣቶች መንፈሳዊ ማህበር\" በሚል ስያሜ ተጀመረ።",
    "historyFull": [
        "አባላቱ በሳምንት ሁለት ቀን ቅዳሜ እና እሑድ እየተገናኙ ትምህርተ ወንጌል በመማማር፣ ዝማሬዎችንና ኪነ ጥበባዊ መርሐ ግብሮችን በማጥናት ለምዕመናን በማቅረብ አገልግሎቱን ጀምረዋል።",
        "በአሁኑ ሰዓት ጅማ ከተማ ላይ ካሉ ግንባር ቀደም ሰንበት ትምህርት ቤቶች መካከል አንዱ ሆኗል። ይህ ሰንበት ትምህርት ቤት በውስጡ ህጻናትን፣ አዳጊዎችን፣ ወጣቶችንና ጎልማሶችን አቅፎ ልዩ ልዩ መንፈሳዊ አገልግሎቶችን እየሰጠ ይገኛል።",
        "አድራሻው በኦሮሚያ ብሔራዊ ክልላዊ መንግስት በጅማ ዞን በጅማ ከተማ መሃል ከተማ መንቲና ቀበሌ ይገኛል።"
    ],
    "learnMore": "ሙሉውን ታሪክ ያንብቡ",
    "showLess": "በአጭሩ አሳይ",
    "missionTitle": "ራዕይ፣ ተልዕኮና ዓላማ",
    "missionSubtitle": "ቅዱሳን አባቶች ጠብቀው ያስረከቡንን የቤተ ክርስቲያን ዶግማ፣ ቀኖና እና ትውፊት አክብሮና አስከብሮ ተስፋ የምናደርገውን መንግስተ ሰማያት ለመውረስ የሚያበቃ የጸና ሃይማኖትና ምሳሌ የሆነ ምግባር ይዞ የሚገኝ ጥበበኛ ትውልድ ተፈጥሮ ማየት ነው።",
    "missionP1": "በማቴዎስ 28፥19 ያለውን ቃል መሠረት በማድረግ ሰዎችን ሁሉ በአብ፣ በወልድና በመንፈስ ቅዱስ ስም እንዲጠመቁ እና የክርስቶስ ተከታዮች እንዲሆኑ ማድረግ ነው።",
    "missionAim": "ዓላማዎቻችን፡",
    "missionPoints": [
        "የቤተ ክርስቲያኒቱን ዶግማ እና ቀኖና ጠብቆ ማስጠበቅ።",
        "ለመንግስተ ሰማያት የሚያበቃ ሁለንተናዊ የቤተ ክርስቲያን ትምህርት መማር እና ማስተማር።",
        "ቤተ ክርስቲያን ለሀገር እና ለማህበረሰቡ መንፈሳዊና ሰብዓዊ ብልጽግና ልትወጣ የሚገባትን አስተዋጽኦ ማበርከት።",
        "ወጣቶችና ሕፃናትን በኦርቶዶክሳዊት ተዋሕዶ እምነትና በክርስቲያናዊ በጎ ምግባር አንጾ በማሳደግ፣ ነገ ቤተ ክርስቲያንን በብቃት የሚረከብና የሚያገለግል ጽኑ መንፈሳዊ ትውልድ ማፍራት።"
    ],
    "nameMeaningTitle": "የስያሜው ትርጉም",
    "nameMeaningIntro": "\"ዓምደ ሃይማኖት\" የሚለው ስያሜያችን የተቋማችንን መንፈሳዊ መሠረትና ዓላማ በግልጽ ያንጸባርቃል፦",
    "nameMeaningItems": [
        {
            "title": "ዓምድ (ምሶሶ)",
            "description": "ማንኛውም ትልቅ ሕንጻ እንዳይፈርስ ደግፎ የሚያቆመው ዋናው መሠረቱ ምሶሶ (ዓምድ) ነው። የክርስቲያናዊ ሕይወታችንም ማዕበልና ፈተና ሲገጥመው የማይናወጠውና ጸንቶ የሚቆመው በእግዚአብሔር ቃል ላይ ሲመሠረት ነው።"
        },
        {
            "title": "ሃይማኖት",
            "description": "ከፈጣሪያችን ጋር ያለን ጽኑ ግንኙነት፣ በመስቀል ላይ የተገለጠው የክርስቶስ ፍቅር፣ እና ተስፋችንን ሁሉ የጣልንበት የእውነት መንገድ ነው።"
        },
        {
            "title": "ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት",
            "description": "ወጣቶችና ሕፃናት በክርስቶስ ኢየሱስ አስተምህሮና በኦርቶዶክሳዊት ቤተ ክርስቲያን እምነት ላይ ጸንተው እንዲቆሙ (እንደ ዓምድ እንዲጠነክሩ) የሚያደርግ፣ እምነታቸውን በዕውቀትና በምግባር የሚያንጽ መንፈሳዊ ማዕከል ማለት ነው።"
        }
    ],
    "valuesTitle": "እሴቶቻችን",
    "valuesIntro": "እነዚህ መሠረታዊ እሴቶቻችን የቃላት ድርደራ ብቻ ሳይሆኑ፣ የዕለት ተዕለት የሕይወት መርሆዎቻችን ናቸው፦",
    "values": [
        {
            "icon": "<GavelIcon />",
            "title": "ሃይማኖት",
            "description": "እምነትን በቃል ብቻ ሳይሆን በሕይወት መኖር ነው። ቅድስት ቤተ ክርስቲያን ያስተማረችንን ንጹሕና የማንደራደርበትን ዶግማና ቀኖና ጠብቆ፣ በበጎ ምግባር ታጅቦ የሚገለጥ ጽኑ አቋማችን ነው።"
        },
        {
            "icon": "<Favorite />",
            "title": "ፍቅር",
            "description": "የክርስቲያናዊ ሕይወታችን ማገር ነው። ፍጹም በሆነ ልብ እግዚአብሔርን መውደድ እና ሰውን ሁሉ (ዘር፣ መልክ፣ ወይም ደረጃ ሳይለዩ) እንደ ራስ አድርጎ ማፍቀርን በተግባር የምናሳይበት እሴታችን ነው።"
        },
        {
            "icon": "<VolunteerActivism />",
            "title": "ርኅራኄ",
            "description": "ርኅራኄ ለእኛ ከንጹሕ የክርስቲያን ፍቅር የሚመነጭ፣ እምነትን ወደ ሕይወት የምንቀይርበት የተግባር መገለጫችን ነው። ጌታችን “ከእነዚህ ከታናናሾቹ ለአንዱ ስላደረጋችሁት ለእኔ አደረጋችሁት” (ማቴ 25፥40) ብሎ ባስተማረው መሠረት፣ በተቸገሩትና በታረዙት ወገኖቻችን ውስጥ ክርስቶስን እናያለን። በመሆኑም ስድስቱን ቃላተ ወንጌል የዕለት ተዕለት የሕይወታችን መመሪያ በማድረግ፤ የተራቡትን በማብላት፣ የታረዙትን በማልበስ፣ ያዘኑትን በማጽናናት እንዲሁም የታመሙትን በመጠየቅ የአምላካችንን ቸርነት ለዓለም የምናንጸባርቅበት ጥልቅ የመንፈስ ፍሬ ነው።"
        },
        {
            "icon": "<School />",
            "title": "ትምህርት",
            "description": "ሐሰተኛ ትምህርቶች በማይነቀንቁት ጽኑ መሠረት ላይ መቆም ነው። \"ከማን እንደተማርክ ታውቃለህና ጽና\" በሚለው የሐዋርያው ቃል መሠረት፣ መንፈሳዊውን ጥበብ ከዘመኑ ዕውቀት ጋር አዋህደን፣ ትውልድን ከስህተት የምንጠብቅበትና አእምሮን የምናበራበት ብርሃናችን ነው።"
        },
        {
            "icon": "<Handshake />",
            "title": "ትሕትና",
            "description": "የቅዱሳን አባቶቻችንንና እናቶቻችንን አርዓያነት በመከተል፣ ራስን ዝቅ አድርጎ በቅንነት የመኖር ክርስቲያናዊ መገለጫችን ነው።"
        },
        {
            "icon": "<Church />",
            "title": "አገልግሎት",
            "description": "ለቤተ ክርስቲያንና ለማኅበረሰቡ የምንሰጠው ቅን አገልጋይነት ሲሆን፤ ይህም የተሰጠንን መንፈሳዊ ሓላፊነት ከፈጸምን በኋላ \"የማንጠቅም ባሪያዎች ነን\" በማለት ያለ ትዕቢት የምናገለግልበት ዝግጁነት ነው።"
        },
        {
            "icon": "<Book />",
            "title": "ሥጋ ወደሙ",
            "description": "ዘወትር ከኃጢአት ርቆ በንስሐ በመታጠብና ቅዱስ ቁርባንን በመቀበል መንፈሳዊ ሕይወታችንን የምናድስበት የክርስቲያን ሥርዓት ነው።"
        }
    ],
    "leadershipTitle": "የሰንበት ትምህርት ቤቱ ሰብሳቢ",
    "leaderName": "ዲያቆን ኢዮብ ዘውዱ",
    "leaderRole": "የሰንበት ትምህርት ቤቱ ሰብሳቢ",
    "leaderQuote": "ነገር ግን እግዚአብሔር ያሳድግ ነበር። — 1ኛ ቆሮንቶስ 3:6",
    "ctaTitle": "የማህበረሰባችን አካል ለመሆን ዝግጁ ኖት?",
    "ctaSubtitle": "ልጅዎ በእምነትና በኅብረት ከእኛ ጋር እንዴት እንደሚያድግ ለማየት ክፍሎቻችንንና ዝግጅቶቻችንን ይጎብኙ።",
    "ctaButton": "ክፍሎቻችንን ያስሱ"
},
  ge: {
    "appName": "ዓምደሃይማኖት",
    "ourStory": "ታሪካችን",
    "pageTitle": "ስለ ዓምደሃይማኖት ሰንበት ትምህርት ቤት",
    "pageDescription": "ስለ ጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ታሪክ፣ ራዕይ፣ ተልዕኮ እና እሴቶች ይወቁ። በግንቦት ወር 1964 ዓ.ም ተመሠረተ።",
    "pageSubtitle": "ታሪክ፣ ራዕይ፣ ተልዕኮና እሴት",
    "historyTitle": "ታሪካችን",
    "historyShort": "የጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት በግንቦት ወር 1964 ዓ.ም ተመሠረተ። በመጀመሪያ በደብሩ ውስጥ በሚገኙ ጥቂት ዲያቆናትና ወጣቶች አነሳሽነት \"የወጣቶች መንፈሳዊ ማህበር\" በሚል ስያሜ ተጀመረ።",
    "historyFull": [
        "አባላቱ በሳምንት ሁለት ቀን ቅዳሜ እና እሑድ እየተገናኙ ትምህርተ ወንጌል በመማማር፣ ዝማሬዎችንና ኪነ ጥበባዊ መርሐ ግብሮችን በማጥናት ለምዕመናን በማቅረብ አገልግሎቱን ጀምረዋል።",
        "በአሁኑ ሰዓት ጅማ ከተማ ላይ ካሉ ግንባር ቀደም ሰንበት ትምህርት ቤቶች መካከል አንዱ ሆኗል። ይህ ሰንበት ትምህርት ቤት በውስጡ ህጻናትን፣ አዳጊዎችን፣ ወጣቶችንና ጎልማሶችን አቅፎ ልዩ ልዩ መንፈሳዊ አገልግሎቶችን እየሰጠ ይገኛል።",
        "አድራሻው በኦሮሚያ ብሔራዊ ክልላዊ መንግስት በጅማ ዞን በጅማ ከተማ መሃል ከተማ መንቲና ቀበሌ ይገኛል።"
    ],
    "learnMore": "ሙሉውን ታሪክ ያንብቡ",
    "showLess": "በአጭሩ አሳይ",
    "missionTitle": "ራዕይ፣ ተልዕኮና ዓላማ",
    "missionSubtitle": "ቅዱሳን አባቶች ጠብቀው ያስረከቡንን የቤተ ክርስቲያን ዶግማ፣ ቀኖና እና ትውፊት አክብሮና አስከብሮ ተስፋ የምናደርገውን መንግስተ ሰማያት ለመውረስ የሚያበቃ የጸና ሃይማኖትና ምሳሌ የሆነ ምግባር ይዞ የሚገኝ ጥበበኛ ትውልድ ተፈጥሮ ማየት ነው።",
    "missionP1": "በማቴዎስ 28፥19 ያለውን ቃል መሠረት በማድረግ ሰዎችን ሁሉ በአብ፣ በወልድና በመንፈስ ቅዱስ ስም እንዲጠመቁ እና የክርስቶስ ተከታዮች እንዲሆኑ ማድረግ ነው።",
    "missionAim": "ዓላማዎቻችን፡",
    "missionPoints": [
        "የቤተ ክርስቲያኒቱን ዶግማ እና ቀኖና ጠብቆ ማስጠበቅ።",
        "ለመንግስተ ሰማያት የሚያበቃ ሁለንተናዊ የቤተ ክርስቲያን ትምህርት መማር እና ማስተማር።",
        "ቤተ ክርስቲያን ለሀገር እና ለማህበረሰቡ መንፈሳዊና ሰብዓዊ ብልጽግና ልትወጣ የሚገባትን አስተዋጽኦ ማበርከት።",
        "ወጣቶችና ሕፃናትን በኦርቶዶክሳዊት ተዋሕዶ እምነትና በክርስቲያናዊ በጎ ምግባር አንጾ በማሳደግ፣ ነገ ቤተ ክርስቲያንን በብቃት የሚረከብና የሚያገለግል ጽኑ መንፈሳዊ ትውልድ ማፍራት።"
    ],
    "nameMeaningTitle": "የስያሜው ትርጉም",
    "nameMeaningIntro": "\"ዓምደ ሃይማኖት\" የሚለው ስያሜያችን የተቋማችንን መንፈሳዊ መሠረትና ዓላማ በግልጽ ያንጸባርቃል፦",
    "nameMeaningItems": [
        {
            "title": "ዓምድ (ምሶሶ)",
            "description": "ማንኛውም ትልቅ ሕንጻ እንዳይፈርስ ደግፎ የሚያቆመው ዋናው መሠረቱ ምሶሶ (ዓምድ) ነው። የክርስቲያናዊ ሕይወታችንም ማዕበልና ፈተና ሲገጥመው የማይናወጠውና ጸንቶ የሚቆመው በእግዚአብሔር ቃል ላይ ሲመሠረት ነው።"
        },
        {
            "title": "ሃይማኖት",
            "description": "ከፈጣሪያችን ጋር ያለን ጽኑ ግንኙነት፣ በመስቀል ላይ የተገለጠው የክርስቶስ ፍቅር፣ እና ተስፋችንን ሁሉ የጣልንበት የእውነት መንገድ ነው።"
        },
        {
            "title": "ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት",
            "description": "ወጣቶችና ሕፃናት በክርስቶስ ኢየሱስ አስተምህሮና በኦርቶዶክሳዊት ቤተ ክርስቲያን እምነት ላይ ጸንተው እንዲቆሙ (እንደ ዓምድ እንዲጠነክሩ) የሚያደርግ፣ እምነታቸውን በዕውቀትና በምግባር የሚያንጽ መንፈሳዊ ማዕከል ማለት ነው።"
        }
    ],
    "valuesTitle": "እሴቶቻችን",
    "valuesIntro": "እነዚህ መሠረታዊ እሴቶቻችን የቃላት ድርደራ ብቻ ሳይሆኑ፣ የዕለት ተዕለት የሕይወት መርሆዎቻችን ናቸው፦",
    "values": [
        {
            "icon": "<GavelIcon />",
            "title": "ሃይማኖት",
            "description": "እምነትን በቃል ብቻ ሳይሆን በሕይወት መኖር ነው። ቅድስት ቤተ ክርስቲያን ያስተማረችንን ንጹሕና የማንደራደርበትን ዶግማና ቀኖና ጠብቆ፣ በበጎ ምግባር ታጅቦ የሚገለጥ ጽኑ አቋማችን ነው።"
        },
        {
            "icon": "<Favorite />",
            "title": "ፍቅር",
            "description": "የክርስቲያናዊ ሕይወታችን ማገር ነው። ፍጹም በሆነ ልብ እግዚአብሔርን መውደድ እና ሰውን ሁሉ (ዘር፣ መልክ፣ ወይም ደረጃ ሳይለዩ) እንደ ራስ አድርጎ ማፍቀርን በተግባር የምናሳይበት እሴታችን ነው።"
        },
        {
            "icon": "<VolunteerActivism />",
            "title": "ርኅራኄ",
            "description": "ርኅራኄ ለእኛ ከንጹሕ የክርስቲያን ፍቅር የሚመነጭ፣ እምነትን ወደ ሕይወት የምንቀይርበት የተግባር መገለጫችን ነው። ጌታችን “ከእነዚህ ከታናናሾቹ ለአንዱ ስላደረጋችሁት ለእኔ አደረጋችሁት” (ማቴ 25፥40) ብሎ ባስተማረው መሠረት፣ በተቸገሩትና በታረዙት ወገኖቻችን ውስጥ ክርስቶስን እናያለን። በመሆኑም ስድስቱን ቃላተ ወንጌል የዕለት ተዕለት የሕይወታችን መመሪያ በማድረግ፤ የተራቡትን በማብላት፣ የታረዙትን በማልበስ፣ ያዘኑትን በማጽናናት እንዲሁም የታመሙትን በመጠየቅ የአምላካችንን ቸርነት ለዓለም የምናንጸባርቅበት ጥልቅ የመንፈስ ፍሬ ነው።"
        },
        {
            "icon": "<School />",
            "title": "ትምህርት",
            "description": "ሐሰተኛ ትምህርቶች በማይነቀንቁት ጽኑ መሠረት ላይ መቆም ነው። \"ከማን እንደተማርክ ታውቃለህና ጽና\" በሚለው የሐዋርያው ቃል መሠረት፣ መንፈሳዊውን ጥበብ ከዘመኑ ዕውቀት ጋር አዋህደን፣ ትውልድን ከስህተት የምንጠብቅበትና አእምሮን የምናበራበት ብርሃናችን ነው።"
        },
        {
            "icon": "<Handshake />",
            "title": "ትሕትና",
            "description": "የቅዱሳን አባቶቻችንንና እናቶቻችንን አርዓያነት በመከተል፣ ራስን ዝቅ አድርጎ በቅንነት የመኖር ክርስቲያናዊ መገለጫችን ነው።"
        },
        {
            "icon": "<Church />",
            "title": "አገልግሎት",
            "description": "ለቤተ ክርስቲያንና ለማኅበረሰቡ የምንሰጠው ቅን አገልጋይነት ሲሆን፤ ይህም የተሰጠንን መንፈሳዊ ሓላፊነት ከፈጸምን በኋላ \"የማንጠቅም ባሪያዎች ነን\" በማለት ያለ ትዕቢት የምናገለግልበት ዝግጁነት ነው።"
        },
        {
            "icon": "<Book />",
            "title": "ሥጋ ወደሙ",
            "description": "ዘወትር ከኃጢአት ርቆ በንስሐ በመታጠብና ቅዱስ ቁርባንን በመቀበል መንፈሳዊ ሕይወታችንን የምናድስበት የክርስቲያን ሥርዓት ነው።"
        }
    ],
    "leadershipTitle": "የሰንበት ትምህርት ቤቱ ሰብሳቢ",
    "leaderName": "ዲያቆን ኢዮብ ዘውዱ",
    "leaderRole": "የሰንበት ትምህርት ቤቱ ሰብሳቢ",
    "leaderQuote": "ነገር ግን እግዚአብሔር ያሳድግ ነበር። — 1ኛ ቆሮንቶስ 3:6",
    "ctaTitle": "የማህበረሰባችን አካል ለመሆን ዝግጁ ኖት?",
    "ctaSubtitle": "ልጅዎ በእምነትና በኅብረት ከእኛ ጋር እንዴት እንደሚያድግ ለማየት ክፍሎቻችንንና ዝግጅቶቻችንን ይጎብኙ።",
    "ctaButton": "ክፍሎቻችንን ያስሱ"
},
};

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

const SectionEyebrow = ({ children, light = false }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.2,
      mb: 2,
    }}
  >
    <Box
      sx={{
        width: 28,
        height: 1,
        bgcolor: light ? alpha(brand.gold, 0.7) : alpha(brand.goldDark, 0.75),
      }}
    />
    <EthiopicCross size={11} color={light ? brand.gold : brand.goldDark} />
    <Typography
      sx={{
        m: 0,
        fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
        fontWeight: 700,
        fontSize: '0.7rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: light ? brand.gold : brand.navy,
      }}
    >
      {children}
    </Typography>
    <Box
      sx={{
        width: 28,
        height: 1,
        bgcolor: light ? alpha(brand.gold, 0.7) : alpha(brand.goldDark, 0.75),
      }}
    />
  </Box>
);

const AboutPage = ({ language = 'en' }) => {
  const t = translations[language] || translations.en;
  const brandName = brandTitles[language] || brandTitles.en;
  const reduceMotion = useReducedMotion();
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [leaderVerse, leaderCitation] = String(t.leaderQuote || '').split(/\s+[—–-]\s+/);
  const nameMeaningItems = t.nameMeaningItems || translations.en.nameMeaningItems;
  const valuesIntro = t.valuesIntro || translations.en.valuesIntro;

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>

      <Box sx={{ bgcolor: brand.stone }}>
        <AboutHero
          subjectImage={crestLogo}
          subjectFit="contain"
          backgroundImage={historyImage}
          brandName={brandName}
          tagline={t.ourStory}
          storyTitle={t.pageSubtitle}
          placeLabel={placeLabels[language] || placeLabels.en}
          yearCaption={yearCaptions[language] || yearCaptions.en}
          foundedYear="1964"
          lineClamp={3}
          mobileLineClamp={2}
        />

        {/* History — editorial split */}
        <Box
          component="section"
          aria-labelledby="history-heading"
          sx={{ bgcolor: brand.white, py: { xs: 6, md: 9 } }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' },
                gap: { xs: 4, md: 7 },
                alignItems: 'start',
              }}
            >
              <Box
                component={motion.div}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewOpts}
                transition={{ duration: 0.6, ease: easeOut }}
                sx={{
                  position: 'relative',
                  aspectRatio: { xs: '4 / 3', md: '3 / 4' },
                  maxHeight: { md: 560 },
                  overflow: 'hidden',
                  bgcolor: brand.navyDark,
                }}
              >
                <Box
                  component="img"
                  src={historyImage}
                  alt=""
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: brand.gold,
                  }}
                />
              </Box>

              <Box
                component={motion.div}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewOpts}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.05 }}
              >
                <Typography
                  sx={{
                    m: 0,
                    mb: 1.5,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: brand.goldDark,
                  }}
                >
                  1964
                </Typography>
                <Typography
                  id="history-heading"
                  component="h2"
                  sx={{
                    m: 0,
                    mb: 3,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.85rem, 3.4vw, 2.55rem)',
                    lineHeight: 1.15,
                    color: brand.navyInk,
                  }}
                >
                  {t.historyTitle}
                </Typography>
                <Typography
                  sx={{
                    m: 0,
                    mb: 2.5,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontSize: { xs: '1.02rem', md: '1.08rem' },
                    lineHeight: 1.85,
                    color: alpha(brand.ink, 0.8),
                  }}
                >
                  {t.historyShort}
                </Typography>
                <Collapse in={isHistoryExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ mb: 2.5 }}>
                    {t.historyFull.map((paragraph, index) => (
                      <Typography
                        key={index}
                        sx={{
                          m: 0,
                          mb: 1.75,
                          fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                          fontSize: { xs: '1.02rem', md: '1.08rem' },
                          lineHeight: 1.85,
                          color: alpha(brand.ink, 0.78),
                        }}
                      >
                        {paragraph}
                      </Typography>
                    ))}
                  </Box>
                </Collapse>
                <Button
                  onClick={() => setIsHistoryExpanded((v) => !v)}
                  variant="text"
                  size="small"
                  endIcon={
                    <ExpandMoreIcon
                      sx={{
                        transform: isHistoryExpanded ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.25s ease',
                      }}
                    />
                  }
                  sx={{
                    color: brand.navy,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 0,
                    minWidth: 0,
                    '&:hover': { bgcolor: 'transparent', color: brand.navyInk },
                  }}
                >
                  {isHistoryExpanded ? t.showLess : t.learnMore}
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Vision + mission + aims — one reading surface */}
        <Box
          component="section"
          aria-labelledby="vision-heading"
          sx={{
            bgcolor: brand.stone,
            py: { xs: 7, md: 10 },
            borderTop: `1px solid ${alpha(brand.navy, 0.08)}`,
            borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
          }}
        >
          <Container maxWidth="md">
            <SectionEyebrow>{t.missionTitle}</SectionEyebrow>
            <Typography
              id="vision-heading"
              component="blockquote"
              sx={{
                m: 0,
                mb: 5,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(1.35rem, 2.8vw, 1.75rem)',
                lineHeight: 1.55,
                color: brand.navyInk,
                textAlign: 'center',
              }}
            >
              {t.missionSubtitle}
            </Typography>

            <Box
              aria-hidden
              sx={{
                width: 40,
                height: 2,
                mx: 'auto',
                mb: 5,
                bgcolor: brand.gold,
              }}
            />

            <Typography
              sx={{
                m: 0,
                mb: 4.5,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: { xs: '1.02rem', md: '1.1rem' },
                lineHeight: 1.85,
                color: alpha(brand.ink, 0.8),
                textAlign: 'center',
                maxWidth: 640,
                mx: 'auto',
              }}
            >
              {t.missionP1}
            </Typography>

            <Typography
              component="h3"
              sx={{
                m: 0,
                mb: 3,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.25rem, 2.2vw, 1.5rem)',
                color: brand.navyInk,
                textAlign: 'center',
              }}
            >
              {t.missionAim}
            </Typography>

            <Box
              component="ul"
              sx={{
                m: 0,
                p: 0,
                listStyle: 'none',
                maxWidth: 620,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.25,
              }}
            >
              {t.missionPoints.map((aim) => (
                <Box
                  component="li"
                  key={aim}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '12px 1fr',
                    columnGap: 1.75,
                    alignItems: 'start',
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 8,
                      height: 8,
                      mt: 1.1,
                      borderRadius: '50%',
                      bgcolor: brand.gold,
                    }}
                  />
                  <Typography
                    sx={{
                      m: 0,
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontSize: { xs: '0.98rem', md: '1.05rem' },
                      lineHeight: 1.8,
                      color: alpha(brand.ink, 0.8),
                    }}
                  >
                    {aim}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Name meaning */}
        <PageSection variant="white" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="md">
            <Typography
              component="h2"
              sx={{
                m: 0,
                mb: 1.5,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.85rem, 3.4vw, 2.55rem)',
                color: brand.navyInk,
                textAlign: 'center',
              }}
            >
              {t.nameMeaningTitle || translations.en.nameMeaningTitle}
            </Typography>
            <Typography
              sx={{
                m: 0,
                mb: { xs: 4, md: 5.5 },
                mx: 'auto',
                maxWidth: 560,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                color: alpha(brand.ink, 0.7),
                textAlign: 'center',
              }}
            >
              {t.nameMeaningIntro || translations.en.nameMeaningIntro}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 5 } }}>
              {nameMeaningItems.map((item, i) => (
                <Box
                  key={item.title}
                  component={motion.div}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewOpts}
                  transition={{ duration: 0.5, ease: easeOut, delay: i * 0.05 }}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'minmax(9rem, 12rem) 1fr' },
                    gap: { xs: 1.25, sm: 3 },
                    alignItems: 'start',
                    pt: i === 0 ? 0 : { xs: 3.5, sm: 4 },
                    borderTop: i === 0 ? 'none' : `1px solid ${alpha(brand.navy, 0.1)}`,
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      m: 0,
                      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                      fontWeight: 700,
                      fontSize: { xs: '1.35rem', sm: '1.45rem' },
                      lineHeight: 1.25,
                      color: brand.navy,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      m: 0,
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontSize: { xs: '0.98rem', md: '1.05rem' },
                      lineHeight: 1.85,
                      color: alpha(brand.ink, 0.78),
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </PageSection>

        {/* እሴቶቻችን — values */}
        <Box
          component="section"
          aria-label={t.valuesTitle}
          sx={{
            position: 'relative',
            bgcolor: brand.stone,
            backgroundImage: `
              radial-gradient(ellipse 70% 50% at 50% 0%, ${alpha(brand.gold, 0.08)} 0%, transparent 55%),
              linear-gradient(180deg, ${brand.white} 0%, ${brand.stone} 100%)
            `,
            ...fillViewportSx,
            py: { xs: 2.5, md: 3 },
            px: { xs: 1.5, md: 2 },
            justifyContent: 'center',
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: 0,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 2.5 }, flexShrink: 0 }}>
              <Typography
                component="h2"
                sx={{
                  m: 0,
                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.65rem', md: '2.15rem', lg: '2.35rem' },
                  lineHeight: 1.15,
                  color: brand.navyInk,
                }}
              >
                {t.valuesTitle}
              </Typography>
              <Box
                aria-hidden
                sx={{ width: 40, height: 2, mx: 'auto', my: 1.25, bgcolor: brand.gold }}
              />
              {valuesIntro && (
                <Typography
                  sx={{
                    m: 0,
                    mx: 'auto',
                    maxWidth: 520,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontSize: { xs: '0.82rem', md: '0.9rem' },
                    lineHeight: 1.55,
                    color: alpha(brand.ink, 0.65),
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {valuesIntro}
                </Typography>
              )}
            </Box>

            {/* Desktop: two rows — 4 + 3 centered */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                gap: 1.75,
                flex: 1,
                minHeight: 0,
                justifyContent: 'center',
              }}
            >
              {[t.values.slice(0, 4), t.values.slice(4)].map((row, rowIndex) => (
                <Box
                  key={rowIndex}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: row.length === 4
                      ? 'repeat(4, minmax(0, 1fr))'
                      : 'repeat(3, minmax(0, 1fr))',
                    gap: { md: 1.5, lg: 1.75 },
                    flex: 1,
                    minHeight: 0,
                    maxWidth: row.length === 3 ? '78%' : '100%',
                    mx: row.length === 3 ? 'auto' : 0,
                    width: '100%',
                  }}
                >
                  {row.map((value, j) => {
                    const i = rowIndex === 0 ? j : j + 4;
                    return (
                      <Box
                        key={value.title}
                        component={motion.article}
                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewOpts}
                        transition={{ duration: 0.4, ease: easeOut, delay: Math.min(i * 0.04, 0.2) }}
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: 0,
                          height: '100%',
                          px: { md: 2, lg: 2.25 },
                          py: { md: 2, lg: 2.25 },
                          bgcolor: brand.white,
                          border: `1px solid ${alpha(brand.navy, 0.08)}`,
                          borderRadius: 1.5,
                          borderTop: `3px solid ${brand.gold}`,
                          boxShadow: `0 8px 24px ${alpha(brand.navyInk, 0.05)}`,
                          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: `0 14px 32px ${alpha(brand.navyInk, 0.1)}`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1.15,
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            sx={{
                              color: brand.navy,
                              display: 'flex',
                              '& .MuiSvgIcon-root': { fontSize: 20 },
                            }}
                          >
                            {value.icon}
                          </Box>
                          <Typography
                            component="h3"
                            sx={{
                              m: 0,
                              fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                              fontWeight: 700,
                              fontSize: { md: '1.12rem', lg: '1.22rem' },
                              lineHeight: 1.2,
                              color: brand.navyInk,
                            }}
                          >
                            {value.title}
                          </Typography>
                        </Box>
                        <Typography
                          title={value.description}
                          sx={{
                            m: 0,
                            flex: 1,
                            minHeight: 0,
                            fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                            fontSize: { md: '0.78rem', lg: '0.84rem' },
                            lineHeight: 1.55,
                            color: alpha(brand.ink, 0.72),
                            overflow: 'auto',
                          }}
                        >
                          {value.description}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>

            {/* Mobile / tablet: scrollable card stack inside one screen */}
            <Box
              sx={{
                display: { xs: 'grid', md: 'none' },
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.25,
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                pb: 1,
              }}
            >
              {t.values.map((value, i) => (
                <Box
                  key={value.title}
                  component={motion.article}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewOpts}
                  transition={{ duration: 0.4, ease: easeOut, delay: Math.min(i * 0.04, 0.2) }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    px: 1.75,
                    py: 1.75,
                    bgcolor: brand.white,
                    border: `1px solid ${alpha(brand.navy, 0.08)}`,
                    borderRadius: 1.5,
                    borderTop: `3px solid ${brand.gold}`,
                    boxShadow: `0 8px 24px ${alpha(brand.navyInk, 0.05)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        color: brand.navy,
                        display: 'flex',
                        '& .MuiSvgIcon-root': { fontSize: 18 },
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography
                      component="h3"
                      sx={{
                        m: 0,
                        fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                        color: brand.navyInk,
                      }}
                    >
                      {value.title}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      m: 0,
                      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                      fontSize: '0.8rem',
                      lineHeight: 1.55,
                      color: alpha(brand.ink, 0.72),
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {value.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Leadership — quiet centered portrait */}
        <Box
          component="section"
          aria-labelledby="chairman-heading"
          sx={{
            bgcolor: brand.white,
            py: { xs: 7, md: 10 },
            borderTop: `1px solid ${alpha(brand.navy, 0.08)}`,
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                m: 0,
                mb: 3.5,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: brand.navy,
              }}
            >
              {t.leadershipTitle}
            </Typography>

            <Box
              component={motion.div}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewOpts}
              transition={{ duration: 0.65, ease: easeOut }}
              sx={{
                width: { xs: 200, sm: 240 },
                mx: 'auto',
                mb: 3.5,
                aspectRatio: '3 / 4',
                overflow: 'hidden',
                bgcolor: brand.navyDark,
                outline: `1px solid ${alpha(brand.gold, 0.55)}`,
                outlineOffset: 8,
              }}
            >
              <Box
                component="img"
                src={priestImage}
                alt={t.leaderName}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  display: 'block',
                }}
              />
            </Box>

            <Typography
              id="chairman-heading"
              component="h2"
              sx={{
                m: 0,
                mb: 2,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                lineHeight: 1.15,
                color: brand.navyInk,
              }}
            >
              {t.leaderName}
            </Typography>

            <Box
              aria-hidden
              sx={{ width: 40, height: 2, mx: 'auto', mb: 3, bgcolor: brand.gold }}
            />

            <Box component="blockquote" sx={{ m: 0, maxWidth: 420, mx: 'auto' }}>
              <Typography
                sx={{
                  m: 0,
                  mb: leaderCitation ? 1.5 : 0,
                  fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: { xs: '1.15rem', md: '1.3rem' },
                  lineHeight: 1.55,
                  color: alpha(brand.navyInk, 0.88),
                }}
              >
                “{leaderVerse}”
              </Typography>
              {leaderCitation && (
                <Typography
                  component="cite"
                  sx={{
                    m: 0,
                    display: 'block',
                    fontStyle: 'normal',
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: brand.goldDark,
                  }}
                >
                  {leaderCitation}
                </Typography>
              )}
            </Box>
          </Container>
        </Box>

        <PageSection variant="ink" pattern sx={{ textAlign: 'center', py: { xs: 8, md: 10 } }}>
          <Container maxWidth="sm">
            <Box
              component="img"
              src={crestLogo}
              alt=""
              sx={{
                width: 64,
                height: 64,
                objectFit: 'contain',
                bgcolor: '#fff',
                borderRadius: '50%',
                border: `2px solid ${brand.gold}`,
                p: 0.75,
                mb: 2.5,
                mx: 'auto',
                display: 'block',
              }}
            />
            <Typography
              component="h2"
              sx={{
                m: 0,
                mb: 1.5,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.65rem, 3.2vw, 2.35rem)',
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
                mb: 3,
                fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                fontSize: '0.98rem',
                lineHeight: 1.65,
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
