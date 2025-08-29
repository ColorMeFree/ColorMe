// Storage service for ColorMeFree
// Handles prompt storage, image storage, and order management

export interface StoredPrompt {
  id: string
  originalPrompt: string
  expandedScenes: string[]
  previewImages: string[]
  chosenImages: string[]
  createdAt: Date
  orderId?: string
  status: 'draft' | 'ordered' | 'completed'
}

export interface OrderData {
  orderId: string
  promptId: string
  customerEmail: string
  shippingAddress: any
  totalAmount: number
  createdAt: Date
  status: 'pending' | 'processing' | 'completed'
}

export class StorageService {
  constructor(
    private kv: KVNamespace,
    private r2?: R2Bucket
  ) {}

  // Store a new prompt with expanded scenes
  async storePrompt(prompt: string, expandedScenes: string[], previewImages: string[]): Promise<string> {
    const promptId = crypto.randomUUID()
    
    const storedPrompt: StoredPrompt = {
      id: promptId,
      originalPrompt: prompt,
      expandedScenes,
      previewImages,
      chosenImages: [],
      createdAt: new Date(),
      status: 'draft'
    }
    
    await this.kv.put(`prompt:${promptId}`, JSON.stringify(storedPrompt), {
      expirationTtl: 86400 * 30 // 30 days
    })
    
    return promptId
  }

  // Store chosen images when customer approves
  async updateChosenImages(promptId: string, chosenImages: string[]): Promise<void> {
    const promptData = await this.kv.get(`prompt:${promptId}`)
    if (!promptData) throw new Error('Prompt not found')
    
    const storedPrompt: StoredPrompt = JSON.parse(promptData)
    storedPrompt.chosenImages = chosenImages
    storedPrompt.status = 'ordered'
    
    await this.kv.put(`prompt:${promptId}`, JSON.stringify(storedPrompt))
  }

  // Store order data
  async storeOrder(orderData: OrderData): Promise<void> {
    await this.kv.put(`order:${orderData.orderId}`, JSON.stringify(orderData), {
      expirationTtl: 86400 * 365 // 1 year
    })
  }

  // Get prompt data for order processing
  async getPromptForOrder(promptId: string): Promise<StoredPrompt | null> {
    const promptData = await this.kv.get(`prompt:${promptId}`)
    if (!promptData) return null
    
    return JSON.parse(promptData) as StoredPrompt
  }

  // Store generated images in R2
  async storeImage(imageBuffer: Buffer, filename: string): Promise<string> {
    if (!this.r2) {
      // Fallback to placeholder URL if R2 not available
      return `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80`
    }
    
    const key = `coloring-pages/${filename}`
    await this.r2.put(key, imageBuffer, {
      httpMetadata: {
        contentType: 'image/png'
      }
    })
    
    return `https://your-r2-domain.com/${key}`
  }

  // Get all stored prompts (for analytics/reuse)
  async getAllPrompts(): Promise<StoredPrompt[]> {
    const prompts: StoredPrompt[] = []
    
    // Note: This is a simplified version. In production, you'd use pagination
    const list = await this.kv.list({ prefix: 'prompt:' })
    
    for (const key of list.keys) {
      const data = await this.kv.get(key.name)
      if (data) {
        prompts.push(JSON.parse(data) as StoredPrompt)
      }
    }
    
    return prompts
  }

  // Mark prompt as completed
  async markPromptCompleted(promptId: string): Promise<void> {
    const promptData = await this.kv.get(`prompt:${promptId}`)
    if (!promptData) throw new Error('Prompt not found')
    
    const storedPrompt: StoredPrompt = JSON.parse(promptData)
    storedPrompt.status = 'completed'
    
    await this.kv.put(`prompt:${promptId}`, JSON.stringify(storedPrompt))
  }
}

// Factory function to create storage service
export function createStorageService(env: any): StorageService {
  return new StorageService(
    env.COLORBOOK_KV,
    env.COLORBOOK_R2 || undefined
  )
}
