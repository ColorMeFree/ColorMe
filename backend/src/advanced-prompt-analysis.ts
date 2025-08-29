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

    // Step 4: Generate 30 expanded scenes with specific, actionable descriptions
    analysis.expandedScenes = await this.generateSpecificScenes(userPrompt, analysis)

    return analysis
  }

  private extractElements(prompt: string): any {
    const lower = prompt.toLowerCase()
    
    // Enhanced element extraction with context
    const elements: {
      main: string[]
      actions: string[]
      objects: string[]
      characters: string[]
      settings: string[]
      relationships: string[]
    } = {
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
      magical: ['fairy', 'wizard', 'witch', 'unicorn', 'phoenix', 'griffin'],
      dinosaur: ['dinosaur', 'dinosaurs', 't-rex', 'triceratops', 'stegosaurus', 'velociraptor']
    }

    // Action detection with context
    const actionPatterns = {
      building: ['build', 'building', 'construct', 'creating', 'making'],
      helping: ['help', 'helping', 'assist', 'support', 'working together'],
      playing: ['play', 'playing', 'fun', 'enjoy', 'having fun'],
      exploring: ['explore', 'exploring', 'discover', 'adventure', 'journey'],
      flying: ['fly', 'flying', 'soar', 'glide', 'hover'],
      discovering: ['discover', 'discovering', 'find', 'finding', 'encounter'],
      learning: ['learn', 'learning', 'try', 'trying', 'figure out', 'understanding']
    }

    // Object detection with context
    const objectPatterns = {
      building: ['house', 'treehouse', 'castle', 'building', 'structure'],
      technology: ['computer', 'phone', 'smartphone', 'tablet', 'escalator', 'elevator', 'car', 'robot'],
      nature: ['tree', 'flower', 'rock', 'mountain', 'river', 'ocean'],
      tools: ['hammer', 'saw', 'nail', 'screwdriver', 'paintbrush'],
      toys: ['ball', 'doll', 'car', 'toy', 'game']
    }

    // Extract characters
    for (const [category, patterns] of Object.entries(characterPatterns)) {
      for (const pattern of patterns) {
        if (lower.includes(pattern)) {
          elements.characters.push(pattern)
        }
      }
    }

    // Extract actions
    for (const [category, patterns] of Object.entries(actionPatterns)) {
      for (const pattern of patterns) {
        if (lower.includes(pattern)) {
          elements.actions.push(pattern)
        }
      }
    }

    // Extract objects
    for (const [category, patterns] of Object.entries(objectPatterns)) {
      for (const pattern of patterns) {
        if (lower.includes(pattern)) {
          elements.objects.push(pattern)
        }
      }
    }

    // Extract main elements (characters + objects)
    elements.main = [...elements.characters, ...elements.objects]
    
    // Extract settings (environmental context)
    elements.settings = this.extractSettings(lower)
    
    // Extract relationships
    elements.relationships = this.extractRelationships(lower)

    return elements
  }

  private extractSettings(prompt: string): string[] {
    const settings = []
    
    if (prompt.includes('treehouse') || prompt.includes('tree house')) settings.push('treehouse')
    if (prompt.includes('castle')) settings.push('castle')
    if (prompt.includes('underwater') || prompt.includes('ocean')) settings.push('underwater')
    if (prompt.includes('space') || prompt.includes('outer space')) settings.push('space')
    if (prompt.includes('jungle') || prompt.includes('forest')) settings.push('jungle')
    if (prompt.includes('city') || prompt.includes('urban')) settings.push('city')
    if (prompt.includes('farm') || prompt.includes('rural')) settings.push('farm')
    if (prompt.includes('school') || prompt.includes('classroom')) settings.push('school')
    if (prompt.includes('home') || prompt.includes('house')) settings.push('home')
    
    return settings
  }

  private extractRelationships(prompt: string): string[] {
    const relationships = []
    
    if (prompt.includes('helping') || prompt.includes('help')) relationships.push('helping')
    if (prompt.includes('working together') || prompt.includes('teamwork')) relationships.push('working together')
    if (prompt.includes('teaching') || prompt.includes('learning')) relationships.push('teaching')
    if (prompt.includes('playing') || prompt.includes('fun')) relationships.push('playing')
    if (prompt.includes('exploring') || prompt.includes('discovering')) relationships.push('exploring')
    
    return relationships
  }

  private generateStyleGuidelines(prompt: string): string[] {
    const guidelines = [
      'thick black outlines for coloring book style',
      'simple, clean line art',
      'no shading or gradients',
      'clear separation between elements',
      'child-friendly and educational',
      'balanced composition',
      'no text, numbers, or letters',
      'clear focal points'
    ]

    // Add specific guidelines based on prompt content
    const lower = prompt.toLowerCase()
    
    if (lower.includes('dinosaur') && lower.includes('technology')) {
      guidelines.push('dinosaurs interacting with specific technology items')
      guidelines.push('technology items clearly visible and recognizable')
      guidelines.push('dinosaurs showing curiosity and wonder')
    }
    
    if (lower.includes('dragon') && lower.includes('treehouse')) {
      guidelines.push('dragon using specific building tools and methods')
      guidelines.push('treehouse construction details clearly shown')
      guidelines.push('dragon and children working together on specific tasks')
    }

    return guidelines
  }

  // NEW: Generate specific, actionable scenes instead of abstract templates
  private async generateSpecificScenes(prompt: string, analysis: PromptAnalysis): Promise<SceneDescription[]> {
    const scenes: SceneDescription[] = []
    const lower = prompt.toLowerCase()
    
    // Generate 30 specific, actionable scenes
    for (let i = 0; i < 30; i++) {
      let specificPrompt = ''
      
      if (lower.includes('dinosaur') && (lower.includes('computer') || lower.includes('technology') || lower.includes('phone') || lower.includes('escalator') || lower.includes('robot') || lower.includes('car') || lower.includes('tv') || lower.includes('screen'))) {
        specificPrompt = this.generateDinosaurTechnologyScene(prompt, i)
      } else if (lower.includes('dragon') && lower.includes('treehouse')) {
        specificPrompt = this.generateDragonTreehouseScene(prompt, i)
      } else if (lower.includes('car') && lower.includes('highway')) {
        specificPrompt = this.generateCarHighwayScene(prompt, i)
      } else {
        // Generic specific scene generation
        specificPrompt = this.generateGenericSpecificScene(prompt, analysis, i)
      }
      
      scenes.push({
        sceneNumber: i + 1,
        title: `Scene ${i + 1}`,
        description: specificPrompt,
        keyElements: analysis.mainElements,
        composition: 'balanced composition with clear focal point',
        style: 'coloring book line art',
        prompt: specificPrompt
      })
    }

    return scenes
  }

  // NEW: Generate specific dinosaur technology interaction scenes
  private generateDinosaurTechnologyScene(basePrompt: string, sceneIndex: number): string {
    const technologyItems = [
      'desktop computer with glowing screen',
      'smartphone with bright display',
      'escalator moving up and down',
      'elevator with buttons',
      'robot with moving parts',
      'tablet with touch screen',
      'car with steering wheel',
      'television with remote control',
      'microwave with digital display',
      'refrigerator with handle',
      'washing machine with door',
      'dishwasher with buttons',
      'toaster with lever',
      'blender with jar',
      'coffee maker with pot',
      'laptop with keyboard',
      'gaming console with controller',
      'headphones with cord',
      'camera with lens',
      'printer with paper',
      'scanner with glass',
      'keyboard with keys',
      'mouse with cord',
      'monitor with stand',
      'speakers with sound waves',
      'microphone with stand',
      'projector with light beam',
      'drone with propellers',
      'smart watch with screen'
    ]

    const dinosaurActions = [
      'dinosaur touching [technology] with claw',
      'dinosaur looking at [technology] with curiosity',
      'dinosaur trying to use [technology] with confusion',
      'dinosaur scared by [technology] moving',
      'dinosaur amazed by [technology] lighting up',
      'dinosaur learning to operate [technology]',
      'dinosaur discovering [technology] for first time',
      'dinosaur investigating [technology] carefully',
      'dinosaur playing with [technology] buttons',
      'dinosaur watching [technology] work',
      'dinosaur helping other dinosaur use [technology]',
      'dinosaur teaching about [technology]',
      'dinosaur fixing [technology] problem',
      'dinosaur creating new [technology]',
      'dinosaur exploring [technology] features',
      'dinosaur showing [technology] to friends',
      'dinosaur comparing different [technology]',
      'dinosaur organizing [technology] collection',
      'dinosaur protecting [technology] from damage',
      'dinosaur sharing [technology] with others',
      'dinosaur celebrating [technology] success',
      'dinosaur troubleshooting [technology] issue',
      'dinosaur upgrading [technology] parts',
      'dinosaur customizing [technology] appearance',
      'dinosaur demonstrating [technology] to others',
      'dinosaur experimenting with [technology]',
      'dinosaur documenting [technology] usage',
      'dinosaur planning [technology] improvements',
      'dinosaur collaborating on [technology] project'
    ]

    const techItem = technologyItems[sceneIndex % technologyItems.length]
    const action = dinosaurActions[sceneIndex % dinosaurActions.length]
    
    return action.replace('[technology]', techItem)
  }

  // NEW: Generate specific dragon treehouse building scenes
  private generateDragonTreehouseScene(basePrompt: string, sceneIndex: number): string {
    const buildingActions = [
      'dragon using fire breath to dry wet wood',
      'dragon carrying large logs with wings spread',
      'dragon and children hammering nails together',
      'dragon using claws to shape wood pieces',
      'dragon creating fire to forge metal tools',
      'dragon helping children climb up to treehouse',
      'dragon decorating finished treehouse with flags',
      'dragon teaching children about building safety',
      'dragon using magic to grow strong trees',
      'dragon creating magical entrance with sparkles',
      'dragon and children celebrating completion',
      'dragon adding final touches to treehouse',
      'dragon creating slide from treehouse to ground',
      'dragon building bridge to treehouse entrance',
      'dragon adding windows and doors to treehouse',
      'dragon creating rope ladder for climbing',
      'dragon building lookout tower on top',
      'dragon adding furniture inside treehouse',
      'dragon creating secret passage behind tree',
      'dragon building zip line to other trees',
      'dragon adding swing set under treehouse',
      'dragon creating garden around treehouse',
      'dragon building water slide from treehouse',
      'dragon adding telescope for stargazing',
      'dragon creating rope bridge between trees',
      'dragon building storage shelves inside',
      'dragon adding hammock for relaxing',
      'dragon creating fire pit near treehouse',
      'dragon building climbing wall on tree trunk',
      'dragon adding wind chimes to branches'
    ]

    return buildingActions[sceneIndex % buildingActions.length]
  }

  // NEW: Generate specific car highway scenes
  private generateCarHighwayScene(basePrompt: string, sceneIndex: number): string {
    const carActions = [
      'car driving fast on straight highway',
      'car changing lanes with turn signal',
      'car passing slower vehicles safely',
      'car merging onto highway from ramp',
      'car exiting highway at off-ramp',
      'car driving through highway tunnel',
      'car crossing highway bridge over river',
      'car driving past highway rest stop',
      'car driving through highway construction zone',
      'car driving in highway carpool lane',
      'car driving past highway exit signs',
      'car driving through highway toll booth',
      'car driving past highway patrol car',
      'car driving through highway rain storm',
      'car driving past highway billboards',
      'car driving through highway mountain pass',
      'car driving past highway gas stations',
      'car driving through highway traffic jam',
      'car driving past highway emergency vehicles',
      'car driving through highway snow storm',
      'car driving past highway truck stops',
      'car driving through highway fog bank',
      'car driving past highway scenic overlook',
      'car driving through highway speed trap',
      'car driving past highway service centers',
      'car driving through highway night driving',
      'car driving past highway wildlife crossing',
      'car driving through highway wind gusts',
      'car driving past highway mile markers'
    ]

    return carActions[sceneIndex % carActions.length]
  }

  // NEW: Generate generic specific scenes for other prompts
  private generateGenericSpecificScene(prompt: string, analysis: PromptAnalysis, sceneIndex: number): string {
    const characters = analysis.characters
    const objects = analysis.objects
    const actions = analysis.actions
    
    if (characters.length === 0 || objects.length === 0) {
      return `${prompt}, specific action scene ${sceneIndex + 1}`
    }

    const character = characters[sceneIndex % characters.length]
    const object = objects[sceneIndex % objects.length]
    const action = actions[sceneIndex % actions.length] || 'interacting with'
    
    return `${character} ${action} ${object} in specific detail`
  }

  // Legacy methods for backward compatibility
  private async generateExpandedScenes(prompt: string, analysis: PromptAnalysis): Promise<SceneDescription[]> {
    return this.generateSpecificScenes(prompt, analysis)
  }

  private createIntelligentScene(prompt: string, analysis: PromptAnalysis, sceneIndex: number): SceneDescription {
    const variations = this.generateSceneVariations(prompt, analysis, sceneIndex)
    
    const scene: SceneDescription = {
      sceneNumber: sceneIndex + 1,
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
      'dragon creating a rope bridge',
      'dragon building storage shelves',
      'dragon adding a hammock',
      'dragon creating a fire pit',
      'dragon building a climbing wall',
      'dragon adding wind chimes'
    ]

    return enhancements[sceneIndex % enhancements.length]
  }

  private enhanceCarHighwayPrompt(basePrompt: string, sceneIndex: number): string {
    const enhancements = [
      'car driving fast on straight highway',
      'car changing lanes with turn signal',
      'car passing slower vehicles safely',
      'car merging onto highway from ramp',
      'car exiting highway at off-ramp',
      'car driving through highway tunnel',
      'car crossing highway bridge over river',
      'car driving past highway rest stop',
      'car driving through highway construction zone',
      'car driving in highway carpool lane',
      'car driving past highway exit signs',
      'car driving through highway toll booth',
      'car driving past highway patrol car',
      'car driving through highway rain storm',
      'car driving past highway billboards',
      'car driving through highway mountain pass',
      'car driving past highway gas stations',
      'car driving through highway traffic jam',
      'car driving past highway emergency vehicles',
      'car driving through highway snow storm',
      'car driving past highway truck stops',
      'car driving through highway fog bank',
      'car driving past highway scenic overlook',
      'car driving through highway speed trap',
      'car driving past highway service centers',
      'car driving through highway night driving',
      'car driving past highway wildlife crossing',
      'car driving through highway wind gusts',
      'car driving past highway mile markers'
    ]

    return enhancements[sceneIndex % enhancements.length]
  }
}

export const advancedPromptAnalysisService = new AdvancedPromptAnalysisService()
