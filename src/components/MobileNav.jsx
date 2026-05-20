import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { label: 'Home', to: '/', icon: 'H' },
  { label: 'Meals', to: '/my-meals', icon: 'M' },
  { label: 'Analytics', to: '/analytics', icon: 'A' },
  { label: 'Water', to: '/hydrations', icon: 'W' },
  { label: 'Performance', to: '/performance', icon: 'P' },
]

export default function MobileNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-1/2 z-40 w-[calc(100vw-1.5rem)] max-w-3xl -translate-x-1/2 rounded-[32px] border border-white/10 bg-slate-950/92 px-3 py-3 shadow-glass backdrop-blur-xl sm:hidden"
    >
      <div className="grid grid-cols-5 gap-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center rounded-3xl px-2 py-3 text-center text-[10px] font-semibold transition ${
                isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`mb-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl text-xs ${isActive ? 'bg-cyan-400/15 text-cyan-100' : 'bg-white/5 text-slate-200'}`}>
                  {item.icon}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  )
}
