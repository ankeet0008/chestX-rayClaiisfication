import { useState, useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { predictImage } from '../utils/api'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface UploadingFile {
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  id: string
}

export default function AnalysisPortalPage() {
  const [uploads, setUploads] = useState<UploadingFile[]>([])
  const [isBusy, setIsBusy] = useState(false)
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.analysis-badge', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 })
      gsap.fromTo('.analysis-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power3.out' })
      gsap.fromTo('.analysis-desc', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.5 })
      gsap.fromTo('.upload-zone', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.6, ease: 'power2.out' })
      gsap.fromTo('.stats-card', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, delay: 0.7 })
      gsap.fromTo('.feature-section', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7,
        scrollTrigger: { trigger: '.feature-section', start: 'top 80%' }
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const newUploads = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: 'uploading' as const,
        id: Math.random().toString(36).substr(2, 9),
      }))

      setUploads((prev) => [...newUploads, ...prev])
      setIsBusy(true)

      for (const upload of newUploads) {
        try {
          setUploads((prev) =>
            prev.map((u) => (u.id === upload.id ? { ...u, status: 'uploading' } : u)),
          )

          const result = await predictImage(upload.file, (pct) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === upload.id
                  ? { ...u, progress: pct, status: pct === 100 ? 'processing' : 'uploading' }
                  : u,
              ),
            )
          })

          setUploads((prev) =>
            prev.map((u) =>
              u.id === upload.id ? { ...u, status: 'completed', progress: 100 } : u,
            ),
          )
          toast.success(`Analysis complete for ${upload.file.name}`)

          setTimeout(() => {
            navigate('/dashboard', { state: { latestResult: result } })
          }, 1500)
        } catch {
          setUploads((prev) =>
            prev.map((u) => (u.id === upload.id ? { ...u, status: 'error' } : u)),
          )
          toast.error(`Failed to analyze ${upload.file.name}`)
        }
      }

      setIsBusy(false)
    },
    [navigate],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.dcm'] },
    multiple: true,
    disabled: isBusy,
  })

  return (
    <div ref={pageRef} className="bg-surface min-h-screen">
      <main className="pt-32 pb-16 px-8 max-w-7xl mx-auto">

        {/* ─── Header ─── */}
        <header className="mb-16">
          <span className="analysis-badge text-xs font-bold tracking-[0.1em] uppercase text-primary mb-4 block">
            Clinical Workspace
          </span>
          <h1 className="analysis-title text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-6 max-w-4xl leading-[1.1] font-headline">
            Precision Analysis <br />
            <span className="text-primary-container">For Every Breath.</span>
          </h1>
          <p className="analysis-desc text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Experience AI-assisted diagnostic clarity. Upload clinical imaging for instant pathology screening and standardized reporting.
          </p>
        </header>

        {/* ─── Bento Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">

          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={`upload-zone md:col-span-7 bg-surface-container-low rounded-2xl p-10 flex flex-col items-center justify-center border-2 border-dashed cursor-pointer group transition-colors ${
              isDragActive
                ? 'border-primary/40 bg-surface-container'
                : 'border-outline-variant/30 hover:border-primary/40'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-primary text-4xl">upload_file</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 font-headline">
              {isDragActive ? 'Drop files here' : 'Drag and drop imaging'}
            </h3>
            <p className="text-on-surface-variant mb-8 text-center max-w-sm">
              Support for DICOM, JPEG, and PNG. Files are encrypted and HIPAA compliant during transit.
            </p>
            <button className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary/10">
              Select Patient File
            </button>
          </div>

          {/* Stats */}
          <div className="md:col-span-5 grid grid-rows-2 gap-8">
            <div className="stats-card bg-secondary-container rounded-2xl p-8 relative overflow-hidden flex flex-col justify-end">
              <div className="absolute top-8 right-8">
                <span className="material-symbols-outlined text-on-secondary-container text-4xl">clinical_notes</span>
              </div>
              <span className="text-on-secondary-container font-bold text-4xl mb-1 font-headline">1,284</span>
              <p className="text-on-secondary-container/80 font-medium">Scans Analyzed This Month</p>
            </div>
            <div className="stats-card bg-primary-container rounded-2xl p-8 relative overflow-hidden flex flex-col justify-end">
              <div className="absolute top-8 right-8">
                <span className="material-symbols-outlined text-on-primary-container text-4xl">speed</span>
              </div>
              <span className="text-on-primary-container font-bold text-4xl mb-1 font-headline">0.4s</span>
              <p className="text-on-primary-container/80 font-medium">Average Latency per Scan</p>
            </div>
          </div>
        </div>

        {/* ─── Upload Queue ─── */}
        {uploads.length > 0 && (
          <div className="mb-16 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-headline">Upload Queue</h3>
              <span className="text-xs text-on-surface-variant font-bold">
                {uploads.filter((u) => u.status !== 'completed').length} remaining
              </span>
            </div>
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="bg-surface-container-low p-5 rounded-xl flex items-center gap-5">
                  <div className="w-11 h-11 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">radiology</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold truncate max-w-[220px]">{upload.file.name}</span>
                      <span className={`text-xs font-bold ${
                        upload.status === 'error' ? 'text-error'
                          : upload.status === 'completed' ? 'text-primary'
                            : 'text-secondary'
                      }`}>
                        {upload.status === 'uploading' ? `${upload.progress}%`
                          : upload.status === 'processing' ? 'Analyzing...'
                            : upload.status === 'completed' ? 'Complete ✓'
                              : 'Error'}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          upload.status === 'error' ? 'bg-error'
                            : upload.status === 'completed' ? 'bg-primary'
                              : 'bg-primary-container'
                        }`}
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Recent Scans Table ─── */}
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-headline">Recent Patient Scans</h2>
              <p className="text-on-surface-variant">Review and manage recent AI screening results.</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-3 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-outline-variant/10 text-on-surface-variant font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="pb-4 px-4">Patient Name</th>
                  <th className="pb-4 px-4">Study Date</th>
                  <th className="pb-4 px-4">ID</th>
                  <th className="pb-4 px-4 text-center">Status</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-6 px-4 font-bold">Johnathan Miller</td>
                  <td className="py-6 px-4 text-on-surface-variant">Oct 24, 2023 · 14:20</td>
                  <td className="py-6 px-4 text-on-surface-variant font-mono text-sm">#CX-88219</td>
                  <td className="py-6 px-4">
                    <div className="flex justify-center">
                      <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        Complete
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button className="text-primary font-bold hover:underline" onClick={() => navigate('/dashboard')}>View Report</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-6 px-4 font-bold">Sarah Chen</td>
                  <td className="py-6 px-4 text-on-surface-variant">Oct 24, 2023 · 13:45</td>
                  <td className="py-6 px-4 text-on-surface-variant font-mono text-sm">#CX-88220</td>
                  <td className="py-6 px-4">
                    <div className="flex justify-center">
                      <span className="bg-secondary-container/30 text-secondary px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-secondary animate-pulse rounded-full" />
                        Analyzing
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button className="text-on-surface-variant opacity-50 cursor-not-allowed font-bold">Processing</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-6 px-4 font-bold">Robert Henderson</td>
                  <td className="py-6 px-4 text-on-surface-variant">Oct 24, 2023 · 13:10</td>
                  <td className="py-6 px-4 text-on-surface-variant font-mono text-sm">#CX-88221</td>
                  <td className="py-6 px-4">
                    <div className="flex justify-center">
                      <span className="bg-surface-container-high text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full" />
                        Pending
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button className="text-on-surface-variant font-bold hover:underline">Cancel</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Feature Showcase ─── */}
        <section className="feature-section mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                alt="X-ray view"
                className="w-full h-[500px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxXr2lerrekxVq8lDWb83p8d89JC5jqC2DLp23QaHdsSjMs3eeDxBshT5QjNrIgL17shRTZYn2z8Jdbku_-mSolvWMazip3TUtdBIbuVMzt89EYYn5l59xSjIHnSePT1KTqFFH6XgsdNm7uy4UMwn8Vix_QVMfJkZZtoz00FrTrKF6NMneErHuVGBt2KNgRly_wRAzrSvhBFcpXXafvgimSyt6HpWgYOX57JZoyqPDXXD_LYTDLp_PayJZeZZDmvzlS_KrooYnncI"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-surface-container-lowest p-6 rounded-2xl shadow-xl max-w-xs border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <span className="font-bold">FDA Cleared AI</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Our algorithms are trained on over 2.5 million curated medical images for clinical-grade reliability.
              </p>
            </div>
          </div>

          <div className="pl-0 md:pl-12">
            <h2 className="text-4xl font-bold mb-6 font-headline">Designed for Clinicians</h2>
            <div className="space-y-8">
              {[
                { icon: 'shield', title: 'HIPAA Secure Vault', desc: 'Patient data is encrypted at rest and in transit with enterprise-grade protection.' },
                { icon: 'account_tree', title: 'Seamless PACs Integration', desc: 'Connect directly to your existing hospital network for automated workflow routing.' },
                { icon: 'auto_awesome', title: 'Auto-Generation Reports', desc: 'AI-suggested findings mapped to standard clinical terminology for faster sign-off.' },
              ].map((f) => (
                <div key={f.title} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">{f.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{f.title}</h4>
                    <p className="text-on-surface-variant">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
