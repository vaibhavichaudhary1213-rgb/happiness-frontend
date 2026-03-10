// styles/forestCabinTheme.js
export const forestCabinTheme = {
  name: "Whispering Woods & Lavender",
  colors: {
    primary: {
      light: '#2A453A',      // Light forest (was #1A3A3A)
      main: '#1A3A3A',        // Deep forest green
      dark: '#0A2A2A',        // Very dark forest
      gradient: 'linear-gradient(135deg, #1A3A3A 0%, #0A2A2A 100%)',
      text: '#E8E0E0'
    },
    secondary: {
      light: '#4A3570',       // Light lavender (was #2A254A)
      main: '#2A254A',        // Deep lavender
      dark: '#1A1540',        // Very dark lavender
      gradient: 'linear-gradient(135deg, #2A254A 0%, #1A1540 100%)',
      text: '#E8D0E8'
    },
    accent: {
      peach: '#D8B0A0',
      terracotta: '#B88A7A',
      sage: '#2A453A',
      lightSage: '#3A554A',
      lavender: '#2A254A',
      darkLavender: '#1A1540',
      deepPurple: '#4A2A48',
      plum: '#3A1F38',
      honey: '#D8C0A0',
      warmGray: '#4A4A4A',
      softLavender: '#3A2A48',
      mutedSage: '#2A3A3A',
      forest: '#1A3A3A',
      whisper: '#2A453A'
    },
    background: {
      main: '#0A1A1A',        // Deep forest background
      paper: '#1A2A2A',       // Slightly lighter forest
      warm: '#1A2525',        // Warm forest
      cozy: '#152020'         // Cozy dark forest
    },
    text: {
      primary: '#E8E0E0',      // Soft white
      secondary: '#C0B8C0',    // Light gray with lavender tint
      muted: '#8A8A8A',        // Medium gray
      lavender: '#B8A8D8',     // Light lavender
      darkPurple: '#C0B0E0',   // Light purple for headers
      plum: '#D0C0E0',         // Very light plum
      light: '#F0F0F0'         // Bright white
    },
    success: {
      light: '#2A554A',
      main: '#1A3A3A',
      dark: '#0A2A2A',
    },
    warning: {
      light: '#D8B080',
      main: '#C09A6A',
      dark: '#A07A4A',
    },
    error: {
      light: '#D89A9A',
      main: '#B87A7A',
      dark: '#985A5A',
    },
    purple: {
      50: '#2A254A',   // Deep lavender
      100: '#3A2A5A',  // Medium lavender
      200: '#4A3A6A',  // Light lavender
      300: '#5A4A7A',  // Lighter lavender
      400: '#6A5A8A',  // Very light lavender
      500: '#7A6A9A',  // Almost light
      600: '#8A7AAA',  // Lightest lavender
    },
    green: {
      50: '#0A1A1A',   // Deepest forest
      100: '#1A2A2A',  // Deep forest
      200: '#1A3A3A',  // Forest
      300: '#2A4A4A',  // Light forest
      400: '#3A5A5A',  // Lighter forest
      500: '#4A6A6A',  // Very light forest
    },
    neutral: {
      50: '#0A0F0A',
      100: '#1A1F1A',
      200: '#2A2F2A',
      300: '#3A3F3A',
      400: '#4A4F4A',
      500: '#5A5F5A',
      600: '#6A6F6A',
      700: '#7A7F7A',
      800: '#8A8F8A',
      900: '#9A9F9A',
    }
  },
  
  animation: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.5)',
    md: '0 4px 12px rgba(0, 0, 0, 0.6)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.7)',
    xl: '0 12px 32px rgba(0, 0, 0, 0.8)',
    warm: '0 4px 20px rgba(42, 37, 74, 0.4)'
  },
  
  borderRadius: {
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    full: '9999px',
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.5rem',
    h4: '1.25rem',
    body: '1rem',
    small: '0.875rem',
    tiny: '0.75rem',
  }
};