export interface Chunk {
  id: string;
  documentId: string;
  content: string;
  tokenCount: number;
}

export function serializeChunk(chunk: Chunk): string {
  return JSON.stringify(chunk);
}

export function deserializeChunk(json: string): Chunk {
  const parsed = JSON.parse(json);
  return {
    id: parsed.id,
    documentId: parsed.documentId,
    content: parsed.content,
    tokenCount: parsed.tokenCount,
  };
}
