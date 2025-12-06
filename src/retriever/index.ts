import type { Config } from '../config/index.js';
import type { VectorStore, SearchResult } from '../indexer/faiss-store.js';
import { generateEmbedding } from '../indexer/embeddings.js';

export class Retriever {
  private vectorStore: VectorStore;
  private config: Config;

  constructor(vectorStore: VectorStore, config: Config) {
    this.vectorStore = vectorStore;
    this.config = config;
  }

  async search(query: string, topK?: number): Promise<SearchResult[]> {
    const k = topK ?? this.config.retrieval.topK;
    const queryEmbedding = generateEmbedding(query, this.config.faiss.dimension);
    const results = this.vectorStore.search(queryEmbedding, k);
    
    // Results are already sorted by score in descending order
    return results;
  }
}

export type { SearchResult } from '../indexer/faiss-store.js';
