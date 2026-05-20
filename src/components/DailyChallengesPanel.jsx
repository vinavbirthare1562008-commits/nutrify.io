import { motion } from 'framer-motion'

export default function DailyChallengesPanel({ challenges = [] }) {
  const completedCount = challenges.filter((item) => item.completed).length
  const totalRewards = challenges.filter((item) => item.completed).reduce((sum, item) => sum + item.reward, 0)

  return (
    <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.94))] p-6 shadow-glass">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Daily challenges</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Engagement and XP missions</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Fresh challenge cards encourage daily action, consistency, and premium habit-building.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-white">{completedCount}/{challenges.length}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Rewarded XP</p>
            <p className="mt-2 text-2xl font-semibold text-white">{totalRewards}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.28 }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-[28px] border p-5 ${
              challenge.completed
                ? 'border-emerald-400/25 bg-emerald-400/8'
                : 'border-white/10 bg-white/[0.04]'
            }`}
          >
            {challenge.completed ? (
              <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                Complete
              </div>
            ) : null}

            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Mission</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{challenge.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{challenge.description}</p>

            <div className="mt-5 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">
                {challenge.progress}
                {challenge.unit}
              </span>
              <span className="font-semibold text-white">
                Target {challenge.target}
                {challenge.unit}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${challenge.completion}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${challenge.completed ? 'bg-gradient-to-r from-emerald-400 to-lime-400' : 'bg-gradient-to-r from-cyan-400 to-violet-500'}`}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{challenge.completion}% complete</span>
              <span className="font-semibold text-cyan-100">+{challenge.reward} XP</span>
            </div>

            {challenge.streakBonus ? (
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-amber-200">Streak bonus +{challenge.streakBonus} XP</p>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
