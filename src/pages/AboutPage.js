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
  om: 'Amdehaayimaanot',
  ti: 'ዓምደሃይማኖት',
  ge: 'ዓምደ ሃይማኖት',
  es: 'Amde Haymanot',
  fr: 'Amde Haymanot',
  ar: 'عمود الإيمان',
};

const placeLabels = {
  en: 'Jimma · Debre Ephrata St. Mary',
  am: 'ጅማ · መንቲና · ደብረ ኤፍራታ ቅድስት ማርያም',
  om: 'Jimmaa · Mantinaa · Dabra Efraataa Qulqulleettii Maariyaam',
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
    en: { appName: 'Amdehayimanot', ourStory: 'Our Story', pageTitle: 'About Amdehayimanot Sunday School', pageDescription: "Learn about the history, vision, mission, and core values of Amdehayimanot Sunday School at Jimma Debre Ephrata St. Mary Cathedral. Founded in Ginbot 1964 E.C., we serve children, youth, and adults in spiritual education.", pageSubtitle: 'History, Vision, Mission & Values', historyTitle: 'Our History', historyShort: 'Amde Haymanot Sunday School of Jimma Debre Ephrata St. Mary Cathedral was founded in Ginbot 1964 E.C. It began through the initiative of a few deacons and youth in the parish under the name “Youth Spiritual Association.”', historyFull: [ 'Members met twice a week on Saturday and Sunday to study the Gospel, practice hymns and artistic programs, and present them to the faithful as their first ministry.', 'Today it stands among the leading Sunday schools in Jimma City, embracing children, adolescents, youth, and adults with diverse spiritual services.', 'Its address is in Mantina Kebele, at the center of Jimma City, Jimma Zone, Oromia National Regional State.' ], learnMore: 'Read Full History', showLess: 'Show Less', missionTitle: 'Vision, Mission & Aims', missionSubtitle: 'Our vision is to see a wise generation formed—holding firm faith and exemplary character that honors and upholds the Church’s dogma, canon, and tradition handed down by the holy fathers, and that qualifies them to inherit the Kingdom of Heaven we hope for.', missionP1: 'Based on the word in Matthew 28:19, our mission is to see that all people are baptized in the name of the Father, the Son, and the Holy Spirit, and become followers of Christ.', missionAim: 'Our aims:', missionPoints: [ 'To keep and preserve the dogma and canon of the Church.', 'To learn and teach holistic Church education that qualifies one for the Kingdom of Heaven.', 'To contribute the spiritual and human prosperity the Church should bring to the nation and society.', 'To raise youth and children in Orthodox Tewahedo faith and Christian virtue, forming a steadfast spiritual generation ready to receive and serve the Church of tomorrow.' ], nameMeaningTitle: 'Meaning of the Name', nameMeaningIntro: 'The name “Amde Haymanot” clearly reflects the spiritual foundation and purpose of our institution:', nameMeaningItems: [ { title: 'Amde (Pillar)', description: 'A pillar is the main support that keeps a great building from falling. Likewise, Christian life stands firm and unshaken amid storms and trials when it is founded on the Word of God.' }, { title: 'Haymanot (Faith)', description: 'It is our steadfast relationship with our Creator, the love of Christ revealed on the Cross, and the path of truth on which we place all our hope.' }, { title: 'Amde Haymanot Sunday School', description: 'A spiritual center that helps youth and children stand firm in the teaching of Christ Jesus and the faith of the Orthodox Church—strengthened like a pillar—and that refines their faith through knowledge and good works.' } ], valuesTitle: 'Our Values', valuesIntro: 'These foundational values are not mere word arrangements; they are the principles of our daily life:', values: [ { icon: <GavelIcon />, title: 'Faith', description: 'Living belief—not in words alone. It is our firm stance that keeps the pure, non-negotiable dogma and canon taught by the Holy Church, accompanied by good works.' }, { icon: <Favorite />, title: 'Love', description: 'The pillar of our Christian life: loving God with a perfect heart and, in practice, loving every person as ourselves—without distinction of race, appearance, or status.' }, { icon: <VolunteerActivism />, title: 'Compassion', description: 'Compassion is how we turn faith into life, flowing from pure Christian love. As our Lord taught, “Inasmuch as you did it to one of the least of these, you did it to Me” (Matthew 25:40), we see Christ in our needy and afflicted neighbors. Guided by the six Gospel words of mercy, we feed the hungry, clothe the naked, comfort the sorrowful, and visit the sick—reflecting God’s kindness to the world.' }, { icon: <School />, title: 'Education', description: 'Standing on a firm foundation that false teachings cannot shake. As the Apostle says, “Continue in what you have learned,” we unite spiritual wisdom with the knowledge of our time—protecting a generation from error and enlightening the mind.' }, { icon: <Handshake />, title: 'Humility', description: 'Following the example of our holy fathers and mothers: living sincerely with a humble spirit.' }, { icon: <Church />, title: 'Service', description: 'Sincere service to the Church and society—ready to serve without pride, saying after fulfilling our spiritual duty, “We are unprofitable servants.”' }, { icon: <Book />, title: 'Holy Communion', description: 'The Christian order by which we renew spiritual life: keeping from sin, cleansing through repentance, and receiving Holy Communion.' } ], leadershipTitle: 'Our Leadership', leaderName: 'Deacon Eyob Zewdu', leaderRole: 'Chairman of the Sunday School', leaderQuote: 'but God gave the growth. — 1 Corinthians 3:6', ctaTitle: 'Ready to Join Our Community?', ctaSubtitle: 'Explore our classes and events to see how your child can grow in faith and fellowship with us.', ctaButton: 'Explore Our Classes', },

    am: { appName: 'ዓምደሃይማኖት', ourStory: 'ታሪካችን', pageTitle: 'ስለ ዓምደሃይማኖት ሰንበት ትምህርት ቤት', pageDescription: 'ስለ ጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ታሪክ፣ ራዕይ፣ ተልዕኮ እና እሴቶች ይወቁ። በግንቦት ወር 1964 ዓ.ም ተመሠረተ።', pageSubtitle: 'ታሪክ፣ ራዕይ፣ ተልዕኮና እሴት', historyTitle: 'ታሪካችን', historyShort: 'የጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት በግንቦት ወር 1964 ዓ.ም ተመሠረተ። በመጀመሪያ በደብሩ ውስጥ በሚገኙ ጥቂት ዲያቆናትና ወጣቶች አነሳሽነት "የወጣቶች መንፈሳዊ ማህበር" በሚል ስያሜ ተጀመረ።', historyFull: [ 'አባላቱ በሳምንት ሁለት ቀን ቅዳሜ እና እሑድ እየተገናኙ ትምህርተ ወንጌል በመማማር፣ ዝማሬዎችንና ኪነ ጥበባዊ መርሐ ግብሮችን በማጥናት ለምዕመናን በማቅረብ አገልግሎቱን ጀምረዋል።', 'በአሁኑ ሰዓት ጅማ ከተማ ላይ ካሉ ግንባር ቀደም ሰንበት ትምህርት ቤቶች መካከል አንዱ ሆኗል። ይህ ሰንበት ትምህርት ቤት በውስጡ ህጻናትን፣ አዳጊዎችን፣ ወጣቶችንና ጎልማሶችን አቅፎ ልዩ ልዩ መንፈሳዊ አገልግሎቶችን እየሰጠ ይገኛል።', 'አድራሻው በኦሮሚያ ብሔራዊ ክልላዊ መንግስት በጅማ ዞን በጅማ ከተማ መሃል ከተማ መንቲና ቀበሌ ይገኛል።' ], learnMore: 'ሙሉውን ታሪክ ያንብቡ', showLess: 'በአጭሩ አሳይ', missionTitle: 'ራዕይ፣ ተልዕኮና ዓላማ', missionSubtitle: 'ቅዱሳን አባቶች ጠብቀው ያስረከቡንን የቤተ ክርስቲያን ዶግማ፣ ቀኖና እና ትውፊት አክብሮና አስከብሮ ተስፋ የምናደርገውን መንግስተ ሰማያት ለመውረስ የሚያበቃ የጸና ሃይማኖትና ምሳሌ የሆነ ምግባር ይዞ የሚገኝ ጥበበኛ ትውልድ ተፈጥሮ ማየት ነው።', missionP1: 'በማቴዎስ 28፥19 ያለውን ቃል መሠረት በማድረግ ሰዎችን ሁሉ በአብ፣ በወልድና በመንፈስ ቅዱስ ስም እንዲጠመቁ እና የክርስቶስ ተከታዮች እንዲሆኑ ማድረግ ነው።', missionAim: 'ዓላማዎቻችን፡', missionPoints: [ 'የቤተ ክርስቲያኒቱን ዶግማ እና ቀኖና ጠብቆ ማስጠበቅ።', 'ለመንግስተ ሰማያት የሚያበቃ ሁለንተናዊ የቤተ ክርስቲያን ትምህርት መማር እና ማስተማር።', 'ቤተ ክርስቲያን ለሀገር እና ለማህበረሰቡ መንፈሳዊና ሰብዓዊ ብልጽግና ልትወጣ የሚገባትን አስተዋጽኦ ማበርከት።', 'ወጣቶችና ሕፃናትን በኦርቶዶክሳዊት ተዋሕዶ እምነትና በክርስቲያናዊ በጎ ምግባር አንጾ በማሳደግ፣ ነገ ቤተ ክርስቲያንን በብቃት የሚረከብና የሚያገለግል ጽኑ መንፈሳዊ ትውልድ ማፍራት።' ], nameMeaningTitle: 'የስያሜው ትርጉም', nameMeaningIntro: '"ዓምደ ሃይማኖት" የሚለው ስያሜያችን የተቋማችንን መንፈሳዊ መሠረትና ዓላማ በግልጽ ያንጸባርቃል፦', nameMeaningItems: [ { title: 'ዓምድ (ምሶሶ)', description: 'ማንኛውም ትልቅ ሕንጻ እንዳይፈርስ ደግፎ የሚያቆመው ዋናው መሠረቱ ምሶሶ (ዓምድ) ነው። የክርስቲያናዊ ሕይወታችንም ማዕበልና ፈተና ሲገጥመው የማይናወጠውና ጸንቶ የሚቆመው በእግዚአብሔር ቃል ላይ ሲመሠረት ነው።' }, { title: 'ሃይማኖት', description: 'ከፈጣሪያችን ጋር ያለን ጽኑ ግንኙነት፣ በመስቀል ላይ የተገለጠው የክርስቶስ ፍቅር፣ እና ተስፋችንን ሁሉ የጣልንበት የእውነት መንገድ ነው።' }, { title: 'ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት', description: 'ወጣቶችና ሕፃናት በክርስቶስ ኢየሱስ አስተምህሮና በኦርቶዶክሳዊት ቤተ ክርስቲያን እምነት ላይ ጸንተው እንዲቆሙ (እንደ ዓምድ እንዲጠነክሩ) የሚያደርግ፣ እምነታቸውን በዕውቀትና በምግባር የሚያንጽ መንፈሳዊ ማዕከል ማለት ነው።' } ], valuesTitle: 'እሴቶቻችን', valuesIntro: 'እነዚህ መሠረታዊ እሴቶቻችን የቃላት ድርደራ ብቻ ሳይሆኑ፣ የዕለት ተዕለት የሕይወት መርሆዎቻችን ናቸው፦', values: [ { icon: <GavelIcon />, title: 'ሃይማኖት', description: 'እምነትን በቃል ብቻ ሳይሆን በሕይወት መኖር ነው። ቅድስት ቤተ ክርስቲያን ያስተማረችንን ንጹሕና የማንደራደርበትን ዶግማና ቀኖና ጠብቆ፣ በበጎ ምግባር ታጅቦ የሚገለጥ ጽኑ አቋማችን ነው።' }, { icon: <Favorite />, title: 'ፍቅር', description: 'የክርስቲያናዊ ሕይወታችን ማገር ነው። ፍጹም በሆነ ልብ እግዚአብሔርን መውደድ እና ሰውን ሁሉ (ዘር፣ መልክ፣ ወይም ደረጃ ሳይለዩ) እንደ ራስ አድርጎ ማፍቀርን በተግባር የምናሳይበት እሴታችን ነው።' }, { icon: <VolunteerActivism />, title: 'ርኅራኄ', description: 'ርኅራኄ ለእኛ ከንጹሕ የክርስቲያን ፍቅር የሚመነጭ፣ እምነትን ወደ ሕይወት የምንቀይርበት የተግባር መገለጫችን ነው። ጌታችን “ከእነዚህ ከታናናሾቹ ለአንዱ ስላደረጋችሁት ለእኔ አደረጋችሁት” (ማቴ 25፥40) ብሎ ባስተማረው መሠረት፣ በተቸገሩትና በታረዙት ወገኖቻችን ውስጥ ክርስቶስን እናያለን። በመሆኑም ስድስቱን ቃላተ ወንጌል የዕለት ተዕለት የሕይወታችን መመሪያ በማድረግ፤ የተራቡትን በማብላት፣ የታረዙትን በማልበስ፣ ያዘኑትን በማጽናናት እንዲሁም የታመሙትን በመጠየቅ የአምላካችንን ቸርነት ለዓለም የምናንጸባርቅበት ጥልቅ የመንፈስ ፍሬ ነው።' }, { icon: <School />, title: 'ትምህርት', description: 'ሐሰተኛ ትምህርቶች በማይነቀንቁት ጽኑ መሠረት ላይ መቆም ነው። "ከማን እንደተማርክ ታውቃለህና ጽና" በሚለው የሐዋርያው ቃል መሠረት፣ መንፈሳዊውን ጥበብ ከዘመኑ ዕውቀት ጋር አዋህደን፣ ትውልድን ከስህተት የምንጠብቅበትና አእምሮን የምናበራበት ብርሃናችን ነው።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'የቅዱሳን አባቶቻችንንና እናቶቻችንን አርዓያነት በመከተል፣ ራስን ዝቅ አድርጎ በቅንነት የመኖር ክርስቲያናዊ መገለጫችን ነው።' }, { icon: <Church />, title: 'አገልግሎት', description: 'ለቤተ ክርስቲያንና ለማኅበረሰቡ የምንሰጠው ቅን አገልጋይነት ሲሆን፤ ይህም የተሰጠንን መንፈሳዊ ሓላፊነት ከፈጸምን በኋላ "የማንጠቅም ባሪያዎች ነን" በማለት ያለ ትዕቢት የምናገለግልበት ዝግጁነት ነው።' }, { icon: <Book />, title: 'ሥጋ ወደሙ', description: 'ዘወትር ከኃጢአት ርቆ በንስሐ በመታጠብና ቅዱስ ቁርባንን በመቀበል መንፈሳዊ ሕይወታችንን የምናድስበት የክርስቲያን ሥርዓት ነው።' } ], leadershipTitle: 'የሰንበት ትምህርት ቤቱ ሰብሳቢ', leaderName: 'ዲያቆን ኢዮብ ዘውዱ', leaderRole: 'የሰንበት ትምህርት ቤቱ ሰብሳቢ', leaderQuote: 'ነገር ግን እግዚአብሔር ያሳድግ ነበር። — 1ኛ ቆሮንቶስ 3:6', ctaTitle: 'የማህበረሰባችን አካል ለመሆን ዝግጁ ኖት?', ctaSubtitle: 'ልጅዎ በእምነትና በኅብረት ከእኛ ጋር እንዴት እንደሚያድግ ለማየት ክፍሎቻችንንና ዝግጅቶቻችንን ይጎብኙ።', ctaButton: 'ክፍሎቻችንን ያስሱ', },

    ti: { appName: 'ዓምደሃይማኖት', ourStory: 'ዛንታና', pageTitle: 'ብዛዕባ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት', pageDescription: "ብዛዕባ ታሪኽ፡ ራእይ፡ ተልእኾን ቀንዲ ክብርታትን ናይ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ኣብ ካቴድራል ቅድስት ማርያም ጅማ ደብረ ኤፍራታ ተማሃሩ። ኣብ ግንቦት 1964 ዓ.ም. ተመስሪቱ፡ ንህጻናት፡ መንእሰያትን ዓበይትን መንፈሳዊ ትምህርቲ ይህብ።", pageSubtitle: 'ታሪኽ፣ ራእይ፣ ተልእኾን ክብርታትን', historyTitle: 'ታሪኽና', historyShort: 'ቤት ትምህርቲ ሰንበት ዓምደ ሃይማኖት ናይ ካቴድራል ቅድስት ማርያም ጅማ ደብረ ኤፍራታ ኣብ ግንቦት 1964 ዓ.ም. ተመስሪቱ። ብተበግሶ ገለ ዲያቆናትን መንእሰያትን ኣብቲ ደብሪ ብስም “መንፈሳዊ ማሕበር መንእሰያት” ተጀሚሩ።', historyFull: [ 'ኣባላት ኣብ ሰሙን ክልተ መዓልቲ ቅዳሜን ሰንበትን ይራኸቡ ነይሮም፡ ትምህርተ ወንጌል ይምሃሩ፡ መዛሙርን ኪነ-ጥበባዊ መደባትን ይለማመዱ፡ ንምእመናን ከም ቀዳማይ ኣገልግሎቶም የቕርቡ።', 'ሎሚ ኣብ ከተማ ጅማ ካብቶም ቀንዲ ኣብያተ ትምህርቲ ሰንበት ሓደ ኮይኑ፡ ህጻናት፡ መንእሰያት፡ ዕድመ-መንእሰያትን ዓበይትን ብዝተፈላለየ መንፈሳዊ ኣገልግሎት የቕፍ።', 'ኣድራሻኡ ኣብ መንቲና ቀበሌ፡ ማእከል ከተማ ጅማ፡ ዞባ ጅማ፡ ክልል ኦሮሚያ ይርከብ።' ], learnMore: 'ሙሉእ ታሪኽ ኣንብብ', showLess: 'ኣሕጽር ኣቢልካ ኣርእይ', missionTitle: 'ራእይ፣ ተልእኾን ዕላማታትን', missionSubtitle: 'ራእይና፡ ብጽኑዕ እምነትን ኣብነታዊ ጠባይን ዝሓዘ፡ ዶግማ፡ ቀኖናን ትውፊትን ቤተ ክርስቲያን ብቅዱሳን ኣቦታት ዝተረከበ ዘኽብርን ዘሕልውን፡ ንመንግስተ ሰማያት ንምውራስ ዘብቅዕ ለባም ወለዶ ምርኣይ እዩ።', missionP1: 'ብቃል ማቴዎስ 28፡19 መሰረት፡ ተልእኾና ኵሎም ሰባት ብስም ኣብ፡ ወልድን መንፈስ ቅዱስን ክጥመቑን ተኸተልቲ ክርስቶስ ክኾኑን ምግባር እዩ።', missionAim: 'ዕላማታትና፡', missionPoints: [ 'ዶግማን ቀኖናን ቤተ ክርስቲያን ምሕላውን ምኽላልን።', 'ንመንግስተ ሰማያት ዘብቅዕ ሁለንተናዊ ትምህርቲ ቤተ ክርስቲያን ምምሃርን ምሃብን።', 'ቤተ ክርስቲያን ንሃገርን ማሕበረሰብን ከተብጽሖ ዝግባእ መንፈሳውን ሰብኣውን ብልጽግና ኣበርክቶ ምግባር።', 'መንእሰያትን ህጻናትን ብኦርቶዶክሳዊት ተዋሕዶ እምነትን ክርስትያናዊ ጽቡቕ ስነ-ምግባርን ምዕባይ፡ ንጽባሕ ቤተ ክርስቲያን ክትቅበልን ክትገልግልን ዝኽእል ጽኑዕ መንፈሳዊ ወለዶ ምፍራይ።' ], nameMeaningTitle: 'ትርጉም ስም', nameMeaningIntro: 'እቲ ስም “ዓምደ ሃይማኖት” ንመንፈሳዊ መሰረትን ዕላማን ትካልና ብንጹር የንጸባርቕ፦', nameMeaningItems: [ { title: 'ዓምድ (ምሶሶ)', description: 'ዓምድ ነቲ ዓብዪ ህንጻ ክወድቕ ዘይገብር ቀንዲ ደገፍ እዩ። ከምኡ ድማ ክርስትያናዊ ህይወት ኣብ ማዕበልን ፈተናን ኣብ ቃል እግዚኣብሔር ምስ ተመስረተ ጽኑዕን ዘይናውጽን ይቕጽል።' }, { title: 'ሃይማኖት', description: 'ምስ ፈጣሪና ዘለና ጽኑዕ ርክብ፡ ኣብ መስቀል ዝተገልጸ ፍቕሪ ክርስቶስ፡ ከምኡ\'ውን ኵሉ ተስፋና ዘንበርናሉ መንገዲ ሓቂ እዩ።' }, { title: 'ቤት ትምህርቲ ሰንበት ዓምደ ሃይማኖት', description: 'መንእሰያትን ህጻናትን ኣብ ትምህርቲ ክርስቶስ ኢየሱስን ኣብ እምነት ኦርቶዶክሳዊት ቤተ ክርስቲያንን ጽኑዓት ክቕመጡ—ከም ዓምድ ክጽንዑ—ዝሕግዝ፡ እምነቶም ብፍልጠትን ብጽቡቕ ግብርን ዘንጽህ መንፈሳዊ ማእከል እዩ።' } ], valuesTitle: 'ክብርታትና', valuesIntro: 'እዞም መሰረታውያን ክብርታት ቃላት ጥራይ ኣይኮኑን፤ መትከላት ናይ መዓልታዊ ህይወትና እዮም፦', values: [ { icon: <GavelIcon />, title: 'እምነት', description: 'ብቃል ጥራይ ዘይኮነ ብህይወት ዝንበር እምነት። ነቲ ቅድስቲ ቤተ ክርስቲያን ዘምህረቶ ንጹህን ዘይድራደር ዶግማን ቀኖናን ዝሕሉ፡ ብጽቡቕ ግብሪ ዝተሰየመ ጽኑዕ ኣቋምና እዩ።' }, { icon: <Favorite />, title: 'ፍቕሪ', description: 'ዓምድ ክርስትያናዊ ህይወትና፡ ብፍጹም ልቢ ኣምላኽ ምፍቓር፡ ኣብ ተግባር ከኣ ነፍሲ ወከፍ ሰብ—ብዘርኢ፡ ብመልክዕ፡ ወይ ብደረጃ ከይፈለጥና—ከም ነብስና ምፍቓር።' }, { icon: <VolunteerActivism />, title: 'ርህራሀ', description: 'ርህራሀ እምነት ናብ ህይወት እንቀይረሉ መገዲ እዩ፡ ካብ ንጹህ ክርስትያናዊ ፍቕሪ ይውሕዝ። ከምቲ ጐይታና ዝመሃረ፡ “ንሓደ ካብዞም ዝነኣሱ ስለ ዝገበርኩምለይ፡ ንኣይ ገይርኩምለይ” (ማቴዎስ 25፡40)፡ ኣብ ዝተጸገሙን ዝተሳቐዩን ጐረባብትና ክርስቶስ ንርኢ። ብስድስቱ ቃላተ ምሕረት ወንጌል ተመሪሕና፡ ጥሙያት ነብልዕ፡ ዕሩቓት ነልብስ፡ ዘሕዘኑ ነጽንዕ፡ ሕሙማት ንበጽሕ—ንጽጋዕ እግዚኣብሔር ንዓለም ነንጸባርቕ።' }, { icon: <School />, title: 'ትምህርቲ', description: 'ሓሰውቲ ትምህርቲ ዘይነቕንቕዎ ጽኑዕ መሰረት ላዕሊ ምቕማጥ። ከምቲ ሃዋርያ ዝብል፡ “ኣብቲ ዝተማሃርካዮ ጽናሕ፡” መንፈሳዊ ጥበብ ምስ ፍልጠት ዘመንና እናኣዋሐድና፡ ወለዶ ካብ ስሕተት ንከላኸልን ኣእምሮ ንብርህን።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'ኣብነት ቅዱሳን ኣቦታትናን ኣዴታትናን ምስዓብ፡ ብትሑት መንፈስ ብቅንዕና ምንባር።' }, { icon: <Church />, title: 'ኣገልግሎት', description: 'ንቤተ ክርስቲያንን ማሕበረሰብን ቅንዕ ኣገልግሎት—ድሕሪ መንፈሳዊ ግቡእና ምፍጻም “ዘይጠቕሙ ባሮት ኢና” እናበልና ብዘይ ትዕቢት ንምግልጋል ዝድለይ።' }, { icon: <Book />, title: 'ቁርባን', description: 'መንፈሳዊ ህይወት እንሐድሰሉ ክርስትያናዊ ስርዓት፡ ካብ ሓጢኣት ምርሓቕ፡ ብንስሓ ምጽራይ፡ ቅዱስ ቁርባን ምቕባል።' } ], leadershipTitle: 'መሪሕነትና', leaderName: 'ዲያቆን ኢዮብ ዘውዱ', leaderRole: 'ሰብሳቢ ቤት ትምህርቲ ሰንበት', leaderQuote: 'ነገር ግን እግዚኣብሔር እዩ ዘዕብዮ። — 1ይ ቆሮንቶስ 3፡6', ctaTitle: 'ኣባል ማሕበረሰብና ክትከውን ድልዊ ዲኻ?', ctaSubtitle: 'ውሉድኩም ብእምነትን ሕብረትን ምሳና ከመይ ከም ዝዓቢ ንምርኣይ፡ ክፍለ-ትምህርትታትናን ፍጻሜታትናን መርምሩ።', ctaButton: 'ክፍለ-ትምህርትታትና መርምሩ', },

    om: { appName: 'Amdehayimanot', ourStory: 'Seenaa Keenya', pageTitle: 'Waa\'ee Mana Barumsaa Dilbataa Amdehayimanot', pageDescription: "Seenaa, mul\'ata, ergama, fi duudhaalee bu\'uuraa Mana Barumsaa Dilbataa Amdehayimanot kan Katidiraalii Qulqulleettii Maariyaam Jimmaa Dabra Efraataa baradhaa. Ginboot 1964 A.L. hundeeffame; daa\'imman, dargaggoota, fi ga\'eessotaaf barnoota hafuuraa kenna.", pageSubtitle: 'Seenaa, Mul\'ata, Ergamaa fi Duudhaalee', historyTitle: 'Seenaa Keenya', historyShort: 'Manni Barumsaa Dilbataa Amde Haymanot kan Katidiraalii Qulqulleettii Maariyaam Jimmaa Dabra Efraataa Ginboot 1964 A.L. hundeeffame. Jalqaba diyaaqonoota fi dargaggoota muraasa waldaa keessatti “Waldaa Hafuuraa Dargaggootaa” jedhamuun eegale.', historyFull: [ 'Miseensonni torbanitti guyyaa lama Sanbataa fi Dilbataa walitti dhufanii Wangeela baratu, faaruufi sagantaa aartii shaakaluu fi amantootatti akka tajaajila jalqabaatti dhiyeessu.', 'Har\'a Magaalaa Jimmaa keessatti manneen barumsaa dilbataa duraa keessaa tokko ta\'ee, daa\'imman, dargaggoota, fi ga\'eessota tajaajila hafuuraa adda addaa kennuun hammata.', 'Teessoon isaa Kebele Mantinaa, giddu-galeessa Magaalaa Jimmaa, Godina Jimmaa, Naannoo Oromiyaa keessa jira.' ], learnMore: 'Seenaa Guutuu Dubbisi', showLess: 'Gabaabsi', missionTitle: 'Mul\'ata, Ergamaa fi Kaayyoo', missionSubtitle: 'Mul\'anni keenya dhaloota ogummaa qabu arguu dha—amantaa cimaa fi amala fakkeenya ta\'e kan dogmaa, qajeelfama, fi duudhaa Waldaa abbootii qulqullootaatiin dabarfame kabajuufi tiksu, kan Mootummaa Samii abdii keenya ta\'e dhaaluuf isaan gahu.', missionP1: 'Jecha Maatewos 28:19 irratti hundaa\'uun, ergamni keenya namoonni hundi maqaa Abbaa, Ilmaa, fi Hafuura Qulqulluutiin cuuphamuu fi hordoftoota Kiristoos ta\'uu isaanii arguu dha.', missionAim: 'Kaayyoon keenya:', missionPoints: [ 'Dogmaa fi qajeelfama Waldaa tiksuu fi eegu.', 'Barnoota Waldaa guutuu kan Mootummaa Samiitiif nama geessu barachuu fi barsiisuu.', 'Badhaadhina hafuuraa fi namoomaa Waldaan biyyaafi hawaasaaf fiduu qabu gumaachuu.', 'Dargaggootaafi daa\'imman amantaa Ortodoksii Tewaahidoofi naamusaa Kiristiyaanummaa keessatti guddisuun, dhaloota hafuuraa cimaa bor Waldaa fudhachuufi tajaajiluuf qophaa\'e uumuu.' ], nameMeaningTitle: 'Hiika Maqaa', nameMeaningIntro: 'Maqaan “Amde Haymanot” bu\'uuraafi kaayyoo hafuuraa dhaabbata keenya ifatti mul\'isa:', nameMeaningItems: [ { title: 'Amde (Tuuta / Pillar)', description: 'Tuutni deeggarsa guddaa ijaarsa guddaa akka hin kufne taasisa. Akkasumas jireenyi Kiristiyaanaa yeroo gufuu fi qorannoo keessatti, yoo jecha Waaqayyoo irratti hundaa\'e, cimaa fi hin raafamne ta\'a.' }, { title: 'Haymanot (Amantaa)', description: 'Hariiroo keenya cimaa Uumaa keenya wajjin, jaalala Kiristoos fannoo irratti mul\'ate, fi karaa dhugaa abdii keenya hunda irratti kennetti.' }, { title: 'Mana Barumsaa Dilbataa Amde Haymanot', description: 'Giddugaleessa hafuuraa dargaggootaafi daa\'imman barsiisa Kiristoos Yesuusifi amantaa Waldaa Ortodoksii irratti akka ciman—akka tuutatti akka jabaatan—gargaaru, amantaa isaanii beekumsafi gocha gaariidhaan qulqulleessu.' } ], valuesTitle: 'Duudhaalee Keenya', valuesIntro: 'Duudhaaleen bu\'uuraa kun qindaa\'ina jechootaa qofa miti; akeekota jireenya keenya guyyaa guyyaa ti:', values: [ { icon: <GavelIcon />, title: 'Amantaa', description: 'Amantaa jireenyatti jiraatu—jecha qofa miti. Dogmaa fi qajeelfama qulqulluu Waldaan barsiifame hin mari\'atamne tiksuun, gocha gaariidhaan waliin, dhaabbannoo keenya cimaa dha.' }, { icon: <Favorite />, title: 'Jaalala', description: 'Tuuta jireenya keenya Kiristiyaanaa: Waaqayyo onnee guutuudhaan jaalachuu, hojiirrattis namoota hunda—sanyii, bifa, ykn sadarkaa malee—akka ofitti jaalachuu.' }, { icon: <VolunteerActivism />, title: 'Garaa Laafina', description: 'Garaa laafinni amantaa gara jireenyatti jijjiirruu keenyati, jaalala Kiristiyaanaa qulqulluu irraa yaa\'a. Akkuma Gooftaan keenya barsiise, “Isa xixiqqoo kana keessaa tokkoof waan gootan naaf gootaniittu” (Maatewos 25:40), ollaa keenya hiyyeessotaafi rakkatoota keessatti Kiristoos argina. Jechoota Wangeelaa ja\'an garaa laafinaatiin qajeelfamannee, beela\'ota nyaachifna, qaawwa uffisna, gaddaa\'ota jajjabeessina, dhukkubsatoota daawwanna—gaarummaa Waaqayyoo addunyaatti mul\'ifna.' }, { icon: <School />, title: 'Barnoota', description: 'Bu\'uura cimaa barsiisonni sobaa hin raasne irratti dhaabbachuu. Akkuma Ergamtoonni jedhan, “Waan baratte keessatti itti fufi,” ogummaa hafuuraa beekumsa yeroo keenya wajjin walitti makuun—dhaloota dogoggora irraa eeguufi sammuu ifsuu dha.' }, { icon: <Handshake />, title: 'Gad-of-deebisuu', description: 'Fakkeenya abbootii fi haadholii qulqullootaa hordofuun: hafuura gad-of-deebisuudhaan qulqullinaan jiraachuu.' }, { icon: <Church />, title: 'Tajaajila', description: 'Tajaajila qajeelaa Waldaafi hawaasaaf—hojii hafuuraa keenya erga xumurreen booda “Tajaajiltoota hin fayyanne dha” jennee of-jajjabeessuu malee tajaajiluuf qophaa\'uu.' }, { icon: <Book />, title: 'Qulqulleettii Qurbanaa', description: 'Sirna Kiristiyaanaa jireenya hafuuraa ittiin haaromsinu: cubbuu irraa fagaachuu, gaabbiiin of qulqulleessuu, Qulqulleettii Qurbaanaa fudhachuu.' } ], leadershipTitle: 'Hoggansa Keenya', leaderName: 'Diyaaqon Iyyoob Zawduu', leaderRole: 'Dura Taa\'aa Mana Barumsaa Dilbataa', leaderQuote: 'garuu Waaqayyoon guddiseera. — 1 Qorontos 3:6', ctaTitle: 'Hawaasa Keenyaatti Dabalamuuf Qophiidhaa?', ctaSubtitle: 'Ijoolleen keessan amantaa fi walitti dhufeenyaan nu wajjin akkamitti akka guddatan arguuf kutaa barnootaa fi sagantaawwan keenya daawwadhaa.', ctaButton: 'Kutaa Barnootaa Keenya Daawwadhaa', },

    es: { appName: 'Amdehayimanot', ourStory: 'Nuestra Historia', pageTitle: 'Sobre la Escuela Dominical Amdehayimanot', pageDescription: "Conozca la historia, visión, misión y valores fundamentales de la Escuela Dominical Amdehayimanot en la Catedral de Santa María de Jimma Debre Ephrata. Fundada en Ginbot 1964 E.C., servimos a niños, jóvenes y adultos en la educación espiritual.", pageSubtitle: 'Historia, Visión, Misión y Valores', historyTitle: 'Nuestra Historia', historyShort: 'La Escuela Dominical Amde Haymanot de la Catedral de Santa María de Jimma Debre Ephrata fue fundada en Ginbot 1964 E.C. Comenzó por iniciativa de unos pocos diáconos y jóvenes de la parroquia bajo el nombre de “Asociación Espiritual de Jóvenes.”', historyFull: [ 'Los miembros se reunían dos veces por semana, el sábado y el domingo, para estudiar el Evangelio, practicar himnos y programas artísticos, y presentarlos a los fieles como su primer ministerio.', 'Hoy se cuenta entre las escuelas dominicales principales de la ciudad de Jimma, acogiendo a niños, adolescentes, jóvenes y adultos con diversos servicios espirituales.', 'Su dirección está en Mantina Kebele, en el centro de la ciudad de Jimma, Zona de Jimma, Estado Regional Nacional de Oromía.' ], learnMore: 'Leer Historia Completa', showLess: 'Mostrar Menos', missionTitle: 'Visión, Misión y Objetivos', missionSubtitle: 'Nuestra visión es ver una generación sabia formada—con fe firme y carácter ejemplar que honra y sostiene el dogma, el canon y la tradición de la Iglesia transmitidos por los santos padres, y que los capacita para heredar el Reino de los Cielos que esperamos.', missionP1: 'Basados en la palabra de Mateo 28:19, nuestra misión es ver que todas las personas sean bautizadas en el nombre del Padre, del Hijo y del Espíritu Santo, y se conviertan en seguidores de Cristo.', missionAim: 'Nuestros objetivos:', missionPoints: [ 'Guardar y preservar el dogma y el canon de la Iglesia.', 'Aprender y enseñar una educación eclesial integral que capacite para el Reino de los Cielos.', 'Contribuir a la prosperidad espiritual y humana que la Iglesia debe aportar a la nación y a la sociedad.', 'Criar a jóvenes y niños en la fe ortodoxa Tewahedo y en la virtud cristiana, formando una generación espiritual firme lista para recibir y servir a la Iglesia del mañana.' ], nameMeaningTitle: 'Significado del Nombre', nameMeaningIntro: 'El nombre “Amde Haymanot” refleja claramente el fundamento espiritual y el propósito de nuestra institución:', nameMeaningItems: [ { title: 'Amde (Pilar)', description: 'Un pilar es el soporte principal que impide que un gran edificio caiga. Asimismo, la vida cristiana permanece firme e inquebrantable en medio de tormentas y pruebas cuando se funda en la Palabra de Dios.' }, { title: 'Haymanot (Fe)', description: 'Es nuestra relación firme con nuestro Creador, el amor de Cristo revelado en la Cruz, y el camino de la verdad en el que depositamos toda nuestra esperanza.' }, { title: 'Escuela Dominical Amde Haymanot', description: 'Un centro espiritual que ayuda a jóvenes y niños a permanecer firmes en la enseñanza de Cristo Jesús y en la fe de la Iglesia Ortodoxa—fortalecidos como un pilar—y que refina su fe mediante el conocimiento y las buenas obras.' } ], valuesTitle: 'Nuestros Valores', valuesIntro: 'Estos valores fundamentales no son meras palabras; son los principios de nuestra vida diaria:', values: [ { icon: <GavelIcon />, title: 'Fe', description: 'Creencia vivida—no solo en palabras. Es nuestra postura firme que guarda el dogma y el canon puros e innegociables enseñados por la Santa Iglesia, acompañados de buenas obras.' }, { icon: <Favorite />, title: 'Amor', description: 'El pilar de nuestra vida cristiana: amar a Dios con un corazón perfecto y, en la práctica, amar a toda persona como a nosotros mismos—sin distinción de raza, apariencia o condición.' }, { icon: <VolunteerActivism />, title: 'Compasión', description: 'La compasión es cómo convertimos la fe en vida, brotando del amor cristiano puro. Como enseñó nuestro Señor: “En cuanto lo hicisteis a uno de estos mis hermanos más pequeños, a mí lo hicisteis” (Mateo 25:40), vemos a Cristo en nuestros vecinos necesitados y afligidos. Guiados por las seis palabras evangélicas de misericordia, alimentamos al hambriento, vestimos al desnudo, consolamos al afligido y visitamos al enfermo—reflejando la bondad de Dios al mundo.' }, { icon: <School />, title: 'Educación', description: 'Permanecer sobre un fundamento firme que las falsas enseñanzas no pueden sacudir. Como dice el Apóstol: “Continúa en lo que has aprendido,” unimos la sabiduría espiritual con el conocimiento de nuestro tiempo—protegiendo a una generación del error e iluminando la mente.' }, { icon: <Handshake />, title: 'Humildad', description: 'Siguiendo el ejemplo de nuestros santos padres y madres: vivir con sinceridad y espíritu humilde.' }, { icon: <Church />, title: 'Servicio', description: 'Servicio sincero a la Iglesia y a la sociedad—dispuestos a servir sin orgullo, diciendo tras cumplir nuestro deber espiritual: “Somos siervos inútiles.”' }, { icon: <Book />, title: 'Santa Comunión', description: 'El orden cristiano por el cual renovamos la vida espiritual: apartarnos del pecado, limpiarnos por el arrepentimiento y recibir la Santa Comunión.' } ], leadershipTitle: 'Nuestro Liderazgo', leaderName: 'Diácono Eyob Zewdu', leaderRole: 'Presidente de la Escuela Dominical', leaderQuote: 'pero Dios daba el crecimiento. — 1 Corintios 3:6', ctaTitle: '¿Listo para Unirte a Nuestra Comunidad?', ctaSubtitle: 'Explora nuestras clases y eventos para ver cómo tu hijo puede crecer en fe y compañerismo con nosotros.', ctaButton: 'Explora Nuestras Clases', },

    fr: { appName: 'Amdehayimanot', ourStory: 'Notre Histoire', pageTitle: 'À propos de l\'École du Dimanche Amdehayimanot', pageDescription: "Découvrez l'histoire, la vision, la mission et les valeurs fondamentales de l'École du Dimanche Amdehayimanot à la cathédrale Sainte-Marie de Jimma Debre Ephrata. Fondée en Ginbot 1964 E.C., nous servons enfants, jeunes et adultes dans l'éducation spirituelle.", pageSubtitle: 'Histoire, Vision, Mission et Valeurs', historyTitle: 'Notre Histoire', historyShort: 'L\'école du dimanche Amde Haymanot de la cathédrale Sainte-Marie de Jimma Debre Ephrata a été fondée en Ginbot 1964 E.C. Elle a commencé grâce à l\'initiative de quelques diacres et jeunes de la paroisse sous le nom d\'« Association spirituelle des jeunes ».', historyFull: [ 'Les membres se réunissaient deux fois par semaine, le samedi et le dimanche, pour étudier l\'Évangile, pratiquer les hymnes et des programmes artistiques, et les présenter aux fidèles comme leur premier ministère.', 'Aujourd\'hui, elle compte parmi les principales écoles du dimanche de la ville de Jimma, accueillant enfants, adolescents, jeunes et adultes avec divers services spirituels.', 'Son adresse se trouve à Mantina Kebele, au centre de la ville de Jimma, zone de Jimma, État régional national d\'Oromia.' ], learnMore: 'Lire l\'Histoire Complète', showLess: 'Afficher Moins', missionTitle: 'Vision, Mission et Objectifs', missionSubtitle: 'Notre vision est de voir une génération sage formée—portant une foi ferme et un caractère exemplaire qui honore et soutient le dogme, le canon et la tradition de l\'Église transmis par les saints pères, et qui les qualifie pour hériter du Royaume des Cieux que nous espérons.', missionP1: 'Sur la base de la parole de Matthieu 28:19, notre mission est de voir que tous soient baptisés au nom du Père, du Fils et du Saint-Esprit, et deviennent disciples du Christ.', missionAim: 'Nos objectifs :', missionPoints: [ 'Garder et préserver le dogme et le canon de l\'Église.', 'Apprendre et enseigner une éducation ecclésiale holistique qui qualifie pour le Royaume des Cieux.', 'Contribuer à la prospérité spirituelle et humaine que l\'Église doit apporter à la nation et à la société.', 'Élever les jeunes et les enfants dans la foi orthodoxe Tewahedo et la vertu chrétienne, formant une génération spirituelle ferme prête à recevoir et servir l\'Église de demain.' ], nameMeaningTitle: 'Signification du Nom', nameMeaningIntro: 'Le nom « Amde Haymanot » reflète clairement le fondement spirituel et le but de notre institution :', nameMeaningItems: [ { title: 'Amde (Pilier)', description: 'Un pilier est le soutien principal qui empêche un grand édifice de s\'écrouler. De même, la vie chrétienne reste ferme et inébranlable au milieu des tempêtes et des épreuves lorsqu\'elle est fondée sur la Parole de Dieu.' }, { title: 'Haymanot (Foi)', description: 'C\'est notre relation ferme avec notre Créateur, l\'amour du Christ révélé sur la Croix, et le chemin de vérité sur lequel nous plaçons toute notre espérance.' }, { title: 'École du Dimanche Amde Haymanot', description: 'Un centre spirituel qui aide les jeunes et les enfants à rester fermes dans l\'enseignement du Christ Jésus et la foi de l\'Église orthodoxe—renforcés comme un pilier—et qui affine leur foi par la connaissance et les bonnes œuvres.' } ], valuesTitle: 'Nos Valeurs', valuesIntro: 'Ces valeurs fondamentales ne sont pas de simples arrangements de mots ; ce sont les principes de notre vie quotidienne :', values: [ { icon: <GavelIcon />, title: 'Foi', description: 'Une croyance vécue—pas seulement en paroles. C\'est notre position ferme qui garde le dogme et le canon purs et non négociables enseignés par la Sainte Église, accompagnés de bonnes œuvres.' }, { icon: <Favorite />, title: 'Amour', description: 'Le pilier de notre vie chrétienne : aimer Dieu d\'un cœur parfait et, en pratique, aimer chaque personne comme nous-mêmes—sans distinction de race, d\'apparence ou de statut.' }, { icon: <VolunteerActivism />, title: 'Compassion', description: 'La compassion est la façon dont nous transformons la foi en vie, découlant de l\'amour chrétien pur. Comme notre Seigneur l\'a enseigné : « Toutes les fois que vous l\'avez fait à l\'un de ces plus petits de mes frères, c\'est à moi que vous l\'avez fait » (Matthieu 25:40), nous voyons le Christ en nos voisins nécessiteux et affligés. Guidés par les six paroles évangéliques de miséricorde, nous nourrissons les affamés, vêtons les nus, consolons les affligés et visitons les malades—reflétant la bonté de Dieu au monde.' }, { icon: <School />, title: 'Éducation', description: 'Se tenir sur un fondement ferme que les faux enseignements ne peuvent ébranler. Comme le dit l\'Apôtre : « Demeure dans ce que tu as appris, » nous unissons la sagesse spirituelle à la connaissance de notre temps—protégeant une génération de l\'erreur et éclairant l\'esprit.' }, { icon: <Handshake />, title: 'Humilité', description: 'Suivre l\'exemple de nos saints pères et mères : vivre sincèrement avec un esprit humble.' }, { icon: <Church />, title: 'Service', description: 'Un service sincère à l\'Église et à la société—prêts à servir sans orgueil, disant après avoir rempli notre devoir spirituel : « Nous sommes des serviteurs inutiles. »' }, { icon: <Book />, title: 'Sainte Communion', description: 'L\'ordre chrétien par lequel nous renouvelons la vie spirituelle : nous éloigner du péché, nous purifier par la repentance, et recevoir la Sainte Communion.' } ], leadershipTitle: 'Notre Direction', leaderName: 'Diacre Eyob Zewdu', leaderRole: 'Président de l\'École du Dimanche', leaderQuote: 'mais Dieu a fait croître. — 1 Corinthiens 3:6', ctaTitle: 'Prêt à Rejoindre Notre Communauté ?', ctaSubtitle: 'Explorez nos cours et événements pour voir comment votre enfant peut grandir dans la foi et la fraternité avec nous.', ctaButton: 'Explorez Nos Cours', },

    ar: { appName: 'عماد الإيمان', ourStory: 'قصتنا', pageTitle: 'حول مدرسة الأحد عماد الإيمان', pageDescription: "تعرّف على تاريخ ورؤية ورسالة وقيم مدرسة الأحد عماد الإيمان في كاتدرائية السيدة مريم بجِمّا دير إفراتا. تأسست في غِنْبُوت ١٩٦٤ بالتقويم الإثيوبي، ونخدم الأطفال والشباب والكبار في التعليم الروحي.", pageSubtitle: 'تاريخ، رؤية، رسالة، وقيم', historyTitle: 'تاريخنا', historyShort: 'تأسست مدرسة الأحد «عماد الإيمان» التابعة لكاتدرائية السيدة مريم في جِمّا دير إفراتا في غِنْبُوت ١٩٦٤ بالتقويم الإثيوبي. بدأت بمبادرة عدد من الشمامسة والشباب في الرعية تحت اسم «الجمعية الروحية للشباب».', historyFull: [ 'كان الأعضاء يجتمعون مرتين في الأسبوع يومي السبت والأحد لدراسة الإنجيل وممارسة الترانيم والبرامج الفنية وتقديمها للمؤمنين كخدمتهم الأولى.', 'واليوم هي من مدارس الأحد الرائدة في مدينة جِمّا، وتحتضن الأطفال والمراهقين والشباب والكبار بخدمات روحية متنوعة.', 'عنوانها في حي مانتينا، وسط مدينة جِمّا، منطقة جِمّا، ولاية أوروميا الإقليمية الوطنية.' ], learnMore: 'اقرأ التاريخ الكامل', showLess: 'عرض أقل', missionTitle: 'الرؤية والرسالة والأهداف', missionSubtitle: 'رؤيتنا أن نرى جيلاً حكيمًا يتشكّل—يحمل إيمانًا راسخًا وخلقًا مثاليًا يكرّم ويحفظ عقيدة الكنيسة وقانونها وتقليدها الذي سلّمه الآباء القديسون، ويؤهّلهم لوراثة ملكوت السموات الذي نرجوه.', missionP1: 'استنادًا إلى كلمة متى ٢٨:١٩، رسالتنا أن نرى أن جميع الناس يتعمّدون باسم الآب والابن والروح القدس ويصيرون أتباعًا للمسيح.', missionAim: 'أهدافنا:', missionPoints: [ 'حفظ عقيدة الكنيسة وقانونها والحفاظ عليهما.', 'تعلّم وتعليم تعليمٍ كنسي شامل يؤهّل لملكوت السموات.', 'المساهمة في الازدهار الروحي والإنساني الذي ينبغي على الكنيسة أن تقدّمه للوطن والمجتمع.', 'تربية الشباب والأطفال في الإيمان الأرثوذكسي التوحيدي والفضيلة المسيحية، لتكوين جيل روحي ثابت مستعد لاستقبال كنيسة الغد وخدمتها.' ], nameMeaningTitle: 'معنى الاسم', nameMeaningIntro: 'يعكس اسم «عماد الإيمان» بوضوح الأساس الروحي وغاية مؤسستنا:', nameMeaningItems: [ { title: 'عماد (عمود)', description: 'العمود هو الدعامة الرئيسة التي تمنع البناء العظيم من السقوط. وكذلك الحياة المسيحية تثبت ولا تتزعزع وسط العواصف والتجارب حين تُؤسَّس على كلمة الله.' }, { title: 'الإيمان', description: 'هو علاقتنا الراسخة بخالقنا، ومحبة المسيح المتجلية على الصليب، وطريق الحق الذي نضع عليه كل رجائنا.' }, { title: 'مدرسة الأحد عماد الإيمان', description: 'مركز روحي يساعد الشباب والأطفال على الثبات في تعليم المسيح يسوع وإيمان الكنيسة الأرثوذكسية—متقوّين كعمود—ويصفّي إيمانهم بالمعرفة والأعمال الصالحة.' } ], valuesTitle: 'قيمنا', valuesIntro: 'هذه القيم الأساسية ليست مجرد ترتيب كلمات؛ إنها مبادئ حياتنا اليومية:', values: [ { icon: <GavelIcon />, title: 'الإيمان', description: 'إيمانٌ معاش—لا بالكلام وحده. هو موقفنا الراسخ الذي يحفظ العقيدة والقانون النقيين غير القابلين للمساومة اللذين علّمتهما الكنيسة المقدسة، مقرونًا بالأعمال الصالحة.' }, { icon: <Favorite />, title: 'المحبة', description: 'عمود حياتنا المسيحية: محبة الله بقلب كامل، وفي العمل محبة كل إنسان كأنفسنا—دون تمييز في العرق أو المظهر أو المكانة.' }, { icon: <VolunteerActivism />, title: 'الرحمة', description: 'الرحمة هي كيف نحوّل الإيمان إلى حياة، تنبع من المحبة المسيحية النقية. كما علّم ربنا: «بما أنكم فعلتموه بأحد إخوتي هؤلاء الأصاغر، فبي فعلتم» (متى ٢٥:٤٠)، نرى المسيح في جيراننا المحتاجين والمتألّمين. وبهدي كلمات الرحمة الإنجيلية الست، نُطعم الجائع ونكسو العريان ونواسي الحزين ونزور المريض—عاكسين لطف الله للعالم.' }, { icon: <School />, title: 'التعليم', description: 'الوقوف على أساس راسخ لا تهزّه التعاليم الباطلة. وكما يقول الرسول: «اثبت على ما تعلّمته»، نوحّد الحكمة الروحية بمعرفة عصرنا—حماية جيل من الضلال وإنارة العقل.' }, { icon: <Handshake />, title: 'التواضع', description: 'اتباع مثال آبائنا وأمهاتنا القديسين: العيش بصدق بروح متواضعة.' }, { icon: <Church />, title: 'الخدمة', description: 'خدمة صادقة للكنيسة والمجتمع—مستعدون للخدمة بلا كبرياء، قائلين بعد أداء واجبنا الروحي: «نحن عبيد بطّالون».' }, { icon: <Book />, title: 'المناولة المقدسة', description: 'النظام المسيحي الذي نجدّد به الحياة الروحية: الابتعاد عن الخطية، والتطهير بالتوبة، وقبول المناولة المقدسة.' } ], leadershipTitle: 'قيادتنا', leaderName: 'الشماس أيوب زودو', leaderRole: 'رئيس مدرسة الأحد', leaderQuote: 'ولكن الله كان ينمي. — ١ كورنثوس ٣:٦', ctaTitle: 'هل أنت مستعد للانضمام إلى مجتمعنا؟', ctaSubtitle: 'استكشف فصولنا وفعالياتنا لترى كيف يمكن لطفلك أن ينمو في الإيمان والزمالة معنا.', ctaButton: 'استكشف فصولنا', },

    ge: { appName: 'ዓምደ ሃይማኖት', ourStory: 'ዜናነ', pageTitle: 'ስለ ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት', pageDescription: "ስለ ታሪከነ፣ ራእይነ፣ ተልእኮነ ወቁምነገርነ ዘቤት ትምህርት ሰንበት ዓምደ ሃይማኖት በካቴድራል ቅድስት ማርያም ጅማ ደብረ ኤፍራታ ተመሀሩ። በግንቦት ፲፱፻፷ወ፬ ዓ.ም. ተመሥረተ፤ ለሕፃናት፣ ለኖሎት ወለዓበይት ትምህርተ መንፈስ ንሁብ።", pageSubtitle: 'ታሪክ፣ ራእይ፣ ተልእኮ ወቁምነገር', historyTitle: 'ታሪከነ', historyShort: 'ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት ዘካቴድራል ቅድስት ማርያም ጅማ ደብረ ኤፍራታ በግንቦት ፲፱፻፷ወ፬ ዓ.ም. ተመሥረተ። በተነሳሒነ ጥቂት ዲያቆናት ወኖሎት በደብር በስመ “መንፈሳዊ ማኅበረ ኖሎት” ተጀመረ።', historyFull: [ 'አባላት በሰሙን ክልኤ ዕለተ ቅዳሜ ወእሁድ ይትራከቡ፣ ትምህርተ ወንጌል ይትመሀሩ፣ መዛሙረ ወግብረ ኪነ ጥበብ ይልምዱ፣ ወለምእመናን ከመ ቀዳሚ አገልግሎቶሙ ያቀርቡ።', 'ዮም ካብቶም ቀዳሚ ኣብያተ ትምህርት ሰንበት በጅማ ከተማ ሀሎ፣ ሕፃናት፣ ኖሎት ወዓበይት በዝተፈላለየ አገልግሎተ መንፈስ የዐቅፍ።', 'አድራሻሁ በመንቲና ቀበሌ፣ ማእከለ ከተማ ጅማ፣ ዞን ጅማ፣ ክልል ኦሮሚያ ሀሎ።' ], learnMore: 'ምንባበ ኵሉ ታሪክ', showLess: 'አሕጽር', missionTitle: 'ራእይ፣ ተልእኮ ወዓላማ', missionSubtitle: 'ራእይነ ውእቱ ምርአየ ትውልድ ጠቢብ ዘተፈጥረ—ጽኑዕ ሃይማኖት ወምግባረ ምሳሌ ዘያከብር ወዘያስከብር ዶግማ፣ ቀኖና ወትውፊተ ቤተ ክርስቲያን ዘአስረከቡ ቅዱሳን አበው፣ ወዘያበቁ ለርስዓተ መንግሥተ ሰማያት ዘንሴፎ።', missionP1: 'በቃለ ማቴዎስ ፳፰፡፲፱ መሠረት፣ ተልእኮነ ውእቱ ምርአየ ኵሉ ሰብእ ይጠመቁ በስመ አብ ወወልድ ወመንፈስ ቅዱስ፣ ወይኩኑ ተከታልያነ ክርስቶስ።', missionAim: 'ዓላማቲነ፡', missionPoints: [ 'ዐቂበ ወሕሊወ ዶግማ ወቀኖና ዘቤተ ክርስቲያን።', 'ትምህርት ወምሃበ ትምህርተ ቤተ ክርስቲያን ፍጹመ ዘያበቁ ለመንግሥተ ሰማያት።', 'አስተዋጽኦ ለብልጽግና መንፈሳዊ ወሰብአዊ ዘቤተ ክርስቲያን ትወጽእ ለሀገር ወለማኅበረሰብ።', 'አንጾ ሕፃናት ወኖሎት በሃይማኖተ ኦርቶዶክሳዊት ተዋሕዶ ወበምግባረ ክርስቲያናዊ፣ ፍጥረተ ትውልድ መንፈሳዊ ጽኑዕ ዘዝግጁ ለተረከበ ወለአገልግሎተ ቤተ ክርስቲያን ዘነገ።' ], nameMeaningTitle: 'ትርጉመ ስም', nameMeaningIntro: 'ስመ “ዓምደ ሃይማኖት” ያንጸባርቅ ገሃደ መሠረተ መንፈሳዊ ወዓላማ ዘትካልነ፦', nameMeaningItems: [ { title: 'ዓምድ (ምሶሶ)', description: 'ዓምድ ውእቱ ዋና ደገፍ ዘያቁም ሕንጻ ዐቢየ ከመ ኢይወድቅ። ከማሁ ሕይወተ ክርስቲያናዊ ይጸንዕ ወኢይትነቀነቅ በማዕበል ወበፈተና ሶበ ተመሥረተ በቃለ እግዚአብሔር።' }, { title: 'ሃይማኖት', description: 'ውእቱ ጽኑዕ ግንኙነትነ ምስለ ፈጣሪነ፣ ፍቅረ ክርስቶስ ዘተገልጠ በመስቀል፣ ወፍኖተ ጽድቅ ዘዲቤሁ ንሠይም ኵሎ ተስፋነ።' }, { title: 'ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት', description: 'ማእከለ መንፈሳዊ ዘይረድእ ኖሎት ወሕፃናት ከመ ይጸንዑ በትምህርተ ክርስቶስ ኢየሱስ ወበሃይማኖተ ቤተ ክርስቲያን ኦርቶዶክሳዊት—ከመ ዓምድ ይጽንዑ—ወያንጽ ሃይማኖቶሙ በዕውቀት ወበግብረ ሠናይ።' } ], valuesTitle: 'ቁምነገርነ', valuesIntro: 'ዝንቱ ቁምነገር መሠረታዊ አኮ ድርደረ ቃላት ባሕቱ፤ ውእቱ መርሆ ሕይወትነ ዘዕለት ተዕለት፦', values: [ { icon: <GavelIcon />, title: 'ሃይማኖት', description: 'እምነት ዘይነብር በሕይወት—አኮ በቃል ባሕቱ። ውእቱ ጽኑዕ አቋምነ ዘያዕቅብ ንጹሐ ዶግማ ወቀኖና ዘአስተምሀረት ቅድስት ቤተ ክርስቲያን፣ ምስለ ግብረ ሠናይ።' }, { icon: <Favorite />, title: 'ፍቅር', description: 'ዓምደ ሕይወትነ ክርስቲያናዊ፡ አፍቅሮ እግዚአብሔር በልብ ፍጹም፣ ወበግብር አፍቅሮ ኵሉ ሰብእ ከመ ነፍስነ—ዘኢይፈልጥ ዘር፣ መልክዕ፣ ወይም ደረጃ።' }, { icon: <VolunteerActivism />, title: 'ምሕረት', description: 'ምሕረት ውእቱ እፎ ንቀይር ሃይማኖት ኀበ ሕይወት፣ ዘይውሕዝ እምንጹሕ ፍቅረ ክርስቲያናዊ። ከመ መሀረ እግዚእነ፡ “በከመ ገበርክሙ ለአሐዱ እምእሉ እምንኡሳን፣ ለየ ገበርክሙ” (ማቴዎስ ፳፭፡፵)፣ ንርኢ ክርስቶስ በጐረባብትነ ነዳያን ወተሳቐዩ። ተመሪሕነ በስድስቱ ቃላተ ምሕረተ ወንጌል፣ ንብልዕ ጥሙያን፣ ንልብስ ዕሩቃን፣ ንጸንዕ ዘሐዘኑ፣ ንበጽሕ ሕሙማን—ንአንጽብር ቸርነተ እግዚአብሔር ለዓለም።' }, { icon: <School />, title: 'ትምህርት', description: 'ቆም በጽኑዕ መሠረት ዘኢይነቅንቁ ሐሰተኛ ትምህርታት። ከመ ይቤ ሐዋርያ፡ “ጽናሕ በዘተመሀርከ፣” ናዋህድ ጥበበ መንፈሳዊ ምስለ ዕውቀተ ዘመንነ—ንዕቅብ ትውልድ እምስሕተት ወናብርህ አእምሮ።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'ተክህሎተ አበዊነ ወእማቲነ ቅዱሳን፡ ሕይወት በቅንዕና በመንፈስ ትሑት።' }, { icon: <Church />, title: 'አገልግሎት', description: 'ቅንዕ አገልግሎት ለቤተ ክርስቲያን ወለማኅበረሰብ—ዝግጁ ለአገልግሎት ዘእንበለ ትዕቢት፣ እምድኅረ ፍጻመ ግቡእነ መንፈሳዊ እንብል “ባርያት ዘኢንጠቅም ንሕነ።”' }, { icon: <Book />, title: 'ቁርባን', description: 'ሥርዓተ ክርስቲያናዊ ዘበእንቲአሁ ንሐድስ ሕይወተ መንፈሳዊ፡ ርሕቀት እምኃጢአት፣ ንጽሐት በንስሓ፣ ወተቀብሎ ቅዱስ ቁርባን።' } ], leadershipTitle: 'መሪሕነትነ', leaderName: 'ዲያቆን ኢዮብ ዘውዱ', leaderRole: 'ሊቀ መንበር ዘቤት ትምህርት ሰንበት', leaderQuote: 'ነገር ግን እግዚአብሔር ያሳድግ ነበር። — ፩ኛ ቆሮንቶስ ፫፡፮', ctaTitle: 'ትፈቅዱኑ ተሳተፎተ በማኅበርነ?', ctaSubtitle: 'ርእዩ ክፍላተነ ወበዓላተነ ከመ ትርአዩ እፎ ውሉድክሙ ይትፌሥሑ በሃይማኖት ወበኅብረት ምስሌነ።', ctaButton: 'አስሱ ክፍላተነ', },
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
