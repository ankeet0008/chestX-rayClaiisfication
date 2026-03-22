import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineCube,
} from 'react-icons/hi'

const NAV_LINKS = [
  { path: '/', label: 'Portal' },
  { path: '/predict', label: 'Analysis' },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 px-4 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className={`max-w-7xl mx-auto glass-panel rounded-3xl transition-all duration-500 border-white/5 shadow-2xl ${
        scrolled ? 'px-6 py-2' : 'px-8 py-4 bg-transparent border-transparent shadow-none'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <HiOutlineCube className="text-white text-xl" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black tracking-tighter uppercase">
                Chest<span className="text-gradient">XR</span>
              </span>
              <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map(({ path, label }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    isActive ? 'text-primary bg-primary/10' : 'text-muted hover:text-primary hover:bg-white/5'
                  }`}
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
              className="w-10 h-10 flex items-center justify-center rounded-2xl glass-panel border-white/5 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-xl text-primary"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <Link
              to="/predict"
              className="hidden lg:inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
            >
              Analyze Examination
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl glass-panel text-primary"
            >
              {mobileOpen ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
             initial={{ opacity: 0, y: -20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: -20, scale: 0.95 }}
             className="md:hidden mt-4 mx-auto max-w-sm glass-panel rounded-[2rem] overflow-hidden shadow-2xl border-white/5 p-6 space-y-4"
          >
            {NAV_LINKS.map(({ path, label }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`block px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    isActive ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-muted hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
            <Link
              to="/predict"
              className="block w-full py-5 bg-primary text-white text-center rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl"
            >
              Analyze X-Ray
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
