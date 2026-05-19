export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 28px 90px rgba(15, 23, 42, 0.28)',
      },
      colors: {
        surface: 'rgba(15, 23, 42, 0.72)',
        surface2: 'rgba(15, 23, 42, 0.88)',
        accent: '#8b5cf6',
        accentSoft: '#38bdf8',
        success: '#22c55e',
      },
      backgroundImage: {
        'dashboard-glow': 'radial-gradient(circle at top left, rgba(139, 92, 246, 0.35), transparent 42%), radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.18), transparent 36%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
