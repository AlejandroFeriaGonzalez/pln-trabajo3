import { v4 as uuidv4 } from 'uuid';
import type { Chunk } from '../models/chunk.js';
import type { Document } from '../models/document.js';
import type { Config } from '../config/index.js';

/**
 * Simple token counter (approximation: ~4 chars per token)
 */
export function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Chunks a document into segments between minTokens and maxTokens.
 */
export function chunkDocument(
  doc: Document,
  config: Pick<Config, 'chunking'>
): Chunk[] {
  const { minTokens, maxTokens, overlap } = config.chunking;
  const chunks: Chunk[] = [];
  const words = doc.content.split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 0) {
    return [];
  }

  let startIdx = 0;
  
  while (startIdx < words.length) {
    let endIdx = startIdx;
    let currentText = '';
    let tokenCount = 0;
    
    while (endIdx < words.length && tokenCount < maxTokens) {
      const nextWord = words[endIdx];
      const nextText = currentText ? `${currentText} ${nextWord}` : nextWord;
      const nextTokenCount = countTokens(nextText);
      
      if (nextTokenCount > maxTokens && tokenCount >= minTokens) {
        break;
      }
      
      currentText = nextText;
      tokenCount = nextTokenCount;
      endIdx++;
    }
    
    if (tokenCount < minTokens && chunks.length > 0) {
      const lastChunk = chunks[chunks.length - 1];
      lastChunk.content = `${lastChunk.content} ${currentText}`;
      lastChunk.tokenCount = countTokens(lastChunk.content);
      break;
    }
    
    if (currentText.length > 0) {
      chunks.push({
        id: uuidv4(),
        documentId: doc.id,
        content: currentText,
        tokenCount: Math.max(minTokens, Math.min(maxTokens, tokenCount)),
      });
    }
    
    const overlapWords = Math.floor((overlap / maxTokens) * (endIdx - startIdx));
    startIdx = endIdx - overlapWords;
    
    if (startIdx >= words.length || endIdx === startIdx) {
      break;
    }
  }
  
  return chunks;
}
