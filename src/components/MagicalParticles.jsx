import { motion } from 'framer-motion'

export default function MagicalParticles({ colors = ['#22d3ee', '#8b5cf6', '#34d399'] }) {
  const particles = Array.from({ length: 22 }, (_, index) => ({
    id: index,
    left: 4 + (index * 4.2) % 90,
    top: 6 + (index * 7.3) % 84,
    size: 4 + (index % 4),
    duration: 3.8 + (index % 5) * 0.55,
    color: colors[index % colors.length],
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 18px ${particle.color}`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.15, 0.75, 0.18],
            scale: [0.85, 1.35, 0.9],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.id * 0.08,
          }}
        />
      ))}
    </div>
  )
}
