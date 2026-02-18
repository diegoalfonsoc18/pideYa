/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8F66',
          dark: '#E55A24',
          50: '#FFF3EE',
          100: '#FFE0D1',
          200: '#FFC2A3',
          500: '#FF6B35',
          600: '#E55A24',
          700: '#CC4A16',
          900: '#7A2D0A',
        },
        secondary: {
          DEFAULT: '#2C3E50',
          light: '#3D566E',
          dark: '#1A252F',
          50: '#E8ECF0',
          100: '#C5CFD9',
          200: '#8D9FB2',
          500: '#2C3E50',
          700: '#1A252F',
          900: '#0D1318',
        },
        success: '#27AE60',
        danger: {
          DEFAULT: '#E74C3C',
          light: '#FDEDEB',
        },
        warning: '#F39C12',
        background: '#F5F1ED',
        card: '#FFFFFF',
        muted: {
          DEFAULT: '#8E8E93',
          light: '#C7C7CC',
        },
        cream: '#FAF7F4',
        sand: '#EDE8E2',
      },
      borderRadius: {
        '2xl': 16,
        '3xl': 24,
        '4xl': 32,
      },
      fontSize: {
        'display': [42, { lineHeight: '48', letterSpacing: -1.5, fontWeight: '800' }],
        'heading': [32, { lineHeight: '38', letterSpacing: -0.8, fontWeight: '700' }],
        'title': [24, { lineHeight: '30', letterSpacing: -0.4, fontWeight: '600' }],
        'body-lg': [17, { lineHeight: '24', fontWeight: '400' }],
        'body': [15, { lineHeight: '22', fontWeight: '400' }],
        'caption': [13, { lineHeight: '18', fontWeight: '500' }],
        'micro': [11, { lineHeight: '14', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
