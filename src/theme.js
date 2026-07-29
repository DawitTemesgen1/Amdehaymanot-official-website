import { createTheme } from '@mui/material/styles';
import { brand } from './brand';

const theme = createTheme({
  palette: {
    primary: {
      main: brand.navy,
      light: brand.navyLight,
      dark: brand.navyDark,
      contrastText: brand.white,
    },
    secondary: {
      main: brand.gold,
      light: brand.goldLight,
      dark: brand.goldDark,
      contrastText: brand.navyInk,
    },
    background: {
      default: brand.stone,
      paper: brand.surfaceElevated,
    },
    text: {
      primary: brand.ink,
      secondary: brand.inkMuted,
    },
  },
  typography: {
    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
    body1: { lineHeight: 1.75, fontSize: '1.05rem' },
    body2: { lineHeight: 1.7 },
    h1: {
      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.12,
      fontSize: '2.85rem',
      '@media (min-width:600px)': { fontSize: '3.6rem' },
      '@media (min-width:900px)': { fontSize: '4.5rem' },
    },
    h2: {
      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.15,
      fontSize: '2.15rem',
      '@media (min-width:600px)': { fontSize: '2.75rem' },
      '@media (min-width:900px)': { fontSize: '3.25rem' },
    },
    h3: {
      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '1.75rem',
      '@media (min-width:600px)': { fontSize: '2.1rem' },
    },
    h4: {
      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
    },
    button: {
      fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.06em',
    },
  },
  shape: {
    borderRadius: brand.frameRadius,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          padding: '12px 28px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
        },
        containedSecondary: {
          boxShadow: `0 0 0 1px ${brand.goldDark}`,
          '&:hover': {
            boxShadow: `0 8px 28px rgba(255, 207, 0, 0.35)`,
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': { borderWidth: 1.5 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid ${brand.borderSubtle}`,
          borderRadius: 2,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: 'none' },
        outlined: {
          border: `1px solid ${brand.borderSubtle}`,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 2 },
        filledSecondary: {
          fontWeight: 700,
          letterSpacing: 1,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 2 },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.gold,
            borderWidth: 2,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none' },
      },
    },
  },
});

export default theme;
