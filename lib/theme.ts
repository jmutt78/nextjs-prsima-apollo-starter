import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    display: React.CSSProperties;
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h2Bold: React.CSSProperties;
    h3: React.CSSProperties;
    h3Bold: React.CSSProperties;
    h4: React.CSSProperties;
    body1: React.CSSProperties;
    body1Bold: React.CSSProperties;
    body2: React.CSSProperties;
    body2Bold: React.CSSProperties;
    small1: React.CSSProperties;
    small1Bold: React.CSSProperties;
    tiny: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    display: React.CSSProperties;
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h2Bold: React.CSSProperties;
    h3: React.CSSProperties;
    h3Bold: React.CSSProperties;
    h4: React.CSSProperties;
    body1: React.CSSProperties;
    body1Bold: React.CSSProperties;
    body2: React.CSSProperties;
    body2Bold: React.CSSProperties;
    small1: React.CSSProperties;
    small1Bold: React.CSSProperties;
    tiny: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
    h1: true;
    h2: true;
    h2Bold: true;
    h3: true;
    h3Bold: true;
    h4: true;
    body1: true;
    body1Bold: true;
    body2: true;
    body2Bold: true;
    small1: true;
    small1Bold: true;
    tiny: true;
  }
}

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const extraColors = {
  primary: '#165D7A',
  secondary: '#DADDC2',
  success: '#D99643',
  error: '#A7342B',
  warning: '#CC4322',
  dark: 'rgba(48, 48, 48, 1)',
  medium: 'rgba(91, 107, 102, 1)',
  hint: 'rgba(128, 147, 141, 1)',
  disabled: 'rgba(191, 203, 199, 1)',
} as const;

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: extraColors.primary,
    },
    secondary: {
      main: extraColors.secondary,
    },
    success: {
      main: extraColors.success,
    },
    error: {
      main: extraColors.error,
    },
    warning: {
      main: extraColors.warning,
    },
    text: {
      primary: '#000',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontSize: 16,
    display: {
      fontSize: 50,
      fontWeight: 600,
      color: extraColors.dark,
    },
    h1: {
      fontSize: 36,
      fontWeight: 600,
      color: extraColors.dark,
    },
    h2: {
      fontSize: 26,
      fontWeight: 400,
      color: extraColors.dark,
    },
    h2Bold: {
      fontSize: 26,
      fontWeight: 600,
      color: extraColors.dark,
    },
    h3: {
      fontSize: 20,
      letterSpacing: '0.2px',
      fontWeight: 600,
      color: extraColors.dark,
    },
    h3Bold: {
      fontSize: 20,
      fontWeight: 600,
      color: extraColors.dark,
    },
    h4: {
      fontSize: 24,
      letterSpacing: '0.1px',
      fontWeight: 600,
      color: extraColors.dark,
    },
    tiny: {
      fontSize: 9,
      fontWeight: 600,
      color: extraColors.dark,
    },
    body1: {
      fontSize: 16,
      fontWeight: 400,
      color: extraColors.dark,
    },
    body1Bold: {
      fontSize: 16,
      fontWeight: 600,
      color: extraColors.dark,
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
      color: extraColors.dark,
    },
    body2Bold: {
      fontSize: 14,
      fontWeight: 600,
      color: extraColors.dark,
    },
    small1: {
      fontSize: 12,
      fontWeight: 400,
      color: extraColors.dark,
    },
    small1Bold: {
      fontSize: 12,
      fontWeight: 600,
      color: extraColors.dark,
    },
  },

  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#000', // Notion's text color
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '7px 10px',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'transparent', // Removes the hover effect
            color: extraColors.primary,
          },
        },
        contained: {
          borderRadius: 4,
          color: extraColors.secondary,
          paddingLeft: '12px',
          paddingRight: '12px',
          fontWeight: 500,
          backgroundColor: extraColors.primary,
          boxShadow:
            'rgba(15, 15, 15, 0.1) 0px 1px 2px, rgba(235, 87, 87, 0.3) 0px 0px 0px 1px inset',
        },
      },
    },
  },
});

export default theme;
