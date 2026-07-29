import React, { useState, useEffect } from 'react';
import { format, parseISO, isFuture } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Grid, CardContent,
  Stack, Avatar, List, ListItem, ListItemIcon, ListItemText,
  CardMedia, CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/system';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

import api, { API_ROOT_URL } from '../api/axiosConfig';
import {
  PageHero, PageSection, SectionHeader, OrthCard, StatBlock, GoldDivider,
} from '../components/ui';
import { brand } from '../brand';

import heroImage from '../assets/hero-image.jpg';
import childrenSinging from '../assets/img 6970.jpg';
import bibleStudy from '../assets/classes-hero.jpg';
import community from '../assets/community.jpg';
import teacherWithKids from '../assets/teacher-with-kids.jpg';
import mediaServicesImage from '../assets/media service.jpg';

import {
  Book, Groups, MusicNote, CameraRoll, Church, Celebration, Favorite, Star, GetApp as GetAppIcon,
  Event as EventIcon, Newspaper as NewsIcon,
} from '@mui/icons-material';

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
  en: { "pageTitle": "Amde Haymanot Sunday School | Spiritual Education in Jimma", "pageDescription": "The official website for Amde Haymanot Sunday School in Jimma. We offer Orthodox teachings, hymnody lessons, and spiritual guidance for youth and children. Find our latest news and events.", "heroChip": "Acts 6:4", "headline": "But we will give ourselves continually to prayer and to the ministry of the word.", "subheadline": "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age. Matthew 28:19", "enrollNow": "Enroll Now", "learnMore": "Click to learn more", "corePillars": "Our Spiritual Services", "pillarsSub": "Services offered in our Sunday School", "faithFormation": "Orthodox Teachings", "faithDesc": "Bible study, sacraments and church rites, teachings on Christian ethics.", "christianCommunity": "Hymnody Lessons", "communityDesc": "Study of Orthodox and Yaredic chants and hymns. Singing to God with grace in your hearts in psalms and hymns and spiritual songs. Colossians 3:16", "religiousEducation": "Social Values", "educationDesc": "And now abide faith, hope, love, these three. 1 Corinthians 13:13", "whyChooseUs": "What will you find if you come to us?", "whyChooseSub": "A Foundation of Faith, Community, and Joy", "ourCommitment": "With the help of God the Holy Spirit", "commitmentText": "We strive to raise youth and children to grow in faith, develop strong moral values, and become faithful, active, discerning, and influential Christians.", "yearsService": "Years of Service", "activeStudents": "Active Students", "dedicatedTeachers": "Dedicated Teachers", "buildingFaith": "Building a Living Generation", "historyText": "Since 1964, the Amdehayimanot Sunday School has been a beacon of spiritual growth. What started as a small gathering has grown into a vibrant ministry serving hundreds of children, helping them build a living relationship with Christ to guide them for life.", "quote": "\"We don't just teach Bible stories - rather, we help people build a living relationship with Christ.\"", "mediaServices": "Media Services", "mediaText": "Capture your sacred moments forever. Our media team offers professional photo and video packages for all special events, preserving high-quality memories for a lifetime.", "baptisms": "Baptism and Christening", "weddings": "Mediation and Marriage", "specialOccasions": "Special Occasions", "bookConsultation": "Contact Us", "testimonialsNote": "From the mouths of the Fathers", "joinFamily": "Join Our Family", "joinText": "Come, let us serve God together", "registerToday": "Register Today", "announcementsTitle": "Latest Announcements", "announcementsSub": "Stay up to date with our latest news and upcoming events.", "latestNews": "Latest News", "upcomingEvents": "Upcoming Events", "noNews": "No recent news. Please check back later.", "noEvents": "No upcoming events scheduled. Stay tuned!", "viewAll": "View All News & Events", "promoTitle": "Get the Amdehayimanot Zimare App!", "promoSubtitle": "Access over 2400 Ethiopian Orthodox hymns in Amharic and Afaan Oromoo, right in your pocket.", "promoButton": "Go to Download Page", "testimonials": [ { "quote": "If you are concerned about the future face of the Church, place the ministry of the Sunday School in your hearts today.", "author": "Abune Gorgorios II", "role": "Archbishop" }, { "quote": "A church without youth has no future life, and a youth not in the church has no future life.", "author": "Pope Shenouda III", "role": "Patriarch of Egypt" }, { "quote": "Train up a child in the way he should go, And when he is old he will not depart from it.", "author": "Proverbs 22:6", "role": "Solomon the Wise" }, { "quote": "Till I come, give attention to reading, to exhortation, to doctrine.", "author": "1 Timothy 4:13", "role": "Saint Paul" }, { "quote": "And you shall teach them to your children, speaking of them when you sit in your house, when you walk by the way, when you lie down, and when you rise up.", "author": "Deuteronomy 6:7", "role": "Moses, Chief of the Prophets" } ] },
  am: { "pageTitle": "ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት | መንፈሳዊ ትምህርት በጂማ", "pageDescription": "የጂማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ይፋዊ ድረ-ገጽ። ለወጣቶችና ህጻናት የኦርቶዶክስ ተዋሕዶ ትምህርቶችን፣ የዝማሬ ትምህርቶችን እና መንፈሳዊ ምሪትን እናቀርባለን። ወቅታዊ ዜናዎቻችንን እና ዝግጅቶቻችንን ያግኙ።", "heroChip": "የሐዋርያት ሥራ 6፡4", "headline": "እኛ ግን ለጸሎትና ቃሉን ለማስተማር እንተጋለን", "subheadline": "እንግዲህ ሂዱና አሕዛብን ሁሉ በአብ በወልድና በመንፈስ ቅዱስ ስም እያጠመቃችኋቸው፥ ያዘዝኋችሁንም ሁሉ እንዲጠብቁ እያስተማራችኋቸው ደቀ መዛሙርት አድርጓቸው፤ እነሆም እኔ እስከ ዓለም ፍጻሜ ድረስ ሁልጊዜ ከእናንተ ጋር ነኝ ማቴ 28፡19", "enrollNow": "አሁን ይመዝገቡ", "learnMore": "የበለጠ ለማወቅ ይጫኑ", "corePillars": "መንፈሳዊ አገልግሎቶቻችን ", "pillarsSub": "በሰንበት ትምህርት ቤታችን የሚሰጡ አገልግሎቶች", "faithFormation": "ኦርቶዶክሳዊ ትምህርቶች", "faithDesc": "የመጽሐፍ ቅዱስ ጥናት፣ የሚስጢራትና ሥርዓተ ቤተክርስትያን፣ የክርስትያናዊ ስነ ምግባር ትምህርቶች ።", "christianCommunity": "ትምህርተ ዝማሬ", "communityDesc": "ኦርቶዶክሳዊና ያሬዳዊ የሆኑ ዝማሬዎችና ወረቦች ጥናት። በመዝሙርና በዝማሬ በመንፈሳዊም ቅኔ በጸጋው በልባችሁ ለእግዚአብሔር ዘምሩ ቆላ 3፡16", "religiousEducation": "ማህበራዊ ዕሴቶች", "educationDesc": "እምነት ተስፋ ፍቅር እነዚህ ሦስቱ ጸንተው ይኖራሉ 1ኛ ቆሮ 13፡13", "whyChooseUs": "እኛጋ ቢመጡ ምን ያገኛሉ", "whyChooseSub": "የእምነት፣ የማህበረሰብ እና የደስታ መሰረት", "ourCommitment": "በእግዚአሄር መንፈስቅዱስ ዕርዳታ", "commitmentText": "ወጣቶችና ልጆችን በእምነት የሚያድጉበት፣ ጠንካራ የሞራል እሴቶችን የሚያዳብሩበት አማኝ፣ ንቁ፣ አስተዋይና ተፅዕኖ ፈጣሪ ክርስትያን ለማድረግ በትጋት እንቆማለን ።", "yearsService": "የአገልግሎት ዓመታት", "activeStudents": "ንቁ ተማሪዎች", "dedicatedTeachers": "ቁርጠኛ መምህራን", "buildingFaith": "ህያው ትዉልድን በመገንባት ላይ", "historyText": "ከ1964 ጀምሮ የዓምደሃይማኖት ሰንበት ትምህርት ቤት የመንፈሳዊ እድገት ብርሃን ሆኖ ቆይቷል። በትንሽ ስብስብ የጀመረው በመቶዎች የሚቆጠሩ ህጻናትን የሚያገለግል ንቁ አገልግሎት ሆኖ አድጓል፣ ለህይወት መመሪያ ከክርስቶስ ጋር ህያው ግንኙነት እንዲገነቡ ይረዳቸዋል።", "quote": "\"የመጽሐፍ ቅዱስ ታሪኮችን ብቻ አናስተምርም - ይልቁን ሰዎች ከክርስቶስ ጋር ህያው ግንኙነት እንዲገነቡ እንረዳቸዋለን እንጂ።\"", "mediaServices": "የሚዲያ አገልግሎቶች", "mediaText": "ቅዱስ ጊዜያችሁን ለዘላለም ያዙ። የእኛ የሚዲያ ቡድን ለሁሉም ልዩ ዝግጅቶች ሙያዊ የፎቶ እና የቪዲዮ ፓኬጆችን ያቀርባል፣ ይህም ለህይወት ዘመን የሚቆዩ ከፍተኛ ጥራት ያላቸውን ትዝታዎች ያስቀምጣል", "baptisms": "ጥምቀት እና ክርስትና", "weddings": "ሽምግልና እና ጋብቻ", "specialOccasions": "ልዩ ልዩ ዝግጅቶች", "bookConsultation": "ያግኙን", "testimonialsNote": "ከአበው አንደበት", "joinFamily": "ቤተሰባችንን ይቀላቀሉ", "joinText": "ኑ እግዚአብሄርን አብረን እናገልግል", "registerToday": "ዛሬ ይመዝገቡ", "announcementsTitle": "ወቅታዊ ማስታወቂያዎች", "announcementsSub": "ከአዳዲስ ዜናዎቻችን እና መጪ ክስተቶች ጋር እንደተዘመኑ ይቆዩ።", "latestNews": "የቅርብ ጊዜ ዜና", "upcomingEvents": "መጪ ክስተቶች", "noNews": "ምንም የቅርብ ጊዜ ዜና የለም። እባክዎ ቆይተው ተመልሰው ይምጡ።", "noEvents": "ምንም መጪ ዝግጅቶች አልተያዙም። ይጠብቁ!", "viewAll": "ሁሉንም ዜናዎች እና ክስተቶች ይመልከቱ", "promoTitle": "የዓምደሃይማኖት ዝማሬ መተግበሪያን ይጫኑ!", "promoSubtitle": "ከ2400 በላይ የኢትዮጵያ ኦርቶዶክስ መዝሙራትን በአማርኛ እና በአፋን ኦሮሞ በኪስዎ ይያዙ።", "promoButton": "ወደ ማውረጃ ገጽ ይሂዱ", "testimonials": [ { "quote": "ለነገ የቤተ ክርስትያን ገጽታ የምትጨነቁ ከሆነ ዛሬ ላይ የሰንበት ትምህርት ቤትን አገልግሎት በልባቹህ አኑሩ።", "author": "አቡነ ጎርጎርዮስ ካልዕ", "role": "ሊቀ ጳጳስ" }, { "quote": "ወጣት የሌላት ቤተክርስትያን የነገ ህይወት የላትም በቤተክርስትያን የሌለ ወጣት የነገ ህይወት የለዉም", "author": "አቡነ ሺኖዳ ሳልሣዊ", "role": "የግብጽ ፓትሪያርክ" }, { "quote": "ልጅን በሚሄድበት መንገድ ምራው፥ በሸመገለም ጊዜ ከእርሱ ፈቀቅ አይልም።", "author": "ምሳ 22፡6", "role": "ጠቢቡ ሰለሞን" }, { "quote": "እስክመጣ ድረስ ለማንበብና ለመምከር ለማስተማርም ተጠንቀቅ።", "author": "1ኛ ጢሞ 4፡13 ", "role": "ቅዱስ ጳውሎስ" }, { "quote": "ለልጆችህም አስተምረው፥ በቤትህም ስትቀመጥ፥ በመንገድም ስትሄድ፥ ስትተኛም፥ ስትነሣም ተጫወተው።", "author": "ዘዳ 6፡7", "role": "ሊቀ ነቢያት ሙሴ" } ] },
  om: { "pageTitle": "Mana Barumsaa Dilbataa Amdehaayimaanot | Barnoota Hafuuraa Jimmaatti", "pageDescription": "Marsariitii idilee Mana Barumsaa Dilbataa Amdehaayimaanot Jimmaatti argamu.", "heroChip": "Hojii Ergamootaa 6:4", "headline": "Nuti garuu kadhannaa fi sagalee lallabuutti ni cichina", "subheadline": "Kanaaf dhaqaa, maqaa Abbaa, Ilmaa fi Hafuura Qulqulluutiin isaan cuuphuudhaan, waan an isin ajaje hundumaa eeguu isaan barsiisuudhaan saboota hundumaa bartoota taasisaa.", "enrollNow": "Amma Galmaa'aa", "learnMore": "Dabalataaf cuqaasi", "corePillars": "Tajaajila Hafuuraa Keenya", "pillarsSub": "Tajaajila mana barumsaa Dilbataa keenyatti kennamu", "faithFormation": "Barnoota Ortodoksii", "faithDesc": "Qo'annoo Macaafa Qulqulluu, iccitiiwwanii fi sirna mana kiristaanaa.", "christianCommunity": "Barnoota Faarfannaa", "communityDesc": "Qo'annoo faarfannaa fi waraabii Ortodoksii fi Yaared.", "religiousEducation": "Duudhaalee Hawaasummaa", "educationDesc": "Amantii, abdii, jaalalli, sadan kun ni jiraatu.", "whyChooseUs": "Gara keenya yoo dhuftan maal argattu?", "whyChooseSub": "Hundee Amantii, Hawaasaa fi Gammachuu", "ourCommitment": "Gargaarsa Waaqayyo Hafuura Qulqulluutiin", "commitmentText": "Dargaggoonnii fi ijoolleen amantiin akka guddatan, duudhaalee naamusa gaarii akka qabaatan, amantoota, dammaqoo, hubatoo fi dhiibbaa kan uuman akka ta'an jabeessinee hojjenna.", "yearsService": "Waggoota Tajaajilaa", "activeStudents": "Barattoota Si'aa'oo", "dedicatedTeachers": "Barsiisota Kutatoo", "buildingFaith": "Dhaloota Jiraataa Ijaaruu", "historyText": "Bara 1964 irraa eegalee, Manni Barumsaa Dilbataa Amdehaayimaanot ifa guddina hafuuraa ta'ee tajaajilaa jira.", "quote": "\"Seenaa Macaafa Qulqulluu qofa hin barsiifnu - namoonni Kiristoos wajjin hariiroo jireenyaa akka ijaarratan ni gargaarra.\"", "mediaServices": "Tajaajila Miidiyaa", "mediaText": "Yeroo keessan qulqulluu bara baraan qabsiisaa.", "baptisms": "Cuuphaa fi Kiristinnaa", "weddings": "Araaraa fi Gaa'ela", "specialOccasions": "Ayyaanota Addaa", "bookConsultation": "Nu Qunnamaa", "testimonialsNote": "Afaan Abbootii irraa", "joinFamily": "Maatii Keenyatti Makamaa", "joinText": "Kottaa Waaqayyoon waliin haa tajaajillu", "registerToday": "Har'a Galmaa'aa", "announcementsTitle": "Beeksisa Haaraa", "announcementsSub": "Odeeffannoo fi taateewwan keenya haaraa hordofaa.", "latestNews": "Odeeffannoo Haaraa", "upcomingEvents": "Taateewwan Dhufan", "noNews": "Odeeffannoon haaraan hin jiru.", "noEvents": "Taateewwan dhufan hin jiran.", "viewAll": "Odeeffannoo fi Taateewwan Hunda Ilaali", "promoTitle": "Applikeeshinii Amdehayimanot Zimare Instool Godhaa!", "promoSubtitle": "Faarfannaa Ortodoksii Itoophiyaa 2400 ol Afaan Amaaraa fi Afaan Oromootiin kiisii keessan keessatti argadhaa.", "promoButton": "Gara Fuula Buufachuutti Deemi", "testimonials": [ { "quote": "Fuula mana kiristaanaa boruuf yoo yaaddoftan, har'a tajaajila mana barumsaa Dilbataa garaa keessanitti kaa'adhaa.", "author": "Abuna Gorgoriyoos Lammaffaa", "role": "Liqa Phaaphaasii" }, { "quote": "Mana kiristaanaa dargaggeessa hin qabne jireenya borii hin qabdu, dargaggeessi mana kiristaanaa keessa hin jirre jireenya borii hin qabu.", "author": "Abuna Shinoodaa Sadaffaa", "role": "Paatiriyaarkii Gibxii" }, { "quote": "Mucaa karaa irra deemu qajeelchi, yommuu dulloomu illee irraa hin goreu.", "author": "Fakkeenya 22:6", "role": "Solomoon Ogeessa" }, { "quote": "Hangan dhufutti, dubbisuu, gorsuu fi barsiisuutti xiyyeeffadhu.", "author": "1 Ximotewos 4:13", "role": "Qulqulluu Phaawuloos" }, { "quote": "Ijoollee keetti barsiisi, yeroo mana kee teessu, yeroo karaa irra deemtu, yeroo ciiftu, yeroo kaatus waa'ee isaanii dubbadhu.", "author": "Seera Keessa Deebii 6:7", "role": "Musee, Gula Raajotaa" } ] },
  ti: { "pageTitle": "ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት | መንፈሳዊ ትምህርቲ ኣብ ጂማ", "pageDescription": "ወግዓዊ ድረ-ገጽ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ኣብ ጂማ።", "heroChip": "ግብሪ ሐዋርያት 6፡4", "headline": "ንሕና ግና ንጸሎትን ንኣገልግሎት ቃልን ክንጸንዕ ኢና", "subheadline": "ስለዚ ኺዱ ንዅሎም ኣህዛብ ብስም ኣቦን ወልድን መንፈስ ቅዱስን እናኣጥመቕኩምዎም፥ ዝኣዘዝኩኹም ኵሉ ኺሕልዉ እናመሀርኩምዎም ደቀ መዛሙርቲ ግበርዎም", "enrollNow": "ሕጂ ተመዝገቡ", "learnMore": "ንዝበለጸ መረዳእታ ጠውቑ", "corePillars": "መንፈሳዊ ኣገልግሎታትና", "pillarsSub": "ኣብ ቤት ትምህርቲ ሰንበትና ዝወሃቡ ኣገልግሎታት", "faithFormation": "ኦርቶዶክሳዊ ትምህርትታት", "faithDesc": "ጽንዓት መጽሓፍ ቅዱስ፣ ምስጢራትን ስርዓተ ቤተክርስትያንን", "christianCommunity": "ትምህርቲ ዝማሬ", "communityDesc": "ጽንዓት ናይ ኦርቶዶክሳውን ያሬዳውን ዝማሬታትን ወረባትን", "religiousEducation": "ማሕበራዊ ክብርታት", "educationDesc": "እምነት ተስፋ ፍቕሪ፡ እዘን ሰለስተ ጸኒዐን ይነብራ እየን", "whyChooseUs": "ናባና እንተ መጺእኩም እንታይ ትረኽቡ፧", "whyChooseSub": "መሰረት እምነት፣ ማሕበረሰብን ሓጎስን", "ourCommitment": "ብረድኤት እግዚኣብሄር መንፈስ ቅዱስ", "commitmentText": "መንእሰያትን ህጻናትን ብእምነት ዝዓብዩሉ፣ ጽኑዕ ስነ-ምግባራዊ ክብርታት ዘማዕብሉሉ፣ እሙናት፣ ንቑሓት፣ ኣስተውዓልትን ጽልዋ ፈጠርትን ክርስትያናት ንምግባር ንጽዕር", "yearsService": "ዓመታት ኣገልግሎት", "activeStudents": "ንቑሓት ተመሃሮ", "dedicatedTeachers": "ውፉያት መምህራን", "buildingFaith": "ህያው ወለዶ ምህናጽ", "historyText": "ካብ 1964 ጀሚሩ፡ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ብርሃን መንፈሳዊ ዕቤት ኮይኑ ጸኒሑ", "quote": "\"ዛንታታት መጽሓፍ ቅዱስ ጥራይ ኣይኮናን እነምህር - ሰባት ምስ ክርስቶስ ህያው ዝምድና ንኺሃንጹ ኢና እንሕግዞም\"", "mediaServices": "ኣገልግሎት ሚድያ", "mediaText": "ቅዱሳት እዋናትኩም ንዘልኣለም ዓቅቡ", "baptisms": "ጥምቀትን ክርስትናን", "weddings": "ሽምግልናን መርዓን", "specialOccasions": "ፈላለዩ ፍሉያት ኣጋጣሚታት", "bookConsultation": "ተወከሱና", "testimonialsNote": "ካብ ኣፍ ኣቦታት", "joinFamily": "ስድራቤትና ተጸንበሩ", "joinText": "ንዑ እግዚኣብሄር ብሓባር ነገልግል", "registerToday": "ሎሚ ተመዝገቡ", "announcementsTitle": "ናይ ቀረባ እዋን ሓበሬታ", "announcementsSub": "ምስ ናይ ቀረባ እዋን ዜናታትናን መጻኢ ፍጻመታትናን ተኸታተሉ", "latestNews": "ናይ ቀረባ እዋን ዜና", "upcomingEvents": "መጻኢ ፍጻመታት", "noNews": "ናይ ቀረባ እዋን ዜና የለን", "noEvents": "መደብ ዝተታሕዘሉ መጻኢ ፍጻመታት የለን", "viewAll": "ኩሉ ዜናታትን ፍጻመታትን ርኣዩ", "promoTitle": "ናይ ዓምደሃይማኖት ዝማሬ ኣፕሊኬሽን ጫኑ!", "promoSubtitle": "ልዕሊ 2400 ናይ ኢትዮጵያ ኦርቶዶክስ መዛሙር ብኣምሓርኛን ኣፋን ኦሮሞን ኣብ ኪስኹም ሒዝኩም ርኸቡ።", "promoButton": "ናብ ገጽ ምውራድ ኪዱ", "testimonials": [ { "quote": "ብዛዕባ ናይ ጽባሕ ገጽ ቤተክርስትያን ትጭነቑ እንተኾንኩም፡ ሎሚ ኣገልግሎት ቤት ትምህርτι ሰንበት ኣብ ልብኹም ኣንብሩ።", "author": "ብፁዕ ኣቡነ ጎርጎርዮስ ካልኣይ", "role": "ሊቀ ጳጳስ" }, { "quote": "መንእሰይ ዘይብላ ቤተክርስትያን ናይ ጽባሕ ህይወት የብላን፡ ኣብ ቤተክርስትያን ዘየለ መንእሰይ ድማ ናይ ጽባሕ ህይወት የብሉን።", "author": "ብፁዕ ኣቡነ ሺኖዳ ሳልሳይ", "role": "ፓትርያርክ ግብጺ" }, { "quote": "ንሕጻን በታ ዚኸደላ መገዲ ምሀሮ፥ ምስ ኣረገ ኸኣ ካብኣ ኣይኬልግስን እዩ።", "author": "ምሳሌ 22፡6", "role": "ጠቢብ ሰሎሞን" }, { "quote": "ክሳዕ ዝመጽእ፡ ንምንባብን ምምዓድን ምምሃርን ተጠንቀቕ።", "author": "1 ጢሞቴዎስ 4፡13", "role": "ቅዱስ ጳውሎስ" }, { "quote": "ንደቅኻ ድማ ምሃሮም፥ ኣብ ቤትካ ኾፍ ኢልካ ኸለኻ፥ ኣብ መገዲ ኽትከይድ ከለኻ፥ ደቂስካ ኸለኻ፥ ተንሲእካ ኸለኻ ድማ ተዛረበሎም።", "author": "ዘዳግም 6፡7", "role": "ሊቀ ነብያት ሙሴ" } ] },
  ge: { "pageTitle": "ቤተ ትምህርት ሰንበት ዓምደሃይማኖት | ትምህርተ መንፈስ በጂማ", "pageDescription": "ወግዓዊ ድረ-ገጽ ዘቤተ ትምህርት ሰንበት ዓምደሃይማኖት በጂማ።", "heroChip": "ግብረ ሐዋርያት ፮፡፬", "headline": "ንሕነሰ ንጸሎት ወለአገልግሎተ ቃል ንጸንዕ", "subheadline": "ሑሩ ወመሀሩ ኵሎ አሕዛበ ወአጥምቅዎሙ በስመ አብ ወወልድ ወመንፈስ ቅዱስ", "enrollNow": "ይመዝገቡ ዮም", "learnMore": "ለተወሳኺ ይጽቀጡ", "corePillars": "መንፈሳዊ አገልግሎታትነ", "pillarsSub": "በቤተ ትምህርት ሰንበትነ ዝውሀቡ አገልግሎታት", "faithFormation": "ትምህርተ ኦርቶዶክስ", "faithDesc": "ንባበ መጽሐፍ ቅዱስ፣ ምስጢራት ወሥርዓተ ቤተ ክርስቲያን", "christianCommunity": "ትምህርተ ዝማሬ", "communityDesc": "ንባበ ዝማሬያት ወወረባት ዘኦርቶዶክስ ወያሬድ", "religiousEducation": "ማኅበራዊ ዕሴታት", "educationDesc": "እምነት ተስፋ ፍቅር እሊአ ሠለስቱ ጸኒዖን ይነብራ", "whyChooseUs": "ኀቤነሰ ለእመ መጻእክሙ ምንተ ትረክቡ፧", "whyChooseSub": "መሠረተ ሃይማኖት፣ ማኅበር ወተድላ", "ourCommitment": "በረድኤተ እግዚአብሔር መንፈስ ቅዱስ", "commitmentText": "ንወጣቶች ወለሕፃናት በሃይማኖት የዓብዩበት፣ ጽኑዓነ ሥነ ምግባር የዓብዩበት፣ አማንያነ፣ ንቁሓነ፣ አስተዋዕያነ ወተጽዕኖ ፈጣሪ ክርስቲያናውያን ለመሆን ንቀውም", "yearsService": "ዓመታት አገልግሎት", "activeStudents": "ንቁሓን ተማሪዎች", "dedicatedTeachers": "ውፉያን መምህራን", "buildingFaith": "ሕንጸተ ሕያው ትውልድ", "historyText": "እም ፲፱፻፶፮ ዓ.ም. ጀሚሮ፣ ቤተ ትምህርት ሰንበት ዓምደሃይማኖት ብርሃነ መንፈሳዊ ዕቤት ኮነ", "quote": "\"ኢንሰመይ ዛንታ መጽሐፍ ቅዱስ ባሕቱ - አላ ንረድኦሙ ለሰብእ ከመ ይሕንጹ ሕያው ዝምድና ምስለ ክርስቶስ።\"", "mediaServices": "አገልግሎተ ሚድያ", "mediaText": "አኀዙ ቅዱሳተ ጊዜያቲክሙ ለዓለም", "baptisms": "ጥምቀት ወክርስትና", "weddings": "ሽምግልና ወመርዓ", "specialOccasions": "ልዩ ልዩ በዓላት", "bookConsultation": "ተወከሱነ", "testimonialsNote": "እም አፈ አበው", "joinFamily": "ተጸንበሩ ቤተሰብነ", "joinText": "ንዑ ንስገድ ለእግዚአብሔር ኅቡረ", "registerToday": "ይመዝገቡ ዮም", "announcementsTitle": "ወቅታዊ ማስታወቂያ", "announcementsSub": "ምስ አዳዲስ ዜናዎቻችን እና መጪ ክስተቶች እንደተዘመኑ ይቆዩ", "latestNews": "የቅርብ ጊዜ ዜና", "upcomingEvents": "መጪ ክስተቶች", "noNews": "ዜና የለም", "noEvents": "ዝግጅቶች የሉም", "viewAll": "ሁሉንም ይመልከቱ", "promoTitle": "መተግበሪያ ፡ ዓምደሃይማኖት ፡ ዝማሬ ፡ ጫኑ!", "promoSubtitle": "ልዕለ ፡ ፪፻፬፻ ፡ መዝሙራተ ፡ ኦርቶዶክስ ፡ ኢትዮጵያ ፡ በአማርኛ ፡ ወበአፋን ፡ ኦሮሞ ፡ ውስተ ፡ ኪስክሙ ፡ ርከቡ።", "promoButton": "ኀበ ፡ ገጸ ፡ ምውራድ ፡ ሑሩ", "testimonials": [ { "quote": "እመ አጨነቀክሙ ገጻ ለቤተ ክርስቲያን ዘነገ፣ ዮም አገልግሎተ ቤተ ትምህርት ሰንበት በልብክሙ አንብሩ።", "author": "አቡነ ጎርጎርዮስ ካልዕ", "role": "ሊቀ ጳጳስ" }, { "quote": "ቤተ ክርስቲያን ዘእንበለ ወጣቶች ኅላዌ ዘነገ የብላ ወወጣቶች ዘእንበለ ቤተ ክርስቲያን ኅላዌ ዘነገ የብሎሙ።", "author": "አቡነ ሺኖዳ ሣልሳይ", "role": "ፓትርያርክ ዘግብፅ" }, { "quote": "መሀሮ ለሕፃን በፍኖቱ ወሶበ ይዐቢ ኢይርሕቅ እምኔሃ።", "author": "ምሳሌ ፳፪፡፮", "role": "ጠቢብ ሰሎሞን" }, { "quote": "እስከ እመጽእ ጽናዕ በንባብ ወበትምህርት ወበግሣፄ።", "author": "፩ኛ ጢሞቴዎስ ፬፡፲፫", "role": "ቅዱስ ጳውሎስ" }, { "quote": "ወመሀርዎሙ ለደቂቅክሙ ወተናገሩ ቦሙ አመ ትነብሩ ውስተ ቤትክሙ ወአመ ትሐውሩ በፍኖት ወአመ ትነውሙ ወአመ ትትነሥኡ።", "author": "ዘዳግም ፮፡፯", "role": "ሙሴ ሊቀ ነቢያት" } ] },
  es: { "pageTitle": "Escuela Dominical Amdehayimanot | Educación Espiritual en Jimma", "pageDescription": "El sitio web oficial de la Escuela Dominical Amdehayimanot en Jimma.", "heroChip": "Hechos 6:4", "headline": "Pero nosotros persistiremos en la oración y en el ministerio de la palabra.", "subheadline": "Por tanto, id y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo", "enrollNow": "Inscríbete Ahora", "learnMore": "Haz clic para saber más", "corePillars": "Nuestros Servicios Espirituales", "pillarsSub": "Servicios ofrecidos en nuestra Escuela Dominical", "faithFormation": "Enseñanzas Ortodoxas", "faithDesc": "Estudio de la Biblia, sacramentos y ritos de la iglesia", "christianCommunity": "Lecciones de Himnodia", "communityDesc": "Estudio de cantos e himnos ortodoxos y Yaredicos", "religiousEducation": "Valores Sociales", "educationDesc": "Y ahora permanecen la fe, la esperanza y el amor, estos tres", "whyChooseUs": "¿Qué encontrarás si vienes a nosotros?", "whyChooseSub": "Un Fundamento de Fe, Comunidad y Alegría", "ourCommitment": "Con la ayuda de Dios Espíritu Santo", "commitmentText": "Nos esforzamos por criar a jóvenes y niños para que crezcan en la fe, desarrollen fuertes valores morales y se conviertan en cristianos fieles, activos e influyentes", "yearsService": "Años de Servicio", "activeStudents": "Estudiantes Activos", "dedicatedTeachers": "Maestros Dedicados", "buildingFaith": "Construyendo una Generación Viva", "historyText": "Desde 1964, la Escuela Dominical Amdehayimanot ha sido un faro de crecimiento espiritual.", "quote": "\"No solo enseñamos historias de la Biblia, sino que ayudamos a las personas a construir una relación viva con Cristo.\"", "mediaServices": "Servicios de Medios", "mediaText": "Captura tus momentos sagrados para siempre.", "baptisms": "Bautismo y Bautizo", "weddings": "Mediación y Matrimonio", "specialOccasions": "Ocasiones Especiales", "bookConsultation": "Contáctanos", "testimonialsNote": "De la boca de los Padres", "joinFamily": "Únete a Nuestra Familia", "joinText": "Ven, sirvamos a Dios juntos", "registerToday": "Regístrate Hoy", "announcementsTitle": "Últimos Anuncios", "announcementsSub": "Manténgase al día con nuestras últimas noticias y próximos eventos.", "latestNews": "Últimas Noticias", "upcomingEvents": "Próximos Eventos", "noNews": "No hay noticias recientes.", "noEvents": "No hay eventos programados.", "viewAll": "Ver Todas las Noticias y Eventos", "promoTitle": "¡Obtén la aplicación Amdehayimanot Zimare!", "promoSubtitle": "Accede a más de 2400 himnos ortodoxos etíopes en amárico y afaan oromoo, directamente en tu bolsillo.", "promoButton": "Ir a la página de descarga", "testimonials": [ { "quote": "Si les preocupa el futuro rostro de la Iglesia, pongan hoy el ministerio de la Escuela Dominical en sus corazones.", "author": "Abune Gorgorios II", "role": "Arzobispo" }, { "quote": "Una iglesia sin jóvenes es una iglesia sin futuro. Además, una juventud sin iglesia es una juventud sin futuro.", "author": "Papa Shenouda III", "role": "Patriarca de Egipto" }, { "quote": "Instruye al niño en su camino, Y aun cuando fuere viejo no se apartará de él.", "author": "Proverbios 22:6", "role": "Salomón el Sabio" }, { "quote": "Entre tanto que voy, ocúpate en la lectura, la exhortación y la enseñanza.", "author": "1 Timoteo 4:13", "role": "San Pablo" }, { "quote": "y las repetirás a tus hijos, y hablarás de ellas estando en tu casa, y andando por el camino, y al acostarte, y cuando te levantes.", "author": "Deuteronomio 6:7", "role": "Moisés, Jefe de los Profetas" } ] },
  fr: { "pageTitle": "École du Dimanche Amdehayimanot | Éducation Spirituelle à Jimma", "pageDescription": "Le site officiel de l'École du Dimanche Amdehayimanot à Jimma.", "heroChip": "Actes 6:4", "headline": "Mais nous, nous persisterons dans la prière et dans le ministère de la parole.", "subheadline": "Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit", "enrollNow": "Inscrivez-vous Maintenant", "learnMore": "Cliquez pour en savoir plus", "corePillars": "Nos Services Spirituels", "pillarsSub": "Services offerts dans notre École du Dimanche", "faithFormation": "Enseignements Orthodoxes", "faithDesc": "Étude de la Bible, sacrements et rites de l'Église", "christianCommunity": "Leçons d'Hymnodie", "communityDesc": "Étude des chants et hymnes orthodoxes et Yarediques", "religiousEducation": "Valeurs Sociales", "educationDesc": "Maintenant donc ces trois choses demeurent: la foi, l'espérance, la charité", "whyChooseUs": "Que trouverez-vous si vous venez à nous ?", "whyChooseSub": "Un Fondement de Foi, de Communauté et de Joie", "ourCommitment": "Avec l'aide de Dieu le Saint-Esprit", "commitmentText": "Nous nous efforçons d'élever les jeunes et les enfants pour qu'ils grandissent dans la foi, développent de solides valeurs morales et deviennent des chrétiens fidèles, actifs et influents.", "yearsService": "Années de Service", "activeStudents": "Étudiants Actifs", "dedicatedTeachers": "Enseignants Dévoués", "buildingFaith": "Bâtir une Génération Vivante", "historyText": "Depuis 1964, l'École du Dimanche Amdehayimanot est un phare de croissance spirituelle.", "quote": "\"Nous n'enseignons pas seulement les histoires de la Bible - nous aidons les gens à construire une relation vivante avec le Christ.\"", "mediaServices": "Services Médias", "mediaText": "Capturez vos moments sacrés pour toujours.", "baptisms": "Baptême et Baptême Chrétien", "weddings": "Médiation et Mariage", "specialOccasions": "Occasions Spéciales", "bookConsultation": "Contactez-nous", "testimonialsNote": "De la bouche des Pères", "joinFamily": "Rejoignez Notre Famille", "joinText": "Venez, servons Dieu ensemble", "registerToday": "Inscrivez-vous Aujourd'hui", "announcementsTitle": "Dernières Annonces", "announcementsSub": "Restez à jour avec nos dernières nouvelles et nos événements à venir.", "latestNews": "Dernières Nouvelles", "upcomingEvents": "Événements à Venir", "noNews": "Aucune nouvelle récente.", "noEvents": "Aucun événement à venir n'est prévu.", "viewAll": "Voir Toutes les Nouvelles et Événements", "promoTitle": "Obtenez l'application Amdehayimanot Zimare !", "promoSubtitle": "Accédez à plus de 2400 hymnes orthodoxes éthiopiens en amharique et en afaan oromoo, directement dans votre poche.", "promoButton": "Aller à la page de téléchargement", "testimonials": [ { "quote": "Si vous vous souciez du futur visage de l'Église, placez aujourd'hui le ministère de l'École du Dimanche dans vos cœurs.", "author": "Abune Gorgorios II", "role": "Archevêque" }, { "quote": "Une Église sans jeunesse est une Église sans avenir. De plus, une jeunesse sans Église est une jeunesse sans avenir.", "author": "Pape Chenouda III", "role": "Patriarche d'Égypte" }, { "quote": "Instruis l'enfant selon la voie qu'il doit suivre; Et quand il sera vieux, il ne s'en détournera pas.", "author": "Proverbes 22:6", "role": "Salomon le Sage" }, { "quote": "Jusqu'à ce que je vienne, applique-toi à la lecture, à l'exhortation, à l'enseignement.", "author": "1 Timothée 4:13", "role": "Saint Paul" }, { "quote": "Tu les inculqueras à tes enfants, et tu en parleras quand tu seras dans ta maison, quand tu iras en voyage, quand tu te coucheras et quand tu te lèveras.", "author": "Deutéronome 6:7", "role": "Moïse, Chef des Prophètes" } ] },
  ar: { "pageTitle": "مدرسة الأحد عمود الإيمان | التعليم الروحي في جيما", "pageDescription": "الموقع الرسمي لمدرسة الأحد عمود الإيمان في جيما.", "heroChip": "أعمال الرسل 6:4", "headline": "أَمَّا نَحْنُ فَنُواظِبُ عَلَى الصَّلاَةِ وَخِدْمَةِ الْكَلِمَةِ.", "subheadline": "فَاذْهَبُوا وَتَلْمِذُوا جَمِيعَ الأُمَمِ وَعَمِّدُوهُمْ بِاسْمِ الآب وَالابْنِ وَالرُّوحِ الْقُድُسِ", "enrollNow": "سجل الآن", "learnMore": "انقر لمعرفة المزيد", "corePillars": "خدماتنا الروحية", "pillarsSub": "الخدمات المقدمة في مدرسة الأحد", "faithFormation": "التعاليم الأرثوذكسية", "faithDesc": "دراسة الكتاب المقدس، الأسرار المقدسة وطقوس الكنيسة", "christianCommunity": "دروس الألحان", "communityDesc": "دراسة الألحان والترانيم الأرثوذكسية والياريدية", "religiousEducation": "القيم الاجتماعية", "educationDesc": "أَمَّا الآنَ فَيَثْبُتُ الإِيمَانُ وَالرَّجَاءُ وَالْمَحَبَّةُ، هذِهِ الثَّلاَثَةُ", "whyChooseUs": "ماذا ستجد إذا أتيت إلينا؟", "whyChooseSub": "أساس من الإيمان والمجتمع والفرح", "ourCommitment": "بعون الله الروح القدس", "commitmentText": "نسعى جاهدين لتربية الشباب والأطفال لينموا في الإيمان، ويطوروا قيمًا أخلاقية قوية، ويصبحوا مسيحيين مؤمنين ونشطين ومؤثرين", "yearsService": "سنوات من الخدمة", "activeStudents": "طلاب نشطون", "dedicatedTeachers": "معلمون متفانون", "buildingFaith": "بناء جيل حي", "historyText": "منذ عام 1964، كانت مدرسة الأحد في عمود الإيمان منارة للنمو الروحي.", "quote": "\"نحن لا نعلم قصص الكتاب المقدس فقط - بل نساعد الناس على بناء علاقة حية مع المسيح.\"", "mediaServices": "الخدمات الإعلامية", "mediaText": "التقط لحظاتك المقدسة إلى الأبد.", "baptisms": "المعمودية والتعميد", "weddings": "الوساطة والزواج", "specialOccasions": "المناسبات الخاصة", "bookConsultation": "اتصل بنا", "testimonialsNote": "من أفواه الآباء", "joinFamily": "انضم إلى عائلتنا", "joinText": "تعالوا نخدم الله معًا", "registerToday": "سجل اليوم", "announcementsTitle": "آخر الإعلانات", "announcementsSub": "ابق على اطلاع بآخر أخبارنا وأحداثنا القادمة.", "latestNews": "آخر الأخبار", "upcomingEvents": "الأحداث القادمة", "noNews": "لا توجد أخبار حديثة.", "noEvents": "لا توجد أحداث قادمة مجدولة.", "viewAll": "عرض جميع الأخبار والأحداث", "promoTitle": "احصل على تطبيق عمدهيمانوت زماري!", "promoSubtitle": "احصل على أكثر من 2400 ترنيمة أرثوذكسية إثيوبية باللغتين الأمهرية والأفان أورومو، في جيبك مباشرة.", "promoButton": "اذهب إلى صفحة التنزيل", "testimonials": [ { "quote": "إذا كنتم قلقين بشأن وجه الكنيسة في المستقبل، فضعوا خدمة مدرسة الأحد في قلوبكم اليوم.", "author": "أبونا غريغوريوس الثاني", "role": "رئيس الأساقفة" }, { "quote": "كنيسة بلا شباب هي كنيسة بلا مستقبل. وشباب بلا كنيسة هو شباب بلا مستقبل.", "author": "البابا شنودة الثالث", "role": "بطريرك مصر" }, { "quote": "رَبِّ الْوَلَدَ فِي طَرِيقِهِ، فَمَتَى شَاخَ أَيْضًا لاَ يَحِيدُ عَنْهُ.", "author": "أمثال 22: 6", "role": "سليمان الحكيم" }, { "quote": "إلى أن أجيء اعكف على القراءة والوعظ والتعليم.", "author": "1 تيموثاوس 4: 13", "role": "القديس بولس" }, { "quote": "ولقنتها بنيك وتكلمت بها حين تجلس في بيتك وحين تمشي في الطريق وحين تنام وحين تقوم.", "author": "تثنية 6: 7", "role": "موسى، رئيس الأنبياء" } ] }
};


