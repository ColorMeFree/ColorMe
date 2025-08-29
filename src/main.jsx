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
    // Validate configuration with timeout
    const configPromise = validateConfig()
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Configuration timeout')), 10000)
    )
    
    const isValid = await Promise.race([configPromise, timeoutPromise])
    
    if (!isValid) {
      // In development, continue anyway
      if (import.meta.env.DEV) {
        console.log('Development mode: Continuing despite config validation failure')
        createRoot(root).render(<App />)
        return
      }
      
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
    
    // In development, try to render anyway
    if (import.meta.env.DEV) {
      console.log('Development mode: Attempting to render app despite initialization error')
      try {
        createRoot(root).render(<App />)
        return
      } catch (renderError) {
        console.error('Failed to render app:', renderError)
      }
    }
    
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
