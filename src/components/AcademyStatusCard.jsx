import { motion } from 'framer-motion'

export default function AcademyStatusCard({ house, gamification }) {
  if (!house || !gamification?.rank) return null

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[34px] border border-white/10 p-6 shadow-glass"
      style={{ background: house.banner }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.58))]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-white/70">{house.name} House</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{gamification.rank.label}</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">{house.emblem} / {house.values.join(' / ')}</p>
          </div>
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl font-semibold text-white">
            {house.icon}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/15 bg-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white/80">Academy XP</p>
            <p className="text-sm font-semibold text-white">{gamification.xp}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${gamification.rankProgress}%` }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${house.achievementTone}`}
            />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/70">
            Next Rank: {gamification.nextRank.label} at {gamification.nextRank.minXp} XP
          </p>
        </div>
      </div>
    </motion.div>
  )
}
