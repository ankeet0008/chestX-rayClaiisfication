import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = (import.meta as any).env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  headers: {
    'Accept': 'application/json',
  },
})

export interface PredictionResult {
  filename: string;
  prediction: string;
  confidence: number;
  class_probabilities: Record<string, number>;
  timestamp: string;
  id?: string;
}

export async function predictImage(file: File, onProgress?: (pct: number) => void): Promise<PredictionResult> {
  const formData = new FormData()
  formData.append('file', file)

  const MAX_RETRIES = 2
  let lastError: any = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        toast.loading('Server is waking up… retrying automatically.', { id: 'cold-start', duration: 15000 })
      }

      const response = await api.post('/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress
          ? (progressEvent) => {
              if (progressEvent.total) {
                const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgress(pct)
              }
            }
          : undefined,
      })

      toast.dismiss('cold-start')
      return response.data
    } catch (err: any) {
      lastError = err
      const isRetryable = !err.response || err.code === 'ECONNABORTED' || err.response?.status >= 500
      if (!isRetryable || attempt === MAX_RETRIES) break
      await new Promise((r) => setTimeout(r, 3000))
    }
  }

  toast.dismiss('cold-start')
  throw lastError
}

export async function checkHealth() {
  const response = await api.get('/api/health')
  return response.data
}

export async function getModelInfo() {
  const response = await api.get('/api/model-info')
  return response.data
}

export async function getHistory(): Promise<PredictionResult[]> {
  const response = await api.get('/api/history')
  return response.data
}

export async function clearHistory() {
  const response = await api.delete('/api/history')
  return response.data
}

export default api
