// Enhanced prompt expansion service for ColorMeFree
// Intelligently generates 30 unique scenes with comprehensive coverage

export interface PromptAnalysis {
  type: 'action' | 'adventure' | 'peaceful' | 'fantasy' | 'modern' | 'nature' | 'mixed'
  elements: {
    vehicles: string[]
    characters: string[]
    actions: string[]
    locations: string[]
    objects: string[]
  }
  complexity: 'simple' | 'medium' | 'complex'
  themes: string[]
}

export class EnhancedPromptExpansionService {
  
  private sceneCategories = {
    action: ['chase', 'escape', 'rescue', 'race', 'battle', 'adventure', 'quest'],
    peaceful: ['explore', 'discover', 'learn', 'help', 'play', 'celebrate', 'create'],
    nature: ['forest', 'ocean', 'space', 'jungle', 'desert', 'mountain', 'river'],
    urban: ['city', 'school', 'park', 'zoo', 'museum', 'library', 'hospital'],
    fantasy: ['castle', 'dragon', 'magic', 'fairy', 'wizard', 'unicorn', 'kingdom'],
    modern: ['car', 'plane', 'robot', 'computer', 'phone', 'television', 'factory']
  }

  private locations = {
    natural: [
      'golf course', 'prehistoric forest', 'dinosaur valley', 'jungle', 'desert',
      'mountain', 'beach', 'cave', 'volcano', 'swamp', 'meadow', 'river',
      'waterfall', 'canyon', 'island', 'ocean', 'space', 'underwater world',
      'rainforest', 'savanna', 'tundra', 'grassland', 'wetland', 'reef'
    ],
    urban: [
      'city', 'village', 'town', 'farm', 'park', 'zoo', 'museum', 'school',
      'playground', 'library', 'hospital', 'fire station', 'police station',
      'space station', 'airport', 'train station', 'bus station', 'market'
    ],
    fantasy: [
      'castle', 'kingdom', 'magical forest', 'crystal cave', 'floating island',
      'cloud city', 'underwater palace', 'tree house', 'fairy garden',
      'wizard tower', 'dragon lair', 'enchanted garden', 'mystical temple'
    ]
  }

  private emotions = [
    'excited', 'scared', 'happy', 'surprised', 'curious', 'brave', 'nervous',
    'confident', 'worried', 'amused', 'determined', 'relaxed', 'energetic',
    'calm', 'adventurous', 'cautious', 'playful', 'serious', 'friendly', 'shy'
  ]

  private times = [
    'morning', 'afternoon', 'evening', 'night', 'sunset', 'dawn', 'midnight', 'noon',
    'spring', 'summer', 'autumn', 'winter', 'rainy day', 'sunny day', 'snowy day'
  ]

  private activities = [
    'playing', 'working', 'resting', 'exploring', 'learning', 'celebrating',
    'cooking', 'building', 'painting', 'singing', 'dancing', 'reading',
    'gardening', 'fishing', 'camping', 'swimming', 'flying', 'driving'
  ]

  // Main expansion function
  expandPrompt(userPrompt: string): string[] {
    // Analyze the prompt
    const analysis = this.analyzePrompt(userPrompt)
    
    // Generate 4 preview scenes (most engaging)
    const previewScenes = this.generatePreviewScenes(userPrompt, analysis)
    
    // Generate 26 additional scenes with intelligent variety
    const remainingScenes = this.generateRemainingScenes(userPrompt, analysis)
    
    return [...previewScenes, ...remainingScenes]
  }

  private analyzePrompt(userPrompt: string): PromptAnalysis {
    const lower = userPrompt.toLowerCase()
    
    // Determine prompt type
    let type: PromptAnalysis['type'] = 'mixed'
    if (this.containsAny(lower, this.sceneCategories.action)) type = 'action'
    else if (this.containsAny(lower, this.sceneCategories.peaceful)) type = 'peaceful'
    else if (this.containsAny(lower, this.sceneCategories.fantasy)) type = 'fantasy'
    else if (this.containsAny(lower, this.sceneCategories.modern)) type = 'modern'
    else if (this.containsAny(lower, this.sceneCategories.nature)) type = 'nature'
    
    // Extract elements
    const elements = {
      vehicles: this.extractVehicles(lower),
      characters: this.extractCharacters(lower),
      actions: this.extractActions(lower),
      locations: this.extractLocations(lower),
      objects: this.extractObjects(lower)
    }
    
    // Determine complexity
    const complexity = this.determineComplexity(elements)
    
    // Identify themes
    const themes = this.identifyThemes(lower, elements)
    
    return { type, elements, complexity, themes }
  }

