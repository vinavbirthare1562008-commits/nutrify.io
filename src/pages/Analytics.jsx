import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Bar,
  BarChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { useAppContext } from '../context/AppContext.jsx'
import ProgressCircle from '../components/ProgressCircle.jsx'
import {
  buildMealCategoryBreakdown,
  buildNutritionRatio,
  buildFrequencyBins,
  buildFatTrend,
  buildGoalCompletionTrend,
  buildMicronutrientRadar,
  buildVitaminOverview,
} from '../utils/appUtils.js'

const styleCard = 'rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl'

export default function Analytics() {
  const {
    meals,
    weeklySummary,
    macroBreakdown,
    monthlyProgress,
    waterTrend,
    weightSeries,
    settings,
    dailyNutrition,
    totalCalories,
    completion,
    proteinCompletion,
    waterCompletion,
    micronutrients,
  } = useAppContext()

  const weeklyAverage = useMemo(
    () => Math.round(weeklySummary.reduce((sum, item) => sum + item.calories, 0) / Math.max(weeklySummary.length, 1)),
    [weeklySummary],
  )

  const topDay = useMemo(
    () => weeklySummary.reduce((top, item) => (item.calories > top.calories ? item : top), weeklySummary[0] || { day: 'N/A', calories: 0 }),
    [weeklySummary],
  )

  const categoryBreakdown = useMemo(() => buildMealCategoryBreakdown(meals), [meals])
  const nutritionRatio = useMemo(() => buildNutritionRatio(dailyNutrition), [dailyNutrition])
  const calorieHistogram = useMemo(() => buildFrequencyBins(weeklySummary.map((item) => item.calories), 80, 6), [weeklySummary])
  const proteinHistogram = useMemo(() => buildFrequencyBins(weeklySummary.map((item) => item.protein), 8, 6), [weeklySummary])
  const weightHistogram = useMemo(() => buildFrequencyBins(weightSeries.map((item) => item.weight), 5, 6), [weightSeries])
  const fatTrend = useMemo(() => buildFatTrend(weeklySummary), [weeklySummary])
  const goalCompletionTrend = useMemo(() => buildGoalCompletionTrend(weeklySummary, settings.calorieGoal), [weeklySummary, settings.calorieGoal])
  const micronutrientRadar = useMemo(() => buildMicronutrientRadar(micronutrients), [micronutrients])
  const vitaminOverview = useMemo(() => buildVitaminOverview(micronutrients), [micronutrients])

  return (
    <div className="space-y-8">
      <section className={`${styleCard}`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Analytics</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Next-level fitness insights</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Deep trend analytics, goal tracking, and premium nutrition intelligence for every workout and meal.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/75 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Calorie target</p>
              <p className="mt-3 text-2xl font-semibold text-white">{settings.calorieGoal} kcal</p>
            </div>
            <div className="rounded-3xl bg-slate-950/75 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Weekly avg.</p>
              <p className="mt-3 text-2xl font-semibold text-white">{weeklyAverage} kcal</p>
            </div>
            <div className="rounded-3xl bg-slate-950/75 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Top day</p>
              <p className="mt-3 text-2xl font-semibold text-white">{topDay.day}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Daily calorie comparison</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Weekly performance</h2>
            </div>
            <span className="rounded-3xl bg-violet-500/15 px-3 py-2 text-sm text-violet-100">Energy</span>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySummary} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Bar dataKey="calories" radius={[14, 14, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Weekly protein intake</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Lean muscle fuel</h2>
            </div>
            <span className="rounded-3xl bg-cyan-500/15 px-3 py-2 text-sm text-cyan-100">Macros</span>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySummary} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Bar dataKey="protein" radius={[14, 14, 0, 0]} fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Monthly carb trends</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Energy rhythm</h2>
            </div>
            <span className="rounded-3xl bg-amber-500/15 px-3 py-2 text-sm text-amber-100">30 days</span>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProgress} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="carbGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Area type="monotone" dataKey="carbs" stroke="#f97316" strokeWidth={3} fill="url(#carbGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Nutrition ratio</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Daily macro balance</h2>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={nutritionRatio} dataKey="value" nameKey="name" innerRadius={42} outerRadius={92} paddingAngle={4}>
                  {nutritionRatio.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {nutritionRatio.map((entry) => (
              <div key={entry.name} className="rounded-3xl bg-slate-950/75 p-4 text-center">
                <p className="text-sm text-slate-400">{entry.name}</p>
                <p className="mt-2 text-lg font-semibold text-white">{entry.value}%</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Calorie frequency</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Weekly distribution</h2>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieHistogram} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Meal category breakdown</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Category insights</h2>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={42} outerRadius={90} paddingAngle={4}>
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categoryBreakdown.slice(0, 4).map((entry) => (
              <div key={entry.name} className="rounded-3xl bg-slate-950/75 p-4">
                <p className="text-sm text-slate-400">{entry.name}</p>
                <p className="mt-2 text-lg font-semibold text-white">{entry.value} logs</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.48 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Protein frequency</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Macro distribution</h2>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={proteinHistogram} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.56 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Weight trend distribution</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Progress histogram</h2>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightHistogram} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.64 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Fat intake progression</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Trend line</h2>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fatTrend} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="fatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Area type="monotone" dataKey="fats" stroke="#a855f7" strokeWidth={3} fill="url(#fatGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.72 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Goal completion trends</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Progress score</h2>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={goalCompletionTrend} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Line type="monotone" dataKey="completion" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Micronutrient balance</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Health radar</h2>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={micronutrientRadar} outerRadius="85%">
                <PolarGrid stroke="rgba(148, 163, 184, 0.16)" />
                <PolarAngleAxis dataKey="nutrient" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Micronutrients" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.35} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.88 }}
          className={styleCard}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Vitamin overview</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Nutrient pulse</h2>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vitaminOverview} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                <Bar dataKey="value" radius={[14, 14, 0, 0]} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
