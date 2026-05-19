import { useMemo, useState } from 'react'
import { ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Line, LineChart } from 'recharts'
import { useAppContext } from '../context/AppContext.jsx'
import MacroRing from '../components/MacroRing.jsx'
import ProgressCircle from '../components/ProgressCircle.jsx'
import WaterTracker from '../components/WaterTracker.jsx'
import StatCard from '../components/StatCard.jsx'
import FoodSearchBar from '../components/FoodSearchBar.jsx'
import FoodDetailsModal from '../components/FoodDetailsModal.jsx'

export default function Dashboard() {
  const {
    dailyNutrition,
    settings,
    totalCalories,
    caloriesRemaining,
    completion,
    dailyMeals,
    weeklySummary,
    recommendations,
    waterIntake,
    updateWaterIntake,
    addFoodToMeal,
  } = useAppContext()
  const [previewFood, setPreviewFood] = useState(null)

  const chartData = useMemo(
    () => weeklySummary.map((item) => ({ day: item.day, calories: item.calories })),
    [weeklySummary],
  )

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Daily Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Performance overview</h1>
            </div>
            <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200">Designed for premium fitness tracking</div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Calories consumed" value={`${totalCalories} kcal`} accent="text-violet-100 bg-violet-500/20">
              {completion}% complete
            </StatCard>
            <StatCard title="Remaining" value={`${caloriesRemaining} kcal`} accent="text-sky-100 bg-sky-500/15">
              Goal {settings.calorieGoal} kcal
            </StatCard>
            <StatCard title="Protein" value={`${dailyNutrition.protein} g`} accent="text-cyan-100 bg-cyan-500/15">
              Target {settings.proteinGoal} g
            </StatCard>
            <StatCard title="Meal logs" value={`${dailyMeals.length}`} accent="text-amber-100 bg-amber-500/15">
              Today
            </StatCard>
          </div>

          <div className="mt-8 rounded-[32px] border border-white/10 bg-slate-950/75 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Insight</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{recommendations.headline}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{recommendations.description}</p>
              </div>
              <div className="rounded-3xl bg-violet-500/15 px-4 py-3 text-sm text-violet-100">Macro balance</div>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <ProgressCircle label="Calories" value={totalCalories} goal={settings.calorieGoal} accent="#8b5cf6" />
          <ProgressCircle label="Protein" value={dailyNutrition.protein} goal={settings.proteinGoal} accent="#38bdf8" />
          <WaterTracker waterIntake={waterIntake} goal={settings.waterGoal} onAddGlass={() => updateWaterIntake(0.25)} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <FoodSearchBar
          onAddFood={(food) => addFoodToMeal(food, 'Lunch')}
          onSelectFood={(food) => setPreviewFood(food)}
        />
        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Nutrition insight</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Weekly activity</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">Track the last seven days to stay ahead of your calorie and macro balance.</p>

          <div className="mt-8 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Line type="monotone" dataKey="calories" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Meals today</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Recent logs</h2>
            </div>
            <span className="rounded-3xl bg-white/5 px-3 py-2 text-sm text-slate-300">{dailyMeals.length} items</span>
          </div>

          <div className="mt-6 space-y-4">
            {dailyMeals.length > 0 ? (
              dailyMeals.slice(0, 4).map((meal) => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => setPreviewFood(meal)}
                  className="w-full rounded-3xl bg-slate-950/75 p-4 text-left transition hover:border-cyan-400 hover:border"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{meal.name}</p>
                      <p className="mt-2 text-sm text-slate-400">{meal.foodCategory} • {meal.serving}</p>
                    </div>
                    <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-200">{meal.calories} kcal</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[32px] border border-dashed border-white/10 bg-slate-950/60 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">No meals logged yet</p>
                <p className="mt-3 text-sm">Add a food item from the search panel to start your day.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Fuel metrics</p>
          <div className="mt-6 grid gap-4">
            <MacroRing protein={dailyNutrition.protein} carbs={dailyNutrition.carbs} fats={dailyNutrition.fats} />
            <WaterTracker waterIntake={waterIntake} goal={settings.waterGoal} onAddGlass={() => updateWaterIntake(0.25)} />
          </div>
        </div>
      </section>

      <FoodDetailsModal
        open={Boolean(previewFood)}
        food={previewFood}
        onClose={() => setPreviewFood(null)}
        onAddToLog={(food) => {
          addFoodToMeal(food, 'Lunch')
          setPreviewFood(null)
        }}
      />
    </div>
  )
}
