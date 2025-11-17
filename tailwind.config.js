/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ff817c',
          DEFAULT: '#f6433d',
          dark: '#d63832',
        },
        secondary: {
          50: '#fef3f2',
          100: '#fde7e6',
          200: '#fbd4d2',
          300: '#f9b5b1',
          400: '#f58881',
          500: '#ff817c',
          600: '#f6433d',
          700: '#d63832',
          800: '#b42e29',
          900: '#8f2621',
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'gradient': 'gradient 3s ease infinite',
        'loading-bar': 'loadingBar 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        loadingBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      backgroundSize: {
        'shimmer': '1000px 100%',
        'gradient': '200% 200%',
      },
    },
  },
  plugins: [],
}