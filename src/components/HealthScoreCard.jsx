import { motion } from 'framer-motion'
import ScoreRing from './ScoreRing.jsx'

export default function HealthScoreCard({ health, gamification }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(140deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] p-6 shadow-glass">
      <div
        className="absolute -right-20 top-0 h-56 w-56 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${health.palette.halo} 0%, transparent 68%)` }}
      />
      <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Health score system</p>
            <span className={`rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${health.palette.text}`}>
              {health.grade}
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-white">Daily readiness intelligence</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{health.feedback}</p>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <ScoreRing
                value={health.score}
                size={182}
                stroke={14}
                label="Health"
                fromColor={health.palette.from}
                toColor={health.palette.to}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {health.components.slice(0, 4).map((item) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-300">{item.label}</p>
                      <span className="text-sm font-semibold text-white">{item.score}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${health.palette.from}, ${health.palette.to})` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Momentum</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Level {gamification.level}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">XP</p>
                    <p className="mt-1 text-lg font-semibold text-white">{gamification.xp}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gamification.levelProgress}%` }}
                    transition={{ duration: 0.95, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-400">{gamification.focusText}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Smart insights</p>
            <div className="mt-4 space-y-3">
              {health.insights.map((insight, index) => (
                <motion.div
                  key={insight}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.26 }}
                  className="rounded-[22px] border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                >
                  {insight}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Daily recommendations</p>
            <div className="mt-4 space-y-3">
              {health.recommendations.map((item) => (
                <div key={item.title} className="rounded-[22px] border border-cyan-400/10 bg-cyan-400/5 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
