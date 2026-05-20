import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'
import Modal from './Modal.jsx'

const actions = [
  { key: 'meal', label: 'Add Meal', short: 'Meal' },
  { key: 'water', label: 'Add Water', short: 'Water' },
  { key: 'snack', label: 'Quick Log Snack', short: 'Snack' },
  { key: 'weight', label: 'Add Weight Entry', short: 'Weight' },
]

export default function FloatingQuickActions() {
  const navigate = useNavigate()
  const {
    foodDatabase,
    recentFoodItems,
    updateWaterIntake,
    addFoodToMeal,
    addWeightEntry,
    healthProfile,
    currentTheme,
  } = useAppContext()
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState(null)
  const [query, setQuery] = useState('')
  const [weightForm, setWeightForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: healthProfile.currentWeight,
  })

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const base = panel === 'snack'
      ? foodDatabase.filter((item) => ['Snacks', 'Fruits', 'Drinks', 'Dairy'].includes(item.category))
      : foodDatabase

    return base
      .filter((item) => !normalized || item.name.toLowerCase().includes(normalized))
      .slice(0, 8)
  }, [foodDatabase, query, panel])

  const handleAction = (key) => {
    if (key === 'water') {
      updateWaterIntake(0.25)
      setOpen(false)
      return
    }

    if (key === 'meal') {
      navigate('/')
    }

    setPanel(key)
    setOpen(false)
  }

  const closePanel = () => {
    setPanel(null)
    setQuery('')
  }

  const logFood = (food, mealType) => {
    addFoodToMeal(food, mealType)
    closePanel()
  }

  return (
    <>
      <div className="pointer-events-none fixed bottom-24 right-4 z-40 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {open ? (
            <div className="pointer-events-auto relative h-56 w-56">
              {actions.map((action, index) => {
                const angle = (-110 + index * 38) * (Math.PI / 180)
                const distance = 92
                const x = Math.cos(angle) * distance
                const y = Math.sin(angle) * distance

                return (
                  <motion.button
                    key={action.key}
                    type="button"
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x, y }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.22 }}
                    onClick={() => handleAction(action.key)}
                    className="absolute bottom-0 right-0 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-slate-950/90 text-center text-[11px] font-semibold text-white shadow-glass backdrop-blur-xl"
                  >
                    {action.short}
                  </motion.button>
                )
              })}
            </div>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen((value) => !value)}
          className="pointer-events-auto relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-slate-950 shadow-[0_20px_45px_rgba(15,23,42,0.35)] backdrop-blur-xl"
          style={{ background: `linear-gradient(135deg, ${currentTheme.colors[0]}, ${currentTheme.colors[1]})` }}
          aria-label="Open quick actions"
        >
          <span className="text-3xl font-light">{open ? '×' : '+'}</span>
        </motion.button>
      </div>

      <Modal
        open={panel === 'meal' || panel === 'snack'}
        title={panel === 'snack' ? 'Quick Log Snack' : 'Quick Add Meal'}
        description="Search and log food instantly from the floating action system."
        onClose={closePanel}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={panel === 'snack' ? 'Search snack foods...' : 'Search meals, fruits, or protein...'}
            className="w-full rounded-[24px] border border-white/10 bg-slate-950/80 px-5 py-4 text-sm text-white outline-none transition focus:border-cyan-400"
          />

          <div className="grid gap-4 md:grid-cols-2">
            {searchResults.map((food) => (
              <button
                key={food.name}
                type="button"
                onClick={() => logFood(food, panel === 'snack' ? 'Snacks' : 'Lunch')}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{food.name}</p>
                    <p className="mt-2 text-xs text-slate-400">{food.serving} / {food.category}</p>
                  </div>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{food.calories} kcal</span>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Recent quick log</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {recentFoodItems.slice(0, 6).map((food) => (
                <button
                  key={food.name}
                  type="button"
                  onClick={() => logFood(food, panel === 'snack' ? 'Snacks' : 'Lunch')}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  {food.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={panel === 'weight'}
        title="Add Weight Entry"
        description="Log a new body-weight reading from anywhere in the app."
        onClose={closePanel}
        maxWidth="max-w-xl"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            addWeightEntry(weightForm)
            closePanel()
          }}
          className="space-y-5"
        >
          <label className="space-y-2 text-sm text-slate-300">
            Date
            <input
              type="date"
              value={weightForm.date}
              onChange={(event) => setWeightForm((current) => ({ ...current, date: event.target.value }))}
              className="w-full rounded-[24px] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Weight (kg)
            <input
              type="number"
              step="0.1"
              value={weightForm.weight}
              onChange={(event) => setWeightForm((current) => ({ ...current, weight: event.target.value }))}
              className="w-full rounded-[24px] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-[24px] bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Save weight entry
          </button>
        </form>
      </Modal>
    </>
  )
}
