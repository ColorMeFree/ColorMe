import { CONFIG } from '../config'

const endpoint = `https://${CONFIG.SHOPIFY_DOMAIN}/api/2024-07/graphql.json`
const headers = {
  'Content-Type':'application/json',
  'X-Shopify-Storefront-Access-Token': CONFIG.STOREFRONT_TOKEN
}

export async function createCart() {
  const q = `mutation { cartCreate { cart { id checkoutUrl } userErrors { message } } }`
  const r = await fetch(endpoint, { method:'POST', headers, body: JSON.stringify({ query: q }) })
  const j = await r.json()
  if (j.errors) throw new Error(j.errors[0].message)
  return j.data.cartCreate.cart
}

export async function addCustomBookToCart(cartId, { designId, prompt, variantGID }) {
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
        { key: 'designId', value: designId },
        { key: 'prompt', value: prompt }
      ]
    }]
  }
  const r = await fetch(endpoint, { method:'POST', headers, body: JSON.stringify({ query:q, variables:vars })})
  const j = await r.json()
  if (j.errors) throw new Error(j.errors[0].message)
  return j.data.cartLinesAdd.cart
}
