import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'
import StatCard from '../components/StatCard.jsx'
import WaterTracker from '../components/WaterTracker.jsx'

export default function Hydrations() {
  const { waterIntake, waterTrend, settings, updateWaterIntake, streak, completion } = useAppContext()
  const hydrationCompletion = Math.min(100, Math.round((waterIntake / settings.waterGoal) * 100))

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Hydration hub</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Daily water performance</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Track your hydration score, follow streak momentum, and see how every sip supports your premium fitness goals.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-950/80 px-5 py-4 text-center text-white shadow-lg shadow-cyan-500/10">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Hydration goal</p>
            <p className="mt-2 text-3xl font-semibold">{settings.waterGoal}L</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl"
        >
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Water progress</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Refill rhythm</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Stay ahead of dehydration with a premium visual goal meter and smart daily intake prompts.
              </p>
            </div>
            <div className="rounded-[28px] bg-slate-950/75 p-5 text-center shadow-inner shadow-cyan-500/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Completion</p>
              <p className="mt-4 text-5xl font-semibold text-cyan-400">{hydrationCompletion}%</p>
              <p className="mt-2 text-sm text-slate-400">of daily goal</p>
            </div>
          </div>

          <div className="mt-8">
            <WaterTracker waterIntake={waterIntake} goal={settings.waterGoal} onAddGlass={() => updateWaterIntake(0.25)} />
          </div>
        </motion.div>

        <div className="space-y-6">
          <StatCard title="Hydration streak" subtitle={`${streak} days`} detail="Daily consistency builds resilient recovery." />
          <StatCard title="Wellness boost" subtitle={`${completion}%`} detail="Calories and hydration aligned for premium energy." />
          <StatCard title="Water wave" subtitle={`${waterTrend.length} days`} detail="Trend history to keep performance on track." />
        </div>
      </section>
    </div>
  )
}
