import { motion } from 'framer-motion'

export default function AchievementCard({ achievement, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${achievement.accent}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Arcane Achievement</p>
          <h3 className="mt-3 text-lg font-semibold text-white">{achievement.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{achievement.description}</p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${achievement.unlocked ? 'bg-emerald-400/15 text-emerald-200' : 'bg-white/5 text-slate-300'}`}>
          {achievement.unlocked ? 'Unlocked' : `${achievement.progress}/${achievement.target}`}
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${achievement.completion}%` }}
          transition={{ duration: 0.9, delay: delay + 0.15 }}
          className={`h-full rounded-full bg-gradient-to-r ${achievement.accent}`}
        />
      </div>
      <p className="mt-3 text-sm text-slate-300">{achievement.completion}% complete</p>
      {achievement.academyTitle ? (
        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">Classic title: {achievement.academyTitle}</p>
      ) : null}
    </motion.div>
  )
}
