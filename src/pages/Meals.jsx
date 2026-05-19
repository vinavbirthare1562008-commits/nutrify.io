import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'
import MealCard from '../components/MealCard.jsx'
import MealModal from '../components/MealModal.jsx'
import FoodSearchBar from '../components/FoodSearchBar.jsx'
import StatCard from '../components/StatCard.jsx'

const mealTypeOptions = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks']

export default function Meals() {
  const {
    filteredPersonalMeals,
    searchQuery,
    selectedMealType,
    favoritePersonalMeals,
    setSearchQuery,
    setSelectedMealType,
    addPersonalMeal,
    updatePersonalMeal,
    deletePersonalMeal,
    duplicatePersonalMeal,
    toggleFavoriteMeal,
    favoriteMealIds,
    modalOpen,
    setModalOpen,
    activeMeal,
    setActiveMeal,
    addMeal,
    filteredMeals,
  } = useAppContext()

  const templatesByType = useMemo(
    () => mealTypeOptions.slice(1).map((type) => ({
      type,
      count: filteredPersonalMeals.filter((meal) => meal.mealType === type).length,
    })),
    [filteredPersonalMeals],
  )

  const handleSave = (mealData) => {
    if (activeMeal) {
      updatePersonalMeal({ ...activeMeal, ...mealData })
    } else {
      addPersonalMeal(mealData)
    }
    setModalOpen(false)
    setActiveMeal(null)
  }

  const handleEdit = (meal) => {
    setActiveMeal(meal)
    setModalOpen(true)
  }

  const handleLog = (meal) => {
    addMeal({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      serving: meal.serving,
      mealType: meal.mealType,
      foodCategory: meal.foodCategory,
      date: new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">My Meals</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Create your custom templates</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Build reusable meals, favorite your top recipes, and add them into your daily log with a single tap.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveMeal(null)
                setModalOpen(true)
              }}
              className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              New recipe
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {templatesByType.map((item) => (
              <div key={item.type} className="rounded-3xl bg-slate-950/75 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.type}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{item.count}</p>
                <p className="mt-2 text-sm text-slate-500">templates</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Favorites</p>
          <p className="mt-3 text-lg font-semibold text-white">Quick access</p>
          <div className="mt-6 grid gap-3">
            {favoritePersonalMeals.length > 0 ? (
              favoritePersonalMeals.map((meal) => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => handleLog(meal)}
                  className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-4 text-left text-white transition hover:border-cyan-400"
                >
                  <div>
                    <p className="font-semibold">{meal.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{meal.mealType} • {meal.serving}</p>
                  </div>
                  <span className="rounded-3xl bg-cyan-500/15 px-3 py-2 text-sm text-cyan-100">Add</span>
                </button>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/75 p-5 text-sm text-slate-400">
                Favorite a meal to pin it for faster access.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Search templates</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Find saved meals</h2>
            </div>
            <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">Instant filtering</div>
          </div>
          <div className="mt-6 grid gap-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, protein, carbs..."
              className="w-full rounded-[26px] border border-white/10 bg-slate-950/75 px-4 py-4 text-sm text-white outline-none transition focus:border-cyan-400"
            />
            <div className="flex flex-wrap gap-2">
              {mealTypeOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedMealType(category)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedMealType === category
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Inspiration</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Build balanced meals</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Save meals with complete nutrition totals so you can log faster and stay aligned with your goals.
          </p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-slate-950/75 p-4">
              <p className="text-sm text-slate-400">Tip</p>
              <p className="mt-2 text-sm text-slate-200">Create meals in the evening and reuse them instantly during busy weekdays.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/75 p-4">
              <p className="text-sm text-slate-400">Top macros</p>
              <p className="mt-2 text-sm text-slate-200">Target 40% carbs, 30% protein and 30% fats for premium recovery.</p>
            </div>
          </div>
        </div>
      </section>

      <FoodSearchBar onAddFood={(food) => addMeal({
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        serving: food.serving,
        mealType: 'Lunch',
        foodCategory: food.category,
        date: new Date().toISOString().slice(0, 10),
      })} />

      <section className="space-y-6">
        {filteredPersonalMeals.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredPersonalMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onEdit={handleEdit}
                onDelete={deletePersonalMeal}
                onDuplicate={duplicatePersonalMeal}
                onToggleFavorite={toggleFavoriteMeal}
                onAddToLog={handleLog}
                isFavorite={favoriteMealIds.includes(meal.id)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-dashed border-white/10 bg-slate-900/80 p-10 text-center text-slate-300 shadow-glass"
          >
            <p className="text-lg font-semibold text-white">No saved meals yet</p>
            <p className="mt-3 text-sm text-slate-400">Create a custom meal to begin building your reusable meal library.</p>
          </motion.div>
        )}
      </section>

      <MealModal open={modalOpen} meal={activeMeal} onSave={handleSave} onClose={() => setModalOpen(false)} />
    </div>
  )
}
