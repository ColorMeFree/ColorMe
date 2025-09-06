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
    // Initialize configuration (always succeeds now)
    await validateConfig()
    
    // Always render the app - it will handle missing config gracefully
    createRoot(root).render(<App />)
    
  } catch (error) {
    console.error('Failed to initialize app:', error)
    
    // Always try to render the app, even if there's an error
    console.log('Attempting to render app despite initialization error')
    try {
      createRoot(root).render(<App />)
    } catch (renderError) {
      console.error('Failed to render app:', renderError)
      
      // Only show error if we can't render at all
      root.innerHTML = `
        <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
          <h1>Application Error</h1>
          <p>Failed to load the application.</p>
          <p>Please refresh the page or contact support if the problem persists.</p>
        </div>
      `
    }
  }
}

// Start the initialization
initializeApp()
