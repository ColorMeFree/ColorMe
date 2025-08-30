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
    
    // Generate 4 specific, actionable scenes (not 30!)
    for (let i = 0; i < 4; i++) {
      let specificPrompt = ''
      
      // Use optimized prompt enhancement system
      specificPrompt = this.enhancePromptForStability(prompt)
      
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

  // ENHANCED: Semantic word database with direct recognition only (no bidirectional associations)
  private getRecognizedWords(prompt: string): string[] {
    const lower = prompt.toLowerCase()
    const recognizedWords: string[] = []
    
    // Check for direct word matches only (no associations)
    const semanticAssociations = {
      // Space & Astronomy (15 words + associations)
      'spaceship': ['shuttle', 'rocket', 'meteor', 'stars', 'planet', 'moon', 'aliens', 'galaxy', 'comet', 'asteroid', 'satellite', 'orbit', 'cosmos', 'nebula', 'black hole'],
      'moon': ['spaceship', 'stars', 'planet', 'meteor', 'night', 'crater', 'astronaut', 'telescope', 'space', 'rocket', 'alien', 'galaxy', 'comet', 'satellite', 'orbit'],
      'stars': ['moon', 'spaceship', 'planet', 'night', 'galaxy', 'telescope', 'space', 'meteor', 'comet', 'nebula', 'cosmos', 'astronaut', 'rocket', 'alien', 'satellite'],
      'planet': ['spaceship', 'moon', 'stars', 'galaxy', 'alien', 'meteor', 'comet', 'orbit', 'space', 'rocket', 'telescope', 'satellite', 'nebula', 'cosmos', 'astronaut'],
      'alien': ['spaceship', 'planet', 'moon', 'stars', 'galaxy', 'meteor', 'comet', 'space', 'rocket', 'telescope', 'satellite', 'nebula', 'cosmos', 'astronaut', 'orbit'],
      
      // Ocean & Marine (15 words + associations)
      'ocean': ['fish', 'whale', 'dolphin', 'shark', 'octopus', 'crab', 'lobster', 'boat', 'ship', 'beach', 'island', 'underwater', 'coral', 'seaweed', 'pearl'],
      'fish': ['ocean', 'whale', 'dolphin', 'shark', 'octopus', 'crab', 'lobster', 'boat', 'ship', 'beach', 'island', 'underwater', 'coral', 'seaweed', 'pearl'],
      'whale': ['ocean', 'fish', 'dolphin', 'shark', 'octopus', 'boat', 'ship', 'beach', 'island', 'underwater', 'coral', 'seaweed', 'pearl', 'wave', 'splash'],
      'dolphin': ['ocean', 'fish', 'whale', 'shark', 'octopus', 'boat', 'ship', 'beach', 'island', 'underwater', 'coral', 'seaweed', 'pearl', 'wave', 'splash'],
      'beach': ['ocean', 'fish', 'whale', 'dolphin', 'shark', 'boat', 'ship', 'island', 'sand', 'shell', 'wave', 'splash', 'coral', 'seaweed', 'pearl'],
      
      // Forest & Nature (15 words + associations)
      'tree': ['forest', 'bird', 'squirrel', 'owl', 'eagle', 'hawk', 'nest', 'leaf', 'branch', 'acorn', 'pinecone', 'woodpecker', 'deer', 'fox', 'bear'],
      'forest': ['tree', 'bird', 'squirrel', 'owl', 'eagle', 'hawk', 'nest', 'leaf', 'branch', 'acorn', 'pinecone', 'woodpecker', 'deer', 'fox', 'bear'],
      'bird': ['tree', 'forest', 'squirrel', 'owl', 'eagle', 'hawk', 'nest', 'leaf', 'branch', 'acorn', 'pinecone', 'woodpecker', 'wing', 'feather', 'beak'],
      'squirrel': ['tree', 'forest', 'bird', 'owl', 'eagle', 'hawk', 'nest', 'leaf', 'branch', 'acorn', 'pinecone', 'woodpecker', 'deer', 'fox', 'bear'],
      'owl': ['tree', 'forest', 'bird', 'squirrel', 'eagle', 'hawk', 'nest', 'leaf', 'branch', 'acorn', 'pinecone', 'woodpecker', 'night', 'moon', 'stars'],
      
      // Farm & Agriculture (15 words + associations)
      'farm': ['cow', 'pig', 'sheep', 'chicken', 'duck', 'horse', 'tractor', 'barn', 'hay', 'corn', 'wheat', 'farmer', 'field', 'fence', 'gate'],
      'cow': ['farm', 'pig', 'sheep', 'chicken', 'duck', 'horse', 'tractor', 'barn', 'hay', 'corn', 'wheat', 'farmer', 'field', 'fence', 'gate'],
      'pig': ['farm', 'cow', 'sheep', 'chicken', 'duck', 'horse', 'tractor', 'barn', 'hay', 'corn', 'wheat', 'farmer', 'field', 'fence', 'gate'],
      'sheep': ['farm', 'cow', 'pig', 'chicken', 'duck', 'horse', 'tractor', 'barn', 'hay', 'corn', 'wheat', 'farmer', 'field', 'fence', 'gate'],
      'tractor': ['farm', 'cow', 'pig', 'sheep', 'chicken', 'duck', 'horse', 'barn', 'hay', 'corn', 'wheat', 'farmer', 'field', 'fence', 'gate'],
      
      // City & Urban (15 words + associations)
      'city': ['car', 'truck', 'bus', 'train', 'building', 'house', 'skyscraper', 'street', 'traffic light', 'crosswalk', 'park', 'playground', 'library', 'store', 'restaurant'],
      'building': ['city', 'car', 'truck', 'bus', 'train', 'house', 'skyscraper', 'street', 'traffic light', 'crosswalk', 'park', 'playground', 'library', 'store', 'restaurant'],
      'house': ['city', 'car', 'truck', 'bus', 'train', 'building', 'skyscraper', 'street', 'traffic light', 'crosswalk', 'park', 'playground', 'library', 'store', 'restaurant'],
      'street': ['city', 'car', 'truck', 'bus', 'train', 'building', 'house', 'skyscraper', 'traffic light', 'crosswalk', 'park', 'playground', 'library', 'store', 'restaurant'],
      'car': ['city', 'truck', 'bus', 'train', 'building', 'house', 'skyscraper', 'street', 'traffic light', 'crosswalk', 'park', 'playground', 'library', 'store', 'restaurant'],
      
      // School & Learning (15 words + associations)
      'school': ['teacher', 'student', 'book', 'pencil', 'crayon', 'paper', 'backpack', 'lunchbox', 'desk', 'chair', 'blackboard', 'library', 'playground', 'bus', 'friend'],
      'teacher': ['school', 'student', 'book', 'pencil', 'crayon', 'paper', 'backpack', 'lunchbox', 'desk', 'chair', 'blackboard', 'library', 'playground', 'bus', 'friend'],
      'book': ['school', 'teacher', 'student', 'pencil', 'crayon', 'paper', 'backpack', 'lunchbox', 'desk', 'chair', 'blackboard', 'library', 'playground', 'bus', 'friend'],
      'pencil': ['school', 'teacher', 'student', 'book', 'crayon', 'paper', 'backpack', 'lunchbox', 'desk', 'chair', 'blackboard', 'library', 'playground', 'bus', 'friend'],
      'student': ['school', 'teacher', 'book', 'pencil', 'crayon', 'paper', 'backpack', 'lunchbox', 'desk', 'chair', 'blackboard', 'library', 'playground', 'bus', 'friend'],
      
      // Home & Family (15 words + associations)
      'home': ['mom', 'dad', 'family', 'baby', 'sister', 'brother', 'grandma', 'grandpa', 'house', 'kitchen', 'bedroom', 'living room', 'bathroom', 'garden', 'pet'],
      'mom': ['home', 'dad', 'family', 'baby', 'sister', 'brother', 'grandma', 'grandpa', 'house', 'kitchen', 'bedroom', 'living room', 'bathroom', 'garden', 'pet'],
      'dad': ['home', 'mom', 'family', 'baby', 'sister', 'brother', 'grandma', 'grandpa', 'house', 'kitchen', 'bedroom', 'living room', 'bathroom', 'garden', 'pet'],
      'family': ['home', 'mom', 'dad', 'baby', 'sister', 'brother', 'grandma', 'grandpa', 'house', 'kitchen', 'bedroom', 'living room', 'bathroom', 'garden', 'pet'],
      'baby': ['home', 'mom', 'dad', 'family', 'sister', 'brother', 'grandma', 'grandpa', 'house', 'kitchen', 'bedroom', 'living room', 'bathroom', 'garden', 'pet'],
      
      // Weather & Seasons (15 words + associations)
      'rain': ['umbrella', 'rainbow', 'puddle', 'cloud', 'storm', 'thunder', 'lightning', 'wet', 'muddy', 'splash', 'boots', 'coat', 'wind', 'cold', 'gray'],
      'snow': ['winter', 'cold', 'ice', 'snowman', 'snowball', 'sled', 'ski', 'boots', 'coat', 'mittens', 'scarf', 'hat', 'white', 'frost', 'freezing'],
      'sun': ['summer', 'hot', 'warm', 'bright', 'yellow', 'orange', 'beach', 'park', 'outdoor', 'shade', 'sunglasses', 'hat', 'ice cream', 'swimming', 'picnic'],
      'cloud': ['rain', 'storm', 'thunder', 'lightning', 'gray', 'sky', 'wind', 'cold', 'wet', 'puddle', 'umbrella', 'rainbow', 'muddy', 'splash', 'boots'],
      'storm': ['rain', 'cloud', 'thunder', 'lightning', 'wind', 'dark', 'gray', 'wet', 'puddle', 'umbrella', 'rainbow', 'muddy', 'splash', 'boots', 'coat'],
      
      // Transportation (15 words + associations)
      'train': ['track', 'station', 'ticket', 'passenger', 'conductor', 'railroad', 'tunnel', 'bridge', 'platform', 'schedule', 'commute', 'travel', 'journey', 'destination', 'arrival'],
      'airplane': ['sky', 'cloud', 'pilot', 'passenger', 'flight', 'airport', 'runway', 'wing', 'engine', 'seat', 'window', 'travel', 'journey', 'destination', 'arrival'],
      'boat': ['water', 'ocean', 'lake', 'river', 'sail', 'captain', 'crew', 'passenger', 'deck', 'anchor', 'rope', 'fishing', 'swimming', 'wave', 'splash'],
      'bicycle': ['road', 'path', 'rider', 'wheel', 'pedal', 'handlebar', 'seat', 'helmet', 'basket', 'bell', 'chain', 'tire', 'brake', 'speed', 'exercise'],
      'truck': ['road', 'highway', 'driver', 'cargo', 'delivery', 'transport', 'engine', 'wheel', 'horn', 'mirror', 'windshield', 'tire', 'brake', 'speed', 'work'],
      
      // Sports & Recreation (15 words + associations)
      'ball': ['game', 'play', 'sport', 'team', 'player', 'field', 'court', 'goal', 'score', 'win', 'lose', 'practice', 'coach', 'uniform', 'trophy'],
      'game': ['ball', 'play', 'sport', 'team', 'player', 'field', 'court', 'goal', 'score', 'win', 'lose', 'practice', 'coach', 'uniform', 'trophy'],
      'play': ['ball', 'game', 'sport', 'team', 'player', 'field', 'court', 'goal', 'score', 'win', 'lose', 'practice', 'coach', 'uniform', 'trophy'],
      'sport': ['ball', 'game', 'play', 'team', 'player', 'field', 'court', 'goal', 'score', 'win', 'lose', 'practice', 'coach', 'uniform', 'trophy'],
      'team': ['ball', 'game', 'play', 'sport', 'player', 'field', 'court', 'goal', 'score', 'win', 'lose', 'practice', 'coach', 'uniform', 'trophy'],
      
      // Food & Cooking (15 words + associations)
      'pizza': ['cheese', 'tomato', 'pepperoni', 'mushroom', 'oven', 'kitchen', 'restaurant', 'delivery', 'slice', 'crust', 'sauce', 'topping', 'hot', 'delicious', 'dinner'],
      'cake': ['birthday', 'party', 'candle', 'frosting', 'sprinkle', 'sweet', 'dessert', 'celebration', 'happy', 'gift', 'balloon', 'present', 'friend', 'family', 'chocolate'],
      'ice cream': ['cold', 'sweet', 'dessert', 'cone', 'sprinkle', 'chocolate', 'vanilla', 'strawberry', 'summer', 'hot', 'refreshing', 'delicious', 'treat', 'party', 'celebration'],
      'apple': ['fruit', 'red', 'green', 'yellow', 'sweet', 'healthy', 'snack', 'pie', 'juice', 'cider', 'orchard', 'tree', 'fall', 'autumn', 'harvest'],
      'banana': ['fruit', 'yellow', 'sweet', 'healthy', 'snack', 'monkey', 'peel', 'smoothie', 'bread', 'pancake', 'tropical', 'energy', 'potassium', 'breakfast', 'lunch'],
      
      // Magic & Fantasy (15 words + associations)
      'dragon': ['fire', 'wings', 'scales', 'magic', 'castle', 'knight', 'princess', 'treasure', 'cave', 'mountain', 'flying', 'breathing', 'sword', 'shield', 'adventure'],
      'fairy': ['wings', 'magic', 'sparkle', 'flower', 'garden', 'forest', 'wand', 'spell', 'princess', 'castle', 'flying', 'glitter', 'pixie', 'dust', 'enchantment'],
      'wizard': ['magic', 'spell', 'wand', 'hat', 'robe', 'castle', 'dragon', 'princess', 'knight', 'treasure', 'cave', 'mountain', 'adventure', 'potion', 'book'],
      'unicorn': ['magic', 'horn', 'rainbow', 'sparkle', 'flying', 'forest', 'garden', 'flower', 'princess', 'castle', 'fairy', 'wings', 'glitter', 'pixie', 'dust'],
      'castle': ['dragon', 'knight', 'princess', 'wizard', 'fairy', 'unicorn', 'treasure', 'cave', 'mountain', 'adventure', 'magic', 'spell', 'wand', 'sword', 'shield'],
      
      // Science & Technology (15 words + associations)
      'robot': ['computer', 'machine', 'technology', 'science', 'laboratory', 'inventor', 'scientist', 'experiment', 'tool', 'gear', 'wire', 'battery', 'program', 'code', 'future'],
      'computer': ['robot', 'machine', 'technology', 'science', 'laboratory', 'inventor', 'scientist', 'experiment', 'tool', 'gear', 'wire', 'battery', 'program', 'code', 'future'],
      'science': ['robot', 'computer', 'machine', 'technology', 'laboratory', 'inventor', 'scientist', 'experiment', 'tool', 'gear', 'wire', 'battery', 'program', 'code', 'future'],
      'experiment': ['robot', 'computer', 'machine', 'technology', 'science', 'laboratory', 'inventor', 'scientist', 'tool', 'gear', 'wire', 'battery', 'program', 'code', 'future'],
      'laboratory': ['robot', 'computer', 'machine', 'technology', 'science', 'inventor', 'scientist', 'experiment', 'tool', 'gear', 'wire', 'battery', 'program', 'code', 'future']
    }
    
         // Check for direct word matches only (no associations added)
     for (const [word, associations] of Object.entries(semanticAssociations)) {
       if (lower.includes(word)) {
         recognizedWords.push(word)
         // REMOVED: No longer adding associated words to avoid contamination
       }
     }
    
    // Also check the original word database categories
    const wordDatabase = {
      // Animals (50 words)
      animals: [
        'cat', 'dog', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'chicken', 'duck',
        'rabbit', 'mouse', 'hamster', 'guinea pig', 'turtle', 'frog', 'snake', 'lizard',
        'elephant', 'giraffe', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer', 'moose',
        'zebra', 'monkey', 'gorilla', 'penguin', 'owl', 'eagle', 'hawk', 'parrot',
        'dolphin', 'whale', 'shark', 'octopus', 'crab', 'lobster', 'butterfly', 'bee',
        'ant', 'spider', 'dragonfly', 'ladybug', 'caterpillar', 'snail', 'worm', 'bat'
      ],
      
      // Objects (50 words)
      objects: [
        'house', 'car', 'truck', 'bus', 'train', 'airplane', 'helicopter', 'boat', 'ship',
        'bicycle', 'skateboard', 'scooter', 'ball', 'doll', 'teddy bear', 'robot', 'dinosaur',
        'castle', 'tower', 'bridge', 'tree', 'flower', 'grass', 'rock', 'mountain', 'river',
        'lake', 'ocean', 'beach', 'island', 'cloud', 'sun', 'moon', 'star', 'rainbow',
        'book', 'pencil', 'crayon', 'paper', 'backpack', 'lunchbox', 'umbrella', 'hat',
        'shoes', 'shirt', 'pants', 'dress', 'coat', 'scarf', 'mittens', 'boots'
      ],
      
      // Actions (50 words)
      actions: [
        'running', 'walking', 'jumping', 'dancing', 'singing', 'playing', 'reading', 'writing',
        'drawing', 'painting', 'building', 'cooking', 'eating', 'drinking', 'sleeping', 'waking',
        'flying', 'swimming', 'climbing', 'sliding', 'swinging', 'riding', 'driving', 'fishing',
        'gardening', 'cleaning', 'washing', 'brushing', 'combing', 'tying', 'zipping', 'buttoning',
        'opening', 'closing', 'pushing', 'pulling', 'lifting', 'carrying', 'throwing', 'catching',
        'kicking', 'hitting', 'bouncing', 'rolling', 'spinning', 'twisting', 'bending', 'stretching',
        'waving', 'pointing', 'clapping', 'hugging'
      ],
      
      // Places (30 words)
      places: [
        'home', 'school', 'park', 'playground', 'zoo', 'museum', 'library', 'store', 'market',
        'restaurant', 'hospital', 'fire station', 'police station', 'post office', 'bank',
        'farm', 'forest', 'jungle', 'desert', 'arctic', 'space', 'moon', 'mars', 'underwater',
        'cave', 'volcano', 'waterfall', 'canyon', 'valley', 'meadow'
      ],
      
      // Colors (20 words)
      colors: [
        'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
        'gray', 'gold', 'silver', 'rainbow', 'multicolored', 'bright', 'dark', 'light', 'neon', 'pastel'
      ],
      
      // Weather (20 words)
      weather: [
        'sunny', 'rainy', 'snowy', 'cloudy', 'windy', 'stormy', 'foggy', 'hot', 'cold', 'warm',
        'cool', 'dry', 'wet', 'icy', 'slippery', 'muddy', 'dusty', 'breezy', 'calm', 'wild'
      ],
      
      // Emotions (20 words)
      emotions: [
        'happy', 'sad', 'angry', 'scared', 'surprised', 'excited', 'tired', 'sleepy', 'hungry',
        'thirsty', 'sick', 'healthy', 'strong', 'weak', 'brave', 'shy', 'friendly', 'lonely',
        'proud', 'embarrassed'
      ],
      
      // Family (20 words)
      family: [
        'mom', 'dad', 'mother', 'father', 'sister', 'brother', 'baby', 'grandma', 'grandpa',
        'aunt', 'uncle', 'cousin', 'family', 'parents', 'children', 'kids', 'boy', 'girl',
        'friend', 'teacher'
      ],
      
      // Food (20 words)
      food: [
        'apple', 'banana', 'orange', 'pizza', 'hamburger', 'hot dog', 'ice cream', 'cake',
        'cookie', 'bread', 'milk', 'juice', 'water', 'soup', 'salad', 'sandwich', 'chicken',
        'fish', 'vegetables', 'fruits'
      ],
      
      // Toys (20 words)
      toys: [
        'blocks', 'puzzle', 'game', 'cards', 'dice', 'marbles', 'jacks', 'hopscotch', 'tag',
        'hide and seek', 'lego', 'playdough', 'bubbles', 'kite', 'balloon', 'stuffed animal',
        'action figure', 'dollhouse', 'play kitchen', 'tool set'
      ],

      // NEW: Professions & Jobs (20 words)
      professions: [
        'doctor', 'nurse', 'teacher', 'firefighter', 'police officer', 'chef', 'artist', 'musician',
        'scientist', 'engineer', 'builder', 'farmer', 'pilot', 'driver', 'mail carrier', 'librarian',
        'dentist', 'veterinarian', 'mechanic', 'gardener'
      ],

      // NEW: Buildings & Structures (20 words)
      buildings: [
        'hospital', 'school', 'library', 'museum', 'store', 'restaurant', 'bank', 'post office',
        'fire station', 'police station', 'gas station', 'hotel', 'church', 'temple', 'mosque',
        'synagogue', 'stadium', 'theater', 'cinema', 'mall'
      ],

      // NEW: Nature & Environment (20 words)
      nature: [
        'mountain', 'hill', 'valley', 'canyon', 'cliff', 'cave', 'volcano', 'waterfall', 'river',
        'stream', 'pond', 'lake', 'ocean', 'beach', 'island', 'desert', 'forest', 'jungle',
        'meadow', 'grassland'
      ],

      // NEW: Seasons & Time (20 words)
      seasons: [
        'spring', 'summer', 'fall', 'autumn', 'winter', 'morning', 'afternoon', 'evening', 'night',
        'dawn', 'dusk', 'midnight', 'noon', 'today', 'tomorrow', 'yesterday', 'week', 'month',
        'year', 'birthday'
      ],

      // NEW: Body Parts (20 words)
      bodyParts: [
        'head', 'face', 'eyes', 'nose', 'mouth', 'ears', 'hair', 'arms', 'hands', 'fingers',
        'legs', 'feet', 'toes', 'back', 'stomach', 'heart', 'brain', 'teeth', 'tongue', 'neck'
      ],

      // NEW: Clothing & Fashion (20 words)
      clothing: [
        'shirt', 'pants', 'dress', 'skirt', 'jacket', 'coat', 'sweater', 'socks', 'shoes', 'boots',
        'hat', 'cap', 'scarf', 'gloves', 'mittens', 'belt', 'tie', 'bow tie', 'jewelry', 'watch'
      ],

      // NEW: Numbers & Math (20 words)
      numbers: [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
        'nineteen', 'twenty'
      ],

      // NEW: Shapes & Geometry (20 words)
      shapes: [
        'circle', 'square', 'triangle', 'rectangle', 'oval', 'diamond', 'star', 'heart', 'cross',
        'line', 'curve', 'angle', 'point', 'edge', 'corner', 'side', 'top', 'bottom', 'front', 'back'
      ],

      // NEW: Sounds & Music (20 words)
      sounds: [
        'music', 'song', 'melody', 'rhythm', 'beat', 'drum', 'guitar', 'piano', 'violin', 'flute',
        'trumpet', 'saxophone', 'harmonica', 'whistle', 'bell', 'chime', 'echo', 'noise', 'silence', 'voice'
      ]
    }
    
    // Check each category for recognized words
    for (const [category, words] of Object.entries(wordDatabase)) {
      for (const word of words) {
        if (lower.includes(word)) {
          recognizedWords.push(word)
        }
      }
    }
    
         // Return only the directly recognized words (no associations)
     return [...new Set(recognizedWords)]
  }

  // NEW: Generate specific scenes from recognized words
  private generateSpecificSceneFromWords(words: string[], sceneIndex: number): string {
    const actions = [
      'playing with',
      'exploring',
      'discovering',
      'learning about',
      'investigating',
      'experimenting with',
      'sharing',
      'creating',
      'protecting',
      'celebrating',
      'teaching about',
      'solving problems with',
      'building',
      'traveling to',
      'finding',
      'using',
      'organizing',
      'repairing',
      'upgrading',
      'customizing',
      'demonstrating',
      'collaborating on',
      'planning',
      'documenting',
      'comparing',
      'testing',
      'maintaining',
      'storing',
      'transporting',
      'displaying'
    ]
    
    const emotions = [
      'with joy',
      'with curiosity',
      'with excitement',
      'with wonder',
      'with care',
      'with creativity',
      'with friends',
      'with imagination',
      'from harm',
      'with happiness',
      'to others',
      'cleverly',
      'carefully',
      'in unexpected places',
      'for helpful purposes',
      'neatly',
      'with attention',
      'with improvements',
      'with style',
      'to others',
      'together',
      'adventurously',
      'thoroughly',
      'evaluatively',
      'experimentally',
      'properly',
      'safely',
      'carefully',
      'proudly'
    ]
    
    // Select words for this scene
    const word1 = words[sceneIndex % words.length]
    const word2 = words[(sceneIndex + 1) % words.length]
    const action = actions[sceneIndex % actions.length]
    const emotion = emotions[sceneIndex % emotions.length]
    
    return `${action} ${word1} and ${word2} ${emotion}`
  }

  // NEW: Optimized prompt enhancement for Stability AI
  private enhancePromptForStability(userPrompt: string): string {
    const lower = userPrompt.toLowerCase()
    
    // Step 1: Our interpretation using word database
    const recognizedWords = this.getRecognizedWords(userPrompt)
    const ourInterpretation = this.createOurInterpretation(userPrompt, recognizedWords)
    
    // Step 2: Stability AI enhancement rules
    const stabilityEnhancement = this.createStabilityEnhancement(ourInterpretation, lower)
    
    // Debug logging to see what's happening
    console.log('Original prompt:', userPrompt)
    console.log('Recognized words:', recognizedWords)
    console.log('Our interpretation:', ourInterpretation)
    console.log('Final prompt:', stabilityEnhancement)
    
    return stabilityEnhancement
  }

  // Step 1: Our interpretation using word database
  private createOurInterpretation(userPrompt: string, recognizedWords: string[]): string {
    if (recognizedWords.length === 0) {
      // Better fallback: preserve original prompt instead of defaulting to cars
      return `${userPrompt}, detailed coloring book illustration, clean black line art`
    }

    // Select key words for interpretation
    const primaryWord = recognizedWords[0]
    const secondaryWord = recognizedWords[1] || recognizedWords[0]
     
     // Create rich interpretation
     const interpretations = [
       `${primaryWord} with detailed ${secondaryWord} elements`,
       `${primaryWord} featuring intricate ${secondaryWord} patterns`,
       `${primaryWord} showcasing beautiful ${secondaryWord} designs`,
       `${primaryWord} with elaborate ${secondaryWord} details`,
       `${primaryWord} displaying complex ${secondaryWord} structures`,
       `${primaryWord} with artistic ${secondaryWord} compositions`,
       `${primaryWord} featuring elegant ${secondaryWord} arrangements`,
       `${primaryWord} with sophisticated ${secondaryWord} layouts`
     ]
     
     return interpretations[Math.floor(Math.random() * interpretations.length)]
   }

   // Step 2: Stability AI enhancement with specific rules
   private createStabilityEnhancement(ourInterpretation: string, originalPrompt: string): string {
     // Base enhancement
     let enhanced = ourInterpretation
     
     // Add specific Stability AI instructions
     enhanced += ", detailed coloring book illustration"
     
     // Add style specifications
     enhanced += ", clean black line art"
     enhanced += ", simple outlines"
     enhanced += ", no shading or gradients"
     enhanced += ", child-friendly design"
     
     // Add composition rules
     enhanced += ", balanced composition"
     enhanced += ", clear focal point"
     enhanced += ", centered subject"
     
     // Add quality requirements
     enhanced += ", no text or letters"
     enhanced += ", no numbers"
     enhanced += ", no overlapping elements"
     enhanced += ", clear separation between parts"
     
     // Add specific details based on prompt type
     if (originalPrompt.includes('butterfly') || originalPrompt.includes('insect')) {
       enhanced += ", symmetrical wing patterns"
       enhanced += ", delicate antennae"
       enhanced += ", graceful proportions"
     }
     
     if (originalPrompt.includes('dragon') || originalPrompt.includes('fantasy')) {
       enhanced += ", majestic appearance"
       enhanced += ", detailed scales"
       enhanced += ", expressive features"
     }
     
     if (originalPrompt.includes('princess') || originalPrompt.includes('fairy')) {
       enhanced += ", elegant dress details"
       enhanced += ", flowing hair"
       enhanced += ", graceful pose"
     }
     
     if (originalPrompt.includes('dinosaur') || originalPrompt.includes('animal')) {
       enhanced += ", friendly expression"
       enhanced += ", detailed features"
       enhanced += ", natural proportions"
     }
     
     if (originalPrompt.includes('car') || originalPrompt.includes('vehicle')) {
       enhanced += ", clean vehicle design"
       enhanced += ", clear mechanical details"
       enhanced += ", smooth lines"
     }
     
     // NEW: Add spider/horror specific details
     if (originalPrompt.includes('spider') || originalPrompt.includes('web') || originalPrompt.includes('spiderweb')) {
       enhanced += ", detailed spider anatomy"
       enhanced += ", intricate web patterns"
       enhanced += ", eight-legged structure"
       enhanced += ", web-spinning details"
     }
     
     // Add environment context
     enhanced += ", simple background"
     enhanced += ", minimal details"
     enhanced += ", focus on main subject"
     
     return enhanced
   }
}

export const advancedPromptAnalysisService = new AdvancedPromptAnalysisService()
