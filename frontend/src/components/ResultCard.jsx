import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineChip,
  HiOutlineDownload,
} from 'react-icons/hi'

const getColor = (label) => {
  const n = (label || '').toLowerCase()
  if (n.includes('normal')) return '#10b981'
  if (n.includes('covid') || n.includes('viral')) return '#f59e0b'
  if (n.includes('bact') || n.includes('pneumonia')) return '#ef4444'
  if (n.includes('opacity')) return '#06b6d4'
  return '#6366f1'
}

export default function ResultCard({ result, imagePreview }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!result) return
    const ctx = gsap.context(() => {
      gsap.from('.result-reveal', { y: 20, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out' })
      gsap.from('.bar-fill', { width: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out', delay: 0.3 })
    }, ref)
    return () => ctx.revert()
  }, [result])

  if (!result) return null

  const { prediction, confidence, all_predictions, model_loaded, note, inference_time_ms } = result
  const color = getColor(prediction)
  const isNormal = (prediction || '').toLowerCase().includes('normal')
  const pct = (confidence * 100).toFixed(1)
  const sorted = Object.entries(all_predictions || {}).sort(([, a], [, b]) => b - a)

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto result-reveal">
      <div className="glass-card overflow-hidden relative">
        <div className="h-1" style={{ background: color }} />

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            {imagePreview && (
              <div className="result-reveal">
                <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <img src={imagePreview} alt="X-ray" className="w-full h-auto object-contain" style={{ maxHeight: '400px', background: '#000' }} />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5" style={{ background: color }}>
                    {isNormal ? <HiOutlineCheckCircle size={14} /> : <HiOutlineExclamationCircle size={14} />}
                    {prediction}
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="result-reveal flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Result</p>
                <h2 className="text-3xl font-black" style={{ color }}>{prediction}</h2>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <HiOutlineClock size={14} />
                    {inference_time_ms?.toFixed(0) || '—'}ms
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <HiOutlineChip size={14} />
                    {model_loaded ? 'Live Model' : 'Demo Mode'}
                  </div>
                </div>
              </div>

              {/* Confidence */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-soft)' }}>Confidence</span>
                  <span className="text-xl font-bold" style={{ color }}>{pct}%</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="bar-fill h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>

              {/* Probabilities */}
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>All Classes</p>
                <div className="space-y-3">
                  {sorted.map(([label, prob]) => {
                    const c = getColor(label)
                    const p = (prob * 100).toFixed(1)
                    const top = label === prediction
                    return (
                      <div key={label}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs ${top ? 'font-bold' : 'font-medium'}`} style={{ color: top ? c : 'var(--text-soft)' }}>{label}</span>
                          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{p}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div className="bar-fill h-full rounded-full" style={{ width: `${p}%`, background: top ? c : 'var(--text-muted)', opacity: top ? 1 : 0.35 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {note && (
            <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <HiOutlineExclamationCircle className="flex-shrink-0 mt-0.5" size={18} style={{ color: '#f59e0b' }} />
              <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{note}</p>
            </div>
          )}

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = `xray-report-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
              }}
              className="btn-outline text-sm"
            >
              <HiOutlineDownload size={16} />
              Download Report
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
        ⚠️ This tool is for research & educational purposes only.
      </p>
    </div>
  )
}
