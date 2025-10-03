import { tailwind } from '@tailwind/v4'

tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
        },
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
        },
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    tailwind.plugin(({ addUtilities, addComponents }) => {
      addUtilities({
        '.text-gradient': {
          '@apply bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500': {},
        },
        '.btn-gradient': {
          '@apply inline-block px-5 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300': {},
        },
        '.form-input': {
          '@apply block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500': {},
        },
        '.form-label': {
          '@apply block mb-2 text-sm font-medium text-gray-900 dark:text-white': {},
        },
        '.card': {
          '@apply w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700': {},
        },
        '.before-gradient::before': {
          content: '""',
          position: 'absolute',
          inset: '0',
          background: 'linear-gradient(to right, var(--color-primary-50) 50%, transparent 50%)',
          zIndex: '0',
          pointerEvents: 'none',
        },
      });

      addComponents({
        '.testimonial-swiper': {
          '.swiper-button-next, .swiper-button-prev': {
            display: 'none',
          },
          '.swiper-pagination': {
            position: 'unset !important',
            marginTop: '30px',
          },
          '.swiper-pagination-bullet': {
            width: '8px',
            height: '8px',
            background: '#CCCCCC',
            borderRadius: '50%',
          },
          '.swiper-pagination-bullet.swiper-pagination-bullet-active': {
            width: '24px',
            borderRadius: '7px',
            backgroundColor: 'var(--color-primary-600)',
          },
        },
      });
    }),
  ],
};