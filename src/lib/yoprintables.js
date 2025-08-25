// Yoprintables.com integration for free coloring page generation
// This service scrapes and processes coloring pages from yoprintables.com

export class YoprintablesService {
  constructor() {
    this.baseUrl = 'https://yoprintables.com/coloring-page-generator/'
    this.categories = [
      'animals', 'vehicles', 'fantasy', 'nature', 'sports', 
      'space', 'underwater', 'castle', 'dinosaurs', 'robots'
    ]
  }

  // Map user prompts to yoprintables categories and keywords
  mapPromptToCategory(prompt) {
    const lowerPrompt = prompt.toLowerCase()
    
    // Simple keyword mapping - can be enhanced with LLM later
    if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle') || lowerPrompt.includes('truck')) {
      return 'vehicles'
    }
    if (lowerPrompt.includes('dinosaur') || lowerPrompt.includes('dino')) {
      return 'dinosaurs'
    }
    if (lowerPrompt.includes('space') || lowerPrompt.includes('planet') || lowerPrompt.includes('rocket')) {
      return 'space'
    }
    if (lowerPrompt.includes('underwater') || lowerPrompt.includes('fish') || lowerPrompt.includes('ocean')) {
      return 'underwater'
    }
    if (lowerPrompt.includes('castle') || lowerPrompt.includes('princess') || lowerPrompt.includes('knight')) {
      return 'castle'
    }
    if (lowerPrompt.includes('animal') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog')) {
      return 'animals'
    }
    if (lowerPrompt.includes('robot') || lowerPrompt.includes('machine')) {
      return 'robots'
    }
    if (lowerPrompt.includes('sport') || lowerPrompt.includes('ball') || lowerPrompt.includes('game')) {
      return 'sports'
    }
    
    // Default to animals for generic prompts
    return 'animals'
  }

  // Generate 4 diverse coloring pages based on prompt
  async generatePages(prompt) {
    const category = this.mapPromptToCategory(prompt)
    
    // For MVP, we'll use a curated set of pages for each category
    // In production, this could scrape yoprintables.com dynamically
    const pages = await this.getCuratedPages(category, prompt)
    
    return pages.slice(0, 4) // Return exactly 4 pages
  }

  // Get curated pages for each category
  async getCuratedPages(category, prompt) {
    const curatedPages = {
      vehicles: [
        'https://yoprintables.com/wp-content/uploads/2024/01/car-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/truck-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/airplane-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/train-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/boat-coloring-page.jpg'
      ],
      dinosaurs: [
        'https://yoprintables.com/wp-content/uploads/2024/01/t-rex-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/triceratops-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/brachiosaurus-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/velociraptor-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/pterodactyl-coloring-page.jpg'
      ],
      space: [
        'https://yoprintables.com/wp-content/uploads/2024/01/rocket-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/planet-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/astronaut-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/ufo-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/star-coloring-page.jpg'
      ],
      animals: [
        'https://yoprintables.com/wp-content/uploads/2024/01/cat-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/dog-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/lion-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/elephant-coloring-page.jpg',
        'https://yoprintables.com/wp-content/uploads/2024/01/giraffe-coloring-page.jpg'
      ]
    }

    // For MVP, use placeholder images that look like coloring pages
    // These will be replaced with actual yoprintables.com images
    const placeholderPages = [
      'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+1',
      'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+2', 
      'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+3',
      'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+4',
      'https://via.placeholder.com/400x600/ffffff/000000?text=Coloring+Page+5'
    ]

    return placeholderPages
  }

  // Generate remaining 26 pages for the full book
  async generateRemainingPages(prompt, styleSeed) {
    const category = this.mapPromptToCategory(prompt)
    
    // Generate 26 more pages in the same style
    const remainingPages = []
    for (let i = 0; i < 26; i++) {
      // Use styleSeed to maintain consistency
      const pageUrl = `https://via.placeholder.com/400x600/ffffff/000000?text=Page+${i + 5}&style=${styleSeed}`
      remainingPages.push(pageUrl)
    }
    
    return remainingPages
  }
}

export const yoprintablesService = new YoprintablesService()
