import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getHistory } from '../utils/api'
import toast from 'react-hot-toast'
import gsap from 'gsap'

interface HistoryItem {
  id: number
  filename: string
  prediction: string
  confidence: number
  timestamp: string
  inference_time_ms: number
}

interface HistoryResponse {
  history: HistoryItem[]
  total: number
}

export default function ResultsDashboardPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedResult, setSelectedResult] = useState<HistoryItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadHistory() {
      try {
        const data: HistoryResponse = await getHistory()
        const items = data.history ?? []
        setHistory(items)
        if (items.length > 0) setSelectedResult(items[0])
      } catch {
        toast.error('Failed to load diagnostic history')
      } finally {
        setIsLoading(false)
      }
    }
    loadHistory()
  }, [location.state])

  useEffect(() => {
    if (!isLoading && pageRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.dash-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })
        gsap.fromTo('.dash-viewer', { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.4, ease: 'power2.out' })
        gsap.fromTo('.dash-sidebar > *', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, delay: 0.5 })
        gsap.fromTo('.dash-chart', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 0.7 })
      }, pageRef)
      return () => ctx.revert()
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="pt-40 pb-32">
        <div className="max-w-screen-xl mx-auto px-8 text-center">
          <span className="material-symbols-outlined text-7xl text-outline-variant mb-6 block">clinical_notes</span>
          <h2 className="text-3xl font-bold font-headline mb-4 text-on-surface">No Diagnostic History Found</h2>
          <p className="text-on-surface-variant mb-10 max-w-md mx-auto text-lg">
            Upload an image in the Analysis Portal to start generating clinical results.
          </p>
          <button
            onClick={() => navigate('/predict')}
            className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Go to Analysis Portal
          </button>
        </div>
      </div>
    )
  }

  const confidencePct = selectedResult ? Math.round(selectedResult.confidence * 100) : 0
  const isNormal = selectedResult?.prediction === 'Normal'

  return (
    <div ref={pageRef} className="bg-surface min-h-screen">
      <main className="pt-24 pb-16 px-4 md:px-12 max-w-[1440px] mx-auto">

        {/* ─── Header ─── */}
        <header className="dash-header mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.05em] text-primary font-bold mb-2 block font-label">
              Patient Analysis Dashboard
            </span>
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tight text-on-surface">
              Case #{selectedResult ? `CX-${selectedResult.id}` : '--'}
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-surface-container text-on-surface px-6 py-4 rounded-full font-bold hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">share</span>
              Share Review
            </button>
            <button className="flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-xl shadow-primary/10 hover:scale-[0.97] transition-transform">
              <span className="material-symbols-outlined">description</span>
              Generate Report
            </button>
          </div>
        </header>

        {/* ─── Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ─── Analysis Viewer ─── */}
          <div className="lg:col-span-8">
            <div className="dash-viewer bg-surface-container-lowest rounded-2xl p-2 relative overflow-hidden">
              <div className="aspect-[4/5] md:aspect-video rounded-[2.5rem] overflow-hidden relative border-4 border-surface-container">
                <img
                  alt="Medical X-ray display"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCndMwvbj9EY4Tempy7WWAABgCKeNJnVFxlvEXTKFWD2wU_fJoCVu7_0qICCGbtvpe_cV-TrNTqnKAioHpuF0iPv11srHMfWae3qA7VWtg7QO5MgarLMBraQYjdKYV11ujxLqNddyLsbY_UREvJuVetpTQLXEwsPjrvgZLDHUz3966IFfLDbKTq-C8Ti9mIrX_c51Zoc56EcvtCLr8zERHWzFTkwi6tG7gISWoZXueStaG8xXOhFT_ZFopS7mgqDQ8XgaJGCWp6j3w"
                />
                {/* AI highlight overlays */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-primary-container rounded-full bg-primary-container/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full">Anomalous Area A</span>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 w-40 h-40 border-2 border-primary-container rounded-full bg-primary-container/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full">Lower Lobe Opacity</span>
                  </div>
                </div>
                {/* Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-on-surface/90 backdrop-blur-md p-2 rounded-full border border-outline-variant/20">
                  <button className="p-3 text-white hover:text-primary-container transition-colors"><span className="material-symbols-outlined">zoom_in</span></button>
                  <button className="p-3 text-white hover:text-primary-container transition-colors"><span className="material-symbols-outlined">contrast</span></button>
                  <button className="p-3 text-white hover:text-primary-container transition-colors"><span className="material-symbols-outlined">layers</span></button>
                  <div className="w-px h-6 bg-white/20 self-center mx-1" />
                  <button className="p-3 text-white hover:text-primary-container transition-colors"><span className="material-symbols-outlined">undo</span></button>
                </div>
              </div>
            </div>

            {/* Historical Charts */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dash-chart bg-surface-container-low p-8 rounded-2xl">
                <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Historical Trend
                </h3>
                <div className="h-48 flex items-end gap-3 px-2">
                  {[40, 55, 45, 85, 100].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-lg ${i >= 3 ? (i === 4 ? 'bg-primary' : 'bg-primary-container') : 'bg-surface-container-highest'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-on-surface/40 uppercase tracking-widest">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                </div>
              </div>
              <div className="dash-chart bg-surface-container-low p-8 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-headline font-bold text-xl mb-2">Findings Context</h3>
                  <p className="text-on-surface/60 text-sm leading-relaxed">
                    AI comparison indicates analysis results for current scan versus baseline reference data.
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-on-surface/40">Confidence Score</span>
                    <span className="text-2xl font-headline font-extrabold text-primary">{confidencePct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="dash-sidebar lg:col-span-4 space-y-6">

            {/* Diagnostic Summary */}
            <div className="bg-primary p-8 rounded-2xl text-on-primary shadow-2xl shadow-primary/20">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 font-label">Diagnostic Summary</span>
                <span className="material-symbols-outlined">emergency</span>
              </div>
              <h2 className="text-3xl font-headline font-bold mb-4 leading-tight">
                {isNormal ? 'No Abnormalities' : `Potential ${selectedResult?.prediction} Detected`}
              </h2>
              <p className="text-on-primary/80 mb-8 leading-relaxed">
                {isNormal
                  ? 'AI analysis indicates no significant pathological findings in the submitted radiograph.'
                  : 'Significant infiltration observed. Recommend immediate clinical correlation and potential follow-up CT scan.'}
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                  <span className="text-sm font-medium">Severity Level</span>
                  <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold">{isNormal ? 'Low' : 'Moderate'}</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                  <span className="text-sm font-medium">Auto-Flagged</span>
                  <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold">{isNormal ? 'Routine' : 'Priority 1'}</span>
                </div>
              </div>
            </div>

            {/* Patient Metadata */}
            <div className="bg-surface-container p-8 rounded-2xl">
              <h3 className="font-headline font-bold text-xl mb-6">Patient Metadata</h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-bold text-on-surface/40 tracking-wider">Filename</span>
                  <span className="font-bold text-lg truncate">{selectedResult?.filename ?? '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase font-bold text-on-surface/40 tracking-wider">Prediction</span>
                    <span className={`font-bold ${isNormal ? 'text-primary' : 'text-error'}`}>{selectedResult?.prediction ?? '—'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase font-bold text-on-surface/40 tracking-wider">Confidence</span>
                    <span className="font-bold text-primary">{confidencePct}%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-bold text-on-surface/40 tracking-wider">Inference Time</span>
                  <span className="font-bold">{selectedResult?.inference_time_ms ?? '—'}ms</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-surface-container-high p-6 rounded-2xl text-left hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-primary mb-3 block">archive</span>
                <span className="text-sm font-bold block">Archive Case</span>
              </button>
              <button className="bg-surface-container-high p-6 rounded-2xl text-left hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-primary mb-3 block">chat</span>
                <span className="text-sm font-bold block">Consult</span>
              </button>
            </div>

            {/* Doctor Notes */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-sm">edit_note</span>
                <h4 className="font-bold text-sm">Radiologist Impressions</h4>
              </div>
              <textarea
                className="w-full bg-surface-container-high border-none rounded-xl p-4 text-sm h-32 placeholder:text-on-surface/30 resize-none"
                placeholder="Add clinical notes here..."
              />
            </div>

            {/* History List */}
            {history.length > 1 && (
              <div className="bg-surface-container p-6 rounded-2xl">
                <h4 className="font-headline font-bold mb-4">All Results</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedResult(item)}
                      className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                        selectedResult?.id === item.id
                          ? 'bg-primary-container/20 ring-1 ring-primary/20'
                          : 'bg-surface-container-lowest hover:bg-surface-container-low'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.prediction === 'Normal' ? 'bg-primary/10' : 'bg-error-container'
                      }`}>
                        <span className={`material-symbols-outlined text-sm ${
                          item.prediction === 'Normal' ? 'text-primary' : 'text-error'
                        }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {item.prediction === 'Normal' ? 'check_circle' : 'warning'}
                        </span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="text-sm font-bold truncate block">{item.filename}</span>
                        <span className="text-[10px] text-on-surface-variant">{item.prediction} • {Math.round(item.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
