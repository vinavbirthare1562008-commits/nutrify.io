import { AnimatePresence, motion } from 'framer-motion'

export default function RewardFeed({ rewards = [] }) {
  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[70] flex w-72 flex-col gap-3">
      <AnimatePresence>
        {rewards.map((reward) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, x: 40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 40, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/92 p-4 shadow-glass backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg text-white shadow-[0_0_22px_rgba(255,255,255,0.15)]"
                style={{ backgroundColor: reward.tone }}
              >
                {reward.glyph}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{reward.title}</p>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">+{reward.xp} XP</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{reward.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
