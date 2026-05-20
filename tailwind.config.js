export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 28px 90px rgba(15, 23, 42, 0.32)',
      },
      colors: {
        surface: 'rgba(15, 23, 42, 0.72)',
        surface2: 'rgba(15, 23, 42, 0.88)',
        accent: '#8b5cf6',
        accentSoft: '#38bdf8',
        success: '#22c55e',
      },
      backgroundImage: {
        'dashboard-glow': 'radial-gradient(circle at 12% 12%, rgba(34,211,238,0.22), transparent 30%), radial-gradient(circle at 88% 14%, rgba(168,85,247,0.28), transparent 34%), radial-gradient(circle at 78% 86%, rgba(34,197,94,0.16), transparent 26%)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
