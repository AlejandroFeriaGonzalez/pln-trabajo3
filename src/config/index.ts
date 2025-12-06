export interface Config {
  groq: {
    apiKey: string;
    model: string;
  };
  faiss: {
    indexPath: string;
    dimension: number;
  };
  chunking: {
    minTokens: number;
    maxTokens: number;
    overlap: number;
  };
  retrieval: {
    topK: number;
  };
}

export function loadConfig(): Config {
  return {
    groq: {
      apiKey: process.env.GROQ_API_KEY || '',
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    },
    faiss: {
      indexPath: process.env.FAISS_INDEX_PATH || './data/index',
      dimension: parseInt(process.env.FAISS_DIMENSION || '384', 10),
    },
    chunking: {
      minTokens: parseInt(process.env.CHUNK_MIN_TOKENS || '200', 10),
      maxTokens: parseInt(process.env.CHUNK_MAX_TOKENS || '500', 10),
      overlap: parseInt(process.env.CHUNK_OVERLAP || '50', 10),
    },
    retrieval: {
      topK: parseInt(process.env.RETRIEVAL_TOP_K || '5', 10),
    },
  };
}

export const defaultConfig: Config = loadConfig();
