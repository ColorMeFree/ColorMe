// Stability AI Integration for Coloring Book Generation
// Simple, cheap, and fast line art generation

export class StabilityAIService {
  private apiKey: string
  private baseUrl = 'https://api.stability.ai/v1/generation'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Generate coloring book line art with advanced rules
  async generateColoringPage(prompt: string, r2Bucket?: R2Bucket, imageIndex?: number, totalImages?: number, attemptNumber?: number): Promise<string> {
    try {
      // Enhanced prompt with quality requirements
      const enhancedPrompt = this.enhancePromptForLineArt(prompt)
      
      // Generate dynamic rules based on image position and attempt number
      const rules = this.generateStabilityRules(imageIndex, totalImages, attemptNumber, prompt)
      
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
              text: rules.positivePrompt,
              weight: rules.positiveWeight
            },
            {
              text: rules.negativePrompt,
              weight: rules.negativeWeight
            }
          ],
          cfg_scale: rules.cfgScale,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: rules.steps,
          style_preset: rules.stylePreset,
          seed: rules.seed
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

  // Analyze prompt and add general enhancements
  private analyzeAndEnhancePrompt(prompt: string): string {
    // Simple, general enhancement that works for any subject
    return `${prompt}, simple cartoon style, child-friendly`
  }

  /**
   * Generate dynamic Stability AI rules based on image position, attempt number, and content
   */
  private generateStabilityRules(imageIndex: number = 0, totalImages: number = 30, attemptNumber: number = 1, prompt: string = ''): any {
    // Base rules
    const baseRules = {
      cfgScale: 8,
      steps: 40,
      stylePreset: "line-art",
      positiveWeight: 1.2,
      negativeWeight: -1.0,
      seed: Math.floor(Math.random() * 1000000)
    }

    // Position-based rules
    const positionRules = this.generatePositionBasedRules(imageIndex, totalImages)
    
    // Content-specific rules
    const contentRules = this.generateContentSpecificRules(prompt)
    
    // Disappointment-based rules (for retry system)
    const disappointmentRules = this.generateDisappointmentRules(attemptNumber)

    // Combine all rules
    return {
      ...baseRules,
      ...positionRules,
      ...contentRules,
      ...disappointmentRules,
      positivePrompt: this.buildPositivePrompt(positionRules, contentRules, disappointmentRules),
      negativePrompt: this.buildNegativePrompt(positionRules, contentRules, disappointmentRules)
    }
  }

  /**
   * Generate rules based on image position in the book
   */
  private generatePositionBasedRules(imageIndex: number, totalImages: number) {
    const isPreview = imageIndex < 4
    const isEarlyBook = imageIndex >= 4 && imageIndex < 10
    const isMidBook = imageIndex >= 10 && imageIndex < 20
    const isLateBook = imageIndex >= 20

    if (isPreview) {
      // Preview Images (1-4): High quality, consistent style
      return {
        cfgScale: 10,
        steps: 50,
        seed: 1000 + imageIndex,
        styleType: 'preview'
      }
    } else if (isEarlyBook) {
      // Early Book Pages (5-10): Variety introduction
      return {
        cfgScale: 12,
        steps: 45,
        seed: 2000 + imageIndex,
        styleType: 'early_book'
      }
    } else if (isMidBook) {
      // Mid Book Pages (11-20): Balanced variety
      return {
        cfgScale: 9,
        steps: 40,
        seed: 3000 + imageIndex,
        styleType: 'mid_book'
      }
    } else if (isLateBook) {
      // Late Book Pages (21-30): Maximum variety
      return {
        cfgScale: 15,
        steps: 35,
        seed: 4000 + imageIndex,
        styleType: 'late_book'
      }
    }

    return {}
  }

