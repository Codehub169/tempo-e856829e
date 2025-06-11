import { extendTheme } from '@chakra-ui/react';

const colors = {
  primary: '#3498db',        // Peter River
  secondary: '#ecf0f1',      // Clouds
  accent: '#e74c3c',         // Alizarin
  text: '#2c3e50',           // Wet Asphalt
  lightText: '#58697a',      // Lighter text
  border: '#bdc3c7',         // Silver
  cardBg: '#f8f9fa',         // Lightest background/cards
  white: '#ffffff',
  success: '#2ecc71',        // Emerald
  warning: '#f39c12',        // Orange
  error: '#e74c3c',          // Alizarin (same as accent)
  // Chakra specific mappings if needed, e.g. for color schemes
  blue: {
    500: '#3498db', // primary
  },
  red: {
    500: '#e74c3c', // accent/error
  },
  green: {
    500: '#2ecc71', // success
  },
  orange: {
    500: '#f39c12', // warning
  },
  gray: {
    50: '#f8f9fa',    // cardBg / lightest gray
    100: '#ecf0f1',   // secondary / light gray
    200: '#dfe3e6',
    300: '#bdc3c7',   // border
    400: '#a7b0b6',
    500: '#8e9ba7',   
    600: '#58697a',   // lightText
    700: '#42505e',
    800: '#2c3e50',   // text
    900: '#1a202c',   // darker text
  }
};

const fonts = {
  heading: "'Lora', serif",
  body: "'Inter', sans-serif",
  mono: "Menlo, Monaco, Consolas, 'Courier New', monospace",
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const styles = {
  global: (props) => ({
    body: {
      fontFamily: fonts.body,
      color: colors.text,
      bg: colors.secondary,
      lineHeight: '1.6',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: fonts.heading,
      color: colors.text,
    },
    a: {
      color: colors.primary,
      _hover: {
        textDecoration: 'underline',
      },
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '500',
      borderRadius: '5px',
    },
    variants: {
      solid: (props) => {
        if (props.colorScheme === 'accent') {
          return {
            bg: colors.accent,
            color: colors.white,
            _hover: {
              bg: '#c0392b', // Darker accent
            },
          };
        }
        if (props.colorScheme === 'primary') {
            return {
              bg: colors.primary,
              color: colors.white,
              _hover: {
                bg: '#2980b9', // Darker primary
              },
            };
          }
        return {};
      },
    },
    defaultProps: {
      colorScheme: 'primary', // Default to primary if not specified
    },
  },
  Link: {
    baseStyle: {
      color: colors.primary,
      _hover: {
        textDecoration: 'underline',
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'primary.500',
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: 'primary.500',
    },
  },
  Container: {
    baseStyle: {
      width: '90%',
      maxW: '1100px',
      py: '20px',
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
});

export default theme;
