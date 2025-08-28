import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { luluService } from './lulu'
import { shopifyService } from './shopify'
import { StabilityAIService } from './stability-ai'
import { shopifyWebhookHandler } from './shopify-webhooks'

const app = new Hono()
app.use('*', cors())

// Health check endpoint
app.get('/', async (c) => {
  const stabilityAIService = new StabilityAIService(c.env.STABILITY_API_KEY || '')
  const stabilityHealth = await stabilityAIService.healthCheck()
  
  return c.json({ 
    status: 'ok', 
    service: 'ColorMeFree Backend',
    version: '1.0.0',
    features: ['stability-ai', 'lulu', 'shopify'],
    stabilityAI: stabilityHealth
  })
})

app.post('/generate-previews', async (c) => {
  const { prompt } = await c.req.json()
  
  try {
    console.log('Received prompt for preview generation:', prompt)
    
    // Use Stability AI for simple, cheap image generation
    const stabilityAIService = new StabilityAIService(c.env.STABILITY_API_KEY || '')
    const images = await stabilityAIService.generatePages(prompt, 4)
    const sessionId = crypto.randomUUID()
    
    console.log('Generated preview images:', images)
    
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
        
        // Generate remaining 26 pages using Stability AI
        const stabilityAIService = new StabilityAIService(c.env.STABILITY_API_KEY || '')
        const remainingPages = await stabilityAIService.generateRemainingPages(bookOrder.prompt, 26)
        
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
    const status = await luluService.getPrintJobStatus(jobId)
    return c.json(status)
  } catch (error) {
    return c.json({ error: 'Failed to get print job status' }, 500)
  }
})

// Stability AI service health check
app.get('/stability-ai/health', async (c) => {
  try {
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
    if (!shopifyWebhookHandler.verifyWebhookSignature(body, hmac || '', process.env.SHOPIFY_WEBHOOK_SECRET || '')) {
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
