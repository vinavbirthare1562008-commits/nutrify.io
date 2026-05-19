import { motion } from 'framer-motion'
import Modal from './Modal.jsx'
import { buildFoodNutritionDetails } from '../utils/appUtils.js'

const nutrientBars = [
  { key: 'protein', label: 'Protein', color: 'from-cyan-400 to-blue-500' },
  { key: 'carbs', label: 'Carbs', color: 'from-orange-400 to-amber-500' },
  { key: 'fats', label: 'Fats', color: 'from-violet-500 to-fuchsia-500' },
  { key: 'fiber', label: 'Fiber', color: 'from-emerald-400 to-emerald-500' },
  { key: 'sugar', label: 'Sugar', color: 'from-rose-500 to-pink-500' },
]

const microKeys = [
  { key: 'sodium', label: 'Sodium' },
  { key: 'potassium', label: 'Potassium' },
  { key: 'calcium', label: 'Calcium' },
  { key: 'iron', label: 'Iron' },
  { key: 'magnesium', label: 'Magnesium' },
  { key: 'vitaminA', label: 'Vitamin A' },
  { key: 'vitaminB', label: 'Vitamin B' },
  { key: 'vitaminC', label: 'Vitamin C' },
  { key: 'vitaminD', label: 'Vitamin D' },
]

export default function FoodDetailsModal({ open, food, onClose, onAddToLog }) {
  if (!food) return null

  const details = buildFoodNutritionDetails(food)

  return (
    <Modal open={open} title={`${details.name} nutrition details`} onClose={onClose}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3 rounded-[28px] border border-white/10 bg-slate-950/80 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{details.category}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{details.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{details.serving} • {details.category}</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-500 px-4 py-3 text-right text-white shadow-lg shadow-cyan-500/20">
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-100">Health score</p>
                <p className="mt-2 text-3xl font-semibold">{details.healthScore}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900/75 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Calories</p>
                <p className="mt-3 text-2xl font-semibold text-white">{details.calories} kcal</p>
              </div>
              <div className="rounded-3xl bg-slate-900/75 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quality</p>
                <p className="mt-3 text-2xl font-semibold text-white">{details.nutritionQuality}%</p>
              </div>
              <div className="rounded-3xl bg-slate-900/75 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Category</p>
                <p className="mt-3 text-2xl font-semibold text-white">{details.category}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Nutrition snapshot</p>
            <div className="mt-5 space-y-4">
              {nutrientBars.map((item) => {
                const value = Math.min(Math.round(details[item.key] || 0), 100)
                return (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{item.label}</span>
                      <span>{details[item.key] ?? 0}{item.key === 'protein' || item.key === 'carbs' || item.key === 'fats' || item.key === 'fiber' ? 'g' : 'g'}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Micronutrient profile</p>
              <p className="mt-2 text-sm text-slate-400">A complete vitamin and mineral snapshot for this item.</p>
            </div>
            <span className="rounded-full bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">Premium</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {microKeys.map((item) => (
              <div key={item.key} className="rounded-3xl bg-slate-900/75 p-4">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-3 text-lg font-semibold text-white">{details[item.key]}{item.key === 'iron' ? ' mg' : item.key === 'vitaminD' ? ' IU' : ' mg'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Fully detailed nutrition insights for this item.</p>
            <p className="text-sm text-slate-400">Tap add to log it instantly in your daily plan.</p>
          </div>
          <button
            type="button"
            onClick={() => onAddToLog?.(details)}
            className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Add to log
          </button>
        </div>
      </motion.div>
    </Modal>
  )
}
