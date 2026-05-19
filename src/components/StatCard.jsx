import { motion } from 'framer-motion'

export default function StatCard({ title, value, accent, children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-3xl px-3 py-2 text-sm font-semibold ${accent}`}>
          {children}
        </div>
      </div>
    </motion.div>
  )
}
