import { describe, it, expect } from 'vitest';
import { 
  serializeChunk, 
  deserializeChunk,
  serializeTrace,
  deserializeTrace,
  type Chunk,
  type Trace,
} from '../src/models/index.js';

describe('Chunk Serialization', () => {
  it('should serialize and deserialize a chunk', () => {
    const chunk: Chunk = {
      id: 'test-id',
      documentId: 'doc-id',
      content: 'Test content',
      tokenCount: 250,
    };

    const json = serializeChunk(chunk);
    const result = deserializeChunk(json);

    expect(result).toEqual(chunk);
  });
});

describe('Trace Serialization', () => {
  it('should serialize and deserialize a trace', () => {
    const trace: Trace = {
      id: 'trace-id',
      entries: [
        {
          traceId: 'trace-id',
          timestamp: '2024-01-01T00:00:00.000Z',
          step: 'classify',
          duration: 100,
        },
      ],
      startTime: '2024-01-01T00:00:00.000Z',
      endTime: '2024-01-01T00:00:01.000Z',
    };

    const json = serializeTrace(trace);
    const result = deserializeTrace(json);

    expect(result).toEqual(trace);
  });
});
