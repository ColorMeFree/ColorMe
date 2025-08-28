import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './ui/App.jsx'
import './styles.css'
import { validateConfig } from './config.js'

// Validate configuration before rendering
if (!validateConfig()) {
  const root = document.getElementById('root')
  root.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
      <h1>Configuration Error</h1>
      <p>Missing required environment variables. Please check your .env.local file.</p>
      <p>Copy env.example to .env.local and fill in your values.</p>
    </div>
  `
} else {
  createRoot(document.getElementById('root')).render(<App />)
}
