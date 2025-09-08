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
      'kill', 'murder', 'blood', 'gore', 'violence', 'attack', 'death', 'dead', 'corpse',
      'torture', 'abuse', 'assault', 'bomb', 'explosion', 'terrorist', 'shooting', 'stabbing',
      'homicide', 'suicide', 'self-harm', 'cutting', 'anorexia', 'bulimia'
    ],
    drugs: [
      'drug', 'cocaine', 'heroin', 'marijuana', 'weed', 'alcohol', 'drunk',
      'beer', 'wine', 'liquor', 'pills', 'inject', 'smoke', 'overdose'
    ],
    inappropriate: [
      'curse', 'swear', 'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell',
      'hate', 'racist', 'discriminatory', 'slave', 'nazi', 'terrorist'
    ]
  }

  // Context-aware filtering for potentially problematic words
  private contextAwareFilter(prompt: string): FilterResult {
    const lowerPrompt = prompt.toLowerCase()
    
    // Check for violent contexts that should be blocked
    const violentContexts = [
      'gun shooting', 'gun kill', 'gun murder', 'gun violence', 'gun attack',
      'fight to death', 'fight kill', 'fight murder', 'fight violence',
      'battle kill', 'battle murder', 'battle death', 'battle violence',
      'war kill', 'war murder', 'war death', 'war violence',
      'knife kill', 'knife murder', 'knife attack', 'knife violence',
      'weapon kill', 'weapon murder', 'weapon attack', 'weapon violence'
    ]
    
    for (const context of violentContexts) {
      if (lowerPrompt.includes(context)) {
        return {
          isValid: false,
          reason: `We do not generate violent imagery`,
          category: 'violence',
          shouldReplacePrompt: true,
          replacementText: "We do not generate violent imagery",
          shouldBlockGeneration: true
        }
      }
    }
    
    // Allow non-violent uses of potentially problematic words
    return { isValid: true }
  }

  private warningKeywords = {
    scary: ['monster', 'ghost', 'zombie', 'vampire', 'witch', 'demon'],
    intense: ['chase', 'escape', 'danger', 'risk', 'adventure'],
    mature: ['love', 'romance', 'dating', 'marriage', 'divorce']
  }

  // Main filtering function
  filterPrompt(userPrompt: string): FilterResult {
    const lowerPrompt = userPrompt.toLowerCase()
    
    // First, check for explicit content that we should block entirely
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
    
    // Then, check for context-aware filtering (allows guns, fighting, battle in non-violent contexts)
    const contextResult = this.contextAwareFilter(userPrompt)
    if (!contextResult.isValid) {
      return contextResult
    }
    
    // If we get here, let Stability AI handle the content moderation
    return { isValid: true }
  }

  // Sanitize prompt for children's content
  sanitizePrompt(userPrompt: string): string {
    let sanitized = userPrompt
    
    // Replace potentially problematic words with child-friendly alternatives
    // Only replace words that are actually problematic, not all instances
    const replacements = {
      'monster': 'friendly creature',
      'ghost': 'friendly spirit',
      'witch': 'friendly wizard',
      'demon': 'friendly magical being',
      'kill': 'defeat',
      'murder': 'defeat',
      'death': 'end',
      'dead': 'defeated'
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


