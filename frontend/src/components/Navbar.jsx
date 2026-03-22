import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/predict', label: 'Analyze' },
  { path: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'var(--bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        padding: scrolled ? '0.75rem 0' : '1.25rem 0',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background: 'var(--primary)' }}>
            XR
          </div>
          <span className="text-lg font-bold tracking-tight">
            Chest<span className="text-gradient">XR</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ path, label }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                  background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
            style={{ color: 'var(--text-soft)', border: '1px solid var(--border)' }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>

          <Link
            to="/predict"
            className="hidden sm:inline-flex btn-primary text-sm"
            style={{ padding: '0.5rem 1.25rem' }}
          >
            Analyze X-Ray
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ color: 'var(--text-soft)', border: '1px solid var(--border)' }}
          >
            {mobileOpen ? <HiOutlineX size={18} /> : <HiOutlineMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map(({ path, label }) => {
                const isActive = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                      background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                    }}
                  >
                    {label}
                  </Link>
                )
              })}
              <Link to="/predict" className="block mt-3">
                <button className="btn-primary w-full justify-center text-sm" style={{ padding: '0.75rem' }}>
                  Analyze X-Ray
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
