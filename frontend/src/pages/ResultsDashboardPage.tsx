import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getHistory } from '../utils/api'
import toast from 'react-hot-toast'

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

  useEffect(() => {
    async function loadHistory() {
      try {
        const data: HistoryResponse = await getHistory()
        const items = data.history ?? []
        setHistory(items)

        if (items.length > 0) {
          setSelectedResult(items[0])
        }
      } catch {
        toast.error('Failed to load diagnostic history')
      } finally {
        setIsLoading(false)
      }
    }
    loadHistory()
  }, [location.state])

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
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 text-center">
          <span className="material-symbols-outlined text-7xl text-outline-variant mb-6 block">
            clinical_notes
          </span>
          <h2 className="text-3xl font-bold font-headline mb-4">No Diagnostic History Found</h2>
          <p className="text-on-surface-variant mb-10 max-w-md mx-auto text-lg">
            Upload an image in the Analysis Portal to start generating clinical results.
          </p>
          <button
            onClick={() => navigate('/predict')}
            className="gradient-primary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg"
          >
            Go to Analysis Portal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-36 pb-32">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">

        {/* ─── Page Header ─── */}
        <header className="mb-16">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
            Results Dashboard
          </h1>
          <p className="text-on-surface-variant text-lg">
            Review and analyse your diagnostic results below.
          </p>
        </header>

        {/* ─── Two-column layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ─── Left column: Findings list ─── */}
          <div className="lg:col-span-5 space-y-8">

            {/* Patient ID placeholder */}
            <section className="bg-surface-container-lowest p-8 rounded-2xl cloud-shadow">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-outline font-label">
                  Selected Record
                </span>
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
              </div>
              <h2 className="text-2xl font-extrabold font-headline text-on-surface mb-2">
                {selectedResult?.filename ?? 'No file selected'}
              </h2>
              <p className="text-on-surface-variant text-xs font-label mb-5">
                Date:{' '}
                {selectedResult
                  ? new Date(selectedResult.timestamp).toLocaleDateString()
                  : '--'}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">
                  Automated Analysis
                </span>
                <span className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full">
                  Routine Screening
                </span>
              </div>
            </section>

            {/* AI Analysis */}
            <section className="bg-surface-container-low p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold font-headline">AI Analysis</h3>
                <span
                  className={`px-4 py-1.5 text-[10px] font-extrabold rounded-full ${
                    selectedResult?.prediction === 'Normal'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  {selectedResult?.prediction === 'Normal' ? 'No Pathologies' : 'Findings Detected'}
                </span>
              </div>

              {/* Prediction */}
              {selectedResult && (
                <div className="bg-surface-container-lowest p-6 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-on-surface">{selectedResult.prediction}</h4>
                    <span className="text-sm font-bold text-primary">
                      {Math.round(selectedResult.confidence * 100)}% Conf.
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${selectedResult.confidence * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-6 border-t border-outline-variant/20">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-outline mb-4 font-label">
                  Analysis Metadata
                </h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="text-[11px] font-medium text-on-surface-variant">
                    Model: <span className="text-on-surface">sklearn v4.2</span>
                  </div>
                  <div className="text-[11px] font-medium text-on-surface-variant">
                    Classes: <span className="text-on-surface">5-Multi</span>
                  </div>
                  <div className="text-[11px] font-medium text-on-surface-variant">
                    Confidence:{' '}
                    <span className="text-on-surface">
                      {selectedResult ? Math.round(selectedResult.confidence * 100) : '--'}%
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-on-surface-variant">
                    Latency:{' '}
                    <span className="text-on-surface">
                      {selectedResult?.inference_time_ms ?? '--'}ms
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Physician Notes */}
            <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20">
              <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                <h3 className="text-sm font-bold font-headline uppercase tracking-tight">
                  Physician Verification
                </h3>
              </div>
              <textarea
                className="w-full bg-surface-container-high border-none focus:ring-1 focus:ring-primary rounded-xl text-sm p-5 h-28 placeholder:text-outline font-body resize-none"
                placeholder="Enter clinical observations..."
              />
              <div className="mt-5 flex gap-3">
                <button className="flex-grow py-3 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">
                  Submit Report
                </button>
                <button className="px-6 py-3 bg-surface-container-high text-on-surface-variant text-xs font-bold rounded-xl hover:bg-surface-container-highest transition-colors">
                  Draft
                </button>
              </div>
            </section>
          </div>

          {/* ─── Right column: History list ─── */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-surface-container-low rounded-2xl p-8">
              <h3 className="font-headline font-bold text-xl mb-8">All Scan Results</h3>
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedResult(item)}
                    className={`p-6 rounded-xl cursor-pointer transition-all flex items-center gap-6 ${
                      selectedResult?.id === item.id
                        ? 'bg-primary-fixed/30 border-2 border-primary/30 ring-2 ring-primary/10'
                        : 'bg-surface-container-lowest hover:bg-surface-container-high border-2 border-transparent'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.prediction === 'Normal'
                          ? 'bg-secondary-container/30'
                          : 'bg-error-container/30'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          item.prediction === 'Normal' ? 'text-secondary' : 'text-error'
                        }`}
                      >
                        {item.prediction === 'Normal' ? 'check_circle' : 'warning'}
                      </span>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm text-on-surface truncate pr-4">
                          {item.filename}
                        </h4>
                        <span
                          className={`text-xs font-bold flex-shrink-0 ${
                            item.prediction === 'Normal' ? 'text-secondary' : 'text-error'
                          }`}
                        >
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-on-surface-variant">{item.prediction}</span>
                        <span className="text-[10px] text-on-surface-variant">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload more */}
            <div
              onClick={() => navigate('/predict')}
              className="bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center text-outline cursor-pointer hover:bg-surface-container-low hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-3xl mb-3">add</span>
              <span className="text-sm font-bold">Upload New Scan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
