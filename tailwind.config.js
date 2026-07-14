/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a237e',
          light: '#3949ab',
          dark: '#0d1642',
          container: '#e8eaf6',
        },
        secondary: {
          DEFAULT: '#00bcd4',
          light: '#4dd0e1',
          dark: '#00838f',
          container: '#e0f7fa',
        },
        surface: '#f8f9ff',
        'outline-variant': '#ccdbf3',
      },
      fontFamily: {
        sans: ['Lexend', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
      boxShadow: {
        card: '0 2px 4px rgba(26, 35, 126, 0.05), 0 8px 24px rgba(26, 35, 126, 0.08)',
        nav: '0 1px 3px rgba(26, 35, 126, 0.06)',
      },
    },
  },
  plugins: [],
};
