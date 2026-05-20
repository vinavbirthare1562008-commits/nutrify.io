import { motion } from 'framer-motion'

export default function ThemePreviewCard({ theme, active, onSelect }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(theme.key)}
      className={`w-full rounded-[28px] border p-4 text-left transition ${
        active ? 'border-cyan-400/30 bg-cyan-400/8' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.06]'
      }`}
    >
      <div className="h-24 rounded-[22px]" style={{ background: theme.preview }} />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{theme.name}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{theme.description}</p>
        </div>
        {active ? (
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
            Active
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex gap-2">
        {theme.colors.map((color) => (
          <span key={color} className="h-3 w-10 rounded-full" style={{ backgroundColor: color }} />
        ))}
      </div>
    </motion.button>
  )
}
