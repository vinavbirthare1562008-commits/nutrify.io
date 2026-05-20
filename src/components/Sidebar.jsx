import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'

const navItems = [
  { path: '/', label: 'Great Hall', iconType: 'home' },
  { path: '/my-meals', label: 'Potion Ledger', iconType: 'meal' },
  { path: '/analytics', label: 'Rune Analytics', iconType: 'analytics' },
  { path: '/hydrations', label: 'Hydration Charms', iconType: 'water' },
  { path: '/performance', label: 'Alchemy Tower', iconType: 'pulse' },
]

const secondaryItems = [
  { path: '/profile', label: 'Wizard Profile', iconType: 'profile' },
  { path: '/settings', label: 'Enchanted Settings', iconType: 'settings' },
]

function Icon({ type, accent }) {
  return (
    <span
      className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-slate-200 transition duration-200"
      style={{ boxShadow: `0 0 20px ${accent}18` }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        {type === 'home' && <path d="M3 11.25 12 3l9 8.25v8.25a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 19.5V11.25Z" />}
        {type === 'meal' && (
          <>
            <path d="M4.5 9.75h15" />
            <path d="M4.5 12.75h15" />
            <path d="M7.5 16.5h9" />
          </>
        )}
        {type === 'analytics' && (
          <>
            <path d="M5.25 15.75V8.25" />
            <path d="M9.75 15.75V5.25" />
            <path d="M14.25 15.75V10.5" />
            <path d="M18.75 15.75V12" />
          </>
        )}
        {type === 'water' && (
          <>
            <path d="M12 4.5c-3.5 5.5-5.25 8.25-5.25 10.5A5.25 5.25 0 0 0 12 20.25 5.25 5.25 0 0 0 17.25 15c0-2.25-1.75-5-5.25-10.5Z" />
            <path d="M12 8.25c-1.5 2.25-2.25 3.25-2.25 4.5 0 1.24.98 2.25 2.25 2.25s2.25-1.01 2.25-2.25c0-1.25-.75-2.25-2.25-4.5Z" />
          </>
        )}
        {type === 'pulse' && (
          <>
            <path d="M3 12h4l2-4 3 8 2-5h5" />
            <path d="M21 12v6a2 2 0 0 1-2 2H5" />
          </>
        )}
        {type === 'profile' && (
          <>
            <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12Z" />
            <path d="M4.5 20.25c0-3.182 2.94-5.75 7.5-5.75s7.5 2.568 7.5 5.75" />
          </>
        )}
        {type === 'settings' && (
          <>
            <path d="M12 6.75v2.25" />
            <path d="M12 14.25v2.25" />
            <path d="M15.75 9.75h-2.25" />
            <path d="M10.5 9.75H8.25" />
            <path d="M15.03 14.22l-1.59-1.59" />
            <path d="M10.56 9.75 8.97 8.16" />
            <path d="M15.03 9.75l-1.59 1.59" />
            <path d="M10.56 14.22l-1.59-1.59" />
          </>
        )}
      </svg>
    </span>
  )
}

export default function Sidebar() {
  const { streak, totalCalories, completion, selectedHouse, gamification, currentTheme } = useAppContext()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const accent = selectedHouse?.colors?.[0] || currentTheme.colors[0]

  return (
    <aside
      className={`hidden xl:flex xl:flex-col xl:overflow-hidden xl:border-r xl:border-white/10 xl:bg-slate-950/88 xl:px-6 xl:py-8 ${
        isCollapsed ? 'xl:w-[108px]' : 'xl:w-[340px]'
      } transition-all duration-300`}
    >
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-8"
      >
        <div
          className="rounded-[32px] border border-white/10 p-6 shadow-glass backdrop-blur-xl"
          style={{ background: selectedHouse?.banner || 'rgba(15,23,42,0.85)' }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className={isCollapsed ? 'hidden' : ''}>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Nutrify Academy</p>
              <h1 className="mt-3 text-2xl font-semibold text-white">{selectedHouse ? selectedHouse.name : 'Academy House'}</h1>
            </div>
            <button
              type="button"
              onClick={() => setIsCollapsed((value) => !value)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-slate-100 transition hover:bg-white/15"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="text-lg">{isCollapsed ? '>' : '<'}</span>
            </button>
          </div>
          {!isCollapsed && (
            <p className="mt-5 text-sm leading-6 text-white/80">
              Rank: {gamification.rank?.label || 'Muggle'} / House path shaped by ritual, focus, and enchanted nutrition mastery.
            </p>
          )}
        </div>

        <nav className="rounded-[32px] border border-white/10 bg-slate-900/85 p-4 shadow-glass backdrop-blur-xl">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `group flex items-center rounded-3xl px-4 py-4 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { background: `linear-gradient(90deg, ${accent}26, rgba(255,255,255,0.04))` } : undefined
                }
              >
                <Icon type={item.iconType} accent={accent} />
                <span className={isCollapsed ? 'hidden' : ''}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className={isCollapsed ? 'hidden' : ''}>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Academy streak</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{streak} days</h2>
            </div>
            <div className="rounded-3xl bg-slate-950/75 px-4 py-3 text-sm text-slate-100">{gamification.rank?.glyph || '✦'}</div>
          </div>
          {!isCollapsed && (
            <>
              <p className="mt-4 text-sm leading-6 text-slate-400">Each consistent day strengthens your house standing and magical rank progression.</p>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center justify-between rounded-3xl bg-white/5 p-4">
                  <span className="text-sm text-slate-400">Potion accuracy</span>
                  <span className="text-sm font-semibold text-white">{completion}%</span>
                </div>
                <div className="rounded-3xl p-4" style={{ background: `linear-gradient(90deg, ${accent}20, rgba(255,255,255,0.04))` }}>
                  <p className="text-sm text-slate-400">Daily energy</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{totalCalories} kcal</p>
                </div>
              </div>
            </>
          )}
        </div>

        <nav className="rounded-[32px] border border-white/10 bg-slate-900/85 p-4 shadow-glass backdrop-blur-xl">
          <div className="space-y-2">
            {secondaryItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-white/5 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                  }`
                }
              >
                <Icon type={item.iconType} accent={accent} />
                <span className={isCollapsed ? 'hidden' : ''}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </motion.div>
    </aside>
  )
}
