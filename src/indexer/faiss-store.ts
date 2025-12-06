import type { Chunk } from '../models/chunk.js';

export interface SearchResult {
  chunk: Chunk;
  score: number;
}

/**
 * Simple in-memory vector store (FAISS-like interface).
 * In production, replace with actual FAISS bindings.
 */
export class VectorStore {
  private vectors: Map<string, number[]> = new Map();
  private chunks: Map<string, Chunk> = new Map();
  private dimension: number;

  constructor(dimension: number = 384) {
    this.dimension = dimension;
  }

  add(chunk: Chunk, embedding: number[]): void {
    if (embedding.length !== this.dimension) {
      throw new Error(`Embedding dimension mismatch: expected ${this.dimension}, got ${embedding.length}`);
    }
    this.vectors.set(chunk.id, embedding);
    this.chunks.set(chunk.id, chunk);
  }

  search(queryEmbedding: number[], topK: number = 5): SearchResult[] {
    const results: SearchResult[] = [];

    for (const [id, vector] of this.vectors) {
      const score = this.cosineSimilarity(queryEmbedding, vector);
      const chunk = this.chunks.get(id)!;
      results.push({ chunk, score });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  size(): number {
    return this.vectors.size;
  }

  clear(): void {
    this.vectors.clear();
    this.chunks.clear();
  }
}
