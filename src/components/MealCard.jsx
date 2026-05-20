import { motion } from 'framer-motion'

export default function MealCard({ meal, onEdit, onDelete, onDuplicate, onToggleFavorite, onAddToLog, isFavorite, mealTypeLabel }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-glass transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{mealTypeLabel || meal.mealType} / {meal.foodCategory}</p>
          <div className="mt-3 flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">{meal.name}</h3>
            <button
              type="button"
              onClick={() => onToggleFavorite(meal.id)}
              className={`rounded-full px-3 py-1 text-sm transition ${
                isFavorite ? 'bg-amber-500/15 text-amber-200' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {isFavorite ? 'Sigil Marked' : 'Mark Sigil'}
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-400">{meal.serving}</p>
        </div>
        <div className="rounded-3xl bg-violet-500/15 px-4 py-2 text-center text-sm text-violet-200">{meal.calories} kcal</div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm text-slate-300">
        <div className="rounded-3xl bg-white/5 p-3">{meal.protein}g Strength</div>
        <div className="rounded-3xl bg-white/5 p-3">{meal.carbs}g Runes</div>
        <div className="rounded-3xl bg-white/5 p-3">{meal.fats}g Essence</div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onEdit(meal)}
          className="rounded-3xl border border-violet-500/20 bg-white/5 px-4 py-2 text-sm text-violet-100 transition hover:bg-violet-500/10"
        >
          Refine
        </button>
        <div className="flex flex-wrap gap-3">
          {onAddToLog && (
            <button
              type="button"
              onClick={() => onAddToLog(meal)}
              className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Cast today
            </button>
          )}
          <button
            type="button"
            onClick={() => onDuplicate(meal.id)}
            className="rounded-3xl bg-slate-800/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
          >
            Clone
          </button>
          <button
            type="button"
            onClick={() => onDelete(meal.id)}
            className="rounded-3xl bg-rose-500/15 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/25"
          >
            Dispel
          </button>
        </div>
      </div>
    </motion.article>
  )
}
