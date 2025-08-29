// Stability AI Integration for Coloring Book Generation
// Simple, cheap, and fast line art generation

export class StabilityAIService {
  private apiKey: string
  private baseUrl = 'https://api.stability.ai/v1/generation'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Generate coloring book line art
  async generateColoringPage(prompt: string, r2Bucket?: R2Bucket): Promise<string> {
    try {
      // Enhance prompt for line art style
      const enhancedPrompt = this.enhancePromptForLineArt(prompt)
      
      const response = await fetch(`${this.baseUrl}/stable-diffusion-xl-1024-v1-0/text-to-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: enhancedPrompt,
              weight: 1
            },
            {
              text: "coloring book, line art, black and white, simple, clean outlines, no shading, suitable for children",
              weight: 0.8
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
          style_preset: "line-art"
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Stability AI error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      // Get the generated image
      const image = data.artifacts[0]
      
      // Convert base64 to Uint8Array for Cloudflare Workers
      const binaryString = atob(image.base64)
      const imageBuffer = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        imageBuffer[i] = binaryString.charCodeAt(i)
      }
      
      // Upload to R2 for permanent storage
      if (r2Bucket) {
        try {
          const r2Url = await this.uploadImage(imageBuffer, prompt, r2Bucket)
          console.log('Successfully uploaded to R2:', r2Url)
          return r2Url
        } catch (error) {
          console.error('R2 upload failed:', error)
        }
      }
      
      // Fallback to data URL if R2 fails
      const dataUrl = `data:image/png;base64,${image.base64}`
      console.log('Using data URL fallback')
      return dataUrl
    } catch (error) {
      console.error('Stability AI generation failed:', error)
      throw error
    }
  }

  // Enhanced prompt interpretation for coloring book style
  private enhancePromptForLineArt(prompt: string): string {
    // Clean and normalize the prompt
    let cleanPrompt = prompt
      .replace(/!+$/, '') // Remove trailing exclamation marks
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    // Detect and enhance different prompt types
    const promptEnhancements = this.analyzeAndEnhancePrompt(cleanPrompt)
    
    // Core line art styling
    const lineArtTerms = [
      'line drawing',
      'black outline',
      'simple illustration',
      'coloring page style',
      'clean lines',
      'no background',
      'white background',
      'minimalist',
      'child-friendly',
      'thick outlines',
      'simple shapes',
      'easy to color'
    ]
    
    return `${promptEnhancements}, ${lineArtTerms.join(', ')}`
  }

  // Analyze prompt and add context-specific enhancements
  private analyzeAndEnhancePrompt(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()
    
    // Character and creature enhancements
    if (lowerPrompt.includes('dinosaur') || lowerPrompt.includes('dragon') || lowerPrompt.includes('monster')) {
      return `${prompt}, friendly cartoon style, big eyes, cute expression`
    }
    
    // Vehicle enhancements
    if (lowerPrompt.includes('car') || lowerPrompt.includes('truck') || lowerPrompt.includes('train') || lowerPrompt.includes('plane')) {
      return `${prompt}, cartoon vehicle, simple design, easy to recognize`
    }
    
    // Animal enhancements
    if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog') || lowerPrompt.includes('bird')) {
      return `${prompt}, cute cartoon animal, friendly expression, simple features`
    }
    
    // Fantasy enhancements
    if (lowerPrompt.includes('castle') || lowerPrompt.includes('princess') || lowerPrompt.includes('knight') || lowerPrompt.includes('magic')) {
      return `${prompt}, fairy tale style, magical elements, child-friendly fantasy`
    }
    
    // Space enhancements
    if (lowerPrompt.includes('space') || lowerPrompt.includes('planet') || lowerPrompt.includes('rocket') || lowerPrompt.includes('alien')) {
      return `${prompt}, space adventure, fun sci-fi, colorful planets`
    }
    
    // Nature enhancements
    if (lowerPrompt.includes('tree') || lowerPrompt.includes('flower') || lowerPrompt.includes('garden') || lowerPrompt.includes('forest')) {
      return `${prompt}, nature scene, simple plants, peaceful setting`
    }
    
    // Action enhancements
    if (lowerPrompt.includes('chase') || lowerPrompt.includes('run') || lowerPrompt.includes('jump') || lowerPrompt.includes('play')) {
      return `${prompt}, action scene, dynamic poses, fun movement`
    }
    
    // Default enhancement for general prompts
    return `${prompt}, simple cartoon style, easy to understand, fun for kids`
  }

  // Upload image to storage (Cloudflare R2)
  private async uploadImage(imageBuffer: Uint8Array, prompt: string, r2Bucket?: R2Bucket): Promise<string> {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substr(2, 9)
    const filename = `coloring-pages/${timestamp}-${randomId}.png`
    
    if (r2Bucket) {
      try {
        await r2Bucket.put(filename, imageBuffer, {
          httpMetadata: {
            contentType: 'image/png'
          }
        })
        
        // Return the R2 URL - we'll serve this through our Worker
        return `https://colorbook-backend-worldfrees.3dworldjames.workers.dev/images/${filename}`
      } catch (error) {
        console.error('Failed to upload to R2:', error)
      }
    }
    
    // Fallback to placeholder for now
    return `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80`
  }

  // Generate multiple pages for a book
  async generatePages(prompt: string, count: number = 4, r2Bucket?: R2Bucket): Promise<string[]> {
    const pages = []
    
    for (let i = 0; i < count; i++) {
      try {
        // Add variation to the prompt
        const variationPrompt = `${prompt}, page ${i + 1}, variation ${i + 1}`
        const imageUrl = await this.generateColoringPage(variationPrompt, r2Bucket)
        pages.push(imageUrl)
      } catch (error) {
        console.error(`Failed to generate page ${i + 1}:`, error)
        // Fallback to placeholder
        pages.push(`https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80`)
      }
    }
    
    return pages
  }

  // Generate remaining pages for complete book
  async generateRemainingPages(prompt: string, count: number = 26): Promise<string[]> {
    const pages = []
    
    for (let i = 0; i < count; i++) {
      try {
        // Add variation to the prompt
        const variationPrompt = `${prompt}, page ${i + 5}, variation ${i + 1}`
        const imageUrl = await this.generateColoringPage(variationPrompt)
        pages.push(imageUrl)
      } catch (error) {
        console.error(`Failed to generate remaining page ${i + 5}:`, error)
        // Fallback to placeholder
        pages.push(`https://via.placeholder.com/1024x1024/ffffff/000000?text=Page+${i + 5}`)
      }
    }
    
    return pages
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      // Test with a simple generation request instead of balance check
      const response = await fetch(`${this.baseUrl}/stable-diffusion-xl-1024-v1-0/text-to-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: "simple test",
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30
        })
      })
      
      if (response.ok) {
        return { 
          status: 'healthy', 
          message: 'Stability AI connected and ready for image generation' 
        }
      } else {
        const errorText = await response.text()
        return { 
          status: 'warning', 
          message: `Stability AI returned ${response.status}: ${errorText}` 
        }
      }
    } catch (error) {
      return { 
        status: 'error', 
        message: `Cannot connect to Stability AI: ${error}` 
      }
    }
  }
}

// Factory function to create StabilityAIService with environment variables
export function createStabilityAIService(env: any): StabilityAIService {
  return new StabilityAIService(env.STABILITY_API_KEY || '')
}

// Export singleton instance for backward compatibility
export const stabilityAIService = new StabilityAIService('')

