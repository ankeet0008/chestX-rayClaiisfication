import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#171c1f',
            borderRadius: '0.75rem',
            boxShadow: '0 24px 48px -12px rgba(23, 28, 31, 0.06)',
            padding: '1rem',
            fontSize: '0.875rem',
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
