import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'My Meals', to: '/my-meals' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Hydrations', to: '/hydrations' },
  { label: 'Performance', to: '/performance' },
  { label: 'Settings', to: '/settings' },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 rounded-[32px] border border-white/10 bg-slate-950/95 px-3 py-3 shadow-glass backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-3 gap-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center rounded-3xl px-2 py-3 text-center text-[10px] font-semibold transition ${
                isActive ? 'bg-violet-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`
            }
          >
            <span className="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-xs text-slate-200">
              {item.label.charAt(0)}
            </span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
