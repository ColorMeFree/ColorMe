export interface PromptAnalysis {
  mainElements: string[]
  actions: string[]
  objects: string[]
  characters: string[]
  settings: string[]
  relationships: string[]
  expandedScenes: SceneDescription[]
  styleGuidelines: string[]
  qualityRequirements: string[]
}

export interface SceneDescription {
  sceneNumber: number
  title: string
  description: string
  keyElements: string[]
  composition: string
  style: string
  prompt: string
}

export class AdvancedPromptAnalysisService {
  
  // Enhanced prompt breakdown with context understanding
  async analyzePrompt(userPrompt: string): Promise<PromptAnalysis> {
    const analysis: PromptAnalysis = {
      mainElements: [],
      actions: [],
      objects: [],
      characters: [],
      settings: [],
      relationships: [],
      expandedScenes: [],
      styleGuidelines: [],
      qualityRequirements: []
    }

    // Step 1: Extract main elements and relationships
    const elements = this.extractElements(userPrompt)
    analysis.mainElements = elements.main
    analysis.actions = elements.actions
    analysis.objects = elements.objects
    analysis.characters = elements.characters
    analysis.settings = elements.settings
    analysis.relationships = elements.relationships

    // Step 2: Generate style guidelines for coloring book quality
    analysis.styleGuidelines = this.generateStyleGuidelines(userPrompt)
    
    // Step 3: Create quality requirements
    analysis.qualityRequirements = [
      'clean black lines only',
      'no shading or gradients',
      'no text, numbers, or letters',
      'simple, clear outlines',
      'child-friendly content',
      'no overlapping elements',
      'balanced composition',
      'clear focal points'
    ]

    // Step 4: Generate 30 expanded scenes with context awareness
    analysis.expandedScenes = await this.generateExpandedScenes(userPrompt, analysis)

    return analysis
  }

  private extractElements(prompt: string): any {
    const lower = prompt.toLowerCase()
    
    // Enhanced element extraction with context
    const elements = {
      main: [],
      actions: [],
      objects: [],
      characters: [],
      settings: [],
      relationships: []
    }

    // Character detection with context
    const characterPatterns = {
      dragon: ['dragon', 'dragons', 'friendly dragon', 'baby dragon'],
      human: ['child', 'children', 'kid', 'kids', 'boy', 'girl', 'person', 'people'],
      animal: ['cat', 'dog', 'bird', 'fish', 'horse', 'elephant', 'lion', 'tiger'],
      magical: ['fairy', 'wizard', 'witch', 'unicorn', 'phoenix', 'griffin']
    }

    // Action detection with context
    const actionPatterns = {
      building: ['build', 'building', 'construct', 'creating', 'making'],
      helping: ['help', 'helping', 'assist', 'support', 'working together'],
      playing: ['play', 'playing', 'fun', 'enjoy', 'having fun'],
      exploring: ['explore', 'exploring', 'discover', 'adventure', 'journey'],
      flying: ['fly', 'flying', 'soar', 'glide', 'hover']
    }

    // Object detection with context
    const objectPatterns = {
      structures: ['treehouse', 'house', 'castle', 'tower', 'bridge', 'ladder'],
      tools: ['hammer', 'saw', 'nails', 'wood', 'tools', 'equipment'],
      vehicles: ['car', 'truck', 'plane', 'boat', 'train', 'bike'],
      nature: ['tree', 'trees', 'forest', 'mountain', 'river', 'ocean']
    }

    // Extract based on patterns
    for (const [category, patterns] of Object.entries(characterPatterns)) {
      for (const pattern of patterns) {
        if (lower.includes(pattern)) {
          elements.characters.push(pattern)
          elements.main.push(pattern)
        }
      }
    }

    for (const [category, patterns] of Object.entries(actionPatterns)) {
      for (const pattern of patterns) {
        if (lower.includes(pattern)) {
          elements.actions.push(pattern)
          elements.main.push(pattern)
        }
      }
    }

    for (const [category, patterns] of Object.entries(objectPatterns)) {
      for (const pattern of patterns) {
        if (lower.includes(pattern)) {
          elements.objects.push(pattern)
          elements.main.push(pattern)
        }
      }
    }

    // Extract relationships
    if (elements.characters.length > 1) {
      elements.relationships.push('multiple characters interacting')
    }
    if (elements.actions.length > 0 && elements.objects.length > 0) {
      elements.relationships.push('characters working with objects')
    }

    return elements
  }

  private generateStyleGuidelines(prompt: string): string[] {
    const guidelines = [
      'coloring book style with thick black outlines',
      'simple, clean line art suitable for children',
      'no background details, focus on main subjects',
      'clear separation between elements',
      'balanced composition with good spacing',
      'child-friendly proportions and expressions',
      'no text, numbers, or written elements',
      'consistent line weight throughout'
    ]

    // Add specific guidelines based on prompt content
    const lower = prompt.toLowerCase()
    
    if (lower.includes('dragon')) {
      guidelines.push('friendly dragon design with rounded features')
      guidelines.push('dragon proportions suitable for children')
    }
    
    if (lower.includes('treehouse') || lower.includes('building')) {
      guidelines.push('simple architectural elements')
      guidelines.push('clear structural lines')
    }
    
    if (lower.includes('helping') || lower.includes('working')) {
      guidelines.push('cooperative action scenes')
      guidelines.push('positive interaction between characters')
    }

    return guidelines
  }

  private async generateExpandedScenes(prompt: string, analysis: PromptAnalysis): Promise<SceneDescription[]> {
    const scenes: SceneDescription[] = []
    
    // Generate 30 scenes with intelligent variation
    for (let i = 0; i < 30; i++) {
      const scene = this.createIntelligentScene(prompt, analysis, i)
      scenes.push(scene)
    }

    return scenes
  }

