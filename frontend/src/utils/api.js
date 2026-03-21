import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
})

// ─── API Methods ────────────────────────────────────────────

/**
 * Upload a chest X-ray image for classification.
 * @param {File} file - The image file to classify
 * @param {function} onProgress - Upload progress callback
 * @returns {Promise<object>} Prediction result
 */
export async function predictImage(file, onProgress = null) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/api/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(pct)
        }
      : undefined,
  })

  return response.data
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
