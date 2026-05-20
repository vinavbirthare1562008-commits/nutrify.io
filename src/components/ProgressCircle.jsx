import { motion } from 'framer-motion'
import { useId } from 'react'

function normalizeAccent(accent) {
  if (Array.isArray(accent)) {
    return accent
  }

  if (typeof accent === 'string' && accent) {
    return [accent, accent]
  }

  return ['#8b5cf6', '#22d3ee']
}

export default function ProgressCircle({
  label,
  value = 0,
  goal,
  accent,
  unit = '%',
  hint,
  caption,
  className = '',
  size = 176,
  stroke = 12,
}) {
  const gradientId = useId().replace(/:/g, '')
  const [fromColor, toColor] = normalizeAccent(accent)
  const progress = Math.min(goal ? (value / Math.max(goal, 1)) * 100 : value, 100)
  const radius = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress / 100)
  const isPercentMode = goal == null
  const displayValue = unit === 'L' ? Number(value).toFixed(1) : Math.round(value)

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.92))] p-5 shadow-glass ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl transition duration-300 group-hover:scale-110"
        style={{ background: `radial-gradient(circle, ${fromColor}55 0%, transparent 72%)` }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">{label}</p>
            <p className="mt-3 text-sm text-slate-300">{hint || 'Premium daily target tracking'}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
            {Math.round(progress)}%
          </div>
        </div>

        <div className="mt-5 grid place-items-center">
          <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={fromColor} />
                  <stop offset="100%" stopColor={toColor} />
                </linearGradient>
                <filter id={`${gradientId}-glow`}>
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(148, 163, 184, 0.16)"
                strokeWidth={stroke}
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                filter={`url(#${gradientId}-glow)`}
              />
            </svg>

            <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full border border-white/8 bg-slate-950/70 text-center backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Live</p>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-semibold text-white">
                  {displayValue}
                </span>
                <span className="pb-1 text-sm text-slate-400">{isPercentMode ? '%' : unit}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {isPercentMode ? 'completion' : `${Math.round(goal || 0)} ${unit} goal`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[26px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          {caption || (isPercentMode ? 'Progress is based on current completion.' : `${Math.round(value)} / ${Math.round(goal || 0)} ${unit}`)}
        </div>
      </div>
    </motion.div>
  )
}
