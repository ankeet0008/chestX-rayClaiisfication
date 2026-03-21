import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import UploadZone from '../components/UploadZone'
import ResultCard from '../components/ResultCard'
import { predictImage } from '../utils/api'

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleFileAccepted = useCallback(async (file) => {
    // Generate preview
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)

    setIsLoading(true)
    setResult(null)

    try {
      const data = await predictImage(file)
      setResult(data)
      toast.success(`Analysis complete: ${data.prediction}`)
    } catch (err) {
      console.error('Prediction error:', err)
      const message = err.response?.data?.detail || 'Failed to analyze image. Is the backend running?'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleNewScan = () => {
    setResult(null)
    setImagePreview(null)
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
          className="text-center mb-12"
        >
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            X-Ray <span className="gradient-text">Analysis</span>
          </h1>
          <p
            className="text-sm max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Upload a chest X-ray image and our AI will classify it instantly.
            Supported conditions: Normal, Pneumonia, COVID-19, Tuberculosis, Lung Opacity.
          </p>
        </motion.div>

        {/* Upload or Results */}
        {result ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ResultCard result={result} imagePreview={imagePreview} />

            {/* New Scan Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNewScan}
                className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                }}
              >
                Analyze Another X-Ray
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <UploadZone
            onFileAccepted={handleFileAccepted}
            isLoading={isLoading}
          />
        )}

        {/* Tips Section */}
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {[
              { emoji: '📋', title: 'PA/AP View', desc: 'Best results with standard chest views' },
              { emoji: '🔍', title: 'Clear Image', desc: 'Ensure good contrast and resolution' },
              { emoji: '⚡', title: 'Fast Results', desc: 'Analysis completes in seconds' },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="p-4 rounded-xl text-center"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="text-2xl mb-2">{emoji}</div>
                <h4
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {title}
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
