import { motion } from 'framer-motion'

export default function HouseSelectionModal({ open, houses, onSelect }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/94 px-4 py-8 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,24,0.98),rgba(2,6,23,0.96))] p-6 shadow-[0_40px_120px_rgba(15,23,42,0.55)] md:p-10">
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 18 }).map((_, index) => (
              <motion.span
                key={index}
                className="absolute h-1.5 w-1.5 rounded-full bg-white/70"
                style={{ left: `${8 + (index * 5) % 84}%`, top: `${10 + (index * 7) % 76}%` }}
                animate={{ y: [0, -16, 0], opacity: [0.25, 0.9, 0.25], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 3 + (index % 5) * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>

          <div className="relative text-center">
            <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Magical Academy Onboarding</p>
            <h1 className="mt-5 text-4xl font-semibold text-white md:text-5xl">Choose Your Nutrify House</h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
              Your house shapes your dashboard aura, magical rewards, academy styling, and the spirit of your wellness journey.
            </p>
          </div>

          <div className="relative mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {houses.map((house, index) => (
              <motion.button
                key={house.key}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(house.key)}
                className="group relative overflow-hidden rounded-[34px] border border-white/10 p-6 text-left shadow-glass"
                style={{ background: house.banner }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.58))]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl font-semibold text-white shadow-[0_0_30px_rgba(255,255,255,0.18)]">
                      {house.icon}
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/90">
                      {house.emblem}
                    </span>
                  </div>
                  <h2 className="mt-8 text-3xl font-semibold text-white">{house.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/80">{house.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {house.values.map((value) => (
                      <span key={value} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white/85">
                        {value}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center gap-2">
                    {house.colors.map((color) => (
                      <span key={color} className="h-3 w-10 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <div className="mt-8 rounded-[22px] border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-white/15">
                    Enter {house.name}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
