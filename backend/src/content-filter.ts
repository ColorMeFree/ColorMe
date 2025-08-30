// Content filtering service for ColorMeFree
// Ensures all prompts are family-friendly and appropriate for children's books

export interface FilterResult {
  isValid: boolean
  reason?: string
  category?: string
  shouldReplacePrompt?: boolean
  replacementText?: string
  shouldBlockGeneration?: boolean
}

export class ContentFilterService {
  private explicitKeywords = {
    sexual: [
      'sex', 'nude', 'naked', 'intimate', 'adult', 'porn', 'erotic', 'sexual',
      'breast', 'penis', 'vagina', 'orgasm', 'masturbation', 'prostitute'
    ],
    violence: [
      'kill', 'murder', 'blood', 'gore', 'weapon', 'gun', 'knife', 'fight',
      'violence', 'attack', 'battle', 'war', 'death', 'dead', 'corpse',
      'torture', 'abuse', 'assault', 'bomb', 'explosion', 'terrorist'
    ],
    drugs: [
      'drug', 'cocaine', 'heroin', 'marijuana', 'weed', 'alcohol', 'drunk',
      'beer', 'wine', 'liquor', 'pills', 'inject', 'smoke', 'overdose'
    ],
    inappropriate: [
      'curse', 'swear', 'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell',
      'hate', 'racist', 'discriminatory', 'slave', 'nazi', 'terrorist',
      'suicide', 'self-harm', 'cutting', 'anorexia', 'bulimia'
    ]
  }

  private warningKeywords = {
    scary: ['monster', 'ghost', 'zombie', 'vampire', 'witch', 'demon'],
    intense: ['chase', 'escape', 'danger', 'risk', 'adventure'],
    mature: ['love', 'romance', 'dating', 'marriage', 'divorce']
  }

  // Main filtering function
  filterPrompt(userPrompt: string): FilterResult {
    const lowerPrompt = userPrompt.toLowerCase()
    
    // Check for explicit content that we should block entirely
    for (const [category, keywords] of Object.entries(this.explicitKeywords)) {
      for (const keyword of keywords) {
        if (lowerPrompt.includes(keyword)) {
          return {
            isValid: false,
            reason: `We do not generate inappropriate imagery`,
            category,
            shouldReplacePrompt: true,
            replacementText: "We do not generate inappropriate imagery",
            shouldBlockGeneration: true
          }
        }
      }
    }
    
    // If we get here, let Stability AI handle the content moderation
    return { isValid: true }
  }

  // Sanitize prompt for children's content
  sanitizePrompt(userPrompt: string): string {
    let sanitized = userPrompt
    
    // Replace potentially problematic words with child-friendly alternatives
    const replacements = {
      'monster': 'friendly creature',
      'ghost': 'friendly spirit',
      'witch': 'friendly wizard',
      'demon': 'friendly magical being',
      'kill': 'defeat',
      'fight': 'play',
      'battle': 'game',
      'war': 'competition'
    }
    
    for (const [problematic, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(problematic, 'gi')
      sanitized = sanitized.replace(regex, replacement)
    }
    
    return sanitized
  }

  // Validate final expanded scenes
  validateScenes(scenes: string[]): { isValid: boolean; invalidScenes: string[] } {
    const invalidScenes: string[] = []
    
    for (const scene of scenes) {
      const result = this.filterPrompt(scene)
      if (!result.isValid) {
        invalidScenes.push(scene)
      }
    }
    
    return {
      isValid: invalidScenes.length === 0,
      invalidScenes
    }
  }
}

export const contentFilterService = new ContentFilterService()


