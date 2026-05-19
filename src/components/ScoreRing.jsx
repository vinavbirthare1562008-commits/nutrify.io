import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export default function ScoreRing({ value = 72, size = 136, stroke = 12, gradientId = 'scoreGrad', label = 'Health' }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const controls = useAnimation()

  useEffect(() => {
    controls.start({ strokeDashoffset: circumference * (1 - Math.min(100, value) / 100), transition: { duration: 1.2, ease: 'easeOut' } })
  }, [value, circumference, controls])

  const colorFrom = value > 80 ? '#06b6d4' : value > 60 ? '#60a5fa' : value > 40 ? '#f59e0b' : '#ef4444'
  const colorTo = value > 80 ? '#7c3aed' : value > 60 ? '#a78bfa' : value > 40 ? '#fb923c' : '#f97316'

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
          <motion.circle
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={controls}
            style={{ rotate: -90 }}
          />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs text-slate-300 uppercase tracking-wider">{label}</div>
        <div className="mt-1 text-3xl font-semibold text-white">{Math.round(value)}</div>
        <div className="text-xs text-slate-400">/100</div>
      </div>
    </div>
  )
}
