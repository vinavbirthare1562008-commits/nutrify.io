export default function NutritionCard({ title, value, subtitle, accent, icon }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {icon && <div className={`rounded-3xl px-4 py-3 text-white ${accent}`}>{icon}</div>}
      </div>
    </div>
  )
}
