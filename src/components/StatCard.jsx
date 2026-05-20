import { motion } from 'framer-motion'

export default function StatCard({
  title,
  value,
  subtitle,
  detail,
  accent,
  children,
}) {
  const badgeContent = children || subtitle

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-6 shadow-glass"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{title}</p>
          <p className="text-3xl font-semibold text-white">{value || subtitle}</p>
          {detail ? <p className="max-w-[22rem] text-sm leading-6 text-slate-400">{detail}</p> : null}
        </div>
        {badgeContent ? (
          <div className={`rounded-3xl border border-white/10 px-3 py-2 text-sm font-semibold ${accent || 'bg-white/5 text-slate-200'}`}>
            {badgeContent}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
