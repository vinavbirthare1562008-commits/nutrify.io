import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Line, LineChart } from 'recharts'
import { useAppContext } from '../context/AppContext.jsx'
import StatCard from '../components/StatCard.jsx'
import ProgressCircle from '../components/ProgressCircle.jsx'
import FoodSearchBar from '../components/FoodSearchBar.jsx'
import FoodDetailsModal from '../components/FoodDetailsModal.jsx'
import HealthScoreCard from '../components/HealthScoreCard.jsx'
import AchievementCard from '../components/AchievementCard.jsx'
import AIInsightsPanel from '../components/AIInsightsPanel.jsx'
import DailyChallengesPanel from '../components/DailyChallengesPanel.jsx'
import AcademyStatusCard from '../components/AcademyStatusCard.jsx'

const cardClass = 'rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-6 shadow-glass'

function DashboardTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-[20px] border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl">
      <p className="text-sm font-semibold text-white">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-2 text-sm text-slate-300">
          {entry.name}: <span className="font-semibold text-white">{Math.round(entry.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const {
    dailyNutrition,
    totalCalories,
    caloriesRemaining,
    completion,
    dailyMeals,
    weeklySummary,
    addFoodToMeal,
    dailyHealth,
    gamification,
    nutritionRings,
    nutritionQualityIndex,
    waterIntake,
    macroTargets,
    aiInsights,
    dailyChallenges,
    personalizedGreeting,
    micronutrientCards,
    currentTheme,
    weeklyHealthTimeline,
    healthTrendDelta,
    selectedHouse,
    magicalMealTypes,
  } = useAppContext()
  const [previewFood, setPreviewFood] = useState(null)

  const energyChartData = useMemo(
    () =>
      weeklySummary.map((item, index) => ({
        day: item.day,
        calories: item.calories,
        protein: item.protein,
        healthScore: weeklyHealthTimeline[index]?.healthScore || 0,
      })),
    [weeklySummary, weeklyHealthTimeline],
  )

  const topMicronutrients = micronutrientCards.slice(0, 6)
  const mealLabelMap = Object.fromEntries(magicalMealTypes.map((item) => [item.key, item.label]))

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.85fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] p-6 shadow-glass">
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `radial-gradient(circle at 20% 22%, ${currentTheme.colors[0]}25, transparent 20%), radial-gradient(circle at 82% 18%, ${currentTheme.colors[1]}30, transparent 24%), radial-gradient(circle at 70% 82%, ${currentTheme.colors[2]}20, transparent 22%)`,
            }}
          />
          <div className="pointer-events-none absolute inset-0">
            {[0, 1, 2, 3, 4].map((item) => (
              <motion.span
                key={item}
                className="absolute h-2 w-2 rounded-full bg-white/60"
                style={{ left: `${14 + item * 16}%`, top: `${18 + (item % 3) * 18}%` }}
                animate={{ y: [0, -10, 0], opacity: [0.35, 0.9, 0.35] }}
                transition={{ duration: 3.2 + item * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                Enchanted academy dashboard
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                Health trend {healthTrendDelta >= 0 ? '+' : ''}{healthTrendDelta}
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold text-white md:text-5xl">
              {personalizedGreeting.greeting}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              {personalizedGreeting.message} Your academy is tracking potions, rituals, ranks, and enchanted actions in one polished ecosystem.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Academy score" value={dailyHealth.score} accent="bg-emerald-500/15 text-emerald-100">
                {dailyHealth.grade}
              </StatCard>
              <StatCard title="Hydration charm" value={`${Math.round((waterIntake / Math.max(1, macroTargets.water)) * 100)}%`} accent="bg-cyan-500/15 text-cyan-100">
                {waterIntake.toFixed(1)}L
              </StatCard>
              <StatCard title="Potion quality" value={nutritionQualityIndex.quality} accent="bg-violet-500/15 text-violet-100">
                {nutritionQualityIndex.healthyRating}
              </StatCard>
              <StatCard title="Academy XP" value={gamification.rank?.label || gamification.level} accent="bg-amber-500/15 text-amber-100">
                {gamification.xp} XP
              </StatCard>
            </div>
          </div>
        </div>

        <AcademyStatusCard house={selectedHouse} gamification={gamification} />
        <HealthScoreCard health={dailyHealth} gamification={gamification} />
      </section>

      <section className={cardClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Academy dashboard</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Arcane nutrition control surface</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Live widgets track your calories, macros, hydration charms, and ritual progress with magical polish and motion.
            </p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
            {dailyMeals.length} rituals today / {caloriesRemaining} kcal remaining
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {nutritionRings.map((ring) => (
            <ProgressCircle
              key={ring.key}
                label={ring.label === 'Water' ? 'Hydration Charm' : ring.label}
              value={ring.value}
              goal={ring.goal}
              unit={ring.unit}
              accent={ring.accent}
              hint={ring.hint}
              caption={`${Math.round(ring.value)} ${ring.unit} tracked`}
              size={160}
            />
          ))}
        </div>
      </section>

      <AIInsightsPanel insights={aiInsights} />

      <DailyChallengesPanel challenges={dailyChallenges} />

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <FoodSearchBar
          onAddFood={(food) => addFoodToMeal(food, 'Lunch')}
          onSelectFood={(food) => setPreviewFood(food)}
        />

        <div className="space-y-6">
          <div className={cardClass}>
            <div className="flex items-center justify-between gap-4">
              <div>
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Rune chart system</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Weekly energy and academy arc</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                Dual trend
              </span>
            </div>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyChartData} margin={{ top: 0, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={currentTheme.colors[1]} stopOpacity={0.42} />
                      <stop offset="100%" stopColor={currentTheme.colors[1]} stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip content={<DashboardTooltip />} />
                  <Area type="monotone" dataKey="calories" name="Calories" stroke={currentTheme.colors[1]} strokeWidth={3} fill="url(#dashboardCalories)" />
                  <Line type="monotone" dataKey="healthScore" name="Health Score" stroke={currentTheme.colors[0]} strokeWidth={3} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cardClass}>
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Wizard recommendations</p>
            <div className="mt-5 grid gap-3">
              {dailyHealth.recommendations.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Arcane nutrient tracking</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Enchanted nutrient coverage</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
              11 nutrients
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {topMicronutrients.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.26 }}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <span className="text-xs text-slate-400">{item.completion}%</span>
                </div>
                <p className="mt-3 text-xl font-semibold text-white">
                  {item.value}
                  <span className="ml-1 text-sm text-slate-400">{item.unit}</span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.completion, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">Target {item.target} {item.unit}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Recent rituals</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Today's potion timeline</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
              {dailyMeals.length} items
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {dailyMeals.length > 0 ? (
              dailyMeals.slice(0, 6).map((meal) => (
                <button
                  key={meal.id || `${meal.name}-${meal.serving}`}
                  type="button"
                  onClick={() => setPreviewFood(meal)}
                  className="w-full rounded-[26px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-white">{meal.name}</p>
                      <p className="mt-2 text-sm text-slate-400">{mealLabelMap[meal.mealType] || meal.foodCategory} / {meal.serving}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-100">{meal.calories} kcal</span>
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{meal.protein}g protein</span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">No meals logged yet</p>
                <p className="mt-3 text-sm">Search an ingredient and begin today's academy score.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Achievement vault</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Unlocked magical progression</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
            Level {gamification.level}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {gamification.achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} delay={index * 0.04} />
          ))}
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
