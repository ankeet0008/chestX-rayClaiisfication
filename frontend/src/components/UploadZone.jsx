import { useCallback, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { gsap } from 'gsap'
import { HiOutlineCloudUpload, HiOutlineX, HiOutlineShieldCheck } from 'react-icons/hi'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }

export default function UploadZone({ onFileAccepted, isLoading }) {
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const containerRef = useRef(null)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0]
      if (err.code === 'file-too-large') toast.error('File too large. Max 10 MB.')
      else if (err.code === 'file-invalid-type') toast.error('Invalid format. Use JPG, PNG, or WebP.')
      else toast.error(err.message)
      return
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      gsap.fromTo(containerRef.current, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED_TYPES, maxSize: MAX_FILE_SIZE, maxFiles: 1, disabled: isLoading,
  })

  const handleClear = (e) => { e.stopPropagation(); setPreview(null); setSelectedFile(null) }
  const handleAnalyze = (e) => { e.stopPropagation(); if (selectedFile && onFileAccepted) onFileAccepted(selectedFile) }

  return (
    <div ref={containerRef}>
      <div
        {...getRootProps()}
        className={`glass-card relative p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden ${isDragActive ? 'ring-2 ring-offset-2' : ''}`}
        style={{ borderColor: isDragActive ? 'var(--primary)' : undefined, '--tw-ring-color': 'var(--primary)' }}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative z-10">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="X-ray preview"
                className="max-h-72 rounded-xl mx-auto object-contain"
                style={{ border: '2px solid var(--border)' }}
              />
              {/* Scan line */}
              <div className="absolute left-0 right-0 h-[2px] animate-scan pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', boxShadow: '0 0 10px var(--primary)' }} />
              {!isLoading && (
                <button onClick={handleClear} className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer" style={{ background: 'var(--danger)' }}>
                  <HiOutlineX size={14} />
                </button>
              )}
            </div>
            <p className="mt-4 text-sm font-medium" style={{ color: 'var(--text-soft)' }}>
              {selectedFile?.name}
              <span className="ml-2" style={{ color: 'var(--text-muted)' }}>({(selectedFile?.size / 1024).toFixed(1)} KB)</span>
            </p>
            {!isLoading && (
              <button onClick={handleAnalyze} className="btn-primary mt-6 mx-auto">
                <HiOutlineShieldCheck size={20} />
                Analyze X-Ray
              </button>
            )}
          </div>
        ) : (
          <div className="py-8">
            <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all ${isDragActive ? 'scale-110' : ''}`} style={{ background: isDragActive ? 'var(--primary)' : 'rgba(99,102,241,0.08)' }}>
              <HiOutlineCloudUpload className="text-3xl" style={{ color: isDragActive ? '#fff' : 'var(--primary)' }} />
            </div>
            <h3 className="text-lg font-bold mb-2">
              {isDragActive ? 'Drop your X-ray here' : 'Upload Chest X-Ray'}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-soft)' }}>
              Drag and drop or <span className="font-semibold" style={{ color: 'var(--primary)' }}>browse files</span>
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Supports JPEG, PNG, WebP · Max 10 MB</p>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 rounded-3xl flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="relative w-14 h-14 mb-4">
              <div className="absolute inset-0 rounded-full" style={{ border: '3px solid rgba(255,255,255,0.1)' }} />
              <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '3px solid transparent', borderTopColor: 'var(--primary)' }} />
            </div>
            <p className="text-white text-sm font-semibold">Analyzing X-Ray…</p>
            <p className="text-white/50 text-xs mt-1">First request may take up to 60s if the server is waking up</p>
          </div>
        )}
      </div>
    </div>
  )
}
