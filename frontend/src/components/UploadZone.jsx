import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineCloudUpload, HiOutlineX, HiOutlinePhotograph } from 'react-icons/hi'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }

export default function UploadZone({ onFileAccepted, isLoading }) {
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0]
      if (err.code === 'file-too-large') {
        toast.error('File too large. Maximum size is 10 MB.')
      } else if (err.code === 'file-invalid-type') {
        toast.error('Invalid file type. Please upload a JPG, PNG, or WebP image.')
      } else {
        toast.error(err.message)
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)

      // Generate preview
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
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

  const borderColor = isDragReject
    ? 'var(--color-danger)'
    : isDragAccept || isDragActive
    ? 'var(--color-primary)'
    : 'var(--border-color)'

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        {...getRootProps()}
        whileHover={!isLoading ? { scale: 1.01 } : {}}
        whileTap={!isLoading ? { scale: 0.99 } : {}}
        className="relative rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: `2px dashed ${borderColor}`,
          boxShadow: isDragActive ? 'var(--shadow-glow)' : 'var(--shadow-md)',
        }}
      >
        <input {...getInputProps()} />

        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none bg-grid"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            /* ── Image Preview ── */
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10"
            >
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="X-ray preview"
                  className="max-h-72 rounded-xl mx-auto object-contain"
                  style={{
                    border: '2px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                />

                {/* Scan line animation overlay */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 pointer-events-none"
                  style={{ background: 'var(--gradient-primary)', opacity: 0.6 }}
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Clear button */}
                {!isLoading && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClear}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
                    style={{ backgroundColor: 'var(--color-danger)' }}
                  >
                    <HiOutlineX size={16} />
                  </motion.button>
                )}
              </div>

              <p
                className="mt-4 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {selectedFile?.name}
                <span className="ml-2" style={{ color: 'var(--text-muted)' }}>
                  ({(selectedFile?.size / 1024).toFixed(1)} KB)
                </span>
              </p>

              {/* Analyze Button */}
              {!isLoading && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAnalyze}
                  className="mt-6 px-8 py-3 rounded-xl text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Analyze X-Ray
                </motion.button>
              )}
            </motion.div>
          ) : (
            /* ── Upload Prompt ── */
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 py-8"
            >
              <motion.div
                animate={{ y: isDragActive ? -5 : 0 }}
                transition={{ type: 'spring' }}
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: isDragActive
                    ? 'var(--gradient-primary)'
                    : 'var(--bg-tertiary)',
                }}
              >
                {isDragActive ? (
                  <HiOutlineCloudUpload className="text-white text-3xl" />
                ) : (
                  <HiOutlinePhotograph
                    className="text-3xl"
                    style={{ color: 'var(--color-primary)' }}
                  />
                )}
              </motion.div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {isDragActive ? 'Drop your X-ray here' : 'Upload Chest X-Ray'}
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                Drag and drop or{' '}
                <span className="font-medium" style={{ color: 'var(--color-primary)' }}>
                  browse files
                </span>
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Supports JPEG, PNG, WebP • Max 10 MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 rounded-2xl flex flex-col items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
          >
            {/* Animated spinner */}
            <div className="relative w-16 h-16 mb-4">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '3px solid rgba(255,255,255,0.1)' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '3px solid transparent',
                  borderTopColor: 'var(--color-primary)',
                  borderRightColor: 'var(--color-accent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  border: '2px solid transparent',
                  borderTopColor: 'var(--color-accent)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <p className="text-white text-sm font-medium">Analyzing X-Ray...</p>
            <p className="text-white/50 text-xs mt-1">This may take a few seconds</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
