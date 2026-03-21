import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaLungs, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      {/* Gradient accent line */}
      <div
        className="h-px w-full"
        style={{ background: 'var(--gradient-primary)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <FaLungs className="text-white text-lg" />
              </div>
              <span
                className="text-xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Chest<span className="gradient-text">XR</span>
              </span>
            </div>
            <p
              className="text-sm max-w-md leading-relaxed mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              AI-powered chest X-ray analysis for rapid, accurate diagnostic support.
              Built with cutting-edge deep learning to assist healthcare professionals.
            </p>
            <div className="flex items-center gap-3">
              {[FaGithub, FaTwitter, FaLinkedin, HiOutlineMail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/predict', label: 'Analyze' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/', label: 'Features' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              Resources
            </h4>
            <ul className="space-y-3">
              {['API Docs', 'GitHub', 'Research Paper'].map(label => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm transition-colors hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            © {new Date().getFullYear()} ChestXR AI Diagnostics. For research & educational purposes.
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            ⚠️ Not a substitute for professional medical diagnosis.
          </p>
        </div>
      </div>
    </footer>
  )
}
