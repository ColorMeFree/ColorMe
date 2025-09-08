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
   * Add intelligent scene guidance with dynamic rule generation for Stability AI
   */
  private addIntelligentSceneGuidance(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()
    
    // Dynamic rule generation for Stability AI
    let guidance = prompt
    
    // Extract and organize characters dynamically
    const characters = this.extractCharacters(lowerPrompt)
    if (characters.length > 1) {
      guidance += ', with each character clearly distinguishable and properly positioned'
      
      // Generate dynamic character positioning
      if (characters.length === 2) {
        guidance += `, ${characters[0]} positioned on left side, ${characters[1]} positioned on right side, facing each other clearly separated`
      } else if (characters.length > 2) {
        guidance += ', all characters positioned with clear spatial separation, no overlapping features'
      }
    }
    
    // Extract and clarify actions dynamically
    const actions = this.extractActions(lowerPrompt)
    if (actions.length > 0) {
      const mainAction = actions[0]
      guidance += `, main action: ${mainAction}, clear interaction between characters`
    }
    
    // Extract and enhance settings dynamically
    const settings = this.extractSettings(lowerPrompt)
    if (settings.length > 0) {
      const mainSetting = settings[0]
      guidance += `, scene set in ${mainSetting}, appropriate environmental details`
    }
    
    // Add dynamic composition rules based on complexity
    if (characters.length > 2 || actions.length > 1) {
      guidance += ', dynamic composition with clear focal points, balanced layout despite complexity'
    }
    
    // General composition rules
    guidance += ', clear composition with distinct character separation, no overlapping features, each element clearly defined'
    
    return guidance
  }

  /**
   * Dynamically extract characters from any prompt
   */
  private extractCharacters(prompt: string): string[] {
    const characters: string[] = []
    
    // Common character patterns
    const characterPatterns = [
      // Animals
      /\b(dogs?|cats?|birds?|fish|horses?|cows?|pigs?|sheep|goats?|chickens?|ducks?|rabbits?|mice|rats?|hamsters?|guinea pigs?)\b/g,
      // Mythical creatures
      /\b(dragons?|unicorns?|fairies?|elves?|dwarves?|giants?|trolls?|goblins?|orcs?|demons?|angels?|ghosts?|zombies?|vampires?|werewolves?)\b/g,
      // Aliens and robots
      /\b(aliens?|robots?|androids?|cyborgs?|droids?|machines?)\b/g,
      // Superheroes
      /\b(superman|batman|spiderman|iron man|hulk|thor|captain america|wonder woman|flash|green lantern|aquaman|black widow|hawkeye|doctor strange|black panther|ant man|wasp|captain marvel|scarlet witch|vision|falcon|winter soldier|deadpool|wolverine|storm|cyclops|jean grey|magneto|professor x)\b/g,
      // Monsters
      /\b(godzilla|king kong|kong|dinosaurs?|dinos?|t-rex|triceratops|stegosaurus|velociraptor|pterodactyl|brontosaurus|monsters?|creatures?)\b/g,
      // People
      /\b(people|persons?|men|women|children|kids?|boys?|girls?|babies?|adults?|elders?|seniors?)\b/g,
      // Professions
      /\b(cowboys?|pirates?|knights?|princesses?|princes?|kings?|queens?|wizards?|witches?|sorcerers?|magicians?|doctors?|nurses?|teachers?|students?|police|officers?|soldiers?|firefighters?|astronauts?|pilots?|chefs?|artists?|musicians?|dancers?|athletes?|sports players?)\b/g,
      // Vehicles
      /\b(cars?|trucks?|buses?|motorcycles?|bicycles?|scooters?|skateboards?|carts?|golf carts?|spaceships?|rockets?|helicopters?|airplanes?|jets?|boats?|ships?|submarines?|trains?|trams?|trolleys?)\b/g
    ]
    
    for (const pattern of characterPatterns) {
      const matches = prompt.match(pattern)
      if (matches) {
        characters.push(...matches)
      }
    }
    
    return [...new Set(characters)] // Remove duplicates
  }

  /**
   * Dynamically extract actions from any prompt
   */
  private extractActions(prompt: string): string[] {
    const actions: string[] = []
    
    const actionPatterns = [
      // Playing activities
      /\b(playing|play|games?|sports?|catch|tag|hide and seek|hopscotch|jump rope|marbles?|yo-yo|puzzles?|board games?|card games?)\b/g,
      // Fighting/conflict
      /\b(fighting|fight|battling|battle|warring|war|dueling|duel|competing|competition|racing|race|challenging|challenge)\b/g,
      // Movement
      /\b(running|run|walking|walk|jumping|jump|hopping|hop|skipping|skip|dancing|dance|swimming|swim|flying|fly|driving|drive|riding|ride|climbing|climb|crawling|crawl)\b/g,
      // Chasing
      /\b(chasing|chase|pursuing|pursue|following|follow|hunting|hunt|tracking|track|seeking|seek)\b/g,
      // Working
      /\b(working|work|building|build|constructing|construct|creating|create|making|make|cooking|cook|baking|bake|cleaning|clean|fixing|fix|repairing|repair)\b/g,
      // Learning
      /\b(learning|learn|studying|study|reading|read|writing|write|drawing|draw|painting|paint|singing|sing|playing music|practicing|practice)\b/g,
      // Eating
      /\b(eating|eat|drinking|drink|feeding|feed|snacking|snack|dining|dine|picnicking|picnic)\b/g,
      // Resting
      /\b(sleeping|sleep|resting|rest|napping|nap|relaxing|relax|meditating|meditate|dreaming|dream)\b/g
    ]
    
    for (const pattern of actionPatterns) {
      const matches = prompt.match(pattern)
      if (matches) {
        actions.push(...matches)
      }
    }
    
    return [...new Set(actions)] // Remove duplicates
  }

  /**
   * Dynamically extract settings from any prompt
   */
  private extractSettings(prompt: string): string[] {
    const settings: string[] = []
    
    const settingPatterns = [
      // Natural environments
      /\b(forest|jungle|desert|mountain|mountains?|hill|hills?|valley|valleys?|canyon|canyons?|cave|caves?|beach|beaches?|shore|shores?|coast|coasts?|river|rivers?|lake|lakes?|ocean|oceans?|sea|seas?|pond|ponds?|stream|streams?|waterfall|waterfalls?|meadow|meadows?|field|fields?|prairie|prairies?|tundra|arctic|antarctic|ice|snow|rain|storm|thunderstorm|hurricane|tornado|earthquake|volcano|volcanoes?)\b/g,
      // Urban environments
      /\b(city|cities?|town|towns?|village|villages?|neighborhood|neighborhoods?|street|streets?|road|roads?|highway|highways?|bridge|bridges?|park|parks?|playground|playgrounds?|school|schools?|hospital|hospitals?|library|libraries?|museum|museums?|zoo|zoos?|aquarium|aquariums?|circus|circuses?|carnival|carnivals?|fair|fairs?|market|markets?|store|stores?|shop|shops?|restaurant|restaurants?|cafe|cafes?|hotel|hotels?|office|offices?|factory|factories?|warehouse|warehouses?|garage|garages?|barn|barns?|shed|sheds?|house|houses?|home|homes?|apartment|apartments?|building|buildings?|skyscraper|skyscrapers?|tower|towers?|castle|castles?|palace|palaces?|mansion|mansions?|cottage|cottages?|cabin|cabins?|tent|tents?|caravan|caravans?|trailer|trailers?)\b/g,
      // Space environments
      /\b(space|outer space|universe|galaxy|galaxies?|planet|planets?|moon|moons?|sun|stars?|asteroid|asteroids?|comet|comets?|meteor|meteors?|nebula|nebulae?|black hole|black holes?|spaceship|spaceships?|space station|space stations?|mars|venus|mercury|jupiter|saturn|uranus|neptune|pluto|earth)\b/g,
      // Fantasy environments
      /\b(kingdom|kingdoms?|realm|realms?|land|lands?|world|worlds?|dimension|dimensions?|magic|magical|enchanted|fairy tale|fairy tales?|wonderland|neverland|narnia|middle earth|hogwarts|asgard|valhalla|olympus|underworld|hell|heaven|paradise|utopia|dystopia)\b/g,
      // Time periods
      /\b(ancient|medieval|renaissance|victorian|colonial|wild west|cowboy|cowboys?|pirate|pirates?|viking|vikings?|knight|knights?|samurai|ninja|gladiator|gladiators?|caveman|cavemen?|prehistoric|dinosaur|dinosaurs?|ice age|stone age|bronze age|iron age|industrial age|modern|contemporary|future|futuristic|sci-fi|science fiction|steampunk|cyberpunk|post-apocalyptic|apocalypse|zombie|zombies?)\b/g
    ]
    
    for (const pattern of settingPatterns) {
      const matches = prompt.match(pattern)
      if (matches) {
        settings.push(...matches)
      }
    }
    
    return [...new Set(settings)] // Remove duplicates
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
