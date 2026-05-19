export default function WaterTracker({ waterIntake, goal, onAddGlass }) {
  const progress = Math.min(Math.round((waterIntake / goal) * 100), 100)

  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-slate-400">Hydration</p>
          <p className="mt-3 text-3xl font-semibold text-white">{waterIntake.toFixed(2)} / {goal} L</p>
        </div>
        <span className="rounded-3xl bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200">{progress}%</span>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-950/60">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${progress}%` }} />
      </div>

      <button
        type="button"
        onClick={onAddGlass}
        className="mt-6 w-full rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Add 250ml
      </button>
    </div>
  )
}
