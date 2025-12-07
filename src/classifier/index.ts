import type { Config } from '../config/index.js';
import { GroqClient } from '../llm/groq-client.js';

export type Intent = 'general' | 'rag_required';

export interface ClassificationResult {
  intent: Intent;
  normalizedQuery: string;
}

const GENERAL_PATTERNS = [
  /^(hi|hello|hey|hola|buenos días|buenas tardes)/i,
  /^(thanks|thank you|gracias)/i,
  /^(bye|goodbye|adiós|chao)/i,
  /^(how are you|cómo estás)/i,
];

export class Classifier {
  private llm: GroqClient;

  constructor(config: Config) {
    this.llm = new GroqClient(config);
  }

  async classify(query: string): Promise<ClassificationResult> {
    const normalizedQuery = this.normalizeQuery(query);
    
    // Simple pattern matching for obvious general queries
    const isGeneral = GENERAL_PATTERNS.some(pattern => pattern.test(normalizedQuery));
    
    console.log(`[Classifier] Query: "${normalizedQuery}" -> Intent: ${isGeneral ? 'general' : 'rag_required'}`);
    
    return {
      intent: isGeneral ? 'general' : 'rag_required',
      normalizedQuery,
    };
  }

  private normalizeQuery(query: string): string {
    return query.trim().replace(/\s+/g, ' ');
  }
}
