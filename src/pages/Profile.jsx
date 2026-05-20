import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'

export default function Profile() {
  const { healthProfile, personalizedGreeting, currentTheme, gamification, dailyHealth } = useAppContext()

  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Profile</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{personalizedGreeting.greeting}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Personalized profile summary for your AI-powered health ecosystem.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active theme</p>
            <p className="mt-3 text-xl font-semibold text-white">{currentTheme.name}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass"
        >
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Identity</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-3xl font-semibold text-white">{healthProfile.name}</p>
              <p className="mt-2 text-sm text-slate-400">Goal: {healthProfile.fitnessGoal} / Activity: {healthProfile.activityLevel}</p>
            </div>
            <div className="rounded-[28px] bg-slate-950/75 px-5 py-4 shadow-glass">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Health score</p>
              <p className="mt-3 text-xl font-semibold text-white">{dailyHealth.score}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass"
        >
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Momentum summary</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Level</p>
              <p className="mt-3 text-3xl font-semibold text-white">{gamification.level}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Unlocked badges</p>
              <p className="mt-3 text-3xl font-semibold text-white">{gamification.unlockedCount}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Hydration streak</p>
              <p className="mt-3 text-3xl font-semibold text-white">{gamification.hydrationStreak}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Goal streak</p>
              <p className="mt-3 text-3xl font-semibold text-white">{gamification.goalCompletionStreak}</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
