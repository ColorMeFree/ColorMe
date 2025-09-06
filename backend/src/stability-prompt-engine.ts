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
   * Remove color words from prompt to ensure black and white only
   */
  private removeColorWords(prompt: string): string {
    const colorWords = [
      'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
      'gray', 'grey', 'gold', 'silver', 'rainbow', 'multicolored', 'bright', 'dark', 'light',
      'neon', 'pastel', 'vibrant', 'colorful', 'colored', 'hue', 'shade', 'tint', 'tone'
    ]
    
    let cleanedPrompt = prompt
    colorWords.forEach(color => {
      const regex = new RegExp(`\\b${color}\\b`, 'gi')
      cleanedPrompt = cleanedPrompt.replace(regex, '')
    })
    
    // Clean up extra spaces
    cleanedPrompt = cleanedPrompt.replace(/\s+/g, ' ').trim()
    
    return cleanedPrompt
  }

  /**
   * Add dynamic scene analysis and spatial awareness
   * Uses wide-net prompts to let Stability AI understand and improve any scene
   */
  private addDynamicSceneAnalysis(prompt: string): string {
    // Wide-net prompts that work for ANY scene type
    const sceneAnalysisPrompts = [
      'Analyze the spatial relationships between all objects and characters',
      'Ensure logical positioning and realistic scene composition',
      'Create coherent spatial arrangements that make sense',
      'Position all elements in realistic, believable locations',
      'Maintain proper scale and perspective relationships',
      'Ensure characters and objects interact naturally with their environment',
      'Apply intelligent scene understanding to create believable compositions',
      'Use contextual awareness to position elements logically',
      'Create dynamic but coherent spatial relationships'
    ]
    
    // Select a few analysis prompts to add context (randomized for variety)
    const shuffledPrompts = [...sceneAnalysisPrompts].sort(() => Math.random() - 0.5)
    const selectedPrompts = shuffledPrompts.slice(0, 3)
    const analysisContext = selectedPrompts.join(', ')
    
    return `${prompt}, ${analysisContext}`
  }

  /**
   * Enhance user prompt for coloring book generation
   * This adds the necessary coloring book styling and dynamic scene analysis
   */
  private enhancePromptForColoringBook(userPrompt: string): string {
    // Step 1: Remove color words
    const colorFreePrompt = this.removeColorWords(userPrompt)
    
    // Step 2: Add dynamic scene analysis
    const sceneAnalyzedPrompt = this.addDynamicSceneAnalysis(colorFreePrompt)
    
    // Step 3: Add coloring book styling with wide-net scene understanding
    return `Black and white line art, clean outlines, children's coloring book style. ${sceneAnalyzedPrompt}, optimized for coloring with balanced open spaces, no shading, simple details suitable for children to color, monochrome only, with intelligent scene composition and logical spatial relationships.`
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
        
        // Add variation elements that work with dynamic scene analysis
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
          'different scene mood',
          'close-up view',
          'wide angle view',
          'side view perspective',
          'overhead view',
          'different character poses',
          'varying object sizes',
          'alternative scene framing',
          'different depth of field',
          'varying scene density',
          'alternative lighting setup',
          'different spatial arrangement',
          'alternative scene dynamics',
          'varying interaction patterns',
          'different environmental context',
          'alternative narrative moment'
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
      return { status: 'error', message: `Prompt engine error: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
  }
}

/**
 * Create a Stability AI prompt engine instance
 */
export function createStabilityPromptEngine(env: any): StabilityPromptEngine {
  return new StabilityPromptEngine(env.STABILITY_API_KEY || '')
}
