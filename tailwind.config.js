/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        // Figma palette
        figma: {
          black: '#000000',
          white: '#FFFFFF',
          'green-cta': '#1FDB1C',
          'green-cta-glow': '#1FDB1C',
          'green-badge-bg': '#D8E5D8',
          'green-badge-text': '#206D1F',
          'card-shadow': 'rgba(0, 0, 0, 0.25)',
        },
        primary: {
          DEFAULT: '#1FDB1C',
          light: '#D8E5D8',
          dark: '#206D1F',
        },
      },
    },
  },
  plugins: [],
}
