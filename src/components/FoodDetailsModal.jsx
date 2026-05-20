import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Modal from './Modal.jsx'
import { buildFoodNutritionDetails, MICRO_NUTRIENT_META } from '../utils/appUtils.js'

const macroCards = [
  { key: 'calories', label: 'Calories', unit: 'kcal', tone: 'from-violet-500 to-fuchsia-500', max: 700 },
  { key: 'protein', label: 'Protein', unit: 'g', tone: 'from-cyan-400 to-blue-500', max: 45 },
  { key: 'carbs', label: 'Carbs', unit: 'g', tone: 'from-amber-400 to-orange-500', max: 80 },
  { key: 'fats', label: 'Fats', unit: 'g', tone: 'from-pink-500 to-violet-500', max: 35 },
  { key: 'fiber', label: 'Fiber', unit: 'g', tone: 'from-emerald-400 to-teal-500', max: 18 },
  { key: 'sugar', label: 'Sugar', unit: 'g', tone: 'from-rose-500 to-pink-500', max: 30 },
]

export default function FoodDetailsModal({ open, food, onClose, onAddToLog }) {
  const [servings, setServings] = useState(1)

  useEffect(() => {
    setServings(1)
  }, [food?.name, open])

  const details = useMemo(() => (food ? buildFoodNutritionDetails(food, servings) : null), [food, servings])

  if (!food || !details) return null

  return (
    <Modal
      open={open}
      title={details.name}
      description="Complete macro and micronutrient intelligence with live serving-size scaling."
      onClose={onClose}
      maxWidth="max-w-7xl"
    >
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{details.category}</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">{details.name}</h3>
                <p className="mt-3 text-sm text-slate-400">{details.baseServing}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {details.ingredientTags.map((tag) => (
                    <span key={tag} className="rounded-full border border-cyan-400/15 bg-cyan-400/8 px-3 py-1 text-xs font-medium text-cyan-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Health score', value: details.healthScore, accent: 'from-emerald-400 to-teal-500' },
                  { label: 'Quality', value: details.nutritionQuality, accent: 'from-cyan-400 to-blue-500' },
                  { label: 'Rating', value: details.healthRating, accent: 'from-violet-500 to-fuchsia-500' },
                ].map((item) => (
                  <div key={item.label} className="min-w-[120px] rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                    <p className={`mt-3 bg-gradient-to-r ${item.accent} bg-clip-text text-3xl font-semibold text-transparent`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Serving size slider</p>
                  <p className="mt-2 text-sm text-slate-400">Adjust the serving size and watch every value update in real time.</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                  {servings.toFixed(2)}x serving
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.25"
                value={servings}
                onChange={(event) => setServings(Number(event.target.value))}
                className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {macroCards.map((item, index) => {
                const value = Number(details[item.key] || 0)
                const width = Math.min((value / item.max) * 100, 100)
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.24 }}
                    className="rounded-[26px] border border-white/10 bg-slate-950/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-300">{item.label}</p>
                      <p className="text-lg font-semibold text-white">
                        {value}
                        <span className="ml-1 text-sm text-slate-400">{item.unit}</span>
                      </p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.75, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="space-y-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Micronutrient profile</p>
              <div className="mt-4 space-y-3">
                {Object.entries(MICRO_NUTRIENT_META).map(([key, meta], index) => {
                  const value = Number(details[key] || 0)
                  const completion = Math.min((value / meta.target) * 100, 100)
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.03, duration: 0.22 }}
                      className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">{meta.label}</p>
                          <p className="mt-1 text-xs text-slate-400">Target {meta.target} {meta.unit}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-200">
                          {value} {meta.unit}
                        </p>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completion}%` }}
                          transition={{ duration: 0.75, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Food metadata</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Serving shown', value: details.serving },
                  { label: 'Category', value: details.category },
                  { label: 'Ingredient tags', value: details.ingredientTags.join(', ') },
                  { label: 'Nutrition score', value: `${details.nutritionQuality}/100` },
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAddToLog?.(details)}
              className="w-full rounded-[26px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Add this serving to today's log
            </button>
          </motion.div>
        </div>
      </div>
    </Modal>
  )
}
