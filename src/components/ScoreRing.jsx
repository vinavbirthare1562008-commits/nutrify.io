import { motion } from 'framer-motion'
import { useId } from 'react'

export default function ScoreRing({
  value = 72,
  size = 136,
  stroke = 12,
  label = 'Health',
  fromColor,
  toColor,
  subtitle = '/100',
}) {
  const gradientId = useId().replace(/:/g, '')
  const radius = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const safeValue = Math.max(0, Math.min(100, value))
  const dashOffset = circumference * (1 - safeValue / 100)
  const start = fromColor || (safeValue >= 78 ? '#22c55e' : safeValue >= 55 ? '#facc15' : '#fb7185')
  const end = toColor || (safeValue >= 78 ? '#14b8a6' : safeValue >= 55 ? '#f97316' : '#ef4444')

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${start}30 0%, transparent 68%)` }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={start} />
            <stop offset="100%" stopColor={end} />
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
          stroke="rgba(148,163,184,0.14)"
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
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.15, ease: 'easeOut' }}
          filter={`url(#${gradientId}-glow)`}
        />
      </svg>

      <div className="absolute inset-[16%] flex flex-col items-center justify-center rounded-full border border-white/10 bg-slate-950/75 text-center backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-[0.34em] text-slate-500">{label}</div>
        <div className="mt-1 text-4xl font-semibold text-white">{Math.round(safeValue)}</div>
        <div className="text-xs text-slate-400">{subtitle}</div>
      </div>
    </div>
  )
}
