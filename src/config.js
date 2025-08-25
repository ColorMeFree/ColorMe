export const CONFIG = {
  SHOPIFY_DOMAIN: process.env.SHOPIFY_DOMAIN || 'YOURSHOP.myshopify.com',
  STOREFRONT_TOKEN: process.env.SHOPIFY_STOREFRONT_TOKEN || 'public_storefront_api_token_here',
  CUSTOM_BOOK_VARIANT_GID: process.env.SHOPIFY_VARIANT_GID || 'gid://shopify/ProductVariant/1234567890',
  BACKEND_URL: process.env.BACKEND_URL || 'https://colorbook-backend.your-subdomain.workers.dev',
  MAX_CYCLES: 5
}
