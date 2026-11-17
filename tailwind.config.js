/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#0A2160',
          900: '#071A45',
        },
        accent: {
          50: '#EAF1FB',
          200: '#C1D4F5',
          300: '#8FB2EC',
          500: '#3D6FD0',
          600: '#0052CC',
          700: '#1D3095',
        },
        ink: {
          300: '#8A93A0',
          500: '#6C737D',
          700: '#3B444F',
          900: '#0D1521',
        },
        surface: {
          50: '#F7F9FC',
          100: '#EEF3F9',
          200: '#E2E9F2',
        }
      },
      fontFamily: {
        sans: ['"Tosh A"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
