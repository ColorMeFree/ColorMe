import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { luluService, createLuluService } from './lulu'
import { shopifyService, createShopifyService } from './shopify'
import { StabilityAIService } from './stability-ai'
import { shopifyWebhookHandler } from './shopify-webhooks'
import { createStorageService } from './storage'
// OLD PROMPT ANALYSIS SERVICES - NOT IN USE
// import { enhancedPromptExpansionService } from './enhanced-prompt-expansion-Not In Use'
// import { advancedPromptAnalysisService } from './advanced-prompt-analysis-Not In Use'
import { contentFilterService } from './content-filter'
import { createStabilityAIService } from './stability-ai'

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
    
    // Step 1: Content filtering - let Stability AI handle moderation
    const filterResult = contentFilterService.filterPrompt(prompt)
    if (!filterResult.isValid) {
      // If inappropriate content detected, block generation entirely
      if (filterResult.shouldBlockGeneration) {
        return c.json({ 
          error: filterResult.reason || 'We do not generate inappropriate imagery',
          shouldReplacePrompt: filterResult.shouldReplacePrompt,
          replacementText: filterResult.replacementText,
          shouldBlockGeneration: true
        }, 400)
      }
    }
    
    // Step 2: Use original prompt (let Stability AI handle content moderation)
    const sanitizedPrompt = prompt
    console.log('Sanitized prompt:', sanitizedPrompt)
    
    // Step 3: Direct prompt pass-through (no analysis - let Stability AI handle everything)
    console.log('Using direct prompt pass-through to Stability AI...')
    const expandedScenes = [sanitizedPrompt] // Just use the original prompt
    console.log('Using original prompt directly')
    
    // Step 5: Let Stability AI handle content moderation (no scene validation)
    
    // Step 6: Get first 4 scenes for preview
    const previewScenes = expandedScenes.slice(0, 4)
    
    // Step 6: Generate 4 preview images using Stability AI
    const sessionId = crypto.randomUUID()
    
    // Create Stability AI service
    const stabilityService = createStabilityAIService(c.env)
    
    // Generate real coloring book images
    let images: string[]
    try {
      console.log('Generating real coloring book images with Stability AI...')
      console.log('Prompt:', sanitizedPrompt)
      console.log('R2 bucket available:', !!c.env.COLORBOOK_R2)
      
      // Generate 4 preview images using the original prompt (let Stability AI handle variation)
      console.log('Generating 4 preview images with original prompt...')
      images = []
      
      for (let i = 0; i < 4; i++) {
        console.log(`Generating image ${i + 1} with original prompt:`, sanitizedPrompt)
        
        const image = await stabilityService.generateColoringPage(sanitizedPrompt, c.env.COLORBOOK_R2)
        images.push(image)
        
        console.log(`Image ${i + 1} generated successfully`)
      }
      console.log('Successfully generated', images.length, 'coloring book images')
      console.log('First image URL:', images[0]?.substring(0, 100) + '...')
    } catch (error) {
      console.error('Stability AI generation failed, using fallback images:', error)
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
      images = [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80'
      ]
    }
    
    // Step 7: Store prompt and expanded scenes
    const storageService = createStorageService(c.env)
    const promptId = await storageService.storePrompt(sanitizedPrompt, expandedScenes, images)
    
    console.log('Stored prompt with ID:', promptId)
    console.log('Generated preview scenes:', previewScenes)
    
    return c.json({ 
      sessionId, 
      images,
      promptId,
      previewScenes: [sanitizedPrompt], // Just the original prompt
      originalPrompt: prompt,
      sanitizedPrompt: sanitizedPrompt,
      totalScenes: 1, // Only one scene (the original prompt)
      filterWarning: filterResult.reason
    })
  } catch (error) {
    console.error('Failed to generate previews:', error)
    return c.json({ error: 'Failed to generate previews' }, 500)
  }
})

app.post('/lock-design', async (c) => {
  const { sessionId, chosen, prompt, promptId } = await c.req.json()
  
  try {
    // Store chosen images for this prompt
    const storageService = createStorageService(c.env)
    await storageService.updateChosenImages(promptId, chosen)
    
    // Generate design ID
    const designId = crypto.randomUUID()
    const styleSeed = crypto.randomUUID() // For consistent style across remaining pages
    
    console.log('Design locked:', { designId, styleSeed, prompt, promptId })
    
    return c.json({ designId, styleSeed, promptId })
  } catch (error) {
    console.error('Failed to lock design:', error)
    return c.json({ error: 'Failed to lock design' }, 500)
  }
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
        
        // Get stored prompt data
        const storageService = createStorageService(c.env)
        const storedPrompt = await storageService.getPromptForOrder(bookOrder.designId)
        
        if (!storedPrompt) {
          throw new Error('Stored prompt not found')
        }
        
        // Generate remaining 26 pages using actual images (Stability AI disabled)
        const remainingPages = Array.from({ length: 26 }, (_, i) => 
          `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80`
        )
        
        // Combine chosen images with remaining pages
        const allPages = [
          ...storedPrompt.chosenImages, // 4 chosen images
          ...remainingPages // 26 remaining pages
        ]
        
        console.log('Generated full book with scenes:', storedPrompt.expandedScenes)
        
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

// Serve images from R2
app.get('/images/*', async (c) => {
  try {
    const path = c.req.path.replace('/images/', '')
    const object = await c.env.COLORBOOK_R2.get(path)
    
    if (!object) {
      return c.json({ error: 'Image not found' }, 404)
    }
    
    const headers = new Headers()
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/png')
    headers.set('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    
    return new Response(object.body, { headers })
  } catch (error) {
    console.error('Failed to serve image:', error)
    return c.json({ error: 'Failed to serve image' }, 500)
  }
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

// Test Stability AI image generation
app.post('/stability-ai/test', async (c) => {
  try {
    const { prompt } = await c.req.json()
    const stabilityService = createStabilityAIService(c.env)
    
    console.log('Testing Stability AI with prompt:', prompt)
    const imageUrl = await stabilityService.generateColoringPage(prompt, c.env.COLORBOOK_R2)
    
    return c.json({ 
      success: true, 
      imageUrl: imageUrl.substring(0, 100) + '...',
      fullUrl: imageUrl
    })
  } catch (error) {
    console.error('Stability AI test failed:', error)
    return c.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, 500)
  }
})

// Generate comprehensive background image
app.post('/generate-background', async (c) => {
  try {
    const stabilityService = createStabilityAIService(c.env)
    
    console.log('Generating comprehensive background image...')
    const imageUrl = await stabilityService.generateBackgroundImage(c.env.COLORBOOK_R2)
    
    return c.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Comprehensive childhood themes background generated successfully'
    })
  } catch (error) {
    console.error('Background generation failed:', error)
    return c.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, 500)
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
