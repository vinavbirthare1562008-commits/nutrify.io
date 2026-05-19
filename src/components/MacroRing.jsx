import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#8b5cf6', '#22d3ee', '#f472b6']

export default function MacroRing({ protein, carbs, fats }) {
  const data = [
    { name: 'Protein', value: protein },
    { name: 'Carbs', value: carbs },
    { name: 'Fats', value: fats },
  ]

  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-slate-400">Macro balance</p>
          <p className="mt-3 text-xl font-semibold text-white">{protein + carbs + fats}g total</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Protein</p>
          <p className="text-lg font-semibold text-white">{protein}g</p>
        </div>
      </div>
      <div className="mt-6 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={58}
              outerRadius={82}
              dataKey="value"
              stroke="transparent"
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {data.map((entry, index) => (
          <div key={entry.name} className="rounded-3xl bg-slate-950/70 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{entry.name}</p>
            <p className="mt-2 text-lg font-semibold text-white">{entry.value}g</p>
          </div>
        ))}
      </div>
    </div>
  )
}
