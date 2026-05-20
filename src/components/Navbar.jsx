import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'

export default function Navbar() {
  const {
    toggleTheme,
    currentTheme,
    totalCalories,
    caloriesRemaining,
    dailyHealth,
    personalizedGreeting,
    selectedHouse,
    gamification,
  } = useAppContext()
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{personalizedGreeting.greeting}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold text-white">Enchanted Nutrition Academy</h2>
          <span className="rounded-2xl bg-white/5 px-3 py-1 text-sm text-slate-300">{today}</span>
          {selectedHouse ? (
            <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
              {selectedHouse.name} / {gamification.rank?.label}
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-slate-400">{personalizedGreeting.message}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/75 px-4 py-4 shadow-glass">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Potion Energy</p>
          <p className="mt-2 text-lg font-semibold text-white">{totalCalories} kcal</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/75 px-4 py-4 shadow-glass">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Remaining</p>
          <p className="mt-2 text-lg font-semibold text-white">{caloriesRemaining} kcal</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/75 px-4 py-4 shadow-glass">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Academy Score</p>
          <p className="mt-2 text-lg font-semibold text-white">{dailyHealth.score}</p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-3xl border border-white/10 bg-slate-900/75 px-4 py-4 text-sm font-medium text-slate-100 transition hover:bg-white/5"
          aria-label="Cycle theme"
        >
          {currentTheme.name}
        </button>
      </div>
    </motion.header>
  )
}
