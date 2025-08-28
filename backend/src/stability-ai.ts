// Stability AI Integration for Coloring Book Generation
// Simple, cheap, and fast line art generation

export class StabilityAIService {
  private apiKey: string
  private baseUrl = 'https://api.stability.ai/v1/generation'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Generate coloring book line art
  async generateColoringPage(prompt: string): Promise<string> {
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
        throw new Error(`Stability AI error: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Get the generated image
      const image = data.artifacts[0]
      const imageBuffer = Buffer.from(image.base64, 'base64')
      
      // Upload to Cloudflare R2 or similar storage
      const imageUrl = await this.uploadImage(imageBuffer, prompt)
      
      return imageUrl
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
  private async uploadImage(imageBuffer: Buffer, prompt: string): Promise<string> {
    // For now, return a placeholder URL
    // In production, upload to Cloudflare R2 or similar
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substr(2, 9)
    
    // TODO: Implement actual upload to Cloudflare R2
    // const uploadUrl = await uploadToR2(imageBuffer, `coloring-pages/${timestamp}-${randomId}.png`)
    
    return `https://your-backend.workers.dev/coloring-pages/${timestamp}-${randomId}.png`
  }

  // Generate multiple pages for a book
  async generatePages(prompt: string, count: number = 4): Promise<string[]> {
    const pages = []
    
    for (let i = 0; i < count; i++) {
      try {
        // Add variation to the prompt
        const variationPrompt = `${prompt}, page ${i + 1}, variation ${i + 1}`
        const imageUrl = await this.generateColoringPage(variationPrompt)
        pages.push(imageUrl)
      } catch (error) {
        console.error(`Failed to generate page ${i + 1}:`, error)
        // Fallback to placeholder
        pages.push(`https://via.placeholder.com/1024x1024/ffffff/000000?text=Coloring+Page+${i + 1}`)
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
      const response = await fetch(`${this.baseUrl}/stable-diffusion-xl-1024-v1-0/user/balance`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      })
      
      if (response.ok) {
        const data = await response.json() as { credits: number }
        return { 
          status: 'healthy', 
          message: `Stability AI connected. Credits: ${data.credits}` 
        }
      } else {
        return { 
          status: 'warning', 
          message: 'Stability AI returned non-200 status' 
        }
      }
    } catch (error) {
      return { 
        status: 'error', 
        message: 'Cannot connect to Stability AI' 
      }
    }
  }
}

// Export singleton instance
export const stabilityAIService = new StabilityAIService('')