  private createIntelligentScene(prompt: string, analysis: PromptAnalysis, sceneIndex: number): SceneDescription {
    const sceneNumber = sceneIndex + 1
    
    // Create scene variations based on the main elements
    const variations = this.generateSceneVariations(prompt, analysis, sceneIndex)
    
    const scene: SceneDescription = {
      sceneNumber,
      title: variations.title,
      description: variations.description,
      keyElements: variations.keyElements,
      composition: variations.composition,
      style: 'coloring book line art',
      prompt: variations.prompt
    }

    return scene
  }

  private generateSceneVariations(prompt: string, analysis: PromptAnalysis, sceneIndex: number): any {
    const lower = prompt.toLowerCase()
    
    // Base scene templates
    const templates = {
      introduction: {
        title: 'Introduction Scene',
        description: 'Setting up the main characters and environment',
        keyElements: analysis.characters.concat(analysis.settings),
        composition: 'centered composition with main characters prominent',
        prompt: `${prompt}, introduction scene, establishing shot`
      },
      action: {
        title: 'Action Scene',
        description: 'Characters engaged in the main activity',
        keyElements: analysis.characters.concat(analysis.actions).concat(analysis.objects),
        composition: 'dynamic composition with action lines',
        prompt: `${prompt}, action scene, characters actively engaged`
      },
      detail: {
        title: 'Detail Scene',
        description: 'Focus on specific elements or close-up details',
        keyElements: analysis.objects.concat(analysis.characters.slice(0, 1)),
        composition: 'close-up composition with detailed elements',
        prompt: `${prompt}, detail scene, close-up focus`
      },
      interaction: {
        title: 'Interaction Scene',
        description: 'Characters working together or interacting',
        keyElements: analysis.characters.concat(analysis.relationships),
        composition: 'group composition showing interaction',
        prompt: `${prompt}, interaction scene, characters working together`
      },
      completion: {
        title: 'Completion Scene',
        description: 'Finished result or celebration',
        keyElements: analysis.objects.concat(analysis.characters),
        composition: 'balanced composition showing completed work',
        prompt: `${prompt}, completion scene, finished result`
      }
    }

    // Select template based on scene index
    const templateKeys = Object.keys(templates)
    const templateKey = templateKeys[sceneIndex % templateKeys.length]
    const baseTemplate = templates[templateKey as keyof typeof templates]

    // Enhance with specific prompt elements
    let enhancedPrompt = baseTemplate.prompt
    
    // Add specific enhancements based on prompt content
    if (lower.includes('dragon') && lower.includes('treehouse')) {
      enhancedPrompt = this.enhanceDragonTreehousePrompt(enhancedPrompt, sceneIndex)
    }
    
    if (lower.includes('car') && lower.includes('highway')) {
      enhancedPrompt = this.enhanceCarHighwayPrompt(enhancedPrompt, sceneIndex)
    }

    return {
      ...baseTemplate,
      prompt: enhancedPrompt
    }
  }

  private enhanceDragonTreehousePrompt(basePrompt: string, sceneIndex: number): string {
    const enhancements = [
      'dragon using fire breath to dry wood',
      'dragon carrying large logs with wings',
      'dragon and children working together on construction',
      'dragon using claws to shape wood pieces',
      'dragon creating fire to forge metal tools',
      'dragon helping children climb up to treehouse',
      'dragon decorating the finished treehouse',
      'dragon teaching children about building',
      'dragon using magic to grow trees',
      'dragon creating a magical entrance',
      'dragon and children celebrating completion',
      'dragon adding final touches to treehouse',
      'dragon creating a slide from treehouse',
      'dragon building a bridge to treehouse',
      'dragon adding windows and doors',
      'dragon creating a rope ladder',
      'dragon building a lookout tower',
      'dragon adding furniture inside treehouse',
      'dragon creating a secret passage',
      'dragon building a zip line',
      'dragon adding a swing set',
      'dragon creating a garden around treehouse',
      'dragon building a water slide',
      'dragon adding a telescope',
      'dragon creating a treasure chest',
      'dragon building a fire pit',
      'dragon adding a flag to treehouse',
      'dragon creating a map room',
      'dragon building a library corner',
      'dragon adding a sleeping area'
    ]

    const enhancement = enhancements[sceneIndex % enhancements.length]
    return `${basePrompt}, ${enhancement}, clean line art, no text, no numbers`
  }

  private enhanceCarHighwayPrompt(basePrompt: string, sceneIndex: number): string {
    const enhancements = [
      'car driving on straight highway',
      'car passing through tunnel',
      'car crossing bridge over river',
      'car driving through mountain pass',
      'car stopping at rest area',
      'car driving through city',
      'car driving through countryside',
      'car driving at sunset',
      'car driving through rain',
      'car driving through snow',
      'car driving through desert',
      'car driving through forest',
      'car driving through construction zone',
      'car driving through toll booth',
      'car driving through gas station',
      'car driving through parking lot',
      'car driving through school zone',
      'car driving through residential area',
      'car driving through business district',
      'car driving through park',
      'car driving through zoo',
      'car driving through amusement park',
      'car driving through airport',
      'car driving through train station',
      'car driving through bus station',
      'car driving through shopping center',
      'car driving through hospital',
      'car driving through police station',
      'car driving through fire station',
      'car driving through library',
      'car driving through museum'
    ]

    const enhancement = enhancements[sceneIndex % enhancements.length]
    return `${basePrompt}, ${enhancement}, clean line art, no text, no numbers`
  }
}

export const advancedPromptAnalysisService = new AdvancedPromptAnalysisService()
