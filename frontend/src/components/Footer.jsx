import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background: 'var(--primary)' }}>XR</div>
              <span className="text-lg font-bold">Chest<span className="text-gradient">XR</span></span>
            </div>
            <p className="text-sm max-w-md leading-relaxed mb-5" style={{ color: 'var(--text-soft)' }}>
              AI-powered chest X-ray analysis for rapid, accurate diagnostic support. Built for medical research.
            </p>
            <a href="https://github.com/ankeet0008/chestX-rayClaiisfication" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--text-soft)' }}>
              <FaGithub size={18} /> View on GitHub
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Product</h4>
            <ul className="space-y-3">
              {[{ to: '/predict', label: 'Analyze' }, { to: '/dashboard', label: 'Dashboard' }, { to: '/', label: 'Features' }].map(({ to, label }) => (
                <li key={label}><Link to={to} className="text-sm transition-colors hover:underline" style={{ color: 'var(--text-soft)' }}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Resources</h4>
            <ul className="space-y-3">
              {['API Docs', 'GitHub', 'Research Paper'].map(label => (
                <li key={label}><a href="#" className="text-sm transition-colors hover:underline" style={{ color: 'var(--text-soft)' }}>{label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} ChestXR AI Diagnostics. Research & educational use only.</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>⚠️ Not a substitute for professional medical diagnosis.</p>
        </div>
      </div>
    </footer>
  )
}
