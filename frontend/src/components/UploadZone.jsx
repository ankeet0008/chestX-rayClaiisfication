import { useCallback, useState, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { gsap } from 'gsap'
import { HiOutlineCloudUpload, HiOutlineX, HiOutlinePhotograph, HiOutlineShieldCheck } from 'react-icons/hi'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }

export default function UploadZone({ onFileAccepted, isLoading }) {
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const scanLineRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (preview && !isLoading) {
      gsap.to(scanLineRef.current, {
        top: "100%",
        duration: 2.5,
        repeat: -1,
        ease: "linear"
      })
    }
  }, [preview, isLoading])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0]
      if (err.code === 'file-too-large') {
        toast.error('File size exceeds 10 MB limit.')
      } else if (err.code === 'file-invalid-type') {
        toast.error('Unsupported file format. Use JPEG or PNG.')
      } else {
        toast.error(err.message)
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      
      gsap.fromTo(containerRef.current, { scale: 0.98 }, { scale: 1, duration: 0.5, ease: "back.out(2)" })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    disabled: isLoading,
  })

  const handleClear = (e) => {
    e.stopPropagation()
    setPreview(null)
    setSelectedFile(null)
  }

  const handleAnalyze = (e) => {
    e.stopPropagation()
    if (selectedFile && onFileAccepted) {
      onFileAccepted(selectedFile)
    }
  }

  return (
    <div ref={containerRef} className="w-full">
      <div
        {...getRootProps()}
        className={`relative glass-panel rounded-[2.5rem] p-12 text-center cursor-pointer transition-all duration-500 overflow-hidden ${
          isDragActive ? 'border-primary ring-4 ring-primary/10' : ''
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          /* ── Image Preview ── */
          <div className="relative z-10 py-4">
            <div className="relative inline-block group">
              <img
                src={preview}
                alt="X-ray preview"
                className="max-h-80 rounded-2xl mx-auto object-contain border-4 border-white/5 shadow-2xl transition-transform group-hover:scale-[1.02] duration-500"
              />

              {/* Scan line animation overlay */}
              {!isLoading && (
                <div
                  ref={scanLineRef}
                  className="absolute left-0 right-0 h-1 pointer-events-none z-20"
                  style={{ 
                    background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)', 
                    boxShadow: '0 0 15px var(--color-primary)',
                    top: '0%' 
                  }}
                />
              )}

              {/* Clear button */}
              {!isLoading && (
                <button
                  onClick={handleClear}
                  className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-danger hover:scale-110 active:scale-95 transition-all shadow-xl z-30"
                >
                  <HiOutlineX size={20} />
                </button>
              )}
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold text-primary mb-1">{selectedFile?.name}</p>
              <p className="text-[10px] uppercase tracking-widest font-black text-muted">
                {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB • READY FOR INFERENCE
              </p>
            </div>

            {/* Analyze Button */}
            {!isLoading && (
              <button
                onClick={handleAnalyze}
                className="mt-10 px-12 py-5 bg-primary text-white font-black rounded-2xl glow-hover transition-all flex items-center gap-3 mx-auto shadow-2xl"
              >
                <HiOutlineShieldCheck size={24} />
                Initialize AI Scan
              </button>
            )}
          </div>
        ) : (
          /* ── Upload Prompt ── */
          <div className="relative z-10 py-10">
            <div className={`w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center transition-all duration-500 ${
              isDragActive ? 'bg-primary scale-110 rotate-12' : 'bg-primary/10'
            }`}>
              <HiOutlineCloudUpload className={`text-4xl transition-colors ${
                isDragActive ? 'text-white' : 'text-primary'
              }`} />
            </div>

            <h3 className="text-2xl font-black mb-3">
              {isDragActive ? 'Release to Scan' : 'Pathology Ingest'}
            </h3>
            <p className="text-secondary font-medium mb-6 max-w-xs mx-auto text-sm">
              Drag & drop medical radiographic imagery here or <span className="text-primary font-bold">browse local storage</span>.
            </p>
            
            <div className="flex items-center justify-center gap-6 opacity-60">
               <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">JPG/PNG</div>
               <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">Max 10MB</div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-card/80 backdrop-blur-xl flex flex-col items-center justify-center p-10 select-none">
            <div className="relative w-24 h-24 mb-10">
               <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
               <div className="absolute inset-4 rounded-full border-2 border-accent/20 animate-pulse" />
               <HiOutlineShieldCheck className="absolute inset-0 m-auto text-2xl text-primary animate-pulse" />
            </div>
            <h4 className="text-xl font-black mb-2 animate-pulse">Running Neural Inference</h4>
            <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] text-center">
               Mapping pathology markers • Please wait
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
