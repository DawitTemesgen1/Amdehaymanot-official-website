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
    en: { appName: 'Amdehayimanot', ourStory: 'Our Story', pageTitle: 'About Amdehayimanot Sunday School', pageDescription: "Learn about the history, vision, mission, and core values of Amdehayimanot Sunday School at Jimma Debre Ephrata St. Mary Cathedral. Founded in Ginbot 1964 E.C., we serve children, youth, and adults in spiritual education.", pageSubtitle: 'History, Vision, Mission & Values', historyTitle: 'Our History', historyShort: 'Amde Haymanot Sunday School of Jimma Debre Ephrata St. Mary Cathedral was founded in Ginbot 1964 E.C. It began through the initiative of a few deacons and youth in the parish under the name “Youth Spiritual Association.”', historyFull: [ 'Members met twice a week on Saturday and Sunday to study the Gospel, practice hymns and artistic programs, and present them to the faithful as their first ministry.', 'Today it stands among the leading Sunday schools in Jimma City, embracing children, adolescents, youth, and adults with diverse spiritual services.', 'Its address is in Mantina Kebele, at the center of Jimma City, Jimma Zone, Oromia National Regional State.' ], learnMore: 'Read Full History', showLess: 'Show Less', missionTitle: 'Vision, Mission & Aims', missionSubtitle: 'Our vision is to see a wise generation formed—holding firm faith and exemplary character that honors and upholds the Church’s dogma, canon, and tradition handed down by the holy fathers, and that qualifies them to inherit the Kingdom of Heaven we hope for.', missionP1: 'Based on the word in Matthew 28:19, our mission is to see that all people are baptized in the name of the Father, the Son, and the Holy Spirit, and become followers of Christ.', missionAim: 'Our aims:', missionPoints: [ 'To keep and preserve the dogma and canon of the Church.', 'To learn and teach holistic Church education that qualifies one for the Kingdom of Heaven.', 'To contribute the spiritual and human prosperity the Church should bring to the nation and society.', 'To raise youth and children in Orthodox Tewahedo faith and Christian virtue, forming a steadfast spiritual generation ready to receive and serve the Church of tomorrow.' ], nameMeaningTitle: 'Meaning of the Name', nameMeaningIntro: 'The name “Amde Haymanot” clearly reflects the spiritual foundation and purpose of our institution:', nameMeaningItems: [ { title: 'Amde (Pillar)', description: 'A pillar is the main support that keeps a great building from falling. Likewise, Christian life stands firm and unshaken amid storms and trials when it is founded on the Word of God.' }, { title: 'Haymanot (Faith)', description: 'It is our steadfast relationship with our Creator, the love of Christ revealed on the Cross, and the path of truth on which we place all our hope.' }, { title: 'Amde Haymanot Sunday School', description: 'A spiritual center that helps youth and children stand firm in the teaching of Christ Jesus and the faith of the Orthodox Church—strengthened like a pillar—and that refines their faith through knowledge and good works.' } ], valuesTitle: 'Our Values', valuesIntro: 'These foundational values are not mere word arrangements; they are the principles of our daily life:', values: [ { icon: <GavelIcon />, title: 'Faith', description: 'Living belief—not in words alone. It is our firm stance that keeps the pure, non-negotiable dogma and canon taught by the Holy Church, accompanied by good works.' }, { icon: <Favorite />, title: 'Love', description: 'The pillar of our Christian life: loving God with a perfect heart and, in practice, loving every person as ourselves—without distinction of race, appearance, or status.' }, { icon: <VolunteerActivism />, title: 'Compassion', description: 'Compassion is how we turn faith into life, flowing from pure Christian love. As our Lord taught, “Inasmuch as you did it to one of the least of these, you did it to Me” (Matthew 25:40), we see Christ in our needy and afflicted neighbors. Guided by the six Gospel words of mercy, we feed the hungry, clothe the naked, comfort the sorrowful, and visit the sick—reflecting God’s kindness to the world.' }, { icon: <School />, title: 'Education', description: 'Standing on a firm foundation that false teachings cannot shake. As the Apostle says, “Continue in what you have learned,” we unite spiritual wisdom with the knowledge of our time—protecting a generation from error and enlightening the mind.' }, { icon: <Handshake />, title: 'Humility', description: 'Following the example of our holy fathers and mothers: living sincerely with a humble spirit.' }, { icon: <Church />, title: 'Service', description: 'Sincere service to the Church and society—ready to serve without pride, saying after fulfilling our spiritual duty, “We are unprofitable servants.”' }, { icon: <Book />, title: 'Holy Communion', description: 'The Christian order by which we renew spiritual life: keeping from sin, cleansing through repentance, and receiving Holy Communion.' } ], leadershipTitle: 'Our Leadership', leaderName: 'Deacon Eyob Zewdu', leaderRole: 'Chairman of the Sunday School', leaderQuote: 'but God gave the growth. — 1 Corinthians 3:6', ctaTitle: 'Ready to Join Our Community?', ctaSubtitle: 'Explore our classes and events to see how your child can grow in faith and fellowship with us.', ctaButton: 'Explore Our Classes', },

    am: { appName: 'ዓምደሃይማኖት', ourStory: 'ታሪካችን', pageTitle: 'ስለ ዓምደሃይማኖት ሰንበት ትምህርት ቤት', pageDescription: 'ስለ ጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ታሪክ፣ ራዕይ፣ ተልዕኮ እና እሴቶች ይወቁ። በግንቦት ወር 1964 ዓ.ም ተመሠረተ።', pageSubtitle: 'ታሪክ፣ ራዕይ፣ ተልዕኮና እሴት', historyTitle: 'ታሪካችን', historyShort: 'የጅማ ደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት በግንቦት ወር 1964 ዓ.ም ተመሠረተ። በመጀመሪያ በደብሩ ውስጥ በሚገኙ ጥቂት ዲያቆናትና ወጣቶች አነሳሽነት "የወጣቶች መንፈሳዊ ማህበር" በሚል ስያሜ ተጀመረ።', historyFull: [ 'አባላቱ በሳምንት ሁለት ቀን ቅዳሜ እና እሑድ እየተገናኙ ትምህርተ ወንጌል በመማማር፣ ዝማሬዎችንና ኪነ ጥበባዊ መርሐ ግብሮችን በማጥናት ለምዕመናን በማቅረብ አገልግሎቱን ጀምረዋል።', 'በአሁኑ ሰዓት ጅማ ከተማ ላይ ካሉ ግንባር ቀደም ሰንበት ትምህርት ቤቶች መካከል አንዱ ሆኗል። ይህ ሰንበት ትምህርት ቤት በውስጡ ህጻናትን፣ አዳጊዎችን፣ ወጣቶችንና ጎልማሶችን አቅፎ ልዩ ልዩ መንፈሳዊ አገልግሎቶችን እየሰጠ ይገኛል።', 'አድራሻው በኦሮሚያ ብሔራዊ ክልላዊ መንግስት በጅማ ዞን በጅማ ከተማ መሃል ከተማ መንቲና ቀበሌ ይገኛል።' ], learnMore: 'ሙሉውን ታሪክ ያንብቡ', showLess: 'በአጭሩ አሳይ', missionTitle: 'ራዕይ፣ ተልዕኮና ዓላማ', missionSubtitle: 'ቅዱሳን አባቶች ጠብቀው ያስረከቡንን የቤተ ክርስቲያን ዶግማ፣ ቀኖና እና ትውፊት አክብሮና አስከብሮ ተስፋ የምናደርገውን መንግስተ ሰማያት ለመውረስ የሚያበቃ የጸና ሃይማኖትና ምሳሌ የሆነ ምግባር ይዞ የሚገኝ ጥበበኛ ትውልድ ተፈጥሮ ማየት ነው።', missionP1: 'በማቴዎስ 28፥19 ያለውን ቃል መሠረት በማድረግ ሰዎችን ሁሉ በአብ፣ በወልድና በመንፈስ ቅዱስ ስም እንዲጠመቁ እና የክርስቶስ ተከታዮች እንዲሆኑ ማድረግ ነው።', missionAim: 'ዓላማዎቻችን፡', missionPoints: [ 'የቤተ ክርስቲያኒቱን ዶግማ እና ቀኖና ጠብቆ ማስጠበቅ።', 'ለመንግስተ ሰማያት የሚያበቃ ሁለንተናዊ የቤተ ክርስቲያን ትምህርት መማር እና ማስተማር።', 'ቤተ ክርስቲያን ለሀገር እና ለማህበረሰቡ መንፈሳዊና ሰብዓዊ ብልጽግና ልትወጣ የሚገባትን አስተዋጽኦ ማበርከት።', 'ወጣቶችና ሕፃናትን በኦርቶዶክሳዊት ተዋሕዶ እምነትና በክርስቲያናዊ በጎ ምግባር አንጾ በማሳደግ፣ ነገ ቤተ ክርስቲያንን በብቃት የሚረከብና የሚያገለግል ጽኑ መንፈሳዊ ትውልድ ማፍራት።' ], nameMeaningTitle: 'የስያሜው ትርጉም', nameMeaningIntro: '"ዓምደ ሃይማኖት" የሚለው ስያሜያችን የተቋማችንን መንፈሳዊ መሠረትና ዓላማ በግልጽ ያንጸባርቃል፦', nameMeaningItems: [ { title: 'ዓምድ (ምሶሶ)', description: 'ማንኛውም ትልቅ ሕንጻ እንዳይፈርስ ደግፎ የሚያቆመው ዋናው መሠረቱ ምሶሶ (ዓምድ) ነው። የክርስቲያናዊ ሕይወታችንም ማዕበልና ፈተና ሲገጥመው የማይናወጠውና ጸንቶ የሚቆመው በእግዚአብሔር ቃል ላይ ሲመሠረት ነው።' }, { title: 'ሃይማኖት', description: 'ከፈጣሪያችን ጋር ያለን ጽኑ ግንኙነት፣ በመስቀል ላይ የተገለጠው የክርስቶስ ፍቅር፣ እና ተስፋችንን ሁሉ የጣልንበት የእውነት መንገድ ነው።' }, { title: 'ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት', description: 'ወጣቶችና ሕፃናት በክርስቶስ ኢየሱስ አስተምህሮና በኦርቶዶክሳዊት ቤተ ክርስቲያን እምነት ላይ ጸንተው እንዲቆሙ (እንደ ዓምድ እንዲጠነክሩ) የሚያደርግ፣ እምነታቸውን በዕውቀትና በምግባር የሚያንጽ መንፈሳዊ ማዕከል ማለት ነው።' } ], valuesTitle: 'እሴቶቻችን', valuesIntro: 'እነዚህ መሠረታዊ እሴቶቻችን የቃላት ድርደራ ብቻ ሳይሆኑ፣ የዕለት ተዕለት የሕይወት መርሆዎቻችን ናቸው፦', values: [ { icon: <GavelIcon />, title: 'ሃይማኖት', description: 'እምነትን በቃል ብቻ ሳይሆን በሕይወት መኖር ነው። ቅድስት ቤተ ክርስቲያን ያስተማረችንን ንጹሕና የማንደራደርበትን ዶግማና ቀኖና ጠብቆ፣ በበጎ ምግባር ታጅቦ የሚገለጥ ጽኑ አቋማችን ነው።' }, { icon: <Favorite />, title: 'ፍቅር', description: 'የክርስቲያናዊ ሕይወታችን ማገር ነው። ፍጹም በሆነ ልብ እግዚአብሔርን መውደድ እና ሰውን ሁሉ (ዘር፣ መልክ፣ ወይም ደረጃ ሳይለዩ) እንደ ራስ አድርጎ ማፍቀርን በተግባር የምናሳይበት እሴታችን ነው።' }, { icon: <VolunteerActivism />, title: 'ርኅራኄ', description: 'ርኅራኄ ለእኛ ከንጹሕ የክርስቲያን ፍቅር የሚመነጭ፣ እምነትን ወደ ሕይወት የምንቀይርበት የተግባር መገለጫችን ነው። ጌታችን “ከእነዚህ ከታናናሾቹ ለአንዱ ስላደረጋችሁት ለእኔ አደረጋችሁት” (ማቴ 25፥40) ብሎ ባስተማረው መሠረት፣ በተቸገሩትና በታረዙት ወገኖቻችን ውስጥ ክርስቶስን እናያለን። በመሆኑም ስድስቱን ቃላተ ወንጌል የዕለት ተዕለት የሕይወታችን መመሪያ በማድረግ፤ የተራቡትን በማብላት፣ የታረዙትን በማልበስ፣ ያዘኑትን በማጽናናት እንዲሁም የታመሙትን በመጠየቅ የአምላካችንን ቸርነት ለዓለም የምናንጸባርቅበት ጥልቅ የመንፈስ ፍሬ ነው።' }, { icon: <School />, title: 'ትምህርት', description: 'ሐሰተኛ ትምህርቶች በማይነቀንቁት ጽኑ መሠረት ላይ መቆም ነው። "ከማን እንደተማርክ ታውቃለህና ጽና" በሚለው የሐዋርያው ቃል መሠረት፣ መንፈሳዊውን ጥበብ ከዘመኑ ዕውቀት ጋር አዋህደን፣ ትውልድን ከስህተት የምንጠብቅበትና አእምሮን የምናበራበት ብርሃናችን ነው።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'የቅዱሳን አባቶቻችንንና እናቶቻችንን አርዓያነት በመከተል፣ ራስን ዝቅ አድርጎ በቅንነት የመኖር ክርስቲያናዊ መገለጫችን ነው።' }, { icon: <Church />, title: 'አገልግሎት', description: 'ለቤተ ክርስቲያንና ለማኅበረሰቡ የምንሰጠው ቅን አገልጋይነት ሲሆን፤ ይህም የተሰጠንን መንፈሳዊ ሓላፊነት ከፈጸምን በኋላ "የማንጠቅም ባሪያዎች ነን" በማለት ያለ ትዕቢት የምናገለግልበት ዝግጁነት ነው።' }, { icon: <Book />, title: 'ሥጋ ወደሙ', description: 'ዘወትር ከኃጢአት ርቆ በንስሐ በመታጠብና ቅዱስ ቁርባንን በመቀበል መንፈሳዊ ሕይወታችንን የምናድስበት የክርስቲያን ሥርዓት ነው።' } ], leadershipTitle: 'የሰንበት ትምህርት ቤቱ ሰብሳቢ', leaderName: 'ዲያቆን ኢዮብ ዘውዱ', leaderRole: 'የሰንበት ትምህርት ቤቱ ሰብሳቢ', leaderQuote: 'ነገር ግን እግዚአብሔር ያሳድግ ነበር። — 1ኛ ቆሮንቶስ 3:6', ctaTitle: 'የማህበረሰባችን አካል ለመሆን ዝግጁ ኖት?', ctaSubtitle: 'ልጅዎ በእምነትና በኅብረት ከእኛ ጋር እንዴት እንደሚያድግ ለማየት ክፍሎቻችንንና ዝግጅቶቻችንን ይጎብኙ።', ctaButton: 'ክፍሎቻችንን ያስሱ', },

    ti: { appName: 'ዓምደሃይማኖት', ourStory: 'ዛንታና', pageTitle: 'ብዛዕባ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት', pageDescription: "ብዛዕባ ናይ ጅማ ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ሃብታም ታሪኽ፡ ተልእኾን ቀንዲ ክብርታትን ተማሃሩ። ኣብ 1964 ዝተመስረተ ኮይኑ፡ ንመንእሰያት መንፈሳዊ ትምህርቲ ንምሃብ ቆሪጽና ንርከብ።", pageSubtitle: 'ታሪኽ፣ ራእይ፣ ተልእኾን ክብርታትን', historyTitle: 'ታሪኽና', historyShort: 'ቤት ትምህርቲ ሰንበት ዓምደሃይማኖት ናይ ጅማ ደብረ ኤፍራታ ቅድስት ማርያም ቤተ ክርስቲያን ኣብ 1964 ዓ.ም. ብመንፈሳዊ ኣገልግሎት ዝተበገሱ ኣቦታትን ኣሕዋትን ተመስሪቱ።', historyFull: [ 'ኣገልግሎት ብሰንኪ ናይቲ ግዜ ፖለቲካዊ ኩነታት ኣብ 1973 ግዝያዊ ደው እኳ እንተበለ፡ ብጻዕሪ ክልተ ዲያቆናት ኣብ 1977 ዳግማይ ተጀሚሩ። እቲ ቤት ትምህርቲ ድማ ኣገልግሎቱ ናብ ገጠራት ብምስፋሕ፡ ከም መዘምራን፡ ስነ-ጽሑፍን ትምህርትን ዝኣመሰሉ ክፍልታት ተወዲቡ።', 'ኣብ 1990ታት፡ ብተምሃሮ ዝተበገሱ ተበግሶታት ነቲ ቤት ትምህርቲ ብምድልዳል ናይ ኣገልግሎት ክፍልታት መስሪቶምን ምስ ካልኦት ኣብያተ-ክርስትያን ምትእስሳር ፈጢሮምን። ከም ንዝተጸገሙ ሰባት ክዳውንቲ ምእካብን ሃይማኖታዊ ኣቕሑት ምሻጥን ዝኣመሰሉ ናይ ልምዓት ፕሮጀክትታት ኣብዚ እዋን’ዚ ተጀሚሮም።', 'ኣብ ዝሓለፈ ዓሰርተ ዓመታት፡ እቲ ኣወዳድባ ናብ ሽዱሽተ ደረጃታት ዓብዩ፡ እዚ ድማ ናይ ዓበይትን ምድላውን ክፍሊታት ዘጠቓልል ኮይኑ፡ ኣብ 13 ናይ ኣገልግሎት ክፍልታት ተወዲቡ። ናይ ገዛእ ርእሱ ስርዓተ-ትምህርቲ ኣዳልዩን ከም ናይ ሃይማኖታዊ ኣቕሑት መሸጥን ሽምዓ ምፍራይን ዝኣመሰሉ እቶት ዘመንጭዉ ፕሮጀክትታት ብምጅማር ንሃዋርያዊ ተልእኾታቱ ፋይናንስ ይገብር ኣሎ።' ], learnMore: 'ሙሉእ ታሪኽ ኣንብብ', showLess: 'ኣሕጽር ኣቢልካ ኣርእይ', missionTitle: 'ራእይናን ተልእኾናን', missionSubtitle: 'ብጽኑዕ እምነትን ኣብነታዊ ጠባይን ዝዓበየ፡ መንግስተ ሰማያት ንምውራስ ድልዊ ዝኾነ ለባም ወለዶ ምርኣይ።', missionP1: 'ተልእኾና፡ ዶግማ፡ ቀኖናን ትውፊትን ቤተ ክርስቲያን ምሕላው ኮይኑ፡ ናብ ዝመጽእ ወለዶ ምትሕልላፍ የረጋግጽ።', missionAim: 'ዕላማታትና፡', missionPoints: [ 'ንምንግስተ ሰማያት ዘብቅዕ ሁለንተናዊ ትምህርቲ ቤተ ክርስቲያን ምሃብ።', 'ንመንፈሳውን ሰብኣውን ብልጽግና ሃገርን ማሕበረሰብን ኣበርክቶ ምግባር።', 'ኣባላት ብእምነትን ስነ-ምግባርን ምዕባይ፡ ንመጻኢ ናይ ቤተ ክርስቲያን ተረከብቲ ምድላው።' ], valuesTitle: ' ቀንዲ ክብርታትና', values: [ { icon: <GavelIcon />, title: 'እምነት', description: 'ብስሩሕ ግብርን ዘይናወጽ ትምህርትን ዝግለጽ እምነት።' }, { icon: <Favorite />, title: 'ፍቕሪ', description: 'ፍቕሪ ኣምላኽን ፍቕሪ ብጻይን።' }, { icon: <VolunteerActivism />, title: 'ርህራሀ', description: 'ነቶም ሽዱሽተ ሰብኣዊ ተግባራት ወንጌል ምንባር።' }, { icon: <School />, title: 'ትምህርቲ', description: 'መንፈሳውን ስጋውን ፍልጠት፡ ከምቲ ቅዱስ ጳውሎስ ንጢሞቴዎስ ዝመኸሮ።' }, { icon: <Church />, title: 'ኣገልግሎት', description: 'ንቤተ ክርስቲያንን ንማሕበረሰብን ብትሕትና ምግልጋል።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'ኣሰር ቅዱሳን ኣቦታትናን ኣዴታትናን ምስዓብ።' }, { icon: <Book />, title: 'ቁርባን', description: 'ብንስሓ ምጽራይን ብቁርባን ህይወት ምሕዳስን።' } ], leadershipTitle: 'መሪሕነትና', leaderName: 'ዲያቆን ኢዮብ ዘውዱ', leaderRole: 'ሰብሳቢ ቤት ትምህርቲ ሰንበት', leaderQuote: 'ነገር ግን እግዚአብሔር ያሳድግ ነበር። — 1ይ ቆሮንቶስ 3:6', ctaTitle: 'ኣባል ማሕበረሰብና ክትከውን ድልዊ ዲኻ?', ctaSubtitle: 'ውሉድኩም ብእምነትን ሕብረትን ምሳና ከመይ ከም ዝዓቢ ንምርኣይ፡ ክፍለ-ትምህርትታትናን ፍጻሜታትናን መርምሩ።', ctaButton: 'ክፍለ-ትምህርትታትና መርምሩ', },
    om: { appName: 'Amdehayimanot', ourStory: 'Seenaa Keenya', pageTitle: 'Waa\'ee Mana Barumsaa Dilbataa Amdehayimanot', pageDescription: "Seenaa, ergama, fi duudhaalee bu'uuraa Mana Barumsaa Dilbataa Amdehayimanot kan Jimmaa baradhaa. Bara 1973 kan hundeeffame, dargaggootaaf barnoota hafuuraa kennuuf of kennee jira.", pageSubtitle: 'Seenaa, Mul’ata, Ergamaa fi Duudhaalee', historyTitle: 'Seenaa Keenya', historyShort: 'Manni Barumsaa Dilbataa Amdehayimanot kan Waldaa Qulqulleettii Maariyaam Jimmaa Dabra Efraataa bara 1973 abbootii fi obboleeyyan tajaajila hafuuraatiif ariifataniin hundeeffame.', historyFull: [ 'Tajaajilli sababa siyaasaa yeroo sanaatiin bara 1981 yeroof addaan citus, bara 1985 carraaqqii diyaaqonoota lamaatiin irra deebi\'ee jalqabame. Sana booda, manni barumsichaa damee akka Kooyarii, Ogbarruu, fi Barnootaatti gurmaa\'uun tajaajila isaa gara waldaalee baadiyyaatti babal\'iseera.', 'Bara 1990n keessa, sochii barattootaan durfamuun damee tajaajilaa hundeessuun fi waldaalee biroo waliin muuxannoo waljijjiiruun mana barumsichaa cimseera. Piroojektiin guddinaa kan akka uffata harka qalleeyyiif walitti qabuu fi meeshaalee amantaa gurguruun yeroo sanatti jalqabame.', 'Kurnan waggaa darbe keessatti, caasaan isaa gara sadarkaa ja\'atti guddate, kutaa ga\'eessotaa dabalatee, damee tajaajilaa 13 jalatti gurmaa\'eera. Sirna barnootaa mataa isaa baafatee fi piroojektii galii madda ta\'an kan akka suuqii meeshaalee amantaa fi oomisha shamaa jalqabuun ergama isaa raawwachaa jira.' ], learnMore: 'Seenaa Guutuu Dubbisi', showLess: 'Gabaabsi', missionTitle: 'Mul\'ata fi Ergama Keenya', missionSubtitle: 'Dhaloota ogummaa qabu, amantaa cimaa fi amala fakkeenya ta\'een guddate, mootummaa samii dhaaluuf qophaa\'e arguu.', missionP1: 'Ergamni keenya dogmaa, qajeelfama, fi duudhaa Waldaa tiksuudhaan, dhaloota dhufuuf akka darbu gochuudha.', missionAim: 'Kaayyoon keenya:', missionPoints: [ 'Barnoota Waldaa guutuu kan mootummaa samiitiif nama geessu kennuu.', 'Guddina hafuuraa fi namoomaa biyyaa fi hawaasaatiif gumaachuu.', 'Miseensota amantaa fi naamusaan kunuunsuun, fuulduraaf Waldaa kan dhaalan gochuu.' ], valuesTitle: 'Duudhaalee Bu\'uuraa Keenya', values: [ { icon: <GavelIcon />, title: 'Amantaa', description: 'Amantaa gocha gaarii fi barsiisa hin raafamneen mul\'atu.' }, { icon: <Favorite />, title: 'Jaalala', description: 'Jaalala Waaqayyoo fi jaalala namaa.' }, { icon: <VolunteerActivism />, title: 'Garaa Laafina', description: 'Gochaalee namoomaa Wangeelaa jahan hojiirra oolchuu.' }, { icon: <School />, title: 'Barnoota', description: 'Beekumsa hafuuraa fi addunyaa, akka Phaawuloos Ximotewoos gorse.' }, { icon: <Church />, title: 'Tajaajila', description: 'Waldaa fi hawaasa gad-of-deebisuun tajaajiluu.' }, { icon: <Handshake />, title: 'Gad-of-deebisuu', description: 'Fakkeenya abboottii fi haadholii qulqulluu hordofuu.' }, { icon: <Book />, title: 'Qulqulleettii Qurbanaa', description: 'Qalbii diddiirrannaan of qulqulleessuu fi Qurbaanaan jireenya haaressuu.' } ], leadershipTitle: 'Hoggansa Keenya', leaderName: 'Diyaaqon Iyyoob Zawduu', leaderRole: 'Dura Taa\'aa Mana Barumsaa Dilbataa', leaderQuote: 'garuu Waaqayyoon guddiseera. — 1 Qorontos 3:6', ctaTitle: 'Hawaasa Keenyaatti Dabalamuuf Qophiidhaa?', ctaSubtitle: 'Ijoolleen keessan amantaa fi walitti dhufeenyaan nu wajjin akkamitti akka guddatan arguuf kutaa barnootaa fi sagantaawwan keenya daawwadhaa.', ctaButton: 'Kutaa Barnootaa Keenya Daawwadhaa', },
    es: { appName: 'Amdehayimanot', ourStory: 'Nuestra Historia', pageTitle: 'Sobre la Escuela Dominical Amdehayimanot', pageDescription: "Conozca la rica historia, misión y valores fundamentales de la Escuela Dominical Amdehayimanot en Jimma. Fundada en 1973, nos dedicamos a la educación espiritual para jóvenes.", pageSubtitle: 'Historia, Visión, Misión y Valores', historyTitle: 'Nuestra Historia', historyShort: 'La Escuela Dominical Amde Haymanot de la Iglesia de Santa María de Jimma Debre Ephrata fue fundada en 1973 por padres y hermanos celosos del servicio espiritual.', historyFull: [ 'Aunque los servicios se interrumpieron temporalmente en 1981 debido al clima político, se reanudaron en 1985 gracias a los esfuerzos de dos diáconos. Desde entonces, la Escuela Dominical expandió su ministerio a las iglesias rurales, organizándose en departamentos como Coro, Literatura y Educación.', 'En la década de 1990, las iniciativas estudiantiles fortalecieron la escuela estableciendo departamentos de servicio y fomentando intercambios de experiencias con otras parroquias, como la Escuela Dominical Genete Tsige. También se iniciaron proyectos de desarrollo, como la recolección de ropa para los necesitados y la venta de artículos religiosos.', 'Durante la última década, su estructura ha crecido a seis niveles, incluyendo clases para adultos y preparatorias, organizadas en 13 departamentos de servicio. Ha desarrollado su propio currículo y ha lanzado proyectos generadores de ingresos, como una tienda de artículos religiosos y la fabricación de velas, para financiar sus misiones apostólicas.' ], learnMore: 'Leer Historia Completa', showLess: 'Mostrar Menos', missionTitle: 'Nuestra Visión y Misión', missionSubtitle: 'Ver una generación sabia, criada con fe sólida y carácter ejemplar, lista para heredar el reino de los cielos.', missionP1: 'Nuestra misión es defender los dogmas, cánones y tradiciones de la Iglesia, asegurando que se transmitan a las generaciones futuras.', missionAim: 'Nuestros objetivos son:', missionPoints: [ 'Proporcionar una educación eclesiástica integral que califique para el reino de los cielos.', 'Contribuir a la prosperidad espiritual y humanitaria del país y la comunidad.', 'Formar a los miembros en la fe y la ética, preparándolos para ser los futuros custodios de la Iglesia.' ], valuesTitle: 'Nuestros Valores Fundamentales', values: [ { icon: <GavelIcon />, title: 'Fe', description: 'Creencia demostrada a través de buenas obras y una doctrina inquebrantable.' }, { icon: <Favorite />, title: 'Amor', description: 'El amor a Dios y el amor al prójimo.' }, { icon: <VolunteerActivism />, title: 'Compasión', description: 'Vivir los seis actos humanitarios del Evangelio.' }, { icon: <School />, title: 'Educación', description: 'Conocimiento espiritual y secular, como aconsejó San Pablo a Timoteo.' }, { icon: <Church />, title: 'Servicio', description: 'Servir a la Iglesia y a la comunidad con humildad.' }, { icon: <Handshake />, title: 'Humildad', description: 'Siguiendo el ejemplo de nuestros santos padres y madres.' }, { icon: <Book />, title: 'Santa Comunión', description: 'Purificarse mediante la penitencia y renovar la vida mediante la Eucaristía.' } ], leadershipTitle: 'Nuestro Liderazgo', leaderName: 'Diácono Eyob Zewdu', leaderRole: 'Presidente de la Escuela Dominical', leaderQuote: 'pero Dios daba el crecimiento. — 1 Corintios 3:6', ctaTitle: '¿Listo para Unirte a Nuestra Comunidad?', ctaSubtitle: 'Explora nuestras clases y eventos para ver cómo tu hijo puede crecer en fe y compañerismo con nosotros.', ctaButton: 'Explora Nuestras Clases', },
    fr: { appName: 'Amdehayimanot', ourStory: 'Notre Histoire', pageTitle: 'À propos de l\'École du Dimanche Amdehayimanot', pageDescription: "Découvrez la riche histoire, la mission et les valeurs fondamentales de l'École du Dimanche Amdehayimanot à Jimma. Fondée en 1973, nous nous consacrons à l'éducation spirituelle des jeunes.", pageSubtitle: 'Histoire, Vision, Mission et Valeurs', historyTitle: 'Notre Histoire', historyShort: 'L\'école du dimanche Amde Haymanot de l\'église Sainte-Marie de Jimma Debre Ephrata a été fondée en 1973 par des pères et des frères zélés pour le service spirituel.', historyFull: [ 'Bien que les services aient été temporairement suspendus en 1981 en raison du climat politique, ils ont été relancés en 1985 grâce aux efforts de deux diacres. Depuis lors, l\'école du dimanche a étendu son ministère aux églises rurales, en s\'organisant en départements tels que la chorale, la littérature et l\'éducation.', 'Dans les années 1990, des initiatives étudiantes ont renforcé l\'école en créant des départements de service et en favorisant les échanges d\'expériences avec d\'autres paroisses, comme l\'école du dimanche de Genete Tsige. Des projets de développement, tels que la collecte de vêtements pour les nécessiteux et la vente d\'articles religieux, ont également été lancés à cette période.', 'Au cours de la dernière décennie, sa structure s\'est développée sur six niveaux, y compris des cours pour adultes et préparatoires, organisés en 13 départements de service. Elle a développé son propre programme et lancé des projets générateurs de revenus, comme une boutique d\'articles religieux et la fabrication de bougies, pour financer ses missions apostoliques.' ], learnMore: 'Lire l\'Histoire Complète', showLess: 'Afficher Moins', missionTitle: 'Notre Vision & Mission', missionSubtitle: 'Voir une génération sage, élevée avec une foi solide et un caractère exemplaire, prête à hériter du royaume des cieux.', missionP1: 'Notre mission est de défendre les dogmes, canons et traditions de l\'Église, en veillant à ce qu\'ils soient transmis aux generations futures.', missionAim: 'Nos objectifs sont :', missionPoints: [ 'Fournir une éducation ecclésiale holistique qui qualifie pour le royaume des cieux.', 'Contribuer à la prospérité spirituelle et humanitaire du pays et de la communauté.', 'Former les membres dans la foi et l\'éthique, les préparant à être les futurs gardiens de l\'Église.' ], valuesTitle: 'Nos Valeurs Fondamentales', values: [ { icon: <GavelIcon />, title: 'Foi', description: 'Croyance démontrée par de bonnes œuvres et une doctrine inébranlable.' }, { icon: <Favorite />, title: 'Amour', description: 'L\'amour de Dieu et l\'amour du prochain.' }, { icon: <VolunteerActivism />, title: 'Compassion', description: 'Vivre les six actes humanitaires de l\'Évangile.' }, { icon: <School />, title: 'Éducation', description: 'Connaissance spirituelle et séculière, comme l\'a conseillé Saint Paul à Timothée.' }, { icon: <Church />, title: 'Service', description: 'Servir l\'Église et la communauté avec humilité.' }, { icon: <Handshake />, title: 'Humilité', description: 'Suivre l\'exemple de nos saints pères et mères.' }, { icon: <Book />, title: 'Sainte Communion', description: 'Se purifier par la pénitence et renouveler sa vie par l\'Eucharistie.' } ], leadershipTitle: 'Notre Direction', leaderName: 'Diacre Eyob Zewdu', leaderRole: 'Président de l\'École du Dimanche', leaderQuote: 'mais Dieu a fait croître. — 1 Corinthiens 3:6', ctaTitle: 'Prêt à Rejoindre Notre Communauté ?', ctaSubtitle: 'Explorez nos cours et événements pour voir comment votre enfant peut grandir dans la foi et la fraternité avec nous.', ctaButton: 'Explorez Nos Cours', },
    ar: { appName: 'عماد الإيمان', ourStory: 'قصتنا', pageTitle: 'حول مدرسة الأحد عماد الإيمان', pageDescription: "تعرف على التاريخ الغني والرسالة والقيم الأساسية لمدرسة الأحد عماد الإيمان في جيما. تأسست عام 1964، ونحن ملتزمون بالتعليم الروحي للشباب.", pageSubtitle: 'تاريخ، رؤية، رسالة، وقيم', historyTitle: 'تاريخنا', historyShort: 'تأسست مدرسة الأحد "عماد الإيمان" التابعة لكنيسة السيدة مريم العذراء في جيما دير إفراتا عام 1973 على يد آباء وإخوة غيورين على الخدمة الروحية.', historyFull: [ 'على الرغم من توقف الخدمات مؤقتًا في عام 1981 بسبب المناخ السياسي، إلا أنها استؤنفت في عام 1985 بجهود اثنين من الشمامسة. منذ ذلك الحين، وسعت مدرسة الأحد خدمتها لتشمل الكنائس الريفية، وتم تنظيمها في أقسام مثل الكورال والأدب والتعليم.', 'في التسعينيات، عززت المبادرات الطلابية المدرسة من خلال إنشاء أقسام خدمية وتعزيز تبادل الخبرات مع الرعايا الأخرى، مثل مدرسة الأحد في جينات تسيج. كما بدأت مشاريع تنموية، مثل جمع الملابس للمحتاجين وبيع المواد الدينية، خلال هذه الفترة.', 'على مدى العقد الماضي، نما هيكلها إلى ستة مستويات، بما في ذلك فصول للبالغين والتحضيرية، منظمة عبر 13 قسمًا خدميًا. وقد طورت منهجها الخاص وأطلقت مشاريع مدرة للدخل مثل متجر للسلع الدينية ومصنع للشموع لتمويل مهامها الرسولية.' ], learnMore: 'اقرأ التاريخ الكامل', showLess: 'عرض أقل', missionTitle: 'رؤيتنا ورسالتنا', missionSubtitle: 'رؤية جيل حكيم، نشأ على إيمان قوي وشخصية مثالية، ومستعد لوراثة ملكوت السماوات.', missionP1: 'رسالتنا هي التمسك بعقائد الكنيسة وقوانينها وتقاليدها، وضمان نقلها إلى الأجيال القادمة.', missionAim: 'أهدافنا هي:', missionPoints: [ 'توفير تعليم كنسي شامل يؤهل لملكوت السماوات.', 'المساهمة في الازدهار الروحي والإنساني للبلاد والمجتمع.', 'تنشئة الأعضاء في الإيمان والأخلاق، وإعدادهم ليكونوا أمناء الكنيسة في المستقبل.' ], valuesTitle: 'قيمنا الأساسية', values: [ { icon: <GavelIcon />, title: 'الإيمان', description: 'الإيمان الذي يظهر من خلال الأعمال الصالحة والعقيدة الراسخة.' }, { icon: <Favorite />, title: 'المحبة', description: 'محبة الله ومحبة القريب.' }, { icon: <VolunteerActivism />, title: 'الرحمة', description: 'تطبيق أعمال الإنجيل الإنسانية الستة.' }, { icon: <School />, title: 'التعليم', description: 'المعرفة الروحية والدنيوية، كما نصح القديس بولس تيموثاوس.' }, { icon: <Church />, title: 'الخدمة', description: 'خدمة الكنيسة والمجتمع بتواضع.' }, { icon: <Handshake />, title: 'التواضع', description: 'اتباع مثال آبائنا وأمهاتنا القديسين.' }, { icon: <Book />, title: 'المناولة المقدسة', description: 'تطهير النفس من خلال التوبة وتجديد الحياة من خلال القربان المقدس.' } ], leadershipTitle: 'قيادتنا', leaderName: 'الشماس أيوب زودو', leaderRole: 'رئيس مدرسة الأحد', leaderQuote: 'ولكن الله كان ينمي. — ١ كورنثوس ٣:٦', ctaTitle: 'هل أنت مستعد للانضمام إلى مجتمعنا؟', ctaSubtitle: 'استكشف فصولنا وفعالياتنا لترى كيف يمكن لطفلك أن ينمو في الإيمان والزمالة معنا.', ctaButton: 'استكشف فصولنا', },
    ge: { appName: 'ዓምደ ሃይማኖት', ourStory: 'ዜናነ', pageTitle: 'ስለ ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት', pageDescription: "ስለ ታሪከነ፣ ተልእኮነ、 ወቁምነገርነ ዘቤት ትምህርት ሰንበት ዓምደ ሃይማኖት በጅማ ተመሀሩ። በዓመተ ፲፱፻፷ወ፭ ተመሥረተ、 ወንሕነ ለትምህርተ መንፈስ ለኖሎት ቆምና።", pageSubtitle: 'ታሪክ፣ ራእይ、 ተልእኮ ወቁምነገር', historyTitle: 'ታሪከነ', historyShort: 'ቤት ትምህርት ሰንበት ዓምደ ሃይማኖት ዘደብረ ኤፍራታ ቅድስት ማርያም በጅማ በዓመተ ፲፱፻፷ወ፭ በአበው ወአኃው እለ መጽኡ ለተግባረ መንፈስ ተመሥረተ።', historyFull: [ 'አገልግሎቱ በዓመተ ፲፱፻፹ወ፩ በምክንያተ ፖለቲካ ለጊዜሁ ተዐገተ፣ ወበዓመተ ፲፱፻፹ወ፭ በክልኤቱ ዲያቆናት ዳግመ ተጀመረ። እምዝ ጊዜ ጀሚሮ፣ ቤት ትምህርቱ በአገልግሎተ ገጠር ተስፍሐ፣ ወበክፍላተ መዝሙር፣ ስነ ጽሑፍ፣ ወትምህርት ተወደበ።', 'በዓመተ ፲፱፻፺፣ ተነሳሒነ ተማሪሃ ለቤት ትምህርቱ አጽንዕዎ፣ ወክፍላተ አገልግሎተ መሥረቱ ወምስለ ካልኣን አድባራት ተላውጦ ገብሩ። ግብረ ልማት፣ ከመ አልባስ ለነዳያን ወመሸጠ ንዋያተ ቅድሳት፣ በዝየ ጊዜ ተጀመረ።', 'በዝ ዐሥርቱ ዓመታት፣ ሥርዓቱ እስከ ስድስቱ ደረጃታት ዐቢየ፣ ወበ ፲፫ ክፍላተ አገልግሎት ተወደበ። ሥርዓተ ትምህርቶ ወለገቢ ዘየዐውድ ግብራት፣ ከመ ሱቀ ንዋያተ ቅድሳት ወምፍራየ ጧፍ፣ ለሐዋርያዊ ተልእኮሁ ገብረ።' ], learnMore: 'ምንባበ ኵሉ ታሪክ', showLess: 'አሕጽር', missionTitle: 'ራእይነ ወተልእኮነ', missionSubtitle: 'ራእይነ ውእቱ ምልአተ ትውልድ ጠቢብ፣ በጽኑዕ ሃይማኖት ወበምግባር ምሳሌ、 ለርስዓተ መንግሥተ ሰማያት ዝግጁ።', missionP1: 'ተልእኮነ ውእቱ ዐቂበ ዶግማ፣ ቀኖና፣ ወትውፊት ዘቤተ ክርስቲያን፣ ወለተከታሊ ትውልድ አውርሶቶሙ።', missionAim: 'ዓላማቲነ፡', missionPoints: [ 'ትምህርተ ቤተ ክርስቲያን ፍጹመ ለርስዓተ መንግሥተ ሰማያት ምሃብ።', 'ለበረከተ ሀገር ወማኅበረሰብ መንፈሳዊ ወሰብአዊ አስተዋጽኦ ምግባር።', 'ለአባላት በሃይማኖት ወበምግባር ምዕባይ፣ ወለተከታሊተ ቤተ ክርስቲያን አበጋዝ ምድላዎሙ።' ], valuesTitle: 'ቁምነገርነ', values: [ { icon: <GavelIcon />, title: 'ሃይማኖት', description: 'እምነት በግብረ ሠናይ ወበኢየኃልቅ ትምህርት ዘይትከሠት።' }, { icon: <Favorite />, title: 'ፍቅር', description: 'ፍቅረ እግዚአብሔር ወፍቅረ ቢጽ።' }, { icon: <VolunteerActivism />, title: 'ምሕረት', description: 'ሕይወተ በስድስቱ ቃላተ ወንጌል ሰብአዊያን።' }, { icon: <School />, title: 'ትምህርት', description: 'ጥበበ መንፈሳዊ ወዓለማዊ፣ ከመ መከረ ቅዱስ ጳውሎስ ለጢሞቴዎስ።' }, { icon: <Church />, title: 'አገልግሎት', description: 'አገልግሎተ ቤተ ክርስቲያን ወማኅበረሰብ በትሕትና።' }, { icon: <Handshake />, title: 'ትሕትና', description: 'ተክህሎተ አበዊነ ወእማቲነ ቅዱሳን።' }, { icon: <Book />, title: 'ቁርባን', description: 'ተሐድሶ ነፍስ በንስሓ ወበቁርባን።' } ], leadershipTitle: 'መሪሕነትነ', leaderName: 'ዲያቆን ኢዮብ ዘውዱ', leaderRole: 'ሊቀ መንበር ዘቤት ትምህርት ሰንበት', leaderQuote: 'ነገር ግን እግዚአብሔር ያሳድግ ነበር። — ፩ኛ ቆሮንቶስ ፫፡፮', ctaTitle: 'ትፈቅዱኑ ተሳተፎተ በማኅበርነ?', ctaSubtitle: 'ርእዩ ክፍላተነ ወበዓላተነ ከመ ትርአዩ እፎ ውሉድክሙ ይትፌሥሑ በሃይማኖት ወበኅብረት ምስሌነ።', ctaButton: 'አስሱ ክፍላተነ', },
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
