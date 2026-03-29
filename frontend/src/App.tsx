import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import AnalysisPortalPage from './pages/AnalysisPortalPage'
import ResultsDashboardPage from './pages/ResultsDashboardPage'
import TechnologyPage from './pages/TechnologyPage'

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

export default function App() {
  const location = useLocation()

  // Scroll to top on route change (unless it's a hash link)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
    } else {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location.pathname, location.hash])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/predict" element={<AnalysisPortalPage />} />
              <Route path="/dashboard" element={<ResultsDashboardPage />} />
              <Route path="/technology" element={<TechnologyPage />} />
              {/* Fallback to landing */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
