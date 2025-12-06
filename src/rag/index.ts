import type { Config } from '../config/index.js';
import type { SearchResult } from '../indexer/faiss-store.js';
import { GroqClient } from '../llm/groq-client.js';

export interface RAGResponse {
  answer: string;
  sources: string[];
}

const RAG_SYSTEM_PROMPT = `You are a helpful assistant that answers questions based on the provided context. 
Always cite your sources by referencing the chunk IDs provided.
If the context doesn't contain relevant information, say so clearly.`;

const RAG_PROMPT = `Context:
{context}

Question: {query}

Please provide a comprehensive answer based on the context above. Include source references.`;

export class RAGGenerator {
  private llm: GroqClient;

  constructor(config: Config) {
    this.llm = new GroqClient(config);
  }

  async generate(query: string, context: SearchResult[]): Promise<RAGResponse> {
    if (context.length === 0) {
      return {
        answer: 'No relevant documents found to answer your question.',
        sources: [],
      };
    }

    const contextText = this.assembleContext(context);
    const prompt = RAG_PROMPT
      .replace('{context}', contextText)
      .replace('{query}', query);

    const response = await this.llm.complete(prompt, RAG_SYSTEM_PROMPT);
    const sources = context.map(r => r.chunk.id);

    return {
      answer: response.content,
      sources,
    };
  }

  private assembleContext(results: SearchResult[]): string {
    return results
      .map((r, i) => `[Source ${i + 1} - ${r.chunk.id}]:\n${r.chunk.content}`)
      .join('\n\n');
  }
}
