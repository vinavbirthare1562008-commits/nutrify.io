import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const priorityStyles = {
  high: 'text-rose-200 bg-rose-500/15 border-rose-400/20',
  medium: 'text-amber-200 bg-amber-500/15 border-amber-400/20',
  low: 'text-emerald-200 bg-emerald-500/15 border-emerald-400/20',
}

const statusGlow = {
  excellent: 'rgba(34,197,94,0.18)',
  improving: 'rgba(34,211,238,0.18)',
  'action-needed': 'rgba(251,113,133,0.18)',
  watch: 'rgba(245,158,11,0.18)',
  opportunity: 'rgba(139,92,246,0.18)',
}

export default function AIInsightsPanel({ insights = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (insights.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % insights.length)
    }, 4800)

    return () => window.clearInterval(timer)
  }, [insights.length])

  if (!insights.length) return null

  const activeInsight = insights[activeIndex] || insights[0]

  return (
    <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.94))] p-6 shadow-glass">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">AI insights</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Adaptive nutrition intelligence</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Real-time optimization suggestions generated from your nutrition, hydration, goal momentum, and health score trends.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {insights.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition ${
                index === activeIndex
                  ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${statusGlow[activeInsight.status] || 'rgba(34,211,238,0.16)'} 0%, transparent 70%)` }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeInsight.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  {activeInsight.badge}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${priorityStyles[activeInsight.priority] || priorityStyles.medium}`}>
                  {activeInsight.priority} priority
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">{activeInsight.title}</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{activeInsight.detail}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="inline-flex h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
                <p className="text-sm text-slate-400">AI recommendation status: {activeInsight.status.replace('-', ' ')}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-2">
            {insights.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-10 bg-cyan-400' : 'w-2 bg-white/20'}`}
                aria-label={`Go to insight ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {insights.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-[24px] border p-4 text-left transition ${
                index === activeIndex
                  ? 'border-cyan-400/30 bg-cyan-400/8'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{item.category}</p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.badge}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
