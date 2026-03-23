import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 120s — Render free tier can take 30-90s to cold start
  headers: {
    'Accept': 'application/json',
  },
})

// ─── API Methods ────────────────────────────────────────────

/**
 * Upload a chest X-ray image for classification.
 * Includes retry logic for Render free-tier cold starts.
 * @param {File} file - The image file to classify
 * @param {function} onProgress - Upload progress callback
 * @returns {Promise<object>} Prediction result
 */
export async function predictImage(file, onProgress = null) {
  const formData = new FormData()
  formData.append('file', file)

  const MAX_RETRIES = 2
  let lastError = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        toast.loading('Server is waking up… retrying automatically.', { id: 'cold-start', duration: 15000 })
      }

      const response = await api.post('/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress
          ? (progressEvent) => {
              const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              onProgress(pct)
            }
          : undefined,
      })

      toast.dismiss('cold-start')
      return response.data
    } catch (err) {
      lastError = err
      // Only retry on timeout or network errors, not on 4xx client errors
      const isRetryable = !err.response || err.code === 'ECONNABORTED' || err.response?.status >= 500
      if (!isRetryable || attempt === MAX_RETRIES) break
      // Wait 3 seconds before retrying
      await new Promise((r) => setTimeout(r, 3000))
    }
  }

  toast.dismiss('cold-start')
  throw lastError
}

/**
 * Check API health status.
 */
export async function checkHealth() {
  const response = await api.get('/api/health')
  return response.data
}

/**
 * Get model information.
 */
export async function getModelInfo() {
  const response = await api.get('/api/model-info')
  return response.data
}

/**
 * Get prediction history.
 */
export async function getHistory() {
  const response = await api.get('/api/history')
  return response.data
}

/**
 * Clear prediction history.
 */
export async function clearHistory() {
  const response = await api.delete('/api/history')
  return response.data
}

export default api
