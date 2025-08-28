export const CONFIG = {
  SHOPIFY_DOMAIN: import.meta.env.VITE_SHOPIFY_DOMAIN || '',
  STOREFRONT_TOKEN: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '',
  CUSTOM_BOOK_VARIANT_GID: import.meta.env.VITE_SHOPIFY_VARIANT_GID || '',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || '',
  MAX_CYCLES: 5
}

// Validate required configuration
export function validateConfig() {
  const required = ['SHOPIFY_DOMAIN', 'STOREFRONT_TOKEN', 'CUSTOM_BOOK_VARIANT_GID', 'BACKEND_URL']
  const missing = required.filter(key => !CONFIG[key])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    console.error('Please copy env.example to .env.local and fill in your values')
    return false
  }
  
  return true
}
