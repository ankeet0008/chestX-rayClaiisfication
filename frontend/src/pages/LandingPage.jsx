import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HiOutlineChip,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineLightningBolt,
  HiOutlineArrowRight,
  HiOutlineCloudUpload,
  HiOutlineChartBar,
  HiOutlineDocumentReport,
} from 'react-icons/hi'
import { FaLungs, FaHeartbeat, FaMicroscope } from 'react-icons/fa'

/* ─── Animation variants ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

/* ─── Data ────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: HiOutlineChip,
    title: 'Deep Learning Powered',
    desc: 'State-of-the-art convolutional neural networks trained on thousands of chest X-ray images.',
    color: '#6366f1',
  },
  {
    icon: HiOutlineClock,
    title: 'Instant Results',
    desc: 'Get predictions in seconds, not hours. Rapid analysis to support clinical decision-making.',
    color: '#06b6d4',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'High Accuracy',
    desc: 'Validated against expert radiologist annotations with industry-leading diagnostic precision.',
    color: '#10b981',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Multi-Class Detection',
    desc: 'Identifies Normal, Pneumonia, COVID-19, Tuberculosis, and Lung Opacity conditions.',
    color: '#f59e0b',
  },
]

const STEPS = [
  {
    icon: HiOutlineCloudUpload,
    title: 'Upload',
    desc: 'Drag & drop your chest X-ray image',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Analyze',
    desc: 'AI processes and classifies the image',
  },
  {
    icon: HiOutlineDocumentReport,
    title: 'Results',
    desc: 'View prediction with confidence scores',
  },
]

const STATS = [
  { value: '5+', label: 'Conditions Detected' },
  { value: '<2s', label: 'Inference Time' },
  { value: '95%+', label: 'Accuracy' },
  { value: '24/7', label: 'Availability' },
]

/* ─── Component ───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ═══════ Hero Section ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div className="absolute inset-0 bg-grid opacity-30" />

        {/* Floating orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(99, 102, 241, 0.15)', top: '10%', right: '10%' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(6, 182, 212, 0.1)', bottom: '20%', left: '5%' }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} custom={0}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <FaHeartbeat className="text-sm" />
              AI-Powered Medical Imaging
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-balance"
            style={{ color: '#f1f5f9' }}
          >
            Chest X-Ray{' '}
            <span className="gradient-text">Analysis</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl font-semibold" style={{ color: '#94a3b8' }}>
              Powered by Deep Learning
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#94a3b8' }}
          >
            Upload a chest X-ray and get instant AI-powered classification for
            pneumonia, COVID-19, tuberculosis, and more — with confidence scores
            and detailed analysis.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/predict">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl text-white font-semibold text-base inline-flex items-center gap-3 cursor-pointer"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <FaLungs />
                Start Analysis
                <HiOutlineArrowRight />
              </motion.button>
            </Link>
            <a href="#features">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl font-semibold text-base cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                Learn More
              </motion.button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{value}</div>
                <div className="text-xs mt-1" style={{ color: '#64748b' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
            style={{ border: '2px solid rgba(148, 163, 184, 0.3)' }}
          >
            <motion.div
              className="w-1.5 h-3 rounded-full"
              style={{ background: '#818cf8' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════ How It Works ═══════ */}
      <section className="py-24 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Simple Process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: 'var(--text-primary)' }}
            >
              How It Works
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {STEPS.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={idx}
                className="relative text-center p-8 rounded-2xl transition-all"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {/* Step number */}
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  {idx + 1}
                </div>

                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                >
                  <Icon size={28} style={{ color: 'var(--color-primary)' }} />
                </div>

                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </p>

                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px" style={{ background: 'var(--border-color)' }} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ Features ═══════ */}
      <section
        id="features"
        className="py-24 px-4"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Capabilities
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: 'var(--text-primary)' }}
            >
              Why Choose ChestXR
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc, color }, idx) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={idx}
                whileHover={{ y: -4, boxShadow: 'var(--shadow-xl)' }}
                className="group p-8 rounded-2xl transition-all cursor-default"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={24} style={{ color }} />
                </div>

                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-24 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <FaMicroscope className="text-white text-3xl" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-extrabold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Ready to Analyze?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-base max-w-xl mx-auto mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              Upload your chest X-ray now and get AI-powered insights in seconds.
              No registration required.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Link to="/predict">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl text-white font-semibold text-base inline-flex items-center gap-3 cursor-pointer"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <HiOutlineCloudUpload size={20} />
                  Upload X-Ray
                  <HiOutlineArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