  private generatePreviewScenes(userPrompt: string, analysis: PromptAnalysis): string[] {
    const scenes = []
    
    // Scene 1: Main concept in primary setting
    scenes.push(this.createMainScene(userPrompt, analysis))
    
    // Scene 2: Different environment
    scenes.push(this.createEnvironmentVariation(userPrompt, analysis))
    
    // Scene 3: Character focus
    scenes.push(this.createCharacterFocus(userPrompt, analysis))
    
    // Scene 4: Action variation
    scenes.push(this.createActionVariation(userPrompt, analysis))
    
    return scenes
  }

  private generateRemainingScenes(userPrompt: string, analysis: PromptAnalysis): string[] {
    const scenes = []
    
    // Generate 26 scenes with intelligent variety
    for (let i = 0; i < 26; i++) {
      const scene = this.generateIntelligentVariation(userPrompt, analysis, i)
      scenes.push(scene)
    }
    
    return scenes
  }

  private createMainScene(userPrompt: string, analysis: PromptAnalysis): string {
    const location = this.getAppropriateLocation(analysis)
    return `${userPrompt} in a ${location}`
  }

  private createEnvironmentVariation(userPrompt: string, analysis: PromptAnalysis): string {
    const location = this.getDifferentLocation(analysis)
    const time = this.getRandomTime()
    return `${userPrompt} in a ${location} during ${time}`
  }

  private createCharacterFocus(userPrompt: string, analysis: PromptAnalysis): string {
    const emotion = this.getRandomEmotion()
    const character = analysis.elements.characters[0] || 'character'
    return `${userPrompt} with ${character} feeling ${emotion}`
  }

  private createActionVariation(userPrompt: string, analysis: PromptAnalysis): string {
    const activity = this.getRandomActivity()
    const location = this.getAppropriateLocation(analysis)
    return `${userPrompt} while ${activity} in a ${location}`
  }

  private generateIntelligentVariation(userPrompt: string, analysis: PromptAnalysis, index: number): string {
    const variations = [
      () => `${userPrompt} at ${this.getRandomLocation(analysis)}`,
      () => `${userPrompt} during ${this.getRandomTime()}`,
      () => `${userPrompt} with ${this.getRandomEmotion()} expressions`,
      () => `${userPrompt} in ${this.getRandomWeather()}`,
      () => `${userPrompt} near a ${this.getRandomLandmark()}`,
      () => `${userPrompt} with ${this.getRandomCharacter()} joining`,
      () => `${userPrompt} while ${this.getRandomActivity()}`,
      () => `${userPrompt} in a ${this.getRandomEnvironment()}`,
      () => `${userPrompt} with ${this.getRandomObject()}`,
      () => `${userPrompt} at ${this.getRandomEvent()}`,
      () => `${userPrompt} exploring ${this.getRandomLocation(analysis)}`,
      () => `${userPrompt} discovering ${this.getRandomLocation(analysis)}`,
      () => `${userPrompt} helping ${this.getRandomCharacter()}`,
      () => `${userPrompt} learning about ${this.getRandomTopic()}`,
      () => `${userPrompt} celebrating in ${this.getRandomLocation(analysis)}`,
      () => `${userPrompt} creating something amazing`,
      () => `${userPrompt} solving a problem`,
      () => `${userPrompt} making new friends`,
      () => `${userPrompt} going on an adventure`,
      () => `${userPrompt} finding treasure`,
      () => `${userPrompt} building something`,
      () => `${userPrompt} painting a picture`,
      () => `${userPrompt} reading a book`,
      () => `${userPrompt} playing a game`,
      () => `${userPrompt} singing a song`,
      () => `${userPrompt} dancing happily`,
      () => `${userPrompt} cooking together`
    ]
    
    const variationIndex = index % variations.length
    return variations[variationIndex]()
  }

