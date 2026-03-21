import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInbox,
} from 'react-icons/hi'
import toast from 'react-hot-toast'
import { getHistory, clearHistory } from '../utils/api'

const CONDITION_COLORS = {
  'Normal': '#10b981',
  'Pneumonia': '#ef4444',
  'COVID-19': '#f59e0b',
  'Tuberculosis': '#8b5cf6',
  'Lung Opacity': '#06b6d4',
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function DashboardPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, avgConfidence: 0, avgTime: 0 })

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const data = await getHistory()
      setHistory(data.history || [])
      
      // Calculate stats
      const items = data.history || []
      const total = items.length
      const avgConfidence = total > 0
        ? items.reduce((s, h) => s + h.confidence, 0) / total
        : 0
      const avgTime = total > 0
        ? items.reduce((s, h) => s + (h.inference_time_ms || 0), 0) / total
        : 0
      
      setStats({ total, avgConfidence, avgTime })
    } catch {
      toast.error('Failed to fetch history. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleClear = async () => {
    try {
      await clearHistory()
      setHistory([])
      setStats({ total: 0, avgConfidence: 0, avgTime: 0 })
      toast.success('History cleared')
    } catch {
      toast.error('Failed to clear history')
    }
  }

  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div
      className="min-h-screen pt-28 pb-16 px-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1
              className="text-3xl sm:text-4xl font-extrabold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Track your analysis history and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchHistory}
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <HiOutlineRefresh size={16} />
              Refresh
            </motion.button>
            {history.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <HiOutlineTrash size={16} />
                Clear
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            {
              label: 'Total Analyses',
              value: stats.total,
              icon: HiOutlineChartBar,
              color: '#6366f1',
            },
            {
              label: 'Avg Confidence',
              value: `${(stats.avgConfidence * 100).toFixed(1)}%`,
              icon: HiOutlineCheckCircle,
              color: '#10b981',
            },
            {
              label: 'Avg Inference',
              value: `${stats.avgTime.toFixed(0)}ms`,
              icon: HiOutlineClock,
              color: '#06b6d4',
            },
          ].map(({ label, value, icon: Icon, color }, idx) => (
            <motion.div
              key={label}
              variants={fadeUp}
              custom={idx}
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color }}>
                    {value}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div className="p-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Analysis History
            </h2>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <motion.div
                className="w-8 h-8 rounded-full mx-auto mb-4"
                style={{
                  border: '3px solid var(--border-color)',
                  borderTopColor: 'var(--color-primary)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-16 text-center">
              <HiOutlineInbox size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                No analyses yet
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Upload a chest X-ray to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    {['#', 'File', 'Prediction', 'Confidence', 'Time', 'Timestamp'].map(h => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {history.map((item, idx) => {
                      const color = CONDITION_COLORS[item.prediction] || 'var(--color-primary)'
                      const isNormal = item.prediction === 'Normal'

                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="transition-colors"
                          style={{ borderBottom: '1px solid var(--border-subtle)' }}
                        >
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                              {item.id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {item.filename || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
                              style={{
                                backgroundColor: `${color}15`,
                                color: color,
                              }}
                            >
                              {isNormal
                                ? <HiOutlineCheckCircle size={14} />
                                : <HiOutlineExclamationCircle size={14} />
                              }
                              {item.prediction}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-20 h-2 rounded-full overflow-hidden"
                                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                              >
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${(item.confidence * 100)}%`,
                                    backgroundColor: color,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                                {(item.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                              {item.inference_time_ms?.toFixed(0)}ms
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {formatTime(item.timestamp)}
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
