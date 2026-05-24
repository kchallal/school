/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#1C1F2A',
        'surface-2': '#252836',
        accent: '#4ECCA3',
        'accent-dim': '#2A9D7A',
        danger: '#FF6B6B',
        warn: '#FFB347',
        muted: '#6B7280',
        base: '#0F1117',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
