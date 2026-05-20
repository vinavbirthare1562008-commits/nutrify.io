import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'
import MealCard from '../components/MealCard.jsx'
import MealModal from '../components/MealModal.jsx'
import FoodSearchBar from '../components/FoodSearchBar.jsx'

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
    magicalMealTypes,
    selectedHouse,
  } = useAppContext()

  const typeLabelMap = useMemo(
    () => Object.fromEntries(magicalMealTypes.map((item) => [item.key, item.label])),
    [magicalMealTypes],
  )

  const templatesByType = useMemo(
    () => mealTypeOptions.slice(1).map((type) => ({
      type,
      label: typeLabelMap[type] || type,
      count: filteredPersonalMeals.filter((meal) => meal.mealType === type).length,
    })),
    [filteredPersonalMeals, typeLabelMap],
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
        <div
          className="rounded-[32px] border border-white/10 p-6 shadow-glass backdrop-blur-xl"
          style={{ background: selectedHouse?.banner || 'rgba(15,23,42,0.85)' }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Potion Ledger</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Brew your enchanted meal codex</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
                Craft reusable potions, favorite your strongest rituals, and summon them into today's journal in one tap.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveMeal(null)
                setModalOpen(true)
              }}
              className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Brew recipe
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {templatesByType.map((item) => (
              <div key={item.type} className="rounded-3xl border border-white/10 bg-slate-950/35 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{item.count}</p>
                <p className="mt-2 text-sm text-white/70">recipes</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Favorite brews</p>
          <p className="mt-3 text-lg font-semibold text-white">Summon quickly</p>
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
                    <p className="mt-1 text-sm text-slate-400">{typeLabelMap[meal.mealType] || meal.mealType} / {meal.serving}</p>
                  </div>
                  <span className="rounded-3xl bg-cyan-500/15 px-3 py-2 text-sm text-cyan-100">Cast</span>
                </button>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/75 p-5 text-sm text-slate-400">
                Favorite a potion to keep it close to your spellbook.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Search spellbook</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Find saved concoctions</h2>
            </div>
            <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">Rune filtering</div>
          </div>
          <div className="mt-6 grid gap-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search elixirs, macros, rituals..."
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
                  {typeLabelMap[category] || category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Alchemy hints</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Build stronger brews</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Favor rituals with protein, fiber, and color-rich ingredients to improve the academy score and potion rarity.
          </p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-slate-950/75 p-4">
              <p className="text-sm text-slate-400">Wizard tip</p>
              <p className="mt-2 text-sm text-slate-200">Design your morning potion in advance and keep your weekdays enchanted.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/75 p-4">
              <p className="text-sm text-slate-400">Rarity rule</p>
              <p className="mt-2 text-sm text-slate-200">Balanced macro ratios and strong micronutrient coverage create rarer potions.</p>
            </div>
          </div>
        </div>
      </section>

      <FoodSearchBar
        onAddFood={(food) => addMeal({
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fats: food.fats,
          serving: food.serving,
          mealType: 'Lunch',
          foodCategory: food.category,
          date: new Date().toISOString().slice(0, 10),
        })}
      />

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
                mealTypeLabel={typeLabelMap[meal.mealType] || meal.mealType}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-dashed border-white/10 bg-slate-900/80 p-10 text-center text-slate-300 shadow-glass"
          >
            <p className="text-lg font-semibold text-white">No potions saved yet</p>
            <p className="mt-3 text-sm text-slate-400">Brew your first custom meal to begin building your enchanted library.</p>
          </motion.div>
        )}
      </section>

      <MealModal open={modalOpen} meal={activeMeal} onSave={handleSave} onClose={() => setModalOpen(false)} />
    </div>
  )
}
