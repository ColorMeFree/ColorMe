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
   * Add basic scene guidance - let Stability AI handle the rest
   */
  private addBasicSceneGuidance(prompt: string): string {
    // Simple, general guidance that works for any scene
    return `${prompt}, clear composition`
  }

  /**
   * Add intelligent scene guidance with character organization rules for Stability AI
   */
  private addIntelligentSceneGuidance(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()
    
    // Character organization rules for Stability AI
    let guidance = prompt
    
    // Multiple character detection and organization
    if (this.hasMultipleCharacters(lowerPrompt)) {
      guidance += ', with each character clearly distinguishable and properly positioned'
      
      // Specific character organization rules
      if (lowerPrompt.includes('godzilla') && lowerPrompt.includes('kong')) {
        guidance += ', Godzilla as giant green dinosaur-like monster with spikes on left side, King Kong as giant gorilla-like creature on right side, facing each other clearly separated'
      } else if (lowerPrompt.includes('superman') && lowerPrompt.includes('batman')) {
        guidance += ', Superman in blue and red costume on left side, Batman in black costume with cape on right side, facing each other clearly separated'
      } else if (lowerPrompt.includes('dinosaur') && lowerPrompt.includes('car')) {
        guidance += ', dinosaur clearly positioned behind or beside the car, people inside the car if applicable, clear separation between characters'
      } else if (lowerPrompt.includes('fight') || lowerPrompt.includes('battle') || lowerPrompt.includes('against')) {
        guidance += ', characters positioned on opposite sides facing each other, clear action between them, no character feature mixing'
      } else if (lowerPrompt.includes('chasing') || lowerPrompt.includes('running after')) {
        guidance += ', chaser positioned behind target, clear movement direction, appropriate distance between characters'
      }
    }
    
    // Action clarification rules
    if (lowerPrompt.includes('winning') || lowerPrompt.includes('beating')) {
      guidance += ', winning character clearly having the advantage, losing character at a disadvantage, clear power dynamic'
    }
    
    if (lowerPrompt.includes('superpowers') || lowerPrompt.includes('powers')) {
      guidance += ', superpowers clearly visible and distinct, each character with their own unique abilities'
    }
    
    // Scene structure rules
    if (lowerPrompt.includes('crazy scene') || lowerPrompt.includes('epic')) {
      guidance += ', dynamic composition with clear focal points, balanced layout despite complexity'
    }
    
    // General composition rules
    guidance += ', clear composition with distinct character separation, no overlapping features, each element clearly defined'
    
    return guidance
  }

  /**
   * Check if prompt contains multiple characters
   */
  private hasMultipleCharacters(prompt: string): boolean {
    const characterKeywords = [
      'godzilla', 'kong', 'king kong', 'dinosaur', 'dino', 't-rex', 'triceratops',
      'superman', 'batman', 'spiderman', 'iron man', 'hulk', 'thor', 'captain america',
      'cowboy', 'pirate', 'knight', 'princess', 'robot', 'alien', 'monster',
      'car', 'truck', 'cart', 'golf cart', 'spaceship', 'helicopter', 'airplane',
      'person', 'people', 'man', 'woman', 'child', 'kid', 'animal', 'creature'
    ]
    
    let characterCount = 0
    for (const keyword of characterKeywords) {
      if (prompt.includes(keyword)) {
        characterCount++
      }
    }
    
    return characterCount > 1
  }

  /**
   * Enhance user prompt for coloring book generation
   * This adds the necessary coloring book styling and intelligent scene guidance
   */
  private enhancePromptForColoringBook(userPrompt: string): string {
    // Step 1: Remove color words
    const colorFreePrompt = this.removeColorWords(userPrompt)
    
    // Step 2: Add intelligent scene guidance with character organization
    const sceneGuidedPrompt = this.addIntelligentSceneGuidance(colorFreePrompt)
    
    // Step 3: Add coloring book styling
    return `Black and white line art, clean outlines, children's coloring book style. ${sceneGuidedPrompt}, optimized for coloring with balanced open spaces, no shading, simple details suitable for children to color, monochrome only.`
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
