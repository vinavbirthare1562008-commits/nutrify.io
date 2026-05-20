import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider } from './context/AppContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Meals from './pages/Meals.jsx'
import Analytics from './pages/Analytics.jsx'
import Hydrations from './pages/Hydrations.jsx'
import Performance from './pages/Performance.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Sidebar from './components/Sidebar.jsx'
import Navbar from './components/Navbar.jsx'
import MobileNav from './components/MobileNav.jsx'
import FloatingQuickActions from './components/FloatingQuickActions.jsx'
import { useAppContext } from './context/AppContext.jsx'

function ContentWrapper({ children }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function AppShell() {
  const { currentTheme } = useAppContext()

  return (
    <div className="min-h-screen text-slate-100 transition-colors duration-500" style={{ background: currentTheme.background }}>
      <div className="absolute inset-0 bg-dashboard-glow opacity-60" />
      <div className="relative flex min-h-screen flex-col xl:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-28 pt-6 md:px-6 xl:px-8">
          <Navbar />
          <ContentWrapper>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-meals" element={<Meals />} />
              <Route path="/personal-meals" element={<Navigate replace to="/my-meals" />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/hydrations" element={<Hydrations />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </ContentWrapper>
        </main>
      </div>
      <MobileNav />
      <FloatingQuickActions />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppShell />
      </Router>
    </AppProvider>
  )
}