  /**
   * Generate content-specific rules based on prompt analysis
   */
  private generateContentSpecificRules(prompt: string) {
    const lowerPrompt = prompt.toLowerCase()
    
    // Vehicle-specific rules
    if (lowerPrompt.includes('car') || lowerPrompt.includes('truck') || lowerPrompt.includes('cart') || lowerPrompt.includes('vehicle')) {
      return {
        contentType: 'vehicle',
        vehicleRules: true
      }
    }
    
    // Dinosaur-specific rules  
    if (lowerPrompt.includes('dinosaur') || lowerPrompt.includes('dino')) {
      return {
        contentType: 'dinosaur',
        dinosaurRules: true
      }
    }
    
    // Chase scene rules
    if (lowerPrompt.includes('chasing') || lowerPrompt.includes('running after') || lowerPrompt.includes('pursuing')) {
      return {
        contentType: 'chase',
        chaseRules: true
      }
    }

    // Golf course rules
    if (lowerPrompt.includes('golf') || lowerPrompt.includes('course')) {
      return {
        contentType: 'golf',
        golfRules: true
      }
    }
    
    return {
      contentType: 'general'
    }
  }

  /**
   * Generate disappointment-based rules for retry system
   */
  private generateDisappointmentRules(attemptNumber: number) {
    const disappointmentLevels = [
      {}, // First attempt - no special rules
      { // Second attempt - subtle changes
        cfgScale: 12,
        seed: 5000 + attemptNumber,
        disappointmentLevel: 1
      },
      { // Third attempt - more dramatic changes
        cfgScale: 15,
        seed: 6000 + attemptNumber,
        disappointmentLevel: 2
      },
      { // Fourth attempt - maximum creativity
        cfgScale: 20,
        steps: 60,
        seed: 7000 + attemptNumber,
        disappointmentLevel: 3
      }
    ]
    
    return disappointmentLevels[attemptNumber - 1] || {}
  }

  /**
   * Build positive prompt based on all rule types
   */
  private buildPositivePrompt(positionRules: any, contentRules: any, disappointmentRules: any): string {
    let positivePrompt = "coloring book style, thick black outlines, clean line art, simple design, no shading, no gradients, no text, no numbers, no letters, child-friendly, clear separation between elements, balanced composition"

    // Add position-based enhancements
    if (positionRules.styleType === 'preview') {
      positivePrompt += ", consistent style, high quality details"
    } else if (positionRules.styleType === 'early_book') {
      positivePrompt += ", different perspective, varied composition"
    } else if (positionRules.styleType === 'mid_book') {
      positivePrompt += ", alternative scene elements, different character poses"
    } else if (positionRules.styleType === 'late_book') {
      positivePrompt += ", unique perspective, creative interpretation, different scene dynamics"
    }

    // Add content-specific enhancements
    if (contentRules.vehicleRules) {
      positivePrompt += ", vehicle positioned on ground surface, people inside vehicle if applicable, clear vehicle details, simple background"
    }
    if (contentRules.dinosaurRules) {
      positivePrompt += ", dinosaur positioned logically in scene, clear dinosaur features, appropriate size relationship with other elements"
    }
    if (contentRules.chaseRules) {
      positivePrompt += ", chaser positioned behind target, clear movement direction, appropriate distance between elements"
    }
    if (contentRules.golfRules) {
      positivePrompt += ", golf course elements properly positioned, clear course layout, appropriate golf equipment placement"
    }

    // Add character organization rules for Stability AI
    positivePrompt += ", each character clearly distinguishable with distinct features, no character feature mixing, proper spatial separation between all elements"

    // Add disappointment-based enhancements
    if (disappointmentRules.disappointmentLevel === 1) {
      positivePrompt += ", fresh perspective, new approach"
    } else if (disappointmentRules.disappointmentLevel === 2) {
      positivePrompt += ", completely different style, alternative composition, unique interpretation"
    } else if (disappointmentRules.disappointmentLevel === 3) {
      positivePrompt += ", maximum creativity, unique perspective, innovative interpretation, completely fresh approach"
    }

    return positivePrompt
  }

