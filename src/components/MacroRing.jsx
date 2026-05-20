import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#22d3ee', '#f59e0b', '#8b5cf6']

export default function MacroRing({ protein, carbs, fats }) {
  const data = [
    { name: 'Protein', value: protein },
    { name: 'Carbs', value: carbs },
    { name: 'Fats', value: fats },
  ]

  return (
    <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-6 shadow-glass">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Macro breakdown</p>
          <p className="mt-3 text-2xl font-semibold text-white">{Math.round(protein + carbs + fats)}g tracked</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
          Live ratio
        </div>
      </div>

      <div className="mt-6 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={58} outerRadius={82} dataKey="value" stroke="transparent" paddingAngle={6}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {data.map((entry, index) => (
          <div key={entry.name} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{entry.name}</p>
            <p className="mt-2 text-xl font-semibold text-white">{Math.round(entry.value)}g</p>
            <div className="mx-auto mt-3 h-2 w-16 rounded-full" style={{ backgroundColor: COLORS[index] }} />
          </div>
        ))}
      </div>
    </div>
  )
}
