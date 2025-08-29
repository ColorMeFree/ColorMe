import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './ui/App.jsx'
import './styles.css'
import { validateConfig } from './config.js'

// Initialize the app with configuration validation
async function initializeApp() {
  const root = document.getElementById('root')
  
  // Show loading state
  root.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
      <h1>Loading ColorMeFree...</h1>
      <p>Initializing configuration...</p>
    </div>
  `
  
  try {
    // Validate configuration
    const isValid = await validateConfig()
    
    if (!isValid) {
      root.innerHTML = `
        <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
          <h1>Configuration Error</h1>
          <p>Missing required configuration. Please check your setup.</p>
          <p>If you're developing locally, copy env.example to .env.local and fill in your values.</p>
          <p>If this is a deployed site, please contact support.</p>
        </div>
      `
      return
    }
    
    // Configuration is valid, render the app
    createRoot(root).render(<App />)
    
  } catch (error) {
    console.error('Failed to initialize app:', error)
    root.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <p>Error: ${error.message}</p>
        <p>Please refresh the page or contact support if the problem persists.</p>
      </div>
    `
  }
}

// Start the initialization
initializeApp()
