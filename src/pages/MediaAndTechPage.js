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
      'Imaging, video, social media, and Christian technology from Amde Haymanot Sunday School in Jimma.',
    heroTitle: 'Media and Tech',
    heroSubtitle: 'Where the Gospel is seen, heard, and built into tools for the Church.',
    leadLabel: 'Our calling',
    leadText:
      'We serve Debre Ephrata St. Mary with a camera in one hand and code in the other — telling the story of faith and building products that help people pray, learn, and gather.',
    servicesLabel: 'Four ways we serve',
    featuredLabel: 'Featured project',
    moreLabel: 'More in progress',
    openApp: 'Get on Google Play',
    soon: 'Soon',
    ctaTitle: 'Partner with us',
    ctaText: 'Feast coverage, a film, a campaign, or a Christian app — start a conversation.',
    ctaButton: 'Contact us',
    services: [
      {
        key: 'imaging',
        title: 'Imaging',
        text: 'Still photography and design for feasts, teaching, and parish life.',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'Video',
        text: 'Filming and editing that carries worship, testimony, and teaching.',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'Social',
        text: 'Reverent, consistent presence across the Sunday School channels.',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'Tech',
        text: 'Apps and digital tools built for Orthodox life and learning.',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'Amde Haymanot Zmare',
      text: 'Orthodox hymns for the year, the fasts, and the feasts — offline, searchable, and made for practice.',
      tag: 'Mobile app',
    },
    moreProjects: [
      { title: 'Media Archive', text: 'Photos and films from ministry life.' },
      { title: 'Learning Portal', text: 'Structured Christian lessons for youth.' },
    ],
  },
  am: {
    pageTitle: 'ሚዲያ እና ቴክ | ዓምደ ሃይማኖት',
    pageDescription: 'ከጅማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ምስል፣ ቪዲዮ፣ ማህበራዊ ሚዲያ እና የክርስቲያን ቴክኖሎጂ።',
    heroTitle: 'ሚዲያ እና ቴክ',
    heroSubtitle: 'ወንጌል የሚታይበት፣ የሚሰማበት እና ለቤተ ክርስቲያን መሣሪያ የሚሆንበት ቦታ።',
    leadLabel: 'ጥሪያችን',
    leadText:
      'ደብረ ኤፍራታ ቅድስት ማርያምን በአንድ እጅ ካሜራ፣ በሌላኛው ኮድ እናገለግላለን — የእምነትን ታሪክ እንናገራለን፤ ለጸሎት፣ ለትምህርት እና ለኅብረት የሚረዱ ምርቶችን እንገነባለን።',
    servicesLabel: 'በአራት መንገድ እናገለግላለን',
    featuredLabel: 'የተለየ ፕሮጀክት',
    moreLabel: 'በሂደት ላይ',
    openApp: 'በጉግል ፕሌይ ያግኙ',
    soon: 'በቅርቡ',
    ctaTitle: 'ከእኛ ጋር ይስሩ',
    ctaText: 'የበዓል ሽፋን፣ ፊልም፣ ዘመቻ ወይም የክርስቲያን መተግበሪያ — ውይይት ይጀምሩ።',
    ctaButton: 'ያግኙን',
    services: [
      {
        key: 'imaging',
        title: 'ምስል',
        text: 'ለበዓላት፣ ለትምህርት እና ለደብር ሕይወት ፎቶግራፊ እና ንድፍ።',
        icon: 'imaging',
      },
      {
        key: 'video',
        title: 'ቪዲዮ',
        text: 'አምልኮን፣ ምስክርነትን እና ትምህርትን የሚሸከም ቀረጻና አርትዖት።',
        icon: 'video',
      },
      {
        key: 'social',
        title: 'ማህበራዊ',
        text: 'በሰንበት ትምህርት ቤት ቻናሎች ላይ የተከበረ እና ወጥ መገኘት።',
        icon: 'social',
      },
      {
        key: 'tech',
        title: 'ቴክ',
        text: 'ለኦርቶዶክሳዊ ሕይወት እና ትምህርት የተገነቡ መተግበሪያዎች።',
        icon: 'tech',
      },
    ],
    featured: {
      title: 'ዓምደሃይማኖት ዝማሬ',
      text: 'ለዓመቱ፣ ለጾማት እና ለበዓላት የኦርቶዶክስ ዝማሬዎች — ከመስመር ውጭ፣ ለፍለጋ ቀላል፣ ለልምምድ የተዘጋጀ።',
      tag: 'የሞባይል መተግበሪያ',
    },
    moreProjects: [
      { title: 'የሚዲያ ማህደር', text: 'ከአገልግሎት ሕይወት ፎቶዎች እና ፊልሞች።' },
      { title: 'የትምህርት መግቢያ', text: 'ለወጣቶች የተዋቀሩ የክርስቲያን ትምህርቶች።' },
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
