import { motion } from 'framer-motion'
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineChip,
  HiOutlineDownload,
} from 'react-icons/hi'

const getColor = (label) => {
  const norm = (label || '').toLowerCase();
  if (norm.includes('normal')) return { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' };
  if (norm.includes('covid') || norm.includes('virus') || norm.includes('viral')) return { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' };
  if (norm.includes('bact') || norm.includes('pneumonia')) return { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' };
  if (norm.includes('tuber') || norm.includes('tb')) return { bg: '#8b5cf6', light: 'rgba(139, 92, 246, 0.1)' };
  if (norm.includes('opacity')) return { bg: '#06b6d4', light: 'rgba(6, 182, 212, 0.1)' };
  
  return { bg: 'var(--color-primary)', light: 'rgba(99,102,241,0.1)' };
}

export default function ResultCard({ result, imagePreview }) {
  if (!result) return null

  const {
    prediction,
    confidence,
    all_predictions,
    model_loaded,
    note,
    inference_time_ms,
  } = result

  const mainColor = getColor(prediction)
  const isNormal = (prediction || '').toLowerCase().includes('normal')
  const confidencePct = (confidence * 100).toFixed(1)

  // Sort predictions by probability (descending)
  const sortedPredictions = Object.entries(all_predictions || {})
    .sort(([, a], [, b]) => b - a)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Main Result Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Top gradient accent */}
        <div className="h-1" style={{ background: mainColor.bg }} />

        <div className="p-6 sm:p-8">
          {/* Grid: Image + Result */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: X-Ray Image */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
                  <img
                    src={imagePreview}
                    alt="Analyzed X-ray"
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '400px', backgroundColor: '#000' }}
                  />
                  {/* Diagnosis badge overlay */}
                  <div
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5"
                    style={{ backgroundColor: mainColor.bg, boxShadow: `0 4px 12px ${mainColor.bg}40` }}
                  >
                    {isNormal ? <HiOutlineCheckCircle size={14} /> : <HiOutlineExclamationCircle size={14} />}
                    {prediction}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Right: Analysis Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col"
            >
              {/* Primary Prediction */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Analysis Result
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-extrabold mb-1"
                  style={{ color: mainColor.bg }}
                >
                  {prediction}
                </h2>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <HiOutlineClock size={14} />
                    <span className="text-xs">{inference_time_ms?.toFixed(0) || '—'}ms</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <HiOutlineChip size={14} />
                    <span className="text-xs">{model_loaded ? 'Live Model' : 'Demo Mode'}</span>
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Confidence
                  </span>
                  <span className="text-2xl font-bold" style={{ color: mainColor.bg }}>
                    {confidencePct}%
                  </span>
                </div>
                <div
                  className="w-full h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: mainColor.light }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidencePct}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${mainColor.bg}, ${mainColor.bg}cc)`,
                      boxShadow: `0 0 12px ${mainColor.bg}40`,
                    }}
                  />
                </div>
              </div>

              {/* All Class Probabilities */}
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                  Class Probabilities
                </p>
                <div className="space-y-3">
                  {sortedPredictions.map(([label, prob], idx) => {
                    const color = getColor(label)
                    const pct = (prob * 100).toFixed(1)
                    const isPrimary = label === prediction

                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-sm ${isPrimary ? 'font-semibold' : 'font-medium'}`}
                            style={{ color: isPrimary ? color.bg : 'var(--text-secondary)' }}
                          >
                            {label}
                          </span>
                          <span
                            className="text-sm font-mono font-medium"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div
                          className="w-full h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: 'var(--bg-tertiary)' }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + idx * 0.1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color.bg }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Demo Mode Notice */}
          {note && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 rounded-xl flex items-start gap-3"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <HiOutlineExclamationCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{note}</p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-6 flex flex-wrap gap-3"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            <button
              onClick={() => {
                const data = JSON.stringify(result, null, 2)
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `xray-report-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <HiOutlineDownload size={16} />
              Download Report
            </button>
          </motion.div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center text-xs mt-6"
        style={{ color: 'var(--text-muted)' }}
      >
        ⚠️ This tool is for research and educational purposes only. It is not a substitute for professional medical diagnosis.
      </motion.p>
    </motion.div>
  )
}
