import { motion } from 'framer-motion'

export default function ChartPanel({ eyebrow, title, badge, children, delay = 0, description, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-6 shadow-glass ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{eyebrow}</p>
          <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
          {description ? <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p> : null}
        </div>
        {badge ? (
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
            {badge}
          </div>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </motion.div>
  )
}
