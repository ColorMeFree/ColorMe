import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { luluService, createLuluService } from './lulu'
import { shopifyService, createShopifyService } from './shopify'
import { StabilityAIService } from './stability-ai'
import { shopifyWebhookHandler } from './shopify-webhooks'

const app = new Hono()
app.use('*', cors())

// Health check endpoint
app.get('/', async (c) => {
  const stabilityAIService = new StabilityAIService(c.env?.STABILITY_API_KEY || '')
  const stabilityHealth = await stabilityAIService.healthCheck()
  
  // Test service configurations
  const luluService = createLuluService(c.env)
  const shopifyService = createShopifyService(c.env)
  
  return c.json({ 
    status: 'ok', 
    service: 'ColorMeFree Backend',
    version: '1.0.0',
    features: ['stability-ai', 'lulu', 'shopify'],
    stabilityAI: stabilityHealth,
    config: {
      hasStabilityKey: !!c.env?.STABILITY_API_KEY,
      hasLuluKeys: !!(c.env?.LULU_API_KEY && c.env?.LULU_CLIENT_SECRET),
      hasShopifySecret: !!c.env?.SHOPIFY_WEBHOOK_SECRET,
      shopifyDomain: c.env?.SHOPIFY_DOMAIN || 'not-set'
    }
  })
})

app.post('/generate-previews', async (c) => {
  const { prompt } = await c.req.json()
  
  try {
    console.log('Received prompt for preview generation:', prompt)
    
    // Use actual images for now (Stability AI disabled)
    const sessionId = crypto.randomUUID()
    const images = [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80'
    ]
    
    console.log('Generated placeholder preview images:', images)
    
    return c.json({ sessionId, images })
  } catch (error) {
    console.error('Failed to generate previews:', error)
    return c.json({ error: 'Failed to generate previews' }, 500)
  }
})

app.post('/lock-design', async (c) => {
  const { sessionId, chosen, prompt } = await c.req.json()
  
  // Store design metadata (in production, use Cloudflare KV)
  const designId = crypto.randomUUID()
  const styleSeed = crypto.randomUUID() // For consistent style across remaining pages
  
  // In production, store in KV:
  // await c.env.COLORBOOK_KV.put(`design:${designId}`, JSON.stringify({
  //   sessionId, chosen, prompt, styleSeed, createdAt: Date.now()
  // }))
  
  console.log('Design locked:', { designId, styleSeed, prompt })
  
  return c.json({ designId, styleSeed })
})

app.post('/order-paid', async (c) => {
  try {
    // Create services with environment variables
    const shopifyService = createShopifyService(c.env)
    const luluService = createLuluService(c.env)
    
    // Verify Shopify HMAC signature
    const hmac = c.req.header('X-Shopify-Hmac-Sha256')
    const body = await c.req.text()
    
    if (!shopifyService.verifyWebhook(body, hmac || '')) {
      return c.json({ error: 'Invalid webhook signature' }, 401)
    }
    
    // Parse order data
    const orderData = shopifyService.parseOrder(body)
    const customBookOrders = shopifyService.extractCustomBookOrders(orderData.lineItems)
    
    if (customBookOrders.length === 0) {
      return c.text('ok') // No custom books in this order
    }
    
    // Process each custom book order
    for (const bookOrder of customBookOrders) {
      try {
        console.log('Processing custom book order:', bookOrder)
        
        // Generate remaining 26 pages using actual images (Stability AI disabled)
        const remainingPages = Array.from({ length: 26 }, (_, i) => 
          `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80`
        )
        
        // TODO: Assemble 30-page PDF (4 chosen + 26 generated)
        // For now, combine placeholder pages
        const allPages = [
          // TODO: Get the 4 chosen pages from storage
          ...remainingPages
        ]
        
        // Submit to Lulu for printing
        const printJob = await luluService.createPrintJob({
          designId: bookOrder.designId,
          prompt: bookOrder.prompt,
          pages: allPages,
          shippingAddress: orderData.shippingAddress,
        })
        
        console.log(`Print job created for order ${orderData.id}, design ${bookOrder.designId}:`, (printJob as any).id)
        
        // Send order confirmation
        await shopifyService.sendOrderConfirmation({
          ...orderData,
          customBooks: customBookOrders,
        })
        
      } catch (error) {
        console.error(`Failed to process book order ${bookOrder.designId}:`, error)
        // Continue processing other orders
      }
    }
    
    return c.text('ok')
  } catch (error) {
    console.error('Order processing error:', error)
    return c.json({ error: 'Failed to process order' }, 500)
  }
})

