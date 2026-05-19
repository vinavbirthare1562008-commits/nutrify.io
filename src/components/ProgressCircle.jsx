import { motion } from 'framer-motion'

export default function ProgressCircle({ label, value, goal, accent }) {
  const progress = Math.min((value / goal) * 100, 100)
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress / 100)

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-center shadow-glass">
      <p className="text-sm uppercase tracking-[0.26em] text-slate-400">{label}</p>
      <div className="relative mx-auto mt-5 h-32 w-32">
        <svg viewBox="0 0 110 110" className="h-full w-full">
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.14)"
            strokeWidth="10"
          />
          <motion.circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke={accent}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            transform="rotate(-90 55 55)"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <p className="text-3xl font-semibold text-white">{Math.round(progress)}%</p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">complete</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-300">
        {value}/{goal} {label === 'Calories' ? 'kcal' : 'g'}
      </p>
    </div>
  )
}
