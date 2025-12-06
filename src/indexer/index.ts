import type { Config } from '../config/index.js';
import type { Chunk } from '../models/chunk.js';
import type { Document } from '../models/document.js';
import { loadDocument } from './loaders.js';
import { normalizeText } from './normalizer.js';
import { chunkDocument } from './chunker.js';
import { generateChunkEmbeddings } from './embeddings.js';
import { VectorStore } from './faiss-store.js';

export class Indexer {
  private config: Config;
  private vectorStore: VectorStore;

  constructor(config: Config) {
    this.config = config;
    this.vectorStore = new VectorStore(config.faiss.dimension);
  }

  async loadDocument(path: string): Promise<Document> {
    const doc = await loadDocument(path);
    doc.content = normalizeText(doc.content);
    return doc;
  }

  chunkDocument(doc: Document): Chunk[] {
    return chunkDocument(doc, this.config);
  }

  async indexChunks(chunks: Chunk[]): Promise<void> {
    const embeddings = generateChunkEmbeddings(chunks, this.config.faiss.dimension);
    
    for (const chunk of chunks) {
      const embedding = embeddings.get(chunk.id);
      if (embedding) {
        this.vectorStore.add(chunk, embedding);
      }
    }
  }

  async indexDocument(path: string): Promise<Chunk[]> {
    const doc = await this.loadDocument(path);
    const chunks = this.chunkDocument(doc);
    await this.indexChunks(chunks);
    return chunks;
  }

  getVectorStore(): VectorStore {
    return this.vectorStore;
  }
}

export { VectorStore } from './faiss-store.js';
export { normalizeText } from './normalizer.js';
export { chunkDocument, countTokens } from './chunker.js';
export { generateEmbedding, generateChunkEmbeddings } from './embeddings.js';
export { loadDocument, loadPdf, loadTxt } from './loaders.js';
