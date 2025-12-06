import type { Config } from '../config/index.js';
import { GroqClient } from '../llm/groq-client.js';

export type Intent = 'general' | 'rag_required';

export interface ClassificationResult {
  intent: Intent;
  normalizedQuery: string;
}

const CLASSIFICATION_PROMPT = `You are a query classifier. Analyze the user's query and determine if it requires document retrieval (RAG) or can be answered directly.

Respond with ONLY one of these two words:
- "rag_required" - if the query asks about specific documents, facts, data, or information that would be in a knowledge base
- "general" - if the query is a general question, greeting, or can be answered without document context

Query: {query}

Classification:`;

export class Classifier {
  private llm: GroqClient;

  constructor(config: Config) {
    this.llm = new GroqClient(config);
  }

  async classify(query: string): Promise<ClassificationResult> {
    const normalizedQuery = this.normalizeQuery(query);
    
    try {
      const response = await this.llm.complete(
        CLASSIFICATION_PROMPT.replace('{query}', normalizedQuery)
      );
      
      const intent = this.parseIntent(response.content);
      
      return {
        intent,
        normalizedQuery,
      };
    } catch {
      // Default to rag_required on error (safer fallback)
      return {
        intent: 'rag_required',
        normalizedQuery,
      };
    }
  }

  private normalizeQuery(query: string): string {
    return query.trim().replace(/\s+/g, ' ');
  }

  private parseIntent(response: string): Intent {
    const lower = response.toLowerCase().trim();
    if (lower.includes('general')) {
      return 'general';
    }
    return 'rag_required';
  }
}
