import { useState, useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'

import UploadZone from '../components/UploadZone'
import ResultCard from '../components/ResultCard'
import { predictImage } from '../utils/api'

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.predict-reveal', {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const handleFileAccepted = useCallback(async (file) => {
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
    <div style={{ width: '100%', minHeight: '100vh', paddingTop: '7rem', paddingBottom: '5rem', position: 'relative' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="predict-reveal text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold" style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--primary)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--primary)' }} />
            AI Diagnosis Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            X-Ray <span className="text-gradient">Analysis</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-soft)' }}>
            Upload a chest X-ray for instant multi-class classification.
            <br />
            <strong style={{ color: 'var(--primary)' }}>Normal · COVID · Lung Opacity · Pneumonia (Viral/Bacterial)</strong>
          </p>
        </div>

        {/* Content */}
        <div className="predict-reveal">
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <ResultCard result={result} imagePreview={imagePreview} />
              <div style={{ textAlign: 'center' }}>
                <button onClick={handleNewScan} className="btn-primary">
                  Analyze Another X-Ray
                </button>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <UploadZone onFileAccepted={handleFileAccepted} isLoading={isLoading} />
            </div>
          )}
        </div>

        {/* Tips */}
        {!result && !isLoading && (
          <div className="predict-reveal" style={{ marginTop: '3rem', maxWidth: '720px', margin: '3rem auto 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { emoji: '📋', title: 'PA/AP View', desc: 'Best results with standard chest views' },
              { emoji: '🔍', title: 'Clear Image', desc: 'Ensure good contrast and resolution' },
              { emoji: '⚡', title: 'Fast Results', desc: 'Analysis completes in seconds' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{emoji}</div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
