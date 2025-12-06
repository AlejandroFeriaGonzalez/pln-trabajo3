import type { Chunk } from '../models/chunk.js';

/**
 * Simple embedding generator using character-based hashing.
 * In production, replace with Sentence Transformers or similar.
 */
export function generateEmbedding(text: string, dimension: number = 384): number[] {
  const embedding = new Array(dimension).fill(0);
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const idx = (charCode * (i + 1)) % dimension;
    embedding[idx] += charCode / 1000;
  }
  
  // Normalize the vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dimension; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}

export function generateChunkEmbeddings(
  chunks: Chunk[],
  dimension: number = 384
): Map<string, number[]> {
  const embeddings = new Map<string, number[]>();
  
  for (const chunk of chunks) {
    embeddings.set(chunk.id, generateEmbedding(chunk.content, dimension));
  }
  
  return embeddings;
}
