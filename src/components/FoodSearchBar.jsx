import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'

export default function FoodSearchBar({ onAddFood, onSelectFood }) {
  const {
    foodDatabase,
    foodGroups,
    selectedFoodGroup,
    setSelectedFoodGroup,
    recentFoodItems,
    recentSearches,
    addRecentSearch,
    selectedHouse,
  } = useAppContext()
  const [query, setQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const filtered = foodDatabase.filter((item) => {
      const matchesGroup = selectedFoodGroup === 'All' || item.category === selectedFoodGroup
      const matchesQuery = !normalized || item.name.toLowerCase().includes(normalized)
      return matchesGroup && matchesQuery
    })

    return filtered.slice(0, 10)
  }, [foodDatabase, query, selectedFoodGroup])

  const handleSelectFood = (food) => {
    setSelectedFood(food)
    onSelectFood?.(food)
    addRecentSearch(food.name)
  }

  const handleSearchKey = (event) => {
    if (event.key === 'Enter' && query.trim()) {
      addRecentSearch(query)
    }
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass transition-all duration-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Potion ingredients</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Find ingredients, cast instantly</h2>
        </div>
        <div className="rounded-3xl bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
          {selectedHouse ? `${selectedHouse.name} apothecary` : 'Arcane search'}
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_auto]">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKey}
            placeholder="Search potions, fruits, protein..."
            className="w-full rounded-[26px] border border-white/10 bg-slate-950/85 px-5 py-4 text-sm text-white outline-none transition focus:border-cyan-400"
          />
          <div className="pointer-events-none absolute inset-y-0 right-4 top-0 grid place-items-center text-slate-500">*</div>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-slate-950/75 p-4 shadow-glass">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Arcane category</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {foodGroups.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedFoodGroup(group)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedFoodGroup === group
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/10'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-5 rounded-[28px] border border-white/10 bg-slate-950/75 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Suggested ingredients</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Tap to inspect a potion profile or cast it into today's journal.</p>
            </div>
            <span className="rounded-3xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{suggestions.length} matches</span>
          </div>

          <div className="grid gap-3">
            {suggestions.length > 0 ? (
              suggestions.map((food) => (
                <motion.div
                  key={food.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-slate-900/80 p-4 transition hover:border-cyan-400 sm:flex-row sm:items-center sm:justify-between"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectFood(food)}
                    className="text-left"
                  >
                    <p className="text-sm font-semibold text-white group-hover:text-cyan-200">{food.name}</p>
                    <p className="mt-2 text-xs text-slate-400">{food.serving} / {food.category}</p>
                  </button>
                  <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0">
                    <span className="rounded-3xl bg-white/5 px-3 py-2 text-xs text-slate-300">{food.calories} kcal</span>
                    <button
                      type="button"
                      onClick={() => onAddFood(food)}
                      className="rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      Cast now
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/80 p-6 text-center text-slate-400">
                <p className="font-medium text-white">No ingredients matched</p>
                <p className="mt-2 text-sm">Try a different incantation or category filter.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 rounded-[28px] border border-white/10 bg-slate-950/75 p-5 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Recent incantations</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Recall your latest searches and refine them quickly.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.length > 0 ? (
              recentSearches.slice(0, 8).map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => setQuery(search)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  {search}
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-400">Your recent arcane searches will appear here.</p>
            )}
          </div>
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Quick cast</p>
            <div className="mt-4 space-y-3">
              {recentFoodItems.length > 0 ? (
                recentFoodItems.slice(0, 4).map((food) => (
                  <button
                    key={food.name}
                    type="button"
                    onClick={() => onAddFood(food)}
                    className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-left text-white transition hover:border-cyan-400"
                  >
                    <div>
                      <p className="text-sm font-semibold">{food.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{food.serving}</p>
                    </div>
                    <span className="text-sm text-slate-300">{food.calories} kcal</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-slate-400">Log foods to populate your quick-cast list.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFood ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="mt-6 rounded-[28px] border border-cyan-500/10 bg-slate-950/80 p-5 shadow-glass"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Chosen ingredient</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{selectedFood.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{selectedFood.serving} / {selectedFood.category}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onAddFood(selectedFood)}
                  className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Cast this potion
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFood(selectedFood)}
                  className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  View enchantments
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
