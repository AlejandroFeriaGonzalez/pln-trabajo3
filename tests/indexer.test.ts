import { describe, it, expect } from 'vitest';
import { normalizeText, countTokens, chunkDocument } from '../src/indexer/index.js';
import type { Document } from '../src/models/document.js';

describe('normalizeText', () => {
  it('should remove excessive whitespace', () => {
    const input = 'Hello    world   test';
    const result = normalizeText(input);
    expect(result).toBe('Hello world test');
  });

  it('should be idempotent', () => {
    const input = 'Hello    world\n\n\ntest';
    const once = normalizeText(input);
    const twice = normalizeText(once);
    expect(once).toBe(twice);
  });

  it('should handle multiple newlines', () => {
    const input = 'Line1\n\n\n\nLine2';
    const result = normalizeText(input);
    expect(result).toBe('Line1\n\nLine2');
  });
});

describe('countTokens', () => {
  it('should estimate token count', () => {
    const text = 'Hello world'; // 11 chars
    const tokens = countTokens(text);
    expect(tokens).toBe(3); // ~4 chars per token
  });
});

describe('chunkDocument', () => {
  it('should chunk a document', () => {
    const doc: Document = {
      id: 'doc-1',
      content: 'word '.repeat(500), // ~500 words
      filename: 'test.txt',
      sourceType: 'txt',
    };

    const config = {
      chunking: {
        minTokens: 200,
        maxTokens: 500,
        overlap: 50,
      },
    };

    const chunks = chunkDocument(doc, config);
    expect(chunks.length).toBeGreaterThan(0);
    
    for (const chunk of chunks) {
      expect(chunk.documentId).toBe(doc.id);
      expect(chunk.content.length).toBeGreaterThan(0);
    }
  });
});
