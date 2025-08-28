// Yoprintables.com Integration Service
// This service handles the complete workflow:
// 1. User input prompt
// 2. Apply our rules (foreground/background details, black and white only)
// 3. Generate 4 images via yoprintables.com
// 4. Download and process images
// 5. Return URLs for frontend display

export class YoprintablesService {
  private baseUrl = 'https://yoprintables.com'
  private apiEndpoint = 'https://api.yoprintables.com' // Hypothetical API endpoint

  // Step 1: Process user prompt and apply our rules
  private processPrompt(userPrompt: string): string {
    // Remove exclamation marks and clean up
    let processedPrompt = userPrompt.replace(/!+$/, '').trim()
    
    // Apply our coloring book rules
    const rules = [
      'black and white line art only',
      'simple background',
      'clear outlines',
      'suitable for children to color',
      'fill two-thirds of the page',
      'no complex shading',
      'bold, clean lines'
    ]
    
    // Add rules to the prompt
    const enhancedPrompt = `${processedPrompt}, ${rules.join(', ')}`
    
    return enhancedPrompt
  }

  // Step 2: Map prompt to yoprintables categories and styles
  private mapPromptToCategory(prompt: string): { category: string; style: string } {
    const lowerPrompt = prompt.toLowerCase()
    
    // Category mapping
    let category = 'animals' // default
    if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle') || lowerPrompt.includes('truck') || lowerPrompt.includes('race')) {
      category = 'vehicles'
    } else if (lowerPrompt.includes('dinosaur') || lowerPrompt.includes('dino')) {
      category = 'dinosaurs'
    } else if (lowerPrompt.includes('space') || lowerPrompt.includes('planet') || lowerPrompt.includes('rocket') || lowerPrompt.includes('alien')) {
      category = 'space'
    } else if (lowerPrompt.includes('underwater') || lowerPrompt.includes('fish') || lowerPrompt.includes('ocean') || lowerPrompt.includes('sea')) {
      category = 'underwater'
    } else if (lowerPrompt.includes('castle') || lowerPrompt.includes('princess') || lowerPrompt.includes('knight') || lowerPrompt.includes('dragon')) {
      category = 'fantasy'
    } else if (lowerPrompt.includes('robot') || lowerPrompt.includes('machine') || lowerPrompt.includes('technology')) {
      category = 'robots'
    } else if (lowerPrompt.includes('sport') || lowerPrompt.includes('ball') || lowerPrompt.includes('game') || lowerPrompt.includes('soccer')) {
      category = 'sports'
    } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog') || lowerPrompt.includes('lion')) {
      category = 'animals'
    }
    
    // Style mapping for consistent coloring book look
    const style = 'coloring-book-line-art'
    
    return { category, style }
  }

  // Step 3: Generate images via yoprintables.com
  private async generateImagesViaYoprintables(processedPrompt: string, category: string, style: string): Promise<string[]> {
    try {
      // For now, we'll use a mock implementation
      // In production, this would make actual API calls to yoprintables.com
      
      // Simulate API call to yoprintables.com
      const response = await this.mockYoprintablesAPI(processedPrompt, category, style)
      
      return response.images
    } catch (error) {
      console.error('Failed to generate images via yoprintables:', error)
      throw new Error('Image generation failed')
    }
  }

  // Mock API call to yoprintables.com (replace with real implementation)
  private async mockYoprintablesAPI(prompt: string, category: string, style: string): Promise<{ images: string[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate realistic placeholder URLs that look like coloring pages
    const baseUrl = 'https://yoprintables.com/coloring-pages'
    const images = [
      `${baseUrl}/${category}/page1-${Date.now()}.png`,
      `${baseUrl}/${category}/page2-${Date.now()}.png`,
      `${baseUrl}/${category}/page3-${Date.now()}.png`,
      `${baseUrl}/${category}/page4-${Date.now()}.png`
    ]
    
    return { images }
  }

  // Step 4: Download and process images
  private async downloadAndProcessImages(imageUrls: string[]): Promise<string[]> {
    const processedUrls = []
    
    for (const url of imageUrls) {
      try {
        // In production, this would:
        // 1. Download the image from yoprintables.com
        // 2. Process it to ensure it's black and white line art
        // 3. Upload to our CDN/storage
        // 4. Return the processed URL
        
        // For now, we'll simulate this process
        const processedUrl = await this.processImage(url)
        processedUrls.push(processedUrl)
      } catch (error) {
        console.error(`Failed to process image ${url}:`, error)
        // Fallback to placeholder
        processedUrls.push(`https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page`)
      }
    }
    
    return processedUrls
  }

  // Process individual image (simulated)
  private async processImage(imageUrl: string): Promise<string> {
    // Simulate image processing
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In production, this would:
    // 1. Fetch the image
    // 2. Convert to black and white if needed
    // 3. Ensure it's line art style
    // 4. Upload to Cloudflare R2 or similar
    // 5. Return the processed URL
    
    // For now, return a realistic URL
    return `https://your-backend.workers.dev/processed-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`
  }

  private generateImageUrl(imageId: string): string {
    // In production, this would return a real URL
    // For now, return a placeholder
    return `https://your-backend.workers.dev/processed-images/${imageId}.png`
  }

  // Main method: Complete workflow
  async generatePages(userPrompt: string): Promise<string[]> {
    try {
      console.log('Starting image generation for prompt:', userPrompt)
      
      // Step 1: Process the prompt
      const processedPrompt = this.processPrompt(userPrompt)
      console.log('Processed prompt:', processedPrompt)
      
      // Step 2: Map to category and style
      const { category, style } = this.mapPromptToCategory(processedPrompt)
      console.log('Mapped to category:', category, 'style:', style)
      
      // Step 3: Generate images via yoprintables.com
      const rawImageUrls = await this.generateImagesViaYoprintables(processedPrompt, category, style)
      console.log('Generated raw images:', rawImageUrls)
      
      // Step 4: Download and process images
      const processedImageUrls = await this.downloadAndProcessImages(rawImageUrls)
      console.log('Processed images:', processedImageUrls)
      
      return processedImageUrls
    } catch (error) {
      console.error('Failed to generate pages:', error)
      // Return fallback placeholder images
      return [
        'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+1',
        'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+2',
        'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+3',
        'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+4'
      ]
    }
  }

  // Generate remaining pages for the complete book
  async generateRemainingPages(prompt: string, styleSeed: string): Promise<string[]> {
    try {
      const processedPrompt = this.processPrompt(prompt)
      const { category, style } = this.mapPromptToCategory(processedPrompt)
      
      const remainingPages = []
      
      // Generate 26 additional pages
      for (let i = 0; i < 26; i++) {
        try {
          // Add variation to the prompt for diversity
          const variationPrompt = `${processedPrompt}, page ${i + 5}, variation ${i + 1}`
          const rawImageUrls = await this.generateImagesViaYoprintables(variationPrompt, category, style)
          const processedUrls = await this.downloadAndProcessImages([rawImageUrls[0]]) // Take first image
          
          remainingPages.push(processedUrls[0])
        } catch (error) {
          console.error(`Failed to generate page ${i + 5}:`, error)
          // Skip this page instead of using placeholder
          continue
        }
      }
      
      return remainingPages
    } catch (error) {
      console.error('Failed to generate remaining pages:', error)
      // Return error instead of fallback placeholders
      throw new Error('Failed to generate remaining pages')
    }
  }

  // Health check for yoprintables service
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      // Test connection to yoprintables.com
      const response = await fetch(this.baseUrl, { method: 'HEAD' })
      
      if (response.ok) {
        return { status: 'healthy', message: 'Yoprintables.com is accessible' }
      } else {
        return { status: 'warning', message: 'Yoprintables.com returned non-200 status' }
      }
    } catch (error) {
      return { status: 'error', message: 'Cannot connect to yoprintables.com' }
    }
  }
}

// Export singleton instance
export const yoprintablesService = new YoprintablesService()
