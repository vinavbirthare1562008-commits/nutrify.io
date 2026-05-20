import { useMemo, useState } from 'react'
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { useAppContext } from '../context/AppContext.jsx'
import StatCard from '../components/StatCard.jsx'
import ProgressCircle from '../components/ProgressCircle.jsx'
import ScoreRing from '../components/ScoreRing.jsx'
import ChartPanel from '../components/ChartPanel.jsx'

function PerformanceTooltip({ active, payload, label }) {
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

export default function Performance() {
  const {
    dailyHealth,
    nutritionQualityIndex,
    gamification,
    weeklyHealthTimeline,
    weeklySummary,
    healthProfile,
    bmi,
    recommendedCalories,
    goalProgress,
    goalPrediction,
    healthSummary,
    updateHealthProfile,
    currentTheme,
    macroTargets,
    dailyNutrition,
    aiInsights,
    weightSeries,
  } = useAppContext()

  const [localProfile, setLocalProfile] = useState(healthProfile)

  const calorieVariance = useMemo(
    () =>
      weeklySummary.map((item) => ({
        day: item.day,
        variance: Math.round(item.calories - recommendedCalories),
      })),
    [weeklySummary, recommendedCalories],
  )

  const macroBalanceData = useMemo(
    () => [
      { metric: 'Protein', value: Math.min(100, Math.round((dailyNutrition.protein / Math.max(1, macroTargets.protein)) * 100)) },
      { metric: 'Carbs', value: Math.min(100, Math.round((dailyNutrition.carbs / Math.max(1, macroTargets.carbs)) * 100)) },
      { metric: 'Fats', value: Math.min(100, Math.round((dailyNutrition.fats / Math.max(1, macroTargets.fats)) * 100)) },
      { metric: 'Hydration', value: Math.min(100, dailyHealth.components.find((item) => item.key === 'hydration')?.score || 0) },
      { metric: 'Quality', value: nutritionQualityIndex.quality },
    ],
    [dailyNutrition, macroTargets, dailyHealth.components, nutritionQualityIndex.quality],
  )

  const handleProfileChange = (key, value) => {
    const parsed = ['age', 'height', 'currentWeight', 'targetWeight', 'dailyCalories', 'startWeight'].includes(key) ? Number(value) : value
    const nextProfile = { ...localProfile, [key]: parsed }
    setLocalProfile(nextProfile)
    updateHealthProfile({ [key]: parsed })
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Performance center</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Advanced health analytics</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Weekly health summaries, target forecasting, macro balance scoring, and intelligent optimization all in one premium hub.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <ScoreRing value={dailyHealth.score} size={132} stroke={12} label="Health" fromColor={currentTheme.colors[0]} toColor={currentTheme.colors[1]} />
            <div>
              <p className="text-sm text-slate-400">Consistency score</p>
              <p className="mt-2 text-3xl font-semibold text-white">{gamification.goalCompletionStreak * 10 + dailyHealth.components.find((item) => item.key === 'consistency')?.score / 2 || 0}</p>
              <p className="mt-2 text-sm text-slate-400">{healthSummary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="BMI" value={bmi} accent="bg-white/5 text-slate-200">
          {bmi < 18.5 ? 'Under' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Elevated' : 'High'}
        </StatCard>
        <StatCard title="Calorie pace" value={`${recommendedCalories} kcal`} accent="bg-violet-500/15 text-violet-100">
          Recommended
        </StatCard>
        <StatCard title="Goal progress" value={`${goalProgress}%`} accent="bg-cyan-500/15 text-cyan-100">
          {goalPrediction}
        </StatCard>
        <StatCard title="Nutrition quality" value={nutritionQualityIndex.quality} accent="bg-emerald-500/15 text-emerald-100">
          {nutritionQualityIndex.healthyRating}
        </StatCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartPanel
          eyebrow="Weekly health summary"
          title="Health score trend"
          badge="Forecasting"
          description="Track how overall health quality is moving across the week based on nutrition, hydration, and consistency."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyHealthTimeline} margin={{ top: 0, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} domain={[0, 100]} />
                <Tooltip content={<PerformanceTooltip />} />
                <Line type="monotone" dataKey="healthScore" name="Health score" stroke={currentTheme.colors[0]} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Forecast widgets</p>
            <div className="mt-5 grid gap-4">
              <ProgressCircle
                value={goalProgress}
                label="Target Progress"
                accent={[currentTheme.colors[2], currentTheme.colors[1]]}
                hint="Weight goal completion"
                caption={`Estimated ${goalPrediction} to target`}
                size={180}
              />
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-semibold text-white">AI guidance</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">{aiInsights[0]?.detail || healthSummary}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartPanel
          eyebrow="Surplus and deficit"
          title="Calorie variance analysis"
          badge="Area chart"
          description="See which days are above or below your recommended pace."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calorieVariance} margin={{ top: 0, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="varianceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentTheme.colors[1]} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={currentTheme.colors[1]} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<PerformanceTooltip />} />
                <Area type="monotone" dataKey="variance" name="Variance" stroke={currentTheme.colors[1]} strokeWidth={3} fill="url(#varianceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel
          eyebrow="Macro balance score"
          title="Performance radar"
          badge="Radar chart"
          description="A fast view of the nutritional dimensions that most affect your current performance."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={macroBalanceData} outerRadius="82%">
                <PolarGrid stroke="rgba(148,163,184,0.16)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar dataKey="value" name="Score" stroke={currentTheme.colors[0]} fill={currentTheme.colors[0]} fillOpacity={0.35} />
                <Tooltip content={<PerformanceTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartPanel
          eyebrow="Weight trend forecasting"
          title="Body-weight trajectory"
          badge="Trend line"
          description="Monitor logged weight over time as part of your target achievement analysis."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightSeries} margin={{ top: 0, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<PerformanceTooltip />} />
                <Line type="monotone" dataKey="weight" name="Weight" stroke={currentTheme.colors[2]} strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Profile controls</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Personalized health settings</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Name', key: 'name', type: 'text' },
              { label: 'Age', key: 'age', type: 'number' },
              { label: 'Height (cm)', key: 'height', type: 'number' },
              { label: 'Start weight (kg)', key: 'startWeight', type: 'number' },
              { label: 'Current weight (kg)', key: 'currentWeight', type: 'number' },
              { label: 'Target weight (kg)', key: 'targetWeight', type: 'number' },
            ].map((field) => (
              <label key={field.key} className="space-y-2 text-sm text-slate-300">
                <span>{field.label}</span>
                <input
                  type={field.type}
                  value={localProfile[field.key] ?? ''}
                  onChange={(e) => handleProfileChange(field.key, e.target.value)}
                  className="w-full rounded-[24px] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>
            ))}
            <label className="space-y-2 text-sm text-slate-300">
              <span>Activity level</span>
              <select
                value={localProfile.activityLevel}
                onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
                className="w-full rounded-[24px] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="intense">Intense</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Fitness goal</span>
              <select
                value={localProfile.fitnessGoal}
                onChange={(e) => handleProfileChange('fitnessGoal', e.target.value)}
                className="w-full rounded-[24px] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              >
                <option value="weight loss">Weight loss</option>
                <option value="muscle gain">Muscle gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>
          </div>
        </div>
      </section>
    </div>
  )
}
