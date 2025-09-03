import defaultTheme from 'tailwindcss/defaultTheme';
import { bgColors } from '../constants/colors.js';

export default {
  content: ["./**/*.{html,js,svelte}"],
  safelist: [
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    ...bgColors, // import and use directly
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        fab: {
          DEFAULT: "#5E60CE",
          light: "#A8A9F5",
          dark: "#3A0CA3",
          accent: "#F72585",
          background: "#F8F9FC",
          muted: "#ADB5BD",
        },
      },
    },
  },
  plugins: [],
};
