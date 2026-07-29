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
      contrastText: brand.navyDark,
    },
    background: {
      default: brand.white,
      paper: '#F8FAFC',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans Ethiopic", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 65, 121, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 65, 121, 0.12)',
        },
      },
    },
  },
});

export default theme;
