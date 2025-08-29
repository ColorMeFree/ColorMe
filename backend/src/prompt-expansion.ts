// Simple prompt expansion service for ColorMeFree
// Generates 30 unique scenes from user input

export class PromptExpansionService {
  
  // Simple scene templates for different types of prompts
  private sceneTemplates = {
    chase: [
      "chasing through a {location}",
      "running away from {chaser} in {location}",
      "escaping through {location} while being pursued",
      "dodging {chaser} in {location}",
      "hiding from {chaser} in {location}"
    ],
    
    adventure: [
      "exploring {location}",
      "discovering {location}",
      "journeying through {location}",
      "searching in {location}",
      "investigating {location}"
    ],
    
    interaction: [
      "meeting {character} in {location}",
      "playing with {character} in {location}",
      "helping {character} in {location}",
      "learning from {character} in {location}",
      "celebrating with {character} in {location}"
    ]
  }

  private locations = [
    "golf course", "prehistoric forest", "dinosaur valley", "jungle", "desert",
    "mountain", "beach", "cave", "volcano", "swamp", "meadow", "river",
    "waterfall", "canyon", "island", "castle", "village", "city", "farm",
    "park", "zoo", "museum", "school", "playground", "library", "hospital",
    "fire station", "police station", "space station", "underwater world"
  ]

  private emotions = [
    "excited", "scared", "happy", "surprised", "curious", "brave", "nervous",
    "confident", "worried", "amused", "determined", "relaxed", "energetic",
    "calm", "adventurous", "cautious", "playful", "serious", "friendly", "shy"
  ]

  // Expand a simple prompt into 30 unique scenes
  expandPrompt(userPrompt: string): string[] {
    const scenes: string[] = []
    
    // Analyze the prompt to determine type
    const promptType = this.analyzePromptType(userPrompt)
    const elements = this.extractElements(userPrompt)
    
    // Generate 4 preview scenes (most engaging)
    scenes.push(...this.generatePreviewScenes(userPrompt, elements, promptType))
    
    // Generate 26 additional scenes
    scenes.push(...this.generateRemainingScenes(userPrompt, elements, promptType))
    
    return scenes
  }

  private analyzePromptType(prompt: string): 'chase' | 'adventure' | 'interaction' {
    const lower = prompt.toLowerCase()
    
    if (lower.includes('chase') || lower.includes('chasing') || lower.includes('running')) {
      return 'chase'
    } else if (lower.includes('explore') || lower.includes('discover') || lower.includes('journey')) {
      return 'adventure'
    } else {
      return 'interaction'
    }
  }

  private extractElements(prompt: string): any {
    // Simple element extraction
    const elements = {
      vehicle: this.extractVehicle(prompt),
      characters: this.extractCharacters(prompt),
      action: this.extractAction(prompt),
      location: this.extractLocation(prompt)
    }
    
    return elements
  }

  private extractVehicle(prompt: string): string {
    const vehicles = ['car', 'truck', 'bus', 'train', 'plane', 'boat', 'bike', 'golf cart', 'tractor', 'fire truck']
    for (const vehicle of vehicles) {
      if (prompt.toLowerCase().includes(vehicle)) {
        return vehicle
      }
    }
    return 'vehicle'
  }

  private extractCharacters(prompt: string): string[] {
    const characters = ['dinosaur', 'dragon', 'monster', 'robot', 'alien', 'princess', 'knight', 'pilot', 'farmer', 'teacher']
    const found = characters.filter(char => prompt.toLowerCase().includes(char))
    return found.length > 0 ? found : ['character']
  }

  private extractAction(prompt: string): string {
    const actions = ['chase', 'run', 'fly', 'swim', 'jump', 'play', 'explore', 'help', 'save', 'build']
    for (const action of actions) {
      if (prompt.toLowerCase().includes(action)) {
        return action
      }
    }
    return 'adventure'
  }

