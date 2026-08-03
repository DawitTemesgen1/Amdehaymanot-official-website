import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Button,
} from '@mui/material';
import { alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  CameraAltOutlined,
  VideocamOutlined,
  ShareOutlined,
  DevicesOutlined,
  OpenInNew,
  ArrowForward,
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
  om: 'Amdehaayimaanot',
  ti: 'ዓምደሃይማኖት',
  ge: 'ዓምደ ሃይማኖት',
  es: 'Amde Haymanot',
  fr: 'Amde Haymanot',
  ar: 'عمود الإيمان',
};

const placeLabels = {
  en: 'Jimma · Debre Ephrata St. Mary',
  am: 'ጅማ · ደብረ ኤፍራታ ቅድስት ማርያም',
  om: 'Jimmaa · Dabra Efraataa',
  ti: 'ጅማ · ደብረ ኤፍራታ ቅድስት ማርያም',
  ge: 'ጅማ · ደብረ ኤፍራታ ቅድስት ማርያም',
  es: 'Jimma · Debre Ephrata Santa María',
  fr: 'Jimma · Debre Ephrata Sainte-Marie',
  ar: 'جيما · دير إفراتا السيدة مريم',
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
    pageTitle: 'Media and Tech | Amde Haymanot',
    pageDescription:
      'Digital ministry, visual archiving, and Orthodox technology from Amde Haymanot Sunday School in Jimma.',
    heroTitle: 'Media and Technology Ministry',
    heroSubtitle: 'Connecting our community and sharing our faith through media and technology.',
    leadLabel: 'Our Ministry',
    leadText:
      'We serve Amde Haymanot Sunday School by giving our ancient faith a modern voice. From capturing the beauty of your family\'s sacred milestones to building digital platforms that enrich our community, our goal is to document the life of our church and connect the next generation to the Word of God.',
    servicesLabel: 'Our Digital Ministry',
    featuredLabel: 'Featured Project',
    moreLabel: 'Upcoming Endeavors',
    openApp: 'Get on Google Play',
    soon: 'God Willing',
    ctaTitle: 'Partner With Us',
    ctaText: 'Whether you need a photographer for an upcoming event or want to collaborate on a new project for the Sunday School, we would love to hear from you.',
    ctaButton: 'Reach out to us',
    services: [
      {
        key: 'imaging',
        title: 'Photography',
        text: 'Professional photography for all your Christian sacred moments, including child baptisms, weddings, shimigilina, birthdays, graduations, and other special events.',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'Videography',
        text: 'High-quality videography and editing packages to beautifully preserve your baptisms, weddings, shimigilina, and all memorable events for a lifetime.',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'Social Media',
        text: 'Sharing spiritual lessons, hymns, and updates across all our Sunday School channels to keep our community connected.',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'Technology',
        text: 'Building apps and digital tools that help our community learn, pray, and grow in the Orthodox faith.',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'Amde Haymanot Zmare',
      text: 'A comprehensive collection of Ethiopian Orthodox Tewahedo hymns for every season, fast, and feast — designed for offline practice and spiritual growth.',
      tag: 'Mobile App',
    },
    moreProjects: [
      { title: 'Spiritual Archive', text: 'Preserving the visual history and sacred moments of our ministry.' },
      { title: 'Orthodox Learning Portal', text: 'Structured theological and spiritual lessons tailored for the youth.' },
    ],
  },
  am: {
    pageTitle: 'ሚዲያ እና ቴክ | ዓምደ ሃይማኖት',
    pageDescription: 'ከጅማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት የዲጂታል አገልግሎት፣ ምስልና የኦርቶዶክሳዊ ቴክኖሎጂ።',
    heroTitle: 'ሚዲያ እና ቴክኖሎጂ አገልግሎት',
    heroSubtitle: 'በሚዲያ እና በቴክኖሎጂ ማኅበረሰባችንን ማገናኘት እና ሃይማኖታችንን ማካፈል።',
    leadLabel: 'የአገልግሎት ጥሪያችን',
    leadText:
      'ጥንታዊውን ሃይማኖታችንን ከዘመኑ ቴክኖሎጂ ጋር በማዋሃድ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤትን እናገለግላለን። የቤተሰቦትን ልዩ መንፈሳዊ በዓላት በፎቶግራፍ ከማስቀረት ጀምሮ የማኅበረሰባችንን መንፈሳዊ ሕይወት የሚያሳድጉ ዲጂታል መድረኮችን እስከ መገንባት ድረስ፤ ዓላማችን የቤተ ክርስቲያናችንን ታሪክ መሰነድ እና ትውልዱን ከእግዚአብሔር ቃል ጋር ማገናኘት ነው።',
    servicesLabel: 'የዲጂታል አገልግሎታችን',
    featuredLabel: 'የተለየ ፕሮጀክት',
    moreLabel: 'በእግዚአብሔር ፈቃድ የሚመጡ',
    openApp: 'በጉግል ፕሌይ ያግኙ',
    soon: 'በቅርቡ',
    ctaTitle: 'ከእኛ ጋር ይስሩ',
    ctaText: 'ለቀጣይ መንፈሳዊ ዝግጅትዎ ፎቶግራፈር ቢፈልጉ፣ ወይም ከሰንበት ትምህርት ቤቱ ጋር በአዲስ ፕሮጀክት ላይ አብረው መሥራት ቢፈልጉ፣ እኛን ቢያነጋግሩን ደስ ይለናል።',
    ctaButton: 'ያግኙን',
    services: [
      {
        key: 'imaging',
        title: 'የፎቶግራፍ አገልግሎት',
        text: 'የሕፃናት ጥምቀት፣ ጋብቻ፣ ሽምግልና፣ ልደት፣ ምረቃ እና ሁሉንም ልዩ ክርስቲያናዊ ዝግጅቶች በሚያምር ሁኔታ ለማስቀረት ሙያዊ የፎቶግራፍ አገልግሎት።',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'የቪዲዮ ቀረጻ',
        text: 'የጥምቀት፣ የጋብቻ፣ የሽምግልና እና የሁሉንም ልዩ ዝግጅቶችዎ ትዝታዎች ለዕድሜ ልክ ጠብቀው ለማቆየት ከፍተኛ ጥራት ያላቸው የቪዲዮ ቀረጻ እና አርትዖት ፓኬጆች።',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'ማህበራዊ ሚዲያ',
        text: 'ማኅበረሰባችንን እርስ በርስ ለማገናኘት መንፈሳዊ ትምህርቶችን፣ መዝሙራትን እና አዳዲስ መረጃዎችን በሁሉም የሰንበት ትምህርት ቤታችን ገጾች ላይ ማጋራት።',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'ቴክኖሎጂ',
        text: 'ማኅበረሰባችን በኦርቶዶክስ እምነት እንዲጸና፣ እንዲማር እና እንዲጸልይ የሚረዱ መተግበሪያዎችን እና ዲጂታል መሣሪያዎችን መገንባት።',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'ዓምደሃይማኖት ዝማሬ',
      text: 'ለየወቅቱ፣ ለጾማት እና ለበዓላት የተዘጋጁ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መዝሙራት ስብስብ — ከመስመር ውጭ፣ ለልምምድ እና ለመንፈሳዊ ዕድገት የተዘጋጀ።',
      tag: 'የሞባይል መተግበሪያ',
    },
    moreProjects: [
      { title: 'መንፈሳዊ ማህደር', text: 'የአገልግሎታችንን ታሪክ እና ቅዱሳን ጊዜያት ጠብቆ ማቆየት።' },
      { title: 'የኦርቶዶክስ ትምህርት መግቢያ', text: 'ለወጣቶች የተዘጋጁ ሥርዓታዊ የነገረ መለኮት እና መንፈሳዊ ትምህርቶች።' },
    ],
  },
  om: {
    pageTitle: 'Miidiyaa fi Teeknooloojii | Amdehaayimaanot',
    pageDescription: 'Tajaajila dijiitaalaa, kuusaa viidiyoo fi fakkii, akkasumas teeknooloojii Ortodooksii Mana Barumsaa Sanbataa Amdehaayimaanot Jimmaa irraa.',
    heroTitle: 'Tajaajila Miidiyaa fi Teeknooloojii',
    heroSubtitle: 'Amantii Ortodooksii seenaa suuraadhaan fi kalaqa dijiitaalaatiin lallabuu.',
    leadLabel: 'Tajaajila Keenya',
    leadText: 'Amantii keenya duriif sagalee ammayyaa kennuudhaan Mana Barumsaa Sanbataa Amdehaayimaanot ni tajaajilla. Miidhagina yeroo qulqulluu maatii keessanii kaasuu irraa eegalee hanga waltajjiiwwan dijiitaalaa hawaasa keenya gabbisan ijaaruutti, galmi keenya jireenya mana kiristaanaa keenyaa galmeessuu fi dhaloota dhufu Dubbii Waaqayyoo waliin wal quunnamsiisuudha.',
    servicesLabel: 'Tajaajila Dijiitaalaa Keenya',
    featuredLabel: 'Pirojektii Addaa',
    moreLabel: 'Hojiiwwan Fuulduraa',
    openApp: 'Google Play irraa argadhu',
    soon: 'Eeyyama Waaqayyootiin',
    ctaTitle: 'Nu Waliin Hojjedhu',
    ctaText: 'Sagantaa dhiheenyatti dhufuuf ogeessa suuraa yoo barbaaddan, ykn pirojektii haaraa Mana Barumsaa Sanbataatiif nu waliin hojjechuu yoo barbaaddan, isin irraa dhaga\'uun nu gammachiisa.',
    ctaButton: 'Nu quunnamaa',
    services: [
      {
        key: 'imaging',
        title: 'Suuraa',
        text: 'Yeroo qulqulluu Kiristiyaanummaa keessan hundumaaf, cuuphaa daa\'immanii, gaa\'ela, shimigilinaa (jaarsummaa), guyyaa dhalootaa, eebbaa fi sagantaawwan addaa biroo dabalatee ogeessummaan suuraa kaasuu.',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'Viidiyoo',
        text: 'Cuuphaa, gaa\'ela, shimigilinaa fi sagantaawwan addaa keessan hunda umrii guutuu akka gaariitti eeguuf viidiyoo qulqullina olaanaa qabuu fi paakeejii gulaaluu (editing).',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'Miidiyaa Hawaasaa',
        text: 'Hawaasni keenya walitti hidhamee akka turuuf barumsa hafuuraa, faarfannaa fi odeeffannoo haaraa chaanaaliiwwan Mana Barumsaa Sanbataa keenya hunda irratti qooduu.',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'Teeknooloojii',
        text: 'Hawaasni keenya amantii Ortodooksii keessatti akka baratu, kadhatuu fi guddatu gargaaruuf appilikeeshinii fi meeshaalee dijiitaalaa ijaaruu.',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'Amdehaayimaanot Zimaaree',
      text: 'Kuusaa faarfannaa Ortodooksii Tawaahidoo Itoophiyaa waqtiilee, sooma fi ayyaana hundaaf — toora intarneetii malee shaakaluu fi guddina hafuuraatiif kan qophaa\'e.',
      tag: 'Appilikeeshinii Moobaayilaa',
    },
    moreProjects: [
      { title: 'Kuusaa Hafuuraa', text: 'Seenaa suuraa fi yeroo qulqulluu tajaajila keenyaa eeguu.' },
      { title: 'Kellaa Barumsa Ortodooksii', text: 'Barumsa xiin-waaqayyummaa fi hafuuraa dargaggootaaf qophaa\'e.' },
    ],
  },
  ti: {
    pageTitle: 'ሚድያን ቴክኖሎጂን | ዓምደሃይማኖት',
    pageDescription: 'ካብ ጅማ ዓምደሃይማኖት ሰንበት ትምህርቲ ቤት ዝቐረበ ዲጂታላዊ ኣገልግሎት፡ ስእላዊ ማሕደርን ኦርቶዶክሳዊ ቴክኖሎጂን።',
    heroTitle: 'ኣገልግሎት ሚድያን ቴክኖሎጂን',
    heroSubtitle: 'እምነት ኦርቶዶክስ ተዋሕዶ ብዲጂታላዊ ምህዞን ስእላዊ ኣዘናትዋን ምእዋጅ።',
    leadLabel: 'ኣገልግሎትና',
    leadText: 'ንጥንታዊ እምነትና ዘመናዊ ድምጺ ብምሃብ ንዓምደሃይማኖት ሰንበት ትምህርቲ ቤት ነገልግል። ውባበ ቅዱስ ግዜያት ስድራቤትኩም ብስእሊ ካብ ምስናድ ጀሚርና፡ ንማሕበረሰብና ዘህብትም ዲጂታላዊ መድረኻት ክሳብ ምህናጽ፤ ዕላማና ታሪኽ ቤተ ክርስቲያንና ምዕቃብን ንዝመጽእ ወለዶ ምስ ቃል ኣምላኽ ምትእስሳርን እዩ።',
    servicesLabel: 'ዲጂታላዊ ኣገልግሎትና',
    featuredLabel: 'ፍሉይ ፕሮጀክት',
    moreLabel: 'ብፍቓድ ኣምላኽ ዝመጹ',
    openApp: 'ኣብ ጉግል ፕለይ ርኸቡ',
    soon: 'ኣብ ቀረባ እዋን',
    ctaTitle: 'ምሳና ስርሑ',
    ctaText: 'ንዝመጽእ መንፈሳዊ መደብኩም ሰኣላይ እንተደሊኹም ወይ ድማ ምስ ሰንበት ትምህርቲ ቤት ኣብ ሓዱሽ ፕሮጀክት ብሓባር ክትሰርሑ እንተደሊኹም፡ ክንሰምዓኩም ደስ ይብለና።',
    ctaButton: 'ርኸቡና',
    services: [
      {
        key: 'imaging',
        title: 'ኣገልግሎት ስእሊ',
        text: 'ጥምቀት ህጻናት፡ መርዓ፡ ሽምግልና፡ ልደት፡ ምረቓን ካልኦት ኩሎም ፍሉያት ክርስትያናዊ መደባትን ብጽቡቕ ኩነታት ንምስናድ ሞያዊ ኣገልግሎት ስእሊ።',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'ኣገልግሎት ቪድዮ',
        text: 'ጥምቀት፡ መርዓ፡ ሽምግልናን ኩሎም ፍሉያት መደባትኩምን ንምሉእ ዕድመ ብጽቡቕ ንምዕቃብ ዝሕግዝ ልዑል ጽሬት ዘለዎ ቀረጻ ቪድዮን ፓኬጅ ኣርትዖትን።',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'ማሕበራዊ ሚድያ',
        text: 'ማሕበረሰብና ንምርኻብ፡ መንፈሳዊ ትምህርትታት፡ መዛሙርን ሓደስቲ ሓበሬታታትን ኣብ ኩሎም ናይ ሰንበት ትምህርቲ ቤትና መድረኻት ምዝርጋሕ።',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'ቴክኖሎጂ',
        text: 'ማሕበረሰብና ብእምነት ኦርቶዶክስ ክማሃር፡ ክጽልን ክዓብን ዝሕግዙ መተግበሪታትን ዲጂታላዊ መሳርሒታትን ምህናጽ።',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'ዓምደሃይማኖት ዝማሬ',
      text: 'ንኩሉ እዋናት፡ ኣጽዋማትን በዓላትን ዝተዳለወ እኩብ መዛሙር ኦርቶዶክስ ተዋሕዶ — ብዘይ ኢንተርነት ንልምምድን ንመንፈሳዊ ዕብየትን ዝተዳለወ።',
      tag: 'ናይ ሞባይል መተግበሪ',
    },
    moreProjects: [
      { title: 'መንፈሳዊ ማሕደር', text: 'ታሪኽ ኣገልግሎትናን ቅዱስ ግዜያትን ብስእሊ ምዕቃብ።' },
      { title: 'መእተዊ ትምህርቲ ኦርቶዶክስ', text: 'ንመንእሰያት ዝተዳለወ ስሩዕ ስነ-መለኮታውን መንፈሳውን ትምህርትታት።' },
    ],
  },
  ge: {
    pageTitle: 'ሚዲያ ወቴክኖሎጂ | ዓምደ ሃይማኖት',
    pageDescription: 'ዲጂታላዊ ኣገልግሎት፣ ስእላዊ ማሕደር ወኦርቶዶክሳዊ ቴክኖሎጂ እምዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ዘጅማ።',
    heroTitle: 'ኣገልግሎተ ሚዲያ ወቴክኖሎጂ',
    heroSubtitle: 'ስብከተ ሃይማኖተ ኦርቶዶክስ ተዋሕዶ በዲጂታላዊ ጥበብ ወበስእላዊ ዜና።',
    leadLabel: 'ኣገልግሎትነ',
    leadText: 'ሃይማኖተነ ጥንታዊተ በቴክኖሎጂ ዘመን ኣሰንየነ ለዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ንትለኣክ። እምኣጽንዖ ክብረ በዓላቲሆሙ ለቤተሰብ በስእል፣ እስከ ሕንጸተ ዲጂታላዊ መድረክ ዘያዐብዮ ለሕይወተ ማኅበረሰብነ መንፈሳዊ፤ ዓላማነ ጽሒፈ ታሪካ ለቤተ ክርስቲያን ወኣዛምዶ ትውልድ ምስለ ቃለ እግዚአብሔር ውእቱ።',
    servicesLabel: 'ኣገልግሎትነ ዘዲጂታል',
    featuredLabel: 'ፍሉይ ፕሮጀክት',
    moreLabel: 'ዘይመጽእ በፈቃደ እግዚአብሔር',
    openApp: 'ረከበ በጉግል ፕሌይ',
    soon: 'በቅሩብ መዋዕል',
    ctaTitle: 'ግበሩ ምስሌነ',
    ctaText: 'ለዘይመጽእ መንፈሳዊ በዓልክሙ ሰኣሊ እመ ትፈቅዱ፣ ኣው እመ ትፈቅዱ ትግበሩ ሐዳሰ ፕሮጀክተ ምስለ ሰንበት ትምህርት ቤትነ፣ ንትፈሣሕ እመ ትረክቡነ።',
    ctaButton: 'ርከቡነ',
    services: [
      {
        key: 'imaging',
        title: 'ኣገልግሎተ ስእል',
        text: 'ጥምቀተ ሕፃናት፣ ከብካብ፣ ሽምግልና፣ ልደት፣ ምረቃ ወኵሎሙ ፍሉያት በዓላተ ክርስትናከሙ በልዑል ጥበብ ዘያጸንዕ ኣገልግሎተ ስእል።',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'ቀረጻ ቪድዮ',
        text: 'ትዝታ ጥምቀት፣ ከብካብ፣ ሽምግልና ወኵሎሙ በዓላትክሙ ለዘለዓለም ዘያጸንዕ ልዑል ዕሴት ዘቦቱ ቀረጻ ቪድዮ ወፓኬጅ ዘኣርትዖት።',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'ማኅበራዊ ሚዲያ',
        text: 'ማኅበረሰብነ ትረክብ ዘንድ፣ መንፈሳዊ ትምህርታተ፣ መዝሙራተ ወሐዲሳነ ዜናሃተ በኵሎሙ ዘሰንበት ትምህርት ቤትነ ገጻት ዘያካፍል።',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'ቴክኖሎጂ',
        text: 'ማኅበረሰብነ በሃይማኖተ ኦርቶዶክስ ይጸናዕ፣ ይማሃር ወይጸሊ ዘንድ ዘይረድእ መተግበሪያ ወዲጂታላዊ መሣሪያ ዘየሐንጽ።',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'ዓምደ ሃይማኖት ዝማሬ',
      text: 'ለኵሉ መዋዕል፣ ኣጽዋማት ወበዓላት ዘተዳለወ ዘኦርቶዶክስ ተዋሕዶ መዝሙራት — ዘእንበለ ኢንተርነት፣ ለልምምድ ወለመንፈሳዊ ዕብየት ዘተዳለወ።',
      tag: 'ዘሞባይል መተግበሪያ',
    },
    moreProjects: [
      { title: 'መንፈሳዊ ማኅደር', text: 'ታሪከ ኣገልግሎትነ ወቅዱሳነ መዋዕለ በስእል ያጸንዕ።' },
      { title: 'መእተዊ ትምህርተ ኦርቶዶክስ', text: 'ለውርዙዋን ዘተዳለወ ሥርዓታዊ ስነ-መለኮት ወመንፈሳዊ ትምህርት።' },
    ],
  },
  es: {
    pageTitle: 'Medios y Tecnología | Amde Haymanot',
    pageDescription: 'Ministerio digital, archivo visual y tecnología ortodoxa de la Escuela Dominical Amde Haymanot en Jimma.',
    heroTitle: 'Ministerio de Medios y Tecnología',
    heroSubtitle: 'Proclamando la fe ortodoxa a través de la narración visual y la innovación digital.',
    leadLabel: 'Nuestro Ministerio',
    leadText: 'Servimos a la Escuela Dominical Amde Haymanot dando una voz moderna a nuestra antigua fe. Desde capturar la belleza de los hitos sagrados de su familia hasta construir plataformas digitales que enriquecen a nuestra comunidad, nuestro objetivo es documentar la vida de nuestra iglesia y conectar a la próxima generación con la Palabra de Dios.',
    servicesLabel: 'Nuestro Ministerio Digital',
    featuredLabel: 'Proyecto Destacado',
    moreLabel: 'Próximos Esfuerzos',
    openApp: 'Consíguelo en Google Play',
    soon: 'Si Dios quiere',
    ctaTitle: 'Asóciate con nosotros',
    ctaText: 'Ya sea que necesite un fotógrafo para un próximo evento o desee colaborar en un nuevo proyecto para la Escuela Dominical, nos encantaría saber de usted.',
    ctaButton: 'Contáctanos',
    services: [
      {
        key: 'imaging',
        title: 'Fotografía',
        text: 'Fotografía profesional para todos sus momentos sagrados cristianos, incluidos bautismos infantiles, bodas, shimigilina, cumpleaños, graduaciones y otros eventos especiales.',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'Videografía',
        text: 'Paquetes de videografía y edición de alta calidad para preservar bellamente sus bautismos, bodas, shimigilina y todos los eventos memorables para toda la vida.',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'Redes Sociales',
        text: 'Compartiendo lecciones espirituales, himnos y actualizaciones en todos los canales de nuestra Escuela Dominical para mantener a nuestra comunidad conectada.',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'Tecnología',
        text: 'Creación de aplicaciones y herramientas digitales que ayudan a nuestra comunidad a aprender, orar y crecer en la fe ortodoxa.',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'Amde Haymanot Zmare',
      text: 'Una colección completa de himnos ortodoxos etíopes Tewahedo para cada temporada, ayuno y fiesta, diseñada para la práctica fuera de línea y el crecimiento espiritual.',
      tag: 'Aplicación Móvil',
    },
    moreProjects: [
      { title: 'Archivo Espiritual', text: 'Preservando la historia visual y los momentos sagrados de nuestro ministerio.' },
      { title: 'Portal de Aprendizaje Ortodoxo', text: 'Lecciones teológicas y espirituales estructuradas adaptadas para los jóvenes.' },
    ],
  },
  fr: {
    pageTitle: 'Médias et Technologie | Amde Haymanot',
    pageDescription: 'Ministère numérique, archivage visuel et technologie orthodoxe de l\'école du dimanche Amde Haymanot à Jimma.',
    heroTitle: 'Ministère des Médias et de la Technologie',
    heroSubtitle: 'Proclamer la foi orthodoxe à travers la narration visuelle et l\'innovation numérique.',
    leadLabel: 'Notre Ministère',
    leadText: 'Nous servons l\'école du dimanche Amde Haymanot en donnant à notre foi ancienne une voix moderne. Qu\'il s\'agisse de capturer la beauté des étapes sacrées de votre famille ou de créer des plateformes numériques qui enrichissent notre communauté, notre objectif est de documenter la vie de notre église et de connecter la prochaine génération à la Parole de Dieu.',
    servicesLabel: 'Notre Ministère Numérique',
    featuredLabel: 'Projet en Vedette',
    moreLabel: 'Projets à Venir',
    openApp: 'Disponible sur Google Play',
    soon: 'Si Dieu le veut',
    ctaTitle: 'Devenez Partenaire',
    ctaText: 'Que vous ayez besoin d\'un photographe pour un événement à venir ou que vous souhaitiez collaborer sur un nouveau projet pour l\'école du dimanche, nous serions ravis de vous entendre.',
    ctaButton: 'Contactez-nous',
    services: [
      {
        key: 'imaging',
        title: 'Photographie',
        text: 'Photographie professionnelle pour tous vos moments sacrés chrétiens, y compris les baptêmes d\'enfants, les mariages, la shimigilina, les anniversaires, les remises de diplômes et autres événements spéciaux.',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'Vidéographie',
        text: 'Vidéographie et forfaits de montage de haute qualité pour préserver magnifiquement vos baptêmes, mariages, shimigilina et tous les événements mémorables pour la vie.',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'Réseaux Sociaux',
        text: 'Partage de leçons spirituelles, d\'hymnes et de mises à jour sur tous les canaux de notre école du dimanche pour garder notre communauté connectée.',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'Technologie',
        text: 'Création d\'applications et d\'outils numériques qui aident notre communauté à apprendre, à prier et à grandir dans la foi orthodoxe.',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'Amde Haymanot Zmare',
      text: 'Une collection complète d\'hymnes orthodoxes éthiopiens Tewahedo pour chaque saison, jeûne et fête — conçue pour la pratique hors ligne et la croissance spirituelle.',
      tag: 'Application Mobile',
    },
    moreProjects: [
      { title: 'Archives Spirituelles', text: 'Préserver l\'histoire visuelle et les moments sacrés de notre ministère.' },
      { title: 'Portail d\'Apprentissage Orthodoxe', text: 'Leçons théologiques et spirituelles structurées adaptées aux jeunes.' },
    ],
  },
  ar: {
    pageTitle: 'الإعلام والتكنولوجيا | عمود الإيمان',
    pageDescription: 'الخدمة الرقمية، الأرشفة المرئية، والتكنولوجيا الأرثوذكسية من مدرسة عمود الإيمان بجيما.',
    heroTitle: 'خدمة الإعلام والتكنولوجيا',
    heroSubtitle: 'إعلان الإيمان الأرثوذكسي من خلال السرد القصصي المرئي والابتكار الرقمي.',
    leadLabel: 'خدمتنا',
    leadText: 'نحن نخدم مدرسة الأحد "عمود الإيمان" من خلال إعطاء إيماننا القديم صوتاً حديثاً. بدءاً من التقاط جمال اللحظات المقدسة لعائلتك وصولاً إلى بناء منصات رقمية تثري مجتمعنا، فإن هدفنا هو توثيق حياة كنيستنا وربط الجيل القادم بكلمة الله.',
    servicesLabel: 'خدمتنا الرقمية',
    featuredLabel: 'مشروع مميز',
    moreLabel: 'المشاريع القادمة',
    openApp: 'احصل عليه من جوجل بلاي',
    soon: 'إن شاء الله',
    ctaTitle: 'شارك معنا',
    ctaText: 'سواء كنت بحاجة إلى مصور لحدث قادم أو ترغب في التعاون في مشروع جديد لمدرسة الأحد، يسعدنا أن نسمع منك.',
    ctaButton: 'تواصل معنا',
    services: [
      {
        key: 'imaging',
        title: 'التصوير الفوتوغرافي',
        text: 'تصوير احترافي لجميع لحظاتك المسيحية المقدسة، بما في ذلك معمودية الأطفال، حفلات الزفاف، الشمجلنا، أعياد الميلاد، حفلات التخرج، وغيرها من المناسبات الخاصة.',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'تصوير الفيديو',
        text: 'حزم تصوير فيديو ومونتاج عالية الجودة للحفاظ بشكل جميل على معمودياتك وحفلات زفافك والشمجلنا وجميع الأحداث التي لا تُنسى مدى الحياة.',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'وسائل التواصل الاجتماعي',
        text: 'مشاركة الدروس الروحية والترانيم والتحديثات عبر جميع قنوات مدرسة الأحد للحفاظ على تواصل مجتمعنا.',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'التكنولوجيا',
        text: 'بناء التطبيقات والأدوات الرقمية التي تساعد مجتمعنا على التعلم والصلاة والنمو في الإيمان الأرثوذكسي.',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'ترانيم عمود الإيمان',
      text: 'مجموعة شاملة من الترانيم الإثيوبية الأرثوذكسية التوحيدية لكل موسم وصوم وعيد — مصممة للممارسة دون اتصال بالإنترنت والنمو الروحي.',
      tag: 'تطبيق هاتف',
    },
    moreProjects: [
      { title: 'الأرشيف الروحي', text: 'الحفاظ على التاريخ المرئي واللحظات المقدسة لخدمتنا.' },
      { title: 'بوابة التعليم الأرثوذكسي', text: 'دروس لاهوتية وروحية منظمة ومصممة للشباب.' },
    ],
  },
};

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
      <Helmet>
        <html lang={language} />
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>

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
