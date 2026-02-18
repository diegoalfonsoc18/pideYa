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
        primary: '#FF6B35',
        secondary: '#2C3E50',
        success: '#27AE60',
        danger: '#E74C3C',
        warning: '#F39C12',
        background: '#F8F9FA',
        card: '#FFFFFF',
        muted: '#8E8E93',
      },
    },
  },
  plugins: [],
};
