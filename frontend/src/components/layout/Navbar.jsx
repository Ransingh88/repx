import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { LayoutDashboard, BookOpen, History, Dumbbell, Zap, Sun, Moon, Menu, X } from 'lucide-react'
import { useWorkout } from '../../store/WorkoutContext'
import { useTheme } from '../../hooks/useTheme'

const NAV_LINKS = [
  { label: 'Dashboard', path: '/',          icon: LayoutDashboard },
  { label: 'Exercises', path: '/exercises', icon: BookOpen },
  { label: 'History',   path: '/history',   icon: History },
]

const Navbar = () => {
  const location = useLocation()
  const { state } = useWorkout()
  const { isDark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const hasActiveSession = !!state.session

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const linkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-gray-900 dark:text-white tracking-tight hover:text-green-600 dark:hover:text-green-400 transition-colors shrink-0"
        >
          <Dumbbell size={20} className="text-green-500" />
          repx.
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path} className={linkClass(path)}>
              <Icon size={14} />
              {label}
            </Link>
          ))}
          {hasActiveSession && (
            <Link
              to="/session"
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <Zap size={14} />
              Active
            </Link>
          )}
        </div>

        {/* Right: theme toggle + hamburger */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path} className={linkClass(path)}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
          {hasActiveSession && (
            <Link
              to="/session"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors mt-1"
            >
              <Zap size={15} />
              Active Workout
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
