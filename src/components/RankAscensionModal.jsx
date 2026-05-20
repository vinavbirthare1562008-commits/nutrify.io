import { motion } from 'framer-motion'

export default function RankAscensionModal({ event, onClose }) {
  if (!event) return null

  return (
    <div className="fixed inset-0 z-[85] grid place-items-center bg-slate-950/78 px-4 backdrop-blur-md" onClick={onClose} role="presentation">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        onClick={(eventClick) => eventClick.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(9,9,20,0.98))] p-8 shadow-[0_40px_120px_rgba(15,23,42,0.58)]"
      >
        <div
          className="absolute inset-0 opacity-85"
          style={{
            background: `radial-gradient(circle at 25% 20%, ${(event.house?.colors?.[0] || '#8b5cf6')}33, transparent 22%), radial-gradient(circle at 78% 26%, ${(event.house?.colors?.[1] || '#22d3ee')}33, transparent 22%), radial-gradient(circle at 52% 78%, ${(event.house?.colors?.[2] || '#34d399')}22, transparent 20%)`,
          }}
        />
        <div className="relative text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Rank Ascension</p>
          <div className="mt-6 text-6xl text-white">{event.rank.glyph}</div>
          <h2 className="mt-5 text-4xl font-semibold text-white">{event.rank.label}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Your academy progress has advanced. The codex now recognizes you as a <span className="font-semibold text-white">{event.rank.label}</span>.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current XP</p>
              <p className="mt-3 text-2xl font-semibold text-white">{event.xp}</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Next rank</p>
              <p className="mt-3 text-2xl font-semibold text-white">{event.nextRank.label}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 rounded-[24px] border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Continue the Academy Path
          </button>
        </div>
      </motion.div>
    </div>
  )
}
