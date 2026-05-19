export default function GoalCard({ title, value, progress, description, accent }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        </div>
        <div className={`rounded-3xl px-4 py-3 text-sm font-semibold ${accent}`}>{progress}%</div>
      </div>
    </div>
  )
}