  // Helper methods
  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword))
  }

  private extractVehicles(text: string): string[] {
    const vehicles = ['car', 'truck', 'bus', 'train', 'plane', 'boat', 'bike', 'golf cart', 'tractor', 'fire truck', 'ambulance', 'police car', 'spaceship', 'submarine', 'helicopter']
    return vehicles.filter(vehicle => text.includes(vehicle))
  }

  private extractCharacters(text: string): string[] {
    const characters = ['dinosaur', 'dragon', 'monster', 'robot', 'alien', 'princess', 'knight', 'pilot', 'farmer', 'teacher', 'doctor', 'firefighter', 'police officer', 'astronaut', 'sailor', 'driver', 'chef', 'artist', 'musician', 'scientist']
    return characters.filter(char => text.includes(char))
  }

  private extractActions(text: string): string[] {
    const actions = ['chase', 'run', 'fly', 'swim', 'jump', 'play', 'explore', 'help', 'save', 'build', 'create', 'learn', 'discover', 'celebrate', 'cook', 'paint', 'sing', 'dance', 'read', 'write']
    return actions.filter(action => text.includes(action))
  }

  private extractLocations(text: string): string[] {
    const allLocations = [...this.locations.natural, ...this.locations.urban, ...this.locations.fantasy]
    return allLocations.filter(location => text.includes(location))
  }

  private extractObjects(text: string): string[] {
    const objects = ['treasure', 'tool', 'toy', 'book', 'map', 'key', 'crystal', 'flower', 'tree', 'rock', 'water', 'food', 'clothing', 'hat', 'shoes', 'backpack', 'lunchbox', 'pencil', 'paper', 'crayons']
    return objects.filter(obj => text.includes(obj))
  }

  private determineComplexity(elements: any): 'simple' | 'medium' | 'complex' {
    const totalElements = Object.values(elements).flat().length
    if (totalElements <= 2) return 'simple'
    if (totalElements <= 4) return 'medium'
    return 'complex'
  }

  private identifyThemes(text: string, elements: any): string[] {
    const themes = []
    if (elements.characters.some(char => ['dinosaur', 'dragon'].includes(char))) themes.push('prehistoric')
    if (elements.characters.some(char => ['robot', 'alien'].includes(char))) themes.push('sci-fi')
    if (elements.characters.some(char => ['princess', 'knight'].includes(char))) themes.push('fantasy')
    if (elements.vehicles.length > 0) themes.push('transportation')
    if (elements.locations.some(loc => this.locations.natural.includes(loc))) themes.push('nature')
    if (elements.locations.some(loc => this.locations.urban.includes(loc))) themes.push('urban')
    return themes
  }

  private getAppropriateLocation(analysis: PromptAnalysis): string {
    if (analysis.themes.includes('prehistoric')) return this.getRandomFrom(this.locations.natural)
    if (analysis.themes.includes('sci-fi')) return 'space station'
    if (analysis.themes.includes('fantasy')) return this.getRandomFrom(this.locations.fantasy)
    if (analysis.themes.includes('urban')) return this.getRandomFrom(this.locations.urban)
    return this.getRandomFrom(this.locations.natural)
  }

  private getDifferentLocation(analysis: PromptAnalysis): string {
    const currentLocation = this.getAppropriateLocation(analysis)
    const allLocations = [...this.locations.natural, ...this.locations.urban, ...this.locations.fantasy]
    const otherLocations = allLocations.filter(loc => loc !== currentLocation)
    return this.getRandomFrom(otherLocations)
  }

  private getRandomLocation(analysis: PromptAnalysis): string {
    return this.getAppropriateLocation(analysis)
  }

  private getRandomEmotion(): string {
    return this.getRandomFrom(this.emotions)
  }

  private getRandomTime(): string {
    return this.getRandomFrom(this.times)
  }

  private getRandomActivity(): string {
    return this.getRandomFrom(this.activities)
  }

  private getRandomWeather(): string {
    const weather = ['sunny day', 'rainy day', 'snowy day', 'cloudy day', 'stormy day', 'foggy day', 'windy day']
    return this.getRandomFrom(weather)
  }

  private getRandomLandmark(): string {
    const landmarks = ['waterfall', 'mountain', 'castle', 'bridge', 'tower', 'cave', 'tree', 'rock', 'lighthouse', 'windmill', 'statue', 'fountain']
    return this.getRandomFrom(landmarks)
  }

  private getRandomCharacter(): string {
    const characters = ['friend', 'family member', 'pet', 'helper', 'guide', 'teacher', 'neighbor', 'classmate']
    return this.getRandomFrom(characters)
  }

  private getRandomEnvironment(): string {
    const environments = ['forest', 'desert', 'ocean', 'space', 'underwater', 'underground', 'jungle', 'meadow']
    return this.getRandomFrom(environments)
  }

  private getRandomObject(): string {
    const objects = ['treasure', 'tool', 'toy', 'book', 'map', 'key', 'crystal', 'flower', 'gift', 'balloon', 'flag', 'banner']
    return this.getRandomFrom(objects)
  }

  private getRandomEvent(): string {
    const events = ['party', 'celebration', 'competition', 'festival', 'parade', 'show', 'concert', 'fair']
    return this.getRandomFrom(events)
  }

  private getRandomTopic(): string {
    const topics = ['animals', 'plants', 'space', 'ocean', 'history', 'science', 'art', 'music', 'sports', 'cooking']
    return this.getRandomFrom(topics)
  }

  private getRandomFrom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }
}

export const enhancedPromptExpansionService = new EnhancedPromptExpansionService()


