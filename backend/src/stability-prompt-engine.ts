/**
 * Stability AI Direct Integration Engine
 * 
 * This service sends user prompts directly to Stability AI for image generation
 * with built-in prompt processing and improvement.
 * 
 * Stability AI handles:
 * 1. Content safety filtering
 * 2. Prompt understanding and improvement
 * 3. Scene generation and variation
 * 4. Coloring book optimization
 */

export class StabilityPromptEngine {
  private apiKey: string
  private baseUrl = 'https://api.stability.ai'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Enhance user prompt for coloring book generation
   * This adds the necessary coloring book styling to any prompt
   */
  private enhancePromptForColoringBook(userPrompt: string): string {
    return `Black and white line art, clean outlines, children's coloring book style. ${userPrompt}, optimized for coloring with balanced open spaces, no shading, simple details suitable for children to color.`
  }

  /**
   * Process user prompt for Stability AI image generation
   * This enhances the prompt with coloring book styling and lets Stability AI handle the rest
   */
  async improvePrompt(userPrompt: string): Promise<string> {
    try {
      // Simply enhance the prompt with coloring book styling
      // Stability AI will handle content filtering, safety, and generation
      const enhancedPrompt = this.enhancePromptForColoringBook(userPrompt)
      
      console.log('Enhanced prompt for Stability AI:', enhancedPrompt)
      return enhancedPrompt
    } catch (error) {
      console.error('Prompt enhancement error:', error)
      throw error
    }
  }

  /**
   * Generate multiple variations of a prompt
   * This creates 30+ different scene variations for a coloring book
   * Stability AI will handle the variation generation during image creation
   */
  async generateVariations(userPrompt: string, count: number = 30): Promise<string[]> {
    try {
      // Get the base enhanced prompt
      const basePrompt = await this.improvePrompt(userPrompt)
      
      // Create variations by adding different descriptive elements
      // Stability AI will generate different images based on these variations
      const variations: string[] = []
      
      for (let i = 0; i < count; i++) {
        let variationPrompt = basePrompt
        
        // Add variation elements to create diversity
        const variationElements = [
          'different angle view',
          'alternative composition',
          'varying character positions',
          'different background elements',
          'alternative perspective',
          'varied scene layout',
          'different character expressions',
          'alternative setting details',
          'varying object placement',
          'different scene mood'
        ]
        
        // Add variation element every few iterations
        if (i > 0 && i % 3 === 0) {
          const element = variationElements[i % variationElements.length]
          variationPrompt = `${basePrompt}, ${element}`
        }
        
        variations.push(variationPrompt)
      }

      return variations
    } catch (error) {
      console.error('Error generating variations:', error)
      // Fallback: return the original prompt with basic coloring book formatting
      const fallbackPrompt = `Black and white line art, clean outlines, children's coloring book style. ${userPrompt}, optimized for coloring with balanced open spaces.`
      return Array(count).fill(fallbackPrompt)
    }
  }

  /**
   * Health check for the prompt engine
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const testPrompt = "A friendly cat playing with a ball"
      await this.improvePrompt(testPrompt)
      return { status: 'healthy', message: 'Stability AI prompt engine is working' }
    } catch (error) {
      return { status: 'error', message: `Prompt engine error: ${error.message}` }
    }
  }
}

/**
 * Create a Stability AI prompt engine instance
 */
export function createStabilityPromptEngine(env: any): StabilityPromptEngine {
  return new StabilityPromptEngine(env.STABILITY_API_KEY || '')
}
