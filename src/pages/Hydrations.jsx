import { ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Line, LineChart } from 'recharts'
import { useAppContext } from '../context/AppContext.jsx'
import StatCard from '../components/StatCard.jsx'
import WaterTracker from '../components/WaterTracker.jsx'
import ChartPanel from '../components/ChartPanel.jsx'

function HydrationTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-[18px] border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl">
      <p className="text-sm font-semibold text-white">{label}</p>
      {payload.map((entry) => (
        <p key={`${entry.dataKey}-${entry.name}`} className="mt-2 text-sm text-slate-300">
          {entry.name || entry.dataKey}: <span className="font-semibold text-white">{Math.round(entry.value * 10) / 10}</span>
        </p>
      ))}
    </div>
  )
}

export default function Hydrations() {
  const { waterIntake, waterTrend, settings, updateWaterIntake, gamification, aiInsights, currentTheme } = useAppContext()
  const hydrationCompletion = Math.min(100, Math.round((waterIntake / settings.waterGoal) * 100))
  const hydrationInsight = aiInsights.find((item) => item.category === 'Hydration') || aiInsights[0]

  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Hydration hub</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Daily water performance</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Track hydration score, streak momentum, and advanced refill patterns with a more app-like premium experience.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] px-5 py-4 text-center text-white shadow-lg shadow-cyan-500/10">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Hydration goal</p>
            <p className="mt-2 text-3xl font-semibold">{settings.waterGoal}L</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <WaterTracker waterIntake={waterIntake} goal={settings.waterGoal} onAddGlass={updateWaterIntake} />

        <div className="space-y-6">
          <StatCard title="Hydration streak" value={`${gamification.hydrationStreak} days`} accent="bg-cyan-500/15 text-cyan-100">
            Active
          </StatCard>
          <StatCard title="Completion" value={`${hydrationCompletion}%`} accent="bg-emerald-500/15 text-emerald-100">
            Today's goal
          </StatCard>
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">AI hydration insight</p>
            <h2 className="mt-4 text-xl font-semibold text-white">{hydrationInsight?.title || 'Hydration looks stable today.'}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{hydrationInsight?.detail || 'Keep sipping steadily to protect energy and appetite balance.'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartPanel
          eyebrow="Hydration tracking"
          title="Seven-day refill curve"
          badge="Area chart"
          description="A smoother view of your daily water intake against your target."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterTrend} margin={{ top: 0, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="waterTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentTheme.colors[0]} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={currentTheme.colors[0]} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<HydrationTooltip />} />
                <Area type="monotone" dataKey="intake" name="Intake (L)" stroke={currentTheme.colors[0]} strokeWidth={3} fill="url(#waterTrendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel
          eyebrow="Goal rhythm"
          title="Hydration completion line"
          badge="Line chart"
          description="Track how consistently you are landing near your water target."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterTrend} margin={{ top: 0, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} domain={[0, 120]} />
                <Tooltip content={<HydrationTooltip />} />
                <Line type="monotone" dataKey="completion" name="Completion %" stroke={currentTheme.colors[1]} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>
    </div>
  )
}
