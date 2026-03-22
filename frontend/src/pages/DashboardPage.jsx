import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
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

const COLORS = {
  'Normal': '#10b981',
  'Pneumonia': '#ef4444',
  'COVID-19': '#f59e0b',
  'Lung Opacity': '#06b6d4',
}

export default function DashboardPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, avgConfidence: 0, avgTime: 0 })
  const pageRef = useRef(null)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const data = await getHistory()
      setHistory(data.history || [])
      const items = data.history || []
      const total = items.length
      const avgConfidence = total > 0 ? items.reduce((s, h) => s + h.confidence, 0) / total : 0
      const avgTime = total > 0 ? items.reduce((s, h) => s + (h.inference_time_ms || 0), 0) / total : 0
      setStats({ total, avgConfidence, avgTime })
    } catch {
      toast.error('Failed to fetch history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.dash-reveal', { y: 24, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' })
      }, pageRef)
      return () => ctx.revert()
    }
  }, [loading])

  const handleClear = async () => {
    try {
      await clearHistory()
      setHistory([])
      setStats({ total: 0, avgConfidence: 0, avgTime: 0 })
      toast.success('History cleared')
    } catch { toast.error('Failed to clear') }
  }

  const formatTime = (iso) => {
    try { return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    catch { return iso }
  }

  return (
    <div ref={pageRef} style={{ width: '100%', minHeight: '100vh', paddingTop: '7rem', paddingBottom: '4rem', position: 'relative' }}>
      <div className="ambient" />
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div className="dash-reveal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-1">
              <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Track your analysis history and metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchHistory} className="btn-outline text-sm" style={{ padding: '0.5rem 1rem' }}>
              <HiOutlineRefresh size={16} /> Refresh
            </button>
            {history.length > 0 && (
              <button onClick={handleClear} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                <HiOutlineTrash size={16} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Analyses', value: stats.total, icon: HiOutlineChartBar, color: '#6366f1' },
            { label: 'Avg Confidence', value: `${(stats.avgConfidence * 100).toFixed(1)}%`, icon: HiOutlineCheckCircle, color: '#10b981' },
            { label: 'Avg Inference', value: `${stats.avgTime.toFixed(0)}ms`, icon: HiOutlineClock, color: '#06b6d4' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="dash-reveal glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                  <Icon size={22} style={{ color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="dash-reveal glass-card overflow-hidden">
          <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-lg font-bold">Analysis History</h2>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 rounded-full mx-auto mb-4 animate-spin" style={{ border: '3px solid var(--border)', borderTopColor: 'var(--primary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-16 text-center">
              <HiOutlineInbox size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-soft)' }}>No analyses yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Upload a chest X-ray to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--bg-soft)' }}>
                    {['#', 'File', 'Prediction', 'Confidence', 'Time', 'Date'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => {
                    const color = COLORS[item.prediction] || 'var(--primary)'
                    const normal = item.prediction === 'Normal'
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-5 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                        <td className="px-5 py-3 text-sm font-medium">{item.filename || 'Unknown'}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: `${color}12`, color }}>
                            {normal ? <HiOutlineCheckCircle size={13} /> : <HiOutlineExclamationCircle size={13} />}
                            {item.prediction}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                              <div className="h-full rounded-full" style={{ width: `${item.confidence * 100}%`, background: color }} />
                            </div>
                            <span className="text-xs font-mono" style={{ color: 'var(--text-soft)' }}>{(item.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.inference_time_ms?.toFixed(0)}ms</td>
                        <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{formatTime(item.timestamp)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