  private extractLocation(prompt: string): string {
    for (const location of this.locations) {
      if (prompt.toLowerCase().includes(location)) {
        return location
      }
    }
    return 'exciting place'
  }

  private generatePreviewScenes(userPrompt: string, elements: any, type: string): string[] {
    const scenes: string[] = []
    
    // Scene 1: Main action in primary location
    scenes.push(`${userPrompt} in a ${this.getRandomLocation()}`)
    
    // Scene 2: Different location, same action
    scenes.push(`${userPrompt} in a ${this.getRandomLocation()}`)
    
    // Scene 3: Different perspective/emotion
    scenes.push(`${userPrompt} - ${this.getRandomEmotion()} scene`)
    
    // Scene 4: Expanded action
    scenes.push(`${userPrompt} with more ${elements.characters.join(' and ')}`)
    
    return scenes
  }

  private generateRemainingScenes(userPrompt: string, elements: any, type: string): string[] {
    const scenes: string[] = []
    
    // Generate 26 more scenes with variations
    for (let i = 0; i < 26; i++) {
      const scene = this.generateVariation(userPrompt, elements, type, i)
      scenes.push(scene)
    }
    
    return scenes
  }

  private generateVariation(userPrompt: string, elements: any, type: string, index: number): string {
    const variations = [
      `${userPrompt} at ${this.getRandomLocation()}`,
      `${userPrompt} during ${this.getRandomTime()}`,
      `${userPrompt} with ${this.getRandomEmotion()} expressions`,
      `${userPrompt} in ${this.getRandomWeather()}`,
      `${userPrompt} near a ${this.getRandomLandmark()}`,
      `${userPrompt} with ${this.getRandomCharacter()} joining`,
      `${userPrompt} while ${this.getRandomActivity()}`,
      `${userPrompt} in a ${this.getRandomEnvironment()}`,
      `${userPrompt} with ${this.getRandomObject()}`,
      `${userPrompt} at ${this.getRandomEvent()}`
    ]
    
    return variations[index % variations.length]
  }

  private getRandomLocation(): string {
    return this.locations[Math.floor(Math.random() * this.locations.length)]
  }

  private getRandomEmotion(): string {
    return this.emotions[Math.floor(Math.random() * this.emotions.length)]
  }

  private getRandomTime(): string {
    const times = ['morning', 'afternoon', 'evening', 'night', 'sunset', 'dawn', 'midnight', 'noon']
    return times[Math.floor(Math.random() * times.length)]
  }

  private getRandomWeather(): string {
    const weather = ['sunny day', 'rainy day', 'snowy day', 'cloudy day', 'stormy day', 'foggy day']
    return weather[Math.floor(Math.random() * weather.length)]
  }

  private getRandomLandmark(): string {
    const landmarks = ['waterfall', 'mountain', 'castle', 'bridge', 'tower', 'cave', 'tree', 'rock']
    return landmarks[Math.floor(Math.random() * landmarks.length)]
  }

  private getRandomCharacter(): string {
    const characters = ['friend', 'family member', 'pet', 'helper', 'guide', 'teacher']
    return characters[Math.floor(Math.random() * characters.length)]
  }

  private getRandomActivity(): string {
    const activities = ['playing', 'working', 'resting', 'exploring', 'learning', 'celebrating']
    return activities[Math.floor(Math.random() * activities.length)]
  }

  private getRandomEnvironment(): string {
    const environments = ['forest', 'desert', 'ocean', 'space', 'underwater', 'underground']
    return environments[Math.floor(Math.random() * environments.length)]
  }

  private getRandomObject(): string {
    const objects = ['treasure', 'tool', 'toy', 'book', 'map', 'key', 'crystal', 'flower']
    return objects[Math.floor(Math.random() * objects.length)]
  }

  private getRandomEvent(): string {
    const events = ['party', 'celebration', 'competition', 'festival', 'parade', 'show']
    return events[Math.floor(Math.random() * events.length)]
  }
}

export const promptExpansionService = new PromptExpansionService()


