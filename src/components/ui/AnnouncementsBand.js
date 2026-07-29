import React from 'react';
import { format, parseISO } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Container, Typography,
} from '@mui/material';
import { styled, alpha } from '@mui/system';
import { motion, useReducedMotion } from 'framer-motion';
import { brand } from '../../brand';
import { API_ROOT_URL } from '../../api/axiosConfig';

const easeOut = [0.16, 1, 0.3, 1];
const viewOpts = { once: true, amount: 0.15 };

const imageUrlFor = (item) =>
  (item.image_url ? `${API_ROOT_URL}${item.image_url}` : null);

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(8, 2, 9),
  background: brand.white,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2, 7),
  },
}));

const Grid2 = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(0, 6),
  alignItems: 'start',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(5, 0),
  },
}));

const Column = styled(Box)(({ theme }) => ({
  minWidth: 0,
  [theme.breakpoints.up('md')]: {
    '&:first-of-type': {
      paddingRight: theme.spacing(3),
      borderRight: `1px solid ${alpha(brand.navy, 0.12)}`,
    },
    '&:last-of-type': {
      paddingLeft: theme.spacing(3),
    },
  },
}));

const ColLabel = styled(Typography)({
  margin: 0,
  marginBottom: 20,
  paddingBottom: 12,
  borderBottom: `2px solid ${brand.gold}`,
  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  fontSize: '0.7rem',
  color: brand.navy,
});

const Row = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '96px 1fr',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  textDecoration: 'none',
  color: 'inherit',
  borderBottom: `1px solid ${alpha(brand.navy, 0.08)}`,
  transition: 'background-color 0.2s ease',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: alpha(brand.stone, 0.65),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '76px 1fr',
    gap: theme.spacing(1.5),
  },
}));

const Thumb = styled(Box)({
  width: '100%',
  aspectRatio: '1 / 1',
  objectFit: 'cover',
  display: 'block',
  background: brand.stone,
  border: `1px solid ${alpha(brand.navy, 0.1)}`,
});

const DateBlock = styled(Box)({
  width: '100%',
  aspectRatio: '1 / 1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: brand.stone,
  border: `1px solid ${alpha(brand.navy, 0.1)}`,
});

/**
 * Structured two-column bulletin — clear, aligned, calm.
 */
const AnnouncementsBand = ({
  title,
  subtitle,
  latestNewsLabel,
  upcomingEventsLabel,
  noNews,
  noEvents,
  viewAllLabel,
  loading,
  news = [],
  events = [],
}) => {
  const reduceMotion = useReducedMotion();
  const hasItems = news.length > 0 || events.length > 0;

  return (
    <Root component="section" aria-labelledby="announcements-title">
      <Container maxWidth="lg">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOpts}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 560, mx: 'auto' }}>
            <Typography
              id="announcements-title"
              component="h2"
              sx={{
                m: 0,
                fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.85rem, 3.5vw, 2.6rem)',
                lineHeight: 1.15,
                color: brand.navy,
              }}
            >
              {title}
            </Typography>
            <Box
              aria-hidden
              sx={{
                width: 48,
                height: 2,
                mx: 'auto',
                my: 2,
                bgcolor: brand.gold,
              }}
            />
            {subtitle && (
              <Typography
                sx={{
                  m: 0,
                  fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: alpha(brand.ink, 0.62),
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </motion.div>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress size={32} sx={{ color: brand.navy }} />
          </Box>
        ) : (
          <Grid2>
            <Column>
              <ColLabel>{latestNewsLabel}</ColLabel>
              {news.length > 0 ? (
                news.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewOpts}
                    transition={{ duration: 0.45, ease: easeOut, delay: i * 0.05 }}
                  >
                    <Row component={RouterLink} to="/news-and-events">
                      {imageUrlFor(item) ? (
                        <Box
                          component="img"
                          className="thumb"
                          src={imageUrlFor(item)}
                          alt=""
                          sx={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            objectFit: 'cover',
                            display: 'block',
                            border: `1px solid ${alpha(brand.navy, 0.1)}`,
                          }}
                        />
                      ) : (
                        <Thumb as="div" />
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                            fontWeight: 600,
                            fontSize: '1.2rem',
                            lineHeight: 1.25,
                            color: brand.navy,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.75,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: alpha(brand.ink, 0.48),
                          }}
                        >
                          {format(parseISO(item.created_at), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    </Row>
                  </motion.div>
                ))
              ) : (
                <Typography sx={{ color: alpha(brand.ink, 0.5), py: 2 }}>{noNews}</Typography>
              )}
            </Column>

            <Column>
              <ColLabel>{upcomingEventsLabel}</ColLabel>
              {events.length > 0 ? (
                events.map((item, i) => {
                  const d = parseISO(item.event_date);
                  return (
                    <motion.div
                      key={item.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewOpts}
                      transition={{ duration: 0.45, ease: easeOut, delay: i * 0.05 }}
                    >
                      <Row component={RouterLink} to="/news-and-events">
                        <DateBlock>
                          <Typography
                            sx={{
                              fontFamily: '"Cormorant Garamond", serif',
                              fontWeight: 700,
                              fontSize: '1.65rem',
                              lineHeight: 1,
                              color: brand.navy,
                            }}
                          >
                            {format(d, 'd')}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.35,
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              color: brand.goldDark,
                            }}
                          >
                            {format(d, 'MMM')}
                          </Typography>
                        </DateBlock>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                              fontWeight: 600,
                              fontSize: '1.2rem',
                              lineHeight: 1.25,
                              color: brand.navy,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.75,
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              color: alpha(brand.ink, 0.48),
                            }}
                          >
                            {format(d, 'EEEE · h:mm a')}
                          </Typography>
                        </Box>
                      </Row>
                    </motion.div>
                  );
                })
              ) : (
                <Typography sx={{ color: alpha(brand.ink, 0.5), py: 2 }}>{noEvents}</Typography>
              )}
            </Column>
          </Grid2>
        )}

        {!loading && hasItems && (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              component={RouterLink}
              to="/news-and-events"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 1,
                px: 4,
                textTransform: 'none',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              {viewAllLabel}
            </Button>
          </Box>
        )}
      </Container>
    </Root>
  );
};

export default AnnouncementsBand;
