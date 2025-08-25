import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { luluService } from './lulu'
import { shopifyService } from './shopify'

const app = new Hono()
app.use('*', cors())

// Yoprintables integration for free coloring pages
class YoprintablesService {
  mapPromptToCategory(prompt: string) {
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle') || lowerPrompt.includes('truck')) {
      return 'vehicles'
    }
    if (lowerPrompt.includes('dinosaur') || lowerPrompt.includes('dino')) {
      return 'dinosaurs'
    }
    if (lowerPrompt.includes('space') || lowerPrompt.includes('planet') || lowerPrompt.includes('rocket')) {
      return 'space'
    }
    if (lowerPrompt.includes('underwater') || lowerPrompt.includes('fish') || lowerPrompt.includes('ocean')) {
      return 'underwater'
    }
    if (lowerPrompt.includes('castle') || lowerPrompt.includes('princess') || lowerPrompt.includes('knight')) {
      return 'castle'
    }
    if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog')) {
      return 'animals'
    }
    if (lowerPrompt.includes('robot') || lowerPrompt.includes('machine')) {
      return 'robots'
    }
    if (lowerPrompt.includes('sport') || lowerPrompt.includes('ball') || lowerPrompt.includes('game')) {
      return 'sports'
    }
    
    return 'animals'
  }

  async generatePages(prompt: string) {
    const category = this.mapPromptToCategory(prompt)
    
    // For MVP, return placeholder images that look like coloring pages
    // These will be replaced with actual yoprintables.com images
    const placeholderPages = [
      `https://via.placeholder.com/400x600/ffffff/000000?text=${encodeURIComponent(category)}+Page+1`,
      `https://via.placeholder.com/400x600/ffffff/000000?text=${encodeURIComponent(category)}+Page+2`,
      `https://via.placeholder.com/400x600/ffffff/000000?text=${encodeURIComponent(category)}+Page+3`,
      `https://via.placeholder.com/400x600/ffffff/000000?text=${encodeURIComponent(category)}+Page+4`
    ]
    
    return placeholderPages
  }

  async generateRemainingPages(prompt: string, styleSeed: string) {
    const category = this.mapPromptToCategory(prompt)
    
    const remainingPages = []
    for (let i = 0; i < 26; i++) {
      const pageUrl = `https://via.placeholder.com/400x600/ffffff/000000?text=${encodeURIComponent(category)}+Page+${i + 5}&style=${styleSeed}`
      remainingPages.push(pageUrl)
    }
    
    return remainingPages
  }
}

const yoprintables = new YoprintablesService()

// Health check endpoint
app.get('/', (c) => {
  return c.json({ 
    status: 'ok', 
    service: 'ColorMeFree Backend',
    version: '1.0.0',
    features: ['yoprintables', 'lulu', 'shopify']
  })
})

app.post('/generate-previews', async (c) => {
  const { prompt } = await c.req.json()
  
  try {
    const images = await yoprintables.generatePages(prompt)
    const sessionId = crypto.randomUUID()
    
    return c.json({ sessionId, images })
  } catch (error) {
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
        // Generate remaining 26 pages
        const remainingPages = await yoprintables.generateRemainingPages(bookOrder.prompt, bookOrder.designId)
        
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

export default app
