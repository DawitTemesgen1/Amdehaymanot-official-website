/** Match AboutHero / HomeHero nav offsets so sections fill one screen. */
export const DESKTOP_NAV = '96px';
export const MOBILE_NAV = '72px';

/** One-screen section styles (desktop locks height; mobile can scroll if needed). */
export const fillViewportSx = {
  height: `calc(100vh - ${DESKTOP_NAV})`,
  maxHeight: `calc(100vh - ${DESKTOP_NAV})`,
  minHeight: `calc(100vh - ${DESKTOP_NAV})`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxSizing: 'border-box',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  '@supports (height: 100dvh)': {
    height: `calc(100dvh - ${DESKTOP_NAV})`,
    maxHeight: `calc(100dvh - ${DESKTOP_NAV})`,
    minHeight: `calc(100dvh - ${DESKTOP_NAV})`,
  },
  '@media (max-width: 899.95px)': {
    height: `calc(100vh - ${MOBILE_NAV})`,
    maxHeight: `calc(100vh - ${MOBILE_NAV})`,
    minHeight: `calc(100vh - ${MOBILE_NAV})`,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    '@supports (height: 100dvh)': {
      height: `calc(100dvh - ${MOBILE_NAV})`,
      maxHeight: `calc(100dvh - ${MOBILE_NAV})`,
      minHeight: `calc(100dvh - ${MOBILE_NAV})`,
    },
  },
};
