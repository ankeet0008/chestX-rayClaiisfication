import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    if (navRef.current && location.pathname !== '/') {
      gsap.fromTo(navRef.current, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    }
  }, [])

  return (
    <nav ref={navRef} id="main-navbar" className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary font-headline tracking-tight">
            Chest XR
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/predict"
              className={`font-headline text-sm ${
                isActive('/predict')
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface/70 hover:text-primary'
              } transition-colors duration-300`}
            >
              Analysis
            </Link>
            <Link
              to="/dashboard"
              className={`font-headline text-sm ${
                isActive('/dashboard')
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface/70 hover:text-primary'
              } transition-colors duration-300`}
            >
              Results
            </Link>
            <Link
              to="/technology"
              className={`font-headline text-sm ${
                isActive('/technology')
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface/70 hover:text-primary'
              } transition-colors duration-300`}
            >
              Technology
            </Link>
            <Link
              to="/faq"
              className={`font-headline text-sm ${
                isActive('/faq')
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface/70 hover:text-primary'
              } transition-colors duration-300`}
            >
              FAQ
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="px-5 py-2 text-sm font-semibold rounded-full text-primary border border-primary/20 hover:bg-primary/5 transition-all">
            Emergency Support
          </button>
          <Link
            to="/predict"
            className="px-6 py-2.5 text-sm font-bold rounded-full bg-primary text-on-primary hover:shadow-lg hover:scale-[0.97] transition-all duration-200"
          >
            Clinician Portal
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-on-surface-variant" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest px-8 py-6 space-y-4">
          <Link to="/predict" className="block text-sm font-medium text-on-surface-variant hover:text-primary" onClick={() => setMobileOpen(false)}>Analysis</Link>
          <Link to="/dashboard" className="block text-sm font-medium text-on-surface-variant hover:text-primary" onClick={() => setMobileOpen(false)}>Results</Link>
          <Link to="/technology" className="block text-sm font-medium text-on-surface-variant hover:text-primary" onClick={() => setMobileOpen(false)}>Technology</Link>
          <Link to="/faq" className="block text-sm font-medium text-on-surface-variant hover:text-primary" onClick={() => setMobileOpen(false)}>FAQ</Link>
          <Link to="/predict" className="block w-full text-center py-3 bg-primary text-on-primary rounded-full font-bold text-sm" onClick={() => setMobileOpen(false)}>Get Started</Link>
        </div>
      )}
    </nav>
  )
}
