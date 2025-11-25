/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        wavePulse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(4px)' },
        },
        fadeInScale: {                   // <-- nuova animazione
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        wavePulse: 'wavePulse 3s ease-in-out infinite',
        'fade-in-scale': 'fadeInScale 0.35s ease-out forwards', // <-- uso diretto in componenti
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function({ addUtilities, theme }) {
      const newAnimations = {
        '.animate-slide-in-right': {
          animation: 'slideInRight 0.3s ease-out forwards',
        },
        '.animate-slide-in-left': {
          animation: 'slideInLeft 0.3s ease-out forwards',
        },
      };
      addUtilities(newAnimations, ['responsive', 'hover']);
    }),
    plugin(function({ addBase, theme }) {
      addBase({
        '@keyframes slideInRight': {
          '0%': { opacity: '0', transform: 'translateX(50%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        '@keyframes slideInLeft': {
          '0%': { opacity: '0', transform: 'translateX(-50%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      });
    }),
  ],
};

