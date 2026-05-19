import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'
import StatCard from '../components/StatCard.jsx'
import ProgressCircle from '../components/ProgressCircle.jsx'
import ScoreRing from '../components/ScoreRing.jsx'
import {
  computeHealthScoreFromData,
  computeNutritionQualityIndex,
  generateSmartSuggestions,
  buildReportAggregates,
  predictDaysToTarget,
} from '../utils/appUtils.js'

const habits = [
  { label: 'Sleep optimization', value: 84 },
  { label: 'Meal balance', value: 78 },
  { label: 'Hydration consistency', value: 92 },
  { label: 'Protein recovery', value: 80 },
]

export default function Performance() {
  const {
    performanceScore,
    nutritionQuality,
    streak,
    meals,
    healthProfile,
    bmi,
    recommendedCalories,
    goalProgress,
    goalPrediction,
    healthSummary,
    updateHealthProfile,
    waterHistory,
    weightLogs,
    settings,
    waterIntake,
    dailyNutrition,
  } = useAppContext()

  const [localProfile, setLocalProfile] = useState(healthProfile)

  const focusAreas = useMemo(
    () => [
      { label: 'Health score', value: performanceScore, color: 'from-violet-500 to-cyan-500' },
      { label: 'Nutrition balance', value: nutritionQuality, color: 'from-cyan-500 to-teal-500' },
      { label: 'Streak power', value: Math.min(100, streak * 10), color: 'from-fuchsia-500 to-pink-500' },
    ],
    [performanceScore, nutritionQuality, streak],
  )

  const handleProfileChange = (key, value) => {
    const parsed = ['age', 'height', 'currentWeight', 'targetWeight', 'dailyCalories'].includes(key) ? Number(value) : value
    const nextProfile = { ...localProfile, [key]: parsed }
    setLocalProfile(nextProfile)
    updateHealthProfile({ [key]: parsed })
  }

  const reportAggregates = useMemo(() => buildReportAggregates(meals, waterHistory, weightLogs), [meals, waterHistory, weightLogs])
  const healthScore = useMemo(() => computeHealthScoreFromData({ meals, waterHistory, settings, streak, weightSeries: weightLogs }), [meals, waterHistory, settings, streak, weightLogs])
  const nutritionIndex = useMemo(() => computeNutritionQualityIndex(meals), [meals])
  const suggestions = useMemo(() => generateSmartSuggestions({ dailyNutrition, water: waterIntake, micronutrients: {}, settings }), [dailyNutrition, waterIntake, settings])
  const predictionEstimate = useMemo(() => predictDaysToTarget({ currentWeight: healthProfile.currentWeight, targetWeight: healthProfile.targetWeight, avgDailyCalories: reportAggregates.avgCalories, recommendedCalories }), [healthProfile, reportAggregates, recommendedCalories])

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Performance overview</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Health management & progress</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Track body metrics, refine goals, and stay on pace with premium health analytics built for modern fitness journeys.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-center shadow-lg shadow-violet-500/8">
              <ScoreRing value={healthScore} size={120} stroke={12} gradientId="healthScoreGrad" label="Health" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Nutrition quality</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">{nutritionIndex.quality}% — {nutritionIndex.healthyRating}</h3>
              <p className="mt-2 text-sm text-slate-400">Processed foods: {nutritionIndex.processedPercent}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl"
        >
          <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Health management</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Personal body metrics</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Update your profile and get tailored recommendations based on your goals and activity level.</p>
            </div>
            <div className="flex items-center justify-center">
              <ProgressCircle value={goalProgress} label="Goal progress" accent="#22c55e" className="w-44" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {habits.map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-950/75 p-5">
                <p className="text-sm text-slate-400">{item.label}</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: `${item.value}%` }} />
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{item.value}%</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Health summary</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/75 p-5">
                <p className="text-sm text-slate-400">BMI</p>
                <p className="mt-3 text-4xl font-semibold text-white">{bmi}</p>
                <p className="mt-2 text-sm text-slate-400">{bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Overweight' : 'High risk'}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/75 p-5">
                <p className="text-sm text-slate-400">Recommended calories</p>
                <p className="mt-3 text-4xl font-semibold text-white">{recommendedCalories} kcal</p>
                <p className="mt-2 text-sm text-slate-400">Tailored for your goal.</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-950/75 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Daily health insight</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{healthSummary}</p>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-950/75 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Goal prediction</p>
              <p className="mt-3 text-2xl font-semibold text-white">{goalPrediction}</p>
              <p className="mt-2 text-sm text-slate-400">Projected time to hit your target weight.</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Personal metrics</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Update your profile</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Name</span>
                <input
                  value={localProfile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Age</span>
                <input
                  type="number"
                  value={localProfile.age}
                  onChange={(e) => handleProfileChange('age', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Height (cm)</span>
                <input
                  type="number"
                  value={localProfile.height}
                  onChange={(e) => handleProfileChange('height', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Current weight (kg)</span>
                <input
                  type="number"
                  value={localProfile.currentWeight}
                  onChange={(e) => handleProfileChange('currentWeight', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Target weight (kg)</span>
                <input
                  type="number"
                  value={localProfile.targetWeight}
                  onChange={(e) => handleProfileChange('targetWeight', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Daily calories</span>
                <input
                  type="number"
                  value={localProfile.dailyCalories ?? recommendedCalories}
                  onChange={(e) => handleProfileChange('dailyCalories', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Activity level</span>
                <select
                  value={localProfile.activityLevel}
                  onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
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
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="weight loss">Weight loss</option>
                  <option value="muscle gain">Muscle gain</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Gender</span>
                <select
                  value={localProfile.gender}
                  onChange={(e) => handleProfileChange('gender', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-950/75 p-5 text-sm text-slate-400">
              <p className="font-semibold text-white">Pro tip</p>
              <p className="mt-2">Keeping your health profile updated helps the platform deliver stronger personalized recommendations and more accurate calorie goals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
