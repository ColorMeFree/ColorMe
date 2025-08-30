import { CONFIG } from '../config'

// Get configuration dynamically to ensure it's loaded
function getShopifyConfig() {
  const domain = CONFIG.SHOPIFY_DOMAIN
  const token = CONFIG.STOREFRONT_TOKEN
  
  console.log('Shopify config check:', {
    domain: domain || 'EMPTY',
    token: token ? '***' : 'MISSING'
  })
  
  if (!domain) {
    throw new Error('Shopify domain is not configured. Please check your setup.')
  }
  
  return {
    endpoint: `https://${domain}/api/2024-07/graphql.json`,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    }
  }
}

export async function createCart() {
  const config = getShopifyConfig()
  
  console.log('Creating Shopify cart with endpoint:', config.endpoint)
  console.log('Headers:', { ...config.headers, 'X-Shopify-Storefront-Access-Token': config.headers['X-Shopify-Storefront-Access-Token'] ? '***' : 'MISSING' })
  
  const q = `mutation { cartCreate { cart { id checkoutUrl } userErrors { message } } }`
  const r = await fetch(config.endpoint, { method:'POST', headers: config.headers, body: JSON.stringify({ query: q }) })
  const j = await r.json()
  
  console.log('Shopify cart creation response:', j)
  
  if (j.errors) {
    console.error('Shopify cart creation errors:', j.errors)
    throw new Error(j.errors[0].message)
  }
  
  if (j.data?.cartCreate?.userErrors?.length > 0) {
    console.error('Shopify user errors:', j.data.cartCreate.userErrors)
    throw new Error(j.data.cartCreate.userErrors[0].message)
  }
  
  return j.data.cartCreate.cart
}

export async function addCustomBookToCart(cartId, { designId, prompt, variantGID }) {
  const config = getShopifyConfig()
  
  const q = `
    mutation($cartId:ID!,$lines:[CartLineInput!]!) {
      cartLinesAdd(cartId:$cartId, lines:$lines) {
        cart { id checkoutUrl }
        userErrors { message }
      }
    }`
  const vars = {
    cartId,
    lines: [{
      merchandiseId: variantGID,
      quantity: 1,
      attributes: [
        { key: 'designId', value: String(designId) },
        { key: 'prompt', value: String(prompt) }
      ]
    }]
  }
  const r = await fetch(config.endpoint, { method:'POST', headers: config.headers, body: JSON.stringify({ query:q, variables:vars })})
  const j = await r.json()
  if (j.errors) throw new Error(j.errors[0].message)
  return j.data.cartLinesAdd.cart
}
