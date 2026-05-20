import { useMemo } from 'react'
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
  Legend,
} from 'recharts'
import { useAppContext } from '../context/AppContext.jsx'
import StatCard from '../components/StatCard.jsx'
import ChartPanel from '../components/ChartPanel.jsx'
import {
  buildMealCategoryBreakdown,
  buildNutritionRatio,
  buildFrequencyBins,
  buildMicronutrientRadar,
  buildVitaminOverview,
} from '../utils/appUtils.js'

function AnalyticsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-[18px] border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl">
      <p className="text-sm font-semibold text-white">{label}</p>
      {payload.map((entry) => (
        <p key={`${entry.dataKey}-${entry.name}`} className="mt-2 text-sm text-slate-300">
          {entry.name || entry.dataKey}: <span className="font-semibold text-white">{Math.round(entry.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const {
    meals,
    weeklySummary,
    monthlyProgress,
    waterTrend,
    weightSeries,
    settings,
    dailyNutrition,
    micronutrients,
    dailyHealth,
    gamification,
    nutritionQualityIndex,
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
  const calorieHistogram = useMemo(() => buildFrequencyBins(weeklySummary.map((item) => item.calories), 250, 6), [weeklySummary])
  const proteinHistogram = useMemo(() => buildFrequencyBins(weeklySummary.map((item) => item.protein), 20, 6), [weeklySummary])
  const micronutrientRadar = useMemo(() => buildMicronutrientRadar(micronutrients), [micronutrients])
  const vitaminOverview = useMemo(() => buildVitaminOverview(micronutrients), [micronutrients])

  const weeklyMultiMetric = useMemo(
    () =>
      weeklySummary.map((item, index) => ({
        day: item.day,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
        hydration: waterTrend[index]?.intake || 0,
      })),
    [weeklySummary, waterTrend],
  )

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-6 shadow-glass">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Premium analytics</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Futuristic nutrition dashboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Deep weekly and monthly intelligence across energy, hydration, weight, micronutrients, and consistency.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard title="Health score" value={dailyHealth.score} accent="bg-emerald-500/15 text-emerald-100">
              {dailyHealth.grade}
            </StatCard>
            <StatCard title="Weekly avg." value={`${weeklyAverage} kcal`} accent="bg-violet-500/15 text-violet-100">
              Trending
            </StatCard>
            <StatCard title="Unlocked badges" value={gamification.unlockedCount} accent="bg-cyan-500/15 text-cyan-100">
              Level {gamification.level}
            </StatCard>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <ChartPanel
          eyebrow="Calories + hydration"
          title="Weekly energy command"
          badge="Line graph"
          description="Animated lines show how daily calories and water intake move together over the week."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyMultiMetric} margin={{ top: 0, right: 18, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<AnalyticsTooltip />} />
                <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                <Line yAxisId="left" type="monotone" dataKey="calories" name="Calories" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="hydration" name="Hydration (L)" stroke="#22d3ee" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel
          eyebrow="Current split"
          title="Daily macro ratio"
          badge="Pie chart"
          delay={0.05}
          description="See where today's calories are being distributed across protein, carbs, and fats."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={nutritionRatio} dataKey="value" nameKey="name" innerRadius={58} outerRadius={102} paddingAngle={4}>
                  {nutritionRatio.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<AnalyticsTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {nutritionRatio.map((entry) => (
              <div key={entry.name} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-sm text-slate-400">{entry.name}</p>
                <p className="mt-2 text-xl font-semibold text-white">{entry.value}%</p>
              </div>
            ))}
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1.1fr]">
        <ChartPanel
          eyebrow="Monthly curves"
          title="Carbohydrates and fats"
          badge="Area graph"
          description="Gradient-filled area trends highlight how your energy sources fluctuate over the last 30 days."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProgress} margin={{ top: 0, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="carbTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.36} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="fatTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<AnalyticsTooltip />} />
                <Area type="monotone" dataKey="carbs" name="Carbs" stroke="#f59e0b" fill="url(#carbTrend)" strokeWidth={3} />
                <Area type="monotone" dataKey="fats" name="Fats" stroke="#8b5cf6" fill="url(#fatTrend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel
          eyebrow="Micronutrient balance"
          title="Radar health map"
          badge="Radar chart"
          delay={0.08}
          description="Track how close each key vitamin and mineral is to its ideal daily target."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={micronutrientRadar} outerRadius="82%">
                <PolarGrid stroke="rgba(148,163,184,0.16)" />
                <PolarAngleAxis dataKey="nutrient" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Coverage" dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.35} />
                <Tooltip content={<AnalyticsTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartPanel
          eyebrow="Protein output"
          title="Weekly protein bars"
          badge="Bar graph"
          description="Daily protein intake compared across the week for recovery and muscle support."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySummary} margin={{ top: 0, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="proteinBars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<AnalyticsTooltip />} />
                <Bar dataKey="protein" name="Protein" fill="url(#proteinBars)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel
          eyebrow="Weight tracking"
          title="Body-weight trajectory"
          badge="Line graph"
          delay={0.08}
          description="Your logged weight points over time, shown in a cleaner premium trend view."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightSeries} margin={{ top: 0, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<AnalyticsTooltip />} />
                <Line type="monotone" dataKey="weight" name="Weight" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartPanel
          eyebrow="Distributions"
          title="Calorie + protein histograms"
          badge="Histograms"
          description="Distribution charts help you spot whether intake is clustered or inconsistent."
        >
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieHistogram} margin={{ top: 0, right: 6, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Bar dataKey="count" name="Days" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proteinHistogram} margin={{ top: 0, right: 6, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Bar dataKey="count" name="Days" fill="#22d3ee" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartPanel>

        <ChartPanel
          eyebrow="Category intelligence"
          title="Meal categories + vitamin pulse"
          badge="Pie + bars"
          delay={0.08}
          description="See where your logged foods come from and which vitamins are strongest right now."
        >
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={42} outerRadius={84} paddingAngle={4}>
                    {categoryBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<AnalyticsTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vitaminOverview} margin={{ top: 0, right: 6, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Bar dataKey="value" name="Coverage" radius={[10, 10, 0, 0]}>
                    {vitaminOverview.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Calorie target" value={`${settings.calorieGoal} kcal`} accent="bg-white/5 text-slate-200">
          Daily
        </StatCard>
        <StatCard title="Top day" value={topDay.day} accent="bg-violet-500/15 text-violet-100">
          {topDay.calories} kcal
        </StatCard>
        <StatCard title="Nutrition quality" value={nutritionQualityIndex.quality} accent="bg-emerald-500/15 text-emerald-100">
          {nutritionQualityIndex.healthyRating}
        </StatCard>
        <StatCard title="Hydration days" value={waterTrend.length} accent="bg-cyan-500/15 text-cyan-100">
          Tracking
        </StatCard>
      </section>
    </div>
  )
}
