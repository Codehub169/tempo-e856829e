import { extendTheme } from '@chakra-ui/react';

// Base colors are defined directly. Components should reference them as 'primary', 'text', etc.
// Or use semantic tokens like 'blue.500' which are mapped below.
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
  
  // Chakra specific mappings for color schemes and shades
  blue: {
    50: '#e6f4fc',
    100: '#cce9f9',
    200: '#b3ddf6',
    300: '#99d2f3',
    400: '#80c6f0',
    500: '#3498db', // primary
    600: '#2d83bc',
    700: '#256f9e',
    800: '#1e5a7f',
    900: '#174561',
  },
  red: {
    50: '#fdeaea',
    100: '#f9d5d5',
    200: '#f5bfbf',
    300: '#f1a9a9',
    400: '#ed9494',
    500: '#e74c3c', // accent/error
    600: '#c0392b',
    700: '#a02f23',
    800: '#80251c',
    900: '#601c15',
  },
  green: {
    50: '#eafaf1',
    100: '#d5f5e3',
    200: '#abebc6',
    300: '#82e0aa',
    400: '#58d68d',
    500: '#2ecc71', // success
    600: '#27ae60', // darker success for hover
    700: '#229954',
    800: '#1e8449',
    900: '#196f3d',
  },
  orange: {
    50: '#fff5e6',
    100: '#ffe0b3',
    200: '#ffd180',
    300: '#ffc24d',
    400: '#ffb31a',
    500: '#f39c12', // warning
    600: '#e67e22', // darker warning for hover
    700: '#d35400',
    800: '#ba4a00',
    900: '#a04000',
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
              bg: colors.red[600], 
            },
          };
        }
        if (props.colorScheme === 'primary') {
            return {
              bg: colors.primary, 
              color: colors.white,
              _hover: {
                bg: colors.blue[600], 
              },
            };
          }
        // Default solid variant (e.g., for colorScheme='gray', 'green', 'orange')
        // Chakra UI will look up `${props.colorScheme}.500` and `${props.colorScheme}.600` in `theme.colors`
        return {
            bg: `${props.colorScheme}.500`,
            color: colors.white,
            _hover: {
                bg: `${props.colorScheme}.600`,
            }
        };
      },
    },
    defaultProps: {
      colorScheme: 'primary', 
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
      focusBorderColor: 'blue.500', 
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: 'blue.500', 
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
