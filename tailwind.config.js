/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a32a87',
          light: '#821c69',
          dark: '#3b002f',
          container: '#fcf8fb',
          'on-container': '#3b002f',
        },
        secondary: {
          DEFAULT: '#75566e',
          light: '#8f6f87',
          dark: '#5c4358',
          container: '#ffd7f2',
        },
        surface: {
          DEFAULT: '#fcf8fb',
          dim: '#dcd9dc',
          bright: '#fcf8fb',
        },
        outline: '#7f747d',
        'outline-variant': '#d0c3cc',
      },
      fontFamily: {
        sans: ['Lexend', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 2px 4px rgba(163, 42, 135, 0.05), 0 8px 24px rgba(163, 42, 135, 0.08)',
        nav: '0 1px 3px rgba(163, 42, 135, 0.06)',
      },
    },
  },
  plugins: [],
};
