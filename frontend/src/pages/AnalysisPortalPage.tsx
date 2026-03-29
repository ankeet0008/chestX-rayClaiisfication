import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { predictImage } from '../utils/api'

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
    <div className="pt-36 pb-32">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">

        {/* ─── Page Header ─── */}
        <header className="max-w-2xl mb-16">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-6">
            Diagnostic Upload Portal
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Submit medical imaging for real-time AI-assisted pathology detection.
            Our clinical models are optimized for high-resolution DICOM and JPEG
            formats.
          </p>
        </header>

        {/* ─── Two-column content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left — Upload + Queue */}
          <section className="lg:col-span-7 flex flex-col gap-10">

            {/* Drop zone */}
            <div
              {...getRootProps()}
              className={`group relative bg-surface-container-lowest rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 outline-dashed outline-2 ${
                isDragActive
                  ? 'outline-primary bg-surface-container-low'
                  : 'outline-outline-variant hover:outline-primary hover:bg-surface-container-low'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-5xl">upload_file</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-3">
                {isDragActive ? 'Drop files here' : 'Drag and drop imaging files'}
              </h3>
              <p className="text-on-surface-variant mb-8 text-sm">
                DICOM, JPEG, or PNG (Max 50 MB per file)
              </p>
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-sm">
                Select Files from System
              </button>
            </div>

            {/* Queue */}
            {uploads.length > 0 && (
              <div className="bg-surface-container-low rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-headline font-bold text-on-surface text-lg">
                    Queue &amp; Progress
                  </h4>
                  <span className="text-xs font-label text-on-surface-variant flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-sm ${isBusy ? 'animate-spin' : ''}`}
                    >
                      sync
                    </span>
                    {uploads.filter((u) => u.status !== 'completed').length} files remaining
                  </span>
                </div>

                <div className="space-y-5">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-5"
                    >
                      <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">
                          radiology
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-semibold truncate max-w-[220px]">
                            {upload.file.name}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              upload.status === 'error'
                                ? 'text-error'
                                : upload.status === 'completed'
                                  ? 'text-primary'
                                  : 'text-primary'
                            }`}
                          >
                            {upload.status === 'uploading'
                              ? `${upload.progress}%`
                              : upload.status === 'processing'
                                ? 'Processing AI...'
                                : upload.status === 'completed'
                                  ? 'Completed ✓'
                                  : 'Error'}
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden relative">
                          {upload.status === 'processing' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/30 to-transparent w-1/2 animate-pulse" />
                          )}
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              upload.status === 'error'
                                ? 'bg-error'
                                : upload.status === 'completed'
                                  ? 'bg-primary'
                                  : 'bg-primary'
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
          </section>

          {/* Right — Sidebar */}
          <aside className="lg:col-span-5 flex flex-col gap-8">

            {/* Secure pipeline card */}
            <div className="bg-surface-container-high rounded-2xl p-10">
              <div className="flex items-start gap-5 mb-10">
                <div className="bg-primary p-3 rounded-xl">
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg mb-2">
                    Secure Clinical Pipeline
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Images are encrypted at rest and in transit. All PII is
                    automatically de-identified before AI analysis.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20">
                  <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                    Compliance
                  </div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">
                      check_circle
                    </span>
                    HIPAA Ready
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20">
                  <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                    Encryption
                  </div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">lock</span>
                    AES-256 Bit
                  </div>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtTnTqfice6eWf-R4Qpd5E4GvJRH36aypigiwy6KrMKNJXWmmDRlClBRy0uRBbDkgmkPRM9x2Kvl724Q3_bjEUE_LmXD_f7wLLt2N1nNmIpV9g8OSC4znl1Zj-xL43h0VES0DDkvIEyMV0Ek3R5oULs2_dUffeb9Ok8puUClCvSFu0L1EMEG00ESYgfHYqit9N-p138pihc9UBbwuVi-5sL1_Brukh_TfjntpG9rgSiNCfgsN9GssZqs74HHT5vC3LqfO_kdPpqgY"
                alt="Clinical Environment"
                className="w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-white text-sm">info</span>
                  <span className="text-white text-xs font-medium tracking-wide">
                    Analysis Engine v4.2 Active
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostic history */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl">
              <h4 className="font-headline font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-6">
                Diagnostic History
              </h4>
              <div className="space-y-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Recent scans (24h)</span>
                  <span className="font-bold">14 Analysis Reports</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Average process time</span>
                  <span className="font-bold text-primary">1.2 seconds</span>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 text-primary font-bold text-sm hover:underline flex items-center justify-center gap-2"
                >
                  View Full Audit Log
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