const AnnouncementItem = ({ item, type }) => {
  const imageUrl = item.image_url
    ? `${API_ROOT_URL}${item.image_url}`
    : 'https://via.placeholder.com/120x80?text=Amde+Haymanot';
  const date = type === 'news'
    ? format(parseISO(item.created_at), 'MMMM d, yyyy')
    : format(parseISO(item.event_date), 'EEEE, MMM d, h:mm a');
  return (
    <Box
      component={RouterLink}
      to="/news-and-events"
      sx={{
        display: 'flex',
        gap: 2,
        p: 0,
        textDecoration: 'none',
        borderBottom: `1px solid ${brand.borderSubtle}`,
        pb: 2,
        transition: 'opacity 0.25s ease',
        '&:hover': { opacity: 0.8 },
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={item.title}
        sx={{ width: { xs: 88, sm: 112 }, height: { xs: 68, sm: 80 }, objectFit: 'cover', flexShrink: 0 }}
      />
      <Box>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
            fontWeight: 600,
            fontSize: '1.15rem',
            color: 'text.primary',
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {date}
        </Typography>
      </Box>
    </Box>
  );
};

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
    { title: t.faithFormation, description: t.faithDesc, icon: <Book />, image: bibleStudy },
    { title: t.christianCommunity, description: t.communityDesc, icon: <MusicNote />, image: childrenSinging },
    { title: t.religiousEducation, description: t.educationDesc, icon: <Groups />, image: community },
  ];
  const stats = [
    { value: '53+', label: t.yearsService },
    { value: '300+', label: t.activeStudents },
    { value: '26+', label: t.dedicatedTeachers },
  ];
  const testimonials = t.testimonials || [];
  const duplicated = [...testimonials, ...testimonials];

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDescription} />
      </Helmet>

      <Box sx={{ bgcolor: brand.stone }}>
        <PageHero
          backgroundImage={heroImage}
          brandName={brandName}
          headline={t.headline}
          support={t.heroChip}
          actions={
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" color="secondary" size="large" component={RouterLink} to="/register">
                {t.enrollNow}
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/about"
                sx={{
                  color: brand.white,
                  borderColor: alpha(brand.gold, 0.55),
                  '&:hover': { borderColor: brand.gold, bgcolor: alpha(brand.gold, 0.08) },
                }}
              >
                {t.learnMore}
              </Button>
            </Stack>
          }
        />

        {/* Services — editorial split, not card grid */}
        <PageSection variant="white">
          <Container maxWidth="lg">
            <SectionHeader eyebrow={t.pillarsSub} title={t.corePillars} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 6, md: 10 } }}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.05 }}
                >
                  <Grid
                    container
                    spacing={{ xs: 3, md: 6 }}
                    alignItems="center"
                    direction={index % 2 === 1 ? 'row-reverse' : 'row'}
                  >
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          border: `1px solid ${brand.borderSubtle}`,
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 12,
                            border: `1px solid ${alpha(brand.gold, 0.4)}`,
                            pointerEvents: 'none',
                            opacity: 0,
                            transition: 'opacity 0.35s ease',
                          },
                          '&:hover::after': { opacity: 1 },
                          '& img': {
                            width: '100%',
                            height: { xs: 240, md: 360 },
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.7s ease',
                          },
                          '&:hover img': { transform: 'scale(1.04)' },
                        }}
                      >
                        <Box component="img" src={feature.image} alt={feature.title} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ color: brand.gold, mb: 2 }}>{React.cloneElement(feature.icon, { sx: { fontSize: 36 } })}</Box>
                      <Typography
                        variant="h3"
                        sx={{ color: brand.navyDark, mb: 2 }}
                      >
                        {feature.title}
                      </Typography>
                      <GoldDivider sx={{ mx: 0, mb: 2.5 }} />
                      <Typography color="text.secondary" sx={{ lineHeight: 1.85, maxWidth: 440 }}>
                        {feature.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </motion.div>
              ))}
            </Box>
          </Container>
        </PageSection>

        {/* Stats + commitment — ink band */}
        <PageSection variant="ink" pattern>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 600,
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    color: brand.white,
                    mb: 2,
                    lineHeight: 1.2,
                  }}
                >
                  {t.ourCommitment}
                </Typography>
                <Typography sx={{ color: alpha('#fff', 0.75), lineHeight: 1.85, maxWidth: 480 }}>
                  {t.commitmentText}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  {stats.map((stat) => (
                    <StatBlock key={stat.label} value={stat.value} label={stat.label} light />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </PageSection>

        {/* Living generation — full-bleed image story */}
        <Box sx={{ position: 'relative', minHeight: { xs: 520, md: 640 }, overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${teacherWithKids})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, ${alpha(brand.navyInk, 0.92)} 0%, ${alpha(brand.navyDark, 0.7)} 55%, ${alpha(brand.navyDark, 0.35)} 100%)`,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 12 } }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Box sx={{ maxWidth: 520, color: brand.white }}>
                <Typography variant="h2" sx={{ color: brand.white, mb: 2 }}>
                  {t.buildingFaith}
                </Typography>
                <GoldDivider sx={{ mx: 0, mb: 3 }} />
                <Typography sx={{ color: alpha('#fff', 0.8), lineHeight: 1.85, mb: 3 }}>
                  {t.historyText}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontSize: '1.25rem',
                    color: brand.gold,
                    borderLeft: `2px solid ${brand.gold}`,
                    pl: 2.5,
                    lineHeight: 1.6,
                  }}
                >
                  {t.quote}
                </Typography>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Announcements */}
        <PageSection variant="stone">
          <Container maxWidth="lg">
            <SectionHeader title={t.announcementsTitle} subtitle={t.announcementsSub} />
            {loading ? (
              <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.75rem', color: brand.navy, mb: 3, displayItems: 'center', gap: 1 }}>
                    <NewsIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                    {t.latestNews}
                  </Typography>
                  {notifications.news.length > 0 ? (
                    <Stack spacing={3}>{notifications.news.map((item) => <AnnouncementItem key={item.id} item={item} type="news" />)}</Stack>
                  ) : (
                    <Typography color="text.secondary">{t.noNews}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.75rem', color: brand.navy, mb: 3 }}>
                    <EventIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                    {t.upcomingEvents}
                  </Typography>
                  {notifications.events.length > 0 ? (
                    <Stack spacing={3}>{notifications.events.map((item) => <AnnouncementItem key={item.id} item={item} type="event" />)}</Stack>
                  ) : (
                    <Typography color="text.secondary">{t.noEvents}</Typography>
                  )}
                </Grid>
              </Grid>
            )}
            {!loading && (notifications.news.length > 0 || notifications.events.length > 0) && (
              <Box textAlign="center" sx={{ mt: 6 }}>
                <Button component={RouterLink} to="/news-and-events" variant="contained" color="primary" size="large">
                  {t.viewAll}
                </Button>
              </Box>
            )}
          </Container>
        </PageSection>

        {/* Media services */}
        <PageSection variant="white">
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
                <SectionHeader
                  align="left"
                  title={t.mediaServices}
                  subtitle={t.mediaText}
                  animated={false}
                  sx={{ mb: 3 }}
                />
                <List disablePadding>
                  {[
                    { icon: <Church />, text: t.baptisms },
                    { icon: <Favorite />, text: t.weddings },
                    { icon: <Celebration />, text: t.specialOccasions },
                  ].map((row) => (
                    <ListItem key={row.text} disableGutters sx={{ py: 1 }}>
                      <ListItemIcon sx={{ color: brand.gold, minWidth: 40 }}>{row.icon}</ListItemIcon>
                      <ListItemText primary={row.text} primaryTypographyProps={{ fontWeight: 500 }} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  color="secondary"
                  href="/contact"
                  endIcon={<CameraRoll />}
                  size="large"
                  sx={{ mt: 3 }}
                >
                  {t.bookConsultation}
                </Button>
              </Grid>
              <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  sx={{
                    position: 'relative',
                    '& img': { width: '100%', height: { xs: 280, md: 420 }, objectFit: 'cover', display: 'block' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      right: -12,
                      bottom: -12,
                      border: `1px solid ${brand.gold}`,
                      zIndex: 0,
                    },
                  }}
                >
                  <Box component="img" src={mediaServicesImage} alt="" sx={{ position: 'relative', zIndex: 1 }} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </PageSection>

        {/* App promo */}
        <PageSection variant="goldRail">
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ mb: 2 }}>{t.promoTitle}</Typography>
            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 520, mx: 'auto' }}>{t.promoSubtitle}</Typography>
            <Button
              component={RouterLink}
              to="/download"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<GetAppIcon />}
            >
              {t.promoButton}
            </Button>
          </Container>
        </PageSection>

        {/* Fathers' words — horizontal scroll, no star ratings clutter */}
        <PageSection variant="ink" pattern>
          <Container maxWidth="lg">
            <SectionHeader title={t.testimonialsNote} light />
          </Container>
          <Box sx={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
            <Box
              sx={{
                display: 'flex',
                width: 'max-content',
                animation: 'homeMarquee 55s linear infinite',
                '@keyframes homeMarquee': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(-50%)' },
                },
                '&:hover': { animationPlayState: 'paused' },
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
        <PageSection variant="white" sx={{ textAlign: 'center' }}>
          <Container maxWidth="sm">
            <Typography variant="h2" sx={{ mb: 2 }}>{t.joinFamily}</Typography>
            <GoldDivider />
            <Typography color="text.secondary" sx={{ mb: 4, mt: 2 }}>{t.joinText}</Typography>
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
