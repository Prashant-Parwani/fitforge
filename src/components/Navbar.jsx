import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileDrawer from './ProfileDrawer'

const navLinks = [
  { to: '/machines', label: 'Machines',   emoji: '🏋️' },
  { to: '/workout',  label: 'Workout',    emoji: '📅' },
  { to: '/diet',     label: 'Diet',       emoji: '🥗' },
  { to: '/calculator', label: 'Calculator', emoji: '🧮' },
  { to: '/scanner',  label: 'AI Scanner', emoji: '📸' },
  { to: '/progress', label: 'Progress',   emoji: '📊' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, logout }            = useAuth()
  const location                    = useLocation()
  const navigate                    = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-brown-200' : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-brown-500 rounded-lg flex items-center justify-center text-cream font-display font-bold text-sm group-hover:bg-brown-600 transition-colors">FF</div>
            <span className="font-display font-semibold text-brown-800 text-lg hidden sm:block">FitForge</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    location.pathname === link.to ? 'bg-brown-500 text-cream' : 'text-brown-700 hover:bg-brown-200 hover:text-brown-800'
                  }`}>
                  <span className="text-base">{link.emoji}</span>{link.label}
                </Link>
              </li>
            ))}
            {/* Log Workout shortcut */}
            {user && (
              <li>
                <Link to="/log"
                  className={`px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    location.pathname === '/log' ? 'bg-brown-500 text-cream' : 'text-brown-700 hover:bg-brown-200'
                  }`}>
                  <span className="text-base">💪</span>Log
                </Link>
              </li>
            )}
          </ul>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <button onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-brown-500 text-cream hover:bg-brown-600 active:scale-95 transition-all duration-200">
                  <span>⚙️</span><span>Personalise</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </button>
                <button onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brown-200 transition-colors">
                  <div className="w-7 h-7 bg-brown-700 rounded-full flex items-center justify-center text-cream text-xs font-bold">
                    {(user.name || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-brown-600 font-body">{user.name?.split(' ')[0]}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <>
                <Link to="/log"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    location.pathname === '/log' ? 'bg-brown-500 text-cream' : 'bg-brown-200 text-brown-700'
                  }`}>
                  💪 Log
                </Link>
                <button onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brown-500 text-cream rounded-lg text-xs font-medium">
                  ⚙️
                </button>
              </>
            )}
            <button className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-brown-200 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}>
              <span className={`block w-5 h-0.5 bg-brown-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-brown-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-brown-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 bg-cream border-t border-brown-200 ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.to ? 'bg-brown-500 text-cream' : 'text-brown-700 hover:bg-brown-100'
                  }`}>
                  <span>{link.emoji}</span>{link.label}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link to="/log"
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === '/log' ? 'bg-brown-500 text-cream' : 'text-brown-700 hover:bg-brown-100'
                  }`}>
                  <span>💪</span>Log Workout
                </Link>
              </li>
            )}
            <li className="pt-2 border-t border-brown-200 mt-1 flex flex-col gap-2">
              {user ? (
                <>
                  <button onClick={() => { setMenuOpen(false); setDrawerOpen(true) }}
                    className="btn-primary w-full text-center text-sm py-2.5 flex items-center justify-center gap-2">
                    ⚙️ Personalise My Profile
                  </button>
                  <button onClick={handleLogout} className="btn-outline w-full text-sm py-2">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login"    className="btn-outline flex-1 text-center text-sm py-2">Login</Link>
                  <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2">Sign Up</Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </header>

      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Floating Log Workout button — mobile only */}
      {user && location.pathname !== '/log' && (
        <Link to="/log"
          className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 bg-brown-500 hover:bg-brown-600 text-cream rounded-full shadow-xl flex items-center justify-center text-2xl transition-all active:scale-95">
          💪
        </Link>
      )}
    </>
  )
}
