// Configuration management for ColorMeFree
// Fetches configuration from backend to avoid exposing secrets in frontend

let CONFIG_CACHE = null
let CONFIG_LOADING = false
let CONFIG_ERROR = null

// Default configuration for development
const DEFAULT_CONFIG = {
  SHOPIFY_DOMAIN: '',
  STOREFRONT_TOKEN: '',
  CUSTOM_BOOK_VARIANT_GID: '',
  BACKEND_URL: 'https://colorbook-backend-worldfrees.3dworldjames.workers.dev',
  MAX_CYCLES: 5
}

// Fetch configuration from backend
async function fetchConfig() {
  if (CONFIG_CACHE) return CONFIG_CACHE
  if (CONFIG_LOADING) {
    // Wait for existing request to complete
    while (CONFIG_LOADING) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return CONFIG_CACHE
  }

  CONFIG_LOADING = true
  CONFIG_ERROR = null

  try {
    const response = await fetch(`${DEFAULT_CONFIG.BACKEND_URL}/config`)
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`)
    }
    
    const backendConfig = await response.json()
    
    // Map backend config to frontend format
    CONFIG_CACHE = {
      SHOPIFY_DOMAIN: backendConfig.shopifyDomain || '',
      STOREFRONT_TOKEN: backendConfig.storefrontToken || '',
      CUSTOM_BOOK_VARIANT_GID: backendConfig.customBookVariantGID || '',
      BACKEND_URL: backendConfig.backendUrl || DEFAULT_CONFIG.BACKEND_URL,
      MAX_CYCLES: backendConfig.maxCycles || 5
    }
    
    return CONFIG_CACHE
  } catch (error) {
    console.error('Failed to fetch configuration from backend:', error)
    CONFIG_ERROR = error
    
    // Fallback to environment variables for development
    const fallbackConfig = {
      SHOPIFY_DOMAIN: import.meta.env.VITE_SHOPIFY_DOMAIN || '',
      STOREFRONT_TOKEN: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '',
      CUSTOM_BOOK_VARIANT_GID: import.meta.env.VITE_SHOPIFY_VARIANT_GID || '',
      BACKEND_URL: import.meta.env.VITE_BACKEND_URL || DEFAULT_CONFIG.BACKEND_URL,
      MAX_CYCLES: 5
    }
    
    CONFIG_CACHE = fallbackConfig
    return fallbackConfig
  } finally {
    CONFIG_LOADING = false
  }
}

// Export configuration getter
export async function getConfig() {
  return await fetchConfig()
}

// Export synchronous config for backward compatibility
export const CONFIG = {
  get SHOPIFY_DOMAIN() { return CONFIG_CACHE?.SHOPIFY_DOMAIN || '' },
  get STOREFRONT_TOKEN() { return CONFIG_CACHE?.STOREFRONT_TOKEN || '' },
  get CUSTOM_BOOK_VARIANT_GID() { return CONFIG_CACHE?.CUSTOM_BOOK_VARIANT_GID || '' },
  get BACKEND_URL() { return CONFIG_CACHE?.BACKEND_URL || DEFAULT_CONFIG.BACKEND_URL },
  get MAX_CYCLES() { return CONFIG_CACHE?.MAX_CYCLES || 5 }
}

// Validate required configuration
export async function validateConfig() {
  const config = await getConfig()
  const required = ['SHOPIFY_DOMAIN', 'STOREFRONT_TOKEN', 'CUSTOM_BOOK_VARIANT_GID']
  const missing = required.filter(key => !config[key])
  
  if (missing.length > 0) {
    console.error('Missing required configuration:', missing)
    if (CONFIG_ERROR) {
      console.error('Configuration fetch error:', CONFIG_ERROR)
    }
    return false
  }
  
  return true
}

// Initialize configuration on module load
fetchConfig().catch(error => {
  console.error('Failed to initialize configuration:', error)
})
