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
      gsap.from(".reveal-predict", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

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
      toast.success(`Analysis complete: ${data.prediction}`, {
        icon: '🔬',
        style: {
          borderRadius: '16px',
          background: '#333',
          color: '#fff',
        },
      })
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
      ref={pageRef}
      className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden"
    >
      <div className="mesh-bg opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="reveal-predict text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] uppercase tracking-widest font-black text-primary mb-4">
             AI Diagnosis Gateway
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Pathological <span className="text-gradient">Engine</span>
          </h1>
          <p className="text-secondary max-w-xl mx-auto font-medium text-sm md:text-base">
            Upload a high-resolution chest X-ray for immediate multi-class classification.
            <br />
            <span className="text-primary opacity-80 font-bold mt-2 block">
              Targets: Normal • COVID • Lung Opacity • Pneumonia (Viral/Bacterial)
            </span>
          </p>
        </div>

        {/* Upload or Results */}
        <div className="reveal-predict">
          {result ? (
            <div className="space-y-12">
              <ResultCard result={result} imagePreview={imagePreview} />

              <div className="text-center">
                <button
                  onClick={handleNewScan}
                  className="px-8 py-4 bg-primary text-white font-black rounded-2xl glow-hover transition-all"
                >
                  Analyze Another Examination
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <UploadZone
                onFileAccepted={handleFileAccepted}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Instructions Grid */}
        {!result && !isLoading && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Standardized View', desc: 'Optimized for PA/AP radiographic projections.' },
              { title: 'Pathology Mapping', desc: 'Identifies density variants and focal opacities.' },
              { title: 'Instant Inference', desc: 'Gradient Boosting results in < 2 seconds.' },
            ].map((tip, i) => (
              <div
                key={i}
                className="reveal-predict glass-panel p-8 rounded-3xl group hover:border-primary/30 transition-colors"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5 font-black text-primary">
                   0{i + 1}
                </div>
                <h4 className="font-bold mb-2">{tip.title}</h4>
                <p className="text-xs text-secondary font-medium leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
