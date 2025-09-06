/**
 * Stability AI Prompt Improvement Engine
 * 
 * This service sends user prompts to Stability AI with specific instructions
 * for generating children's coloring book illustrations.
 * 
 * The system prompt instructs Stability AI to:
 * 1. Filter unsafe content
 * 2. Understand user intent
 * 3. Expand & organize scenes
 * 4. Optimize for coloring book output
 * 5. Generate variety
 */

export class StabilityPromptEngine {
  private apiKey: string
  private baseUrl = 'https://api.stability.ai'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * System prompt that instructs Stability AI on how to process coloring book prompts
   */
  private getSystemPrompt(): string {
    return `You are a Stability AI prompt refiner for a children's black & white coloring book generator.
Goal: Transform user prompts into clean, safe, detailed, and varied black-and-white line-art illustration prompts suitable for a children's coloring book.

FILTERING RULES:
- Block & refuse: sexual content, nudity, graphic violence, gore, drugs, or anything inappropriate for children.
- If blocked, return: "This prompt cannot be used for a children's coloring book. Please try something different."

PROCESSING STEPS:
1. Understand intent:
   - Identify the main characters, their roles, actions, and environment.
   - Extract implied elements that the user did not explicitly state but are logically expected (e.g., if a golf cart is being chased, people should be inside).

2. Expand the scene:
   - Define the foreground: key characters, objects, or interactions.
   - Define the background: environmental details, but keep them simple enough for coloring.
   - Add small extra details (props, clothing, accessories, setting markers) to give variety across multiple outputs.

3. Adapt for coloring books:
   - Always use "black and white line art, clean outlines, no shading, optimized for coloring books".
   - Ensure balanced complexity: not too detailed, not too simple.
   - Provide open spaces for coloring.

4. Generate variety:
   - Produce multiple variations of each scene (30 minimum).
   - Vary composition: character positions, number of elements, background features.
   - Introduce scene alternatives (different perspectives, slightly altered scenarios).

PROMPT OUTPUT FORMAT:
Always end with: "Black and white line art, clean outlines, children's coloring book style. [Expanded description], optimized for coloring with balanced open spaces."

EXAMPLE TRANSFORMATION:
User Input: "A dinosaur chasing a golfcart on a golf course."

Output: "Black and white line art, clean outlines, children's coloring book style. A roaring Tyrannosaurus rex runs behind a moving golf cart on a hilly golf course. Two people inside the golf cart are holding on tightly, one yelling, one smiling. Golf clubs spill onto the grass in the foreground. A flag from a golf hole waves in the background. Optimized for coloring with balanced open spaces."

Now process the user's prompt following these exact rules.`
  }

  /**
   * Send user prompt to Stability AI with the system instructions
   * This will return an improved prompt ready for image generation
   */
  async improvePrompt(userPrompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using GPT-4o-mini for prompt improvement
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`Stability AI prompt improvement failed: ${response.statusText}`)
      }

      const data = await response.json()
      const improvedPrompt = data.choices[0]?.message?.content

      if (!improvedPrompt) {
        throw new Error('No improved prompt returned from Stability AI')
      }

      // Check if the prompt was blocked
      if (improvedPrompt.includes('cannot be used for a children\'s coloring book')) {
        throw new Error('Content blocked: inappropriate for children')
      }

      return improvedPrompt.trim()
    } catch (error) {
      console.error('Stability AI prompt improvement error:', error)
      throw error
    }
  }

  /**
   * Generate multiple variations of a prompt
   * This creates 30+ different scene variations for a coloring book
   */
  async generateVariations(userPrompt: string, count: number = 30): Promise<string[]> {
    const variations: string[] = []
    
    try {
      // First, get the base improved prompt
      const basePrompt = await this.improvePrompt(userPrompt)
      variations.push(basePrompt)

      // Generate additional variations by asking for specific variations
      for (let i = 1; i < count; i++) {
        const variationPrompt = `Create a variation ${i + 1} of this coloring book scene. Change the composition, character positions, background details, or perspective while keeping the core concept. Original: "${userPrompt}"`
        
        try {
          const variation = await this.improvePrompt(variationPrompt)
          variations.push(variation)
        } catch (error) {
          console.warn(`Failed to generate variation ${i + 1}:`, error)
          // If variation fails, use the base prompt with a slight modification
          variations.push(`${basePrompt} Variation ${i + 1}.`)
        }
      }

      return variations
    } catch (error) {
      console.error('Error generating variations:', error)
      // Fallback: return the original prompt with basic coloring book formatting
      return Array(count).fill(`Black and white line art, clean outlines, children's coloring book style. ${userPrompt}, optimized for coloring with balanced open spaces.`)
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