// Get print job status
app.get('/print-job/:jobId', async (c) => {
  const jobId = c.req.param('jobId')
  
  try {
    const luluService = createLuluService(c.env)
    const status = await luluService.getPrintJobStatus(jobId)
    return c.json(status)
  } catch (error) {
    console.error('Failed to get print job status:', error)
    return c.json({ error: 'Failed to get print job status' }, 500)
  }
})

// Configuration endpoint for frontend
app.get('/config', async (c) => {
  return c.json({
    shopifyDomain: c.env?.SHOPIFY_DOMAIN || '',
    storefrontToken: c.env?.SHOPIFY_STOREFRONT_TOKEN || '',
    backendUrl: c.env?.BACKEND_URL || '',
    personalDomain: c.env?.PERSONAL_DOMAIN || '',
    // Note: We'll add the product variant GID here once we create it
    customBookVariantGID: c.env?.SHOPIFY_VARIANT_GID || '',
    maxCycles: 5
  })
})

// Secure Shopify product management endpoint
app.get('/shopify/product/:productId', async (c) => {
  const productId = c.req.param('productId')
  
  try {
    // Access secrets securely from Cloudflare
    const adminToken = c.env?.SHOPIFY_ADMIN_TOKEN
    const shopifyDomain = c.env?.SHOPIFY_DOMAIN
    
    if (!adminToken || !shopifyDomain) {
      return c.json({ error: 'Shopify configuration not available' }, 500)
    }
    
    // Fetch product details from Shopify
    const response = await fetch(`https://${shopifyDomain}/admin/api/2024-07/products/${productId}.json`, {
      headers: {
        'X-Shopify-Access-Token': adminToken,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      return c.json({ error: 'Failed to fetch product from Shopify' }, response.status)
    }
    
    const productData = await response.json()
    
    // Return only non-sensitive product information
    return c.json({
      productId: productData.product.id,
      title: productData.product.title,
      variants: productData.product.variants.map((variant: any) => ({
        id: variant.id,
        gid: `gid://shopify/ProductVariant/${variant.id}`,
        title: variant.title,
        price: variant.price,
        sku: variant.sku
      }))
    })
    
  } catch (error) {
    console.error('Error fetching Shopify product:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Stability AI service health check
app.get('/stability-ai/health', async (c) => {
  try {
    const stabilityAIService = new StabilityAIService(c.env?.STABILITY_API_KEY || '')
    const health = await stabilityAIService.healthCheck()
    return c.json(health)
  } catch (error) {
    return c.json({ status: 'error', message: 'Health check failed' }, 500)
  }
})

// Shopify webhook for order completion
app.post('/webhooks/shopify/orders/paid', async (c) => {
  try {
    const body = await c.req.text()
    const hmac = c.req.header('X-Shopify-Hmac-Sha256')
    
    // Verify webhook signature
    if (!shopifyWebhookHandler.verifyWebhookSignature(body, hmac || '', c.env?.SHOPIFY_WEBHOOK_SECRET || '')) {
      return c.json({ error: 'Invalid webhook signature' }, 401)
    }
    
    const webhookData = JSON.parse(body)
    const customerData = await shopifyWebhookHandler.handleOrderCompleted(webhookData)
    
    if (customerData) {
      console.log('Order completed, customer data captured:', customerData.email)
    }
    
    return c.text('ok')
  } catch (error) {
    console.error('Webhook processing error:', error)
    return c.json({ error: 'Failed to process webhook' }, 500)
  }
})

// Get customer data for upsell (for frontend)
app.get('/customer/:email', async (c) => {
  try {
    const email = c.req.param('email')
    const customerData = await shopifyWebhookHandler.getCustomerData(email)
    
    if (customerData) {
      return c.json(customerData)
    } else {
      return c.json({ error: 'Customer not found' }, 404)
    }
  } catch (error) {
    return c.json({ error: 'Failed to get customer data' }, 500)
  }
})

export default app