  /**
   * Build negative prompt based on all rule types
   */
  private buildNegativePrompt(positionRules: any, contentRules: any, disappointmentRules: any): string {
    let negativePrompt = "deformed, blurry, low quality, text, numbers, letters, overlapping, messy, complex, realistic, photographic, 3d, cgi"

    // Add position-based negatives
    if (positionRules.styleType === 'preview') {
      negativePrompt += ", inconsistent style"
    } else if (positionRules.styleType === 'early_book') {
      negativePrompt += ", same composition as previous pages"
    } else if (positionRules.styleType === 'mid_book') {
      negativePrompt += ", repetitive scenes"
    } else if (positionRules.styleType === 'late_book') {
      negativePrompt += ", similar to any previous pages, repetitive elements"
    }

    // Add content-specific negatives
    if (contentRules.vehicleRules) {
      negativePrompt += ", vehicle floating, people outside vehicle when they should be inside, unclear vehicle structure"
    }
    if (contentRules.dinosaurRules) {
      negativePrompt += ", dinosaur in wrong position, unclear dinosaur features, inappropriate size relationships"
    }
    if (contentRules.chaseRules) {
      negativePrompt += ", chaser in front of target, unclear movement, inappropriate positioning"
    }
    if (contentRules.golfRules) {
      negativePrompt += ", golf equipment floating, unclear course layout, inappropriate golf element placement"
    }

    // Add character organization negatives for Stability AI
    negativePrompt += ", character feature mixing, overlapping character features, unclear character separation, characters with mixed attributes"

    // Add disappointment-based negatives
    if (disappointmentRules.disappointmentLevel === 2) {
      negativePrompt += ", similar to previous attempts, repetitive elements"
    } else if (disappointmentRules.disappointmentLevel === 3) {
      negativePrompt += ", similar to any previous attempts, repetitive elements, conventional approach"
    }

    return negativePrompt
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

  // Generate high-resolution background image with comprehensive childhood themes
  async generateBackgroundImage(r2Bucket?: R2Bucket): Promise<string> {
    try {
      // Comprehensive prompt combining multiple childhood themes
      const comprehensivePrompt = `A magical coloring book scene that combines the best of childhood imagination: A majestic treehouse castle built in a giant oak tree, with a friendly dragon wearing a crown as the guardian, surrounded by a moat filled with colorful fish and mermaids. Dinosaurs wearing party hats are having a tea party with robots and aliens at picnic tables. Princesses and knights are playing soccer with unicorns and fairies. Space rockets are launching from the tree branches, while submarines explore underwater caves beneath the tree roots. Butterflies with geometric patterns flutter around, and a rainbow bridge connects to a floating island where children are building sandcastles with friendly monsters. The scene is partially colored with vibrant watercolors - some areas are fully colored in bright, cheerful hues while others remain as clean black outlines ready for coloring. The composition is panoramic and detailed, perfect for a full-screen background. The style is whimsical, child-friendly, and captures the pure joy of childhood imagination.`

      const response = await fetch(`${this.baseUrl}/stable-diffusion-xl-1024-v1-0/text-to-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: comprehensivePrompt,
              weight: 1.5
            },
            {
              text: "coloring book style, thick black outlines, clean line art, partially colored with watercolors, vibrant colors, white space for coloring, child-friendly, magical, whimsical, detailed composition, panoramic view, high quality, professional illustration, balanced layout, clear separation between elements",
              weight: 1.3
            },
            {
              text: "deformed, blurry, low quality, text, numbers, letters, overlapping, messy, complex, realistic, photographic, 3d, cgi, dark, scary, inappropriate, adult content",
              weight: -1.5
            }
          ],
          cfg_scale: 12,
          height: 640,
          width: 1536,
          samples: 1,
          steps: 50,
          style_preset: "line-art"
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Stability AI background generation error: ${response.status} - ${errorText}`)
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
          const r2Url = await this.uploadBackgroundImage(imageBuffer, r2Bucket)
          console.log('Successfully uploaded background to R2:', r2Url)
          return r2Url
        } catch (error) {
          console.error('R2 background upload failed:', error)
        }
      }
      
      // Fallback to data URL if R2 fails
      const dataUrl = `data:image/png;base64,${image.base64}`
      console.log('Using background data URL fallback')
      return dataUrl
    } catch (error) {
      console.error('Background generation failed:', error)
      throw error
    }
  }

  // Upload background image to storage (Cloudflare R2)
  private async uploadBackgroundImage(imageBuffer: Uint8Array, r2Bucket?: R2Bucket): Promise<string> {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substr(2, 9)
    const filename = `backgrounds/comprehensive-childhood-themes-${timestamp}-${randomId}.png`
    
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
        console.error('Failed to upload background to R2:', error)
      }
    }
    
    // Fallback to placeholder for now
    return `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=4096&h=2048&fit=crop&crop=center&auto=format&q=80`
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

