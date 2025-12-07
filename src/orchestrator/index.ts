import { v4 as uuidv4 } from 'uuid';
import type { Config } from '../config/index.js';
import type { Trace, TraceEntry } from '../models/trace.js';
import { Classifier } from '../classifier/index.js';
import { Retriever } from '../retriever/index.js';
import { RAGGenerator, type RAGResponse } from '../rag/index.js';
import type { VectorStore } from '../indexer/faiss-store.js';
import { GroqClient } from '../llm/groq-client.js';

export interface Response {
  answer: string;
  sources?: string[];
  traceId: string;
}

export class Orchestrator {
  private classifier: Classifier;
  private retriever: Retriever;
  private ragGenerator: RAGGenerator;
  private llm: GroqClient;
  private config: Config;
  private traces: Map<string, Trace> = new Map();

  constructor(vectorStore: VectorStore, config: Config) {
    this.config = config;
    this.classifier = new Classifier(config);
    this.retriever = new Retriever(vectorStore, config);
    this.ragGenerator = new RAGGenerator(config);
    this.llm = new GroqClient(config);
  }

  async process(query: string): Promise<Response> {
    const traceId = uuidv4();
    const trace: Trace = {
      id: traceId,
      entries: [],
      startTime: new Date().toISOString(),
    };

    try {
      // Step 1: Classify the query
      const classifyStart = Date.now();
      const classification = await this.classifier.classify(query);
      this.addTraceEntry(trace, 'classify', Date.now() - classifyStart);

      // Step 2: Route based on intent
      if (classification.intent === 'general') {
        console.log('[Orchestrator] Routing to direct response (general intent)');
        const directStart = Date.now();
        const response = await this.handleDirectResponse(query);
        this.addTraceEntry(trace, 'direct_response', Date.now() - directStart);
        
        trace.endTime = new Date().toISOString();
        this.traces.set(traceId, trace);
        
        return {
          answer: response,
          traceId,
        };
      }

      // Step 3: RAG pipeline
      console.log('[Orchestrator] Routing to RAG pipeline');
      const retrieveStart = Date.now();
      const results = await this.retriever.search(classification.normalizedQuery);
      console.log(`[Orchestrator] Retrieved ${results.length} chunks`);
      this.addTraceEntry(trace, 'retrieve', Date.now() - retrieveStart);

      const generateStart = Date.now();
      const ragResponse = await this.ragGenerator.generate(
        classification.normalizedQuery,
        results
      );
      console.log(`[Orchestrator] Generated response with ${ragResponse.sources.length} sources`);
      this.addTraceEntry(trace, 'generate', Date.now() - generateStart);

      trace.endTime = new Date().toISOString();
      this.traces.set(traceId, trace);

      return {
        answer: ragResponse.answer,
        sources: ragResponse.sources,
        traceId,
      };
    } catch (error) {
      trace.endTime = new Date().toISOString();
      this.traces.set(traceId, trace);
      
      return {
        answer: `Error processing query: ${error instanceof Error ? error.message : 'Unknown error'}`,
        traceId,
      };
    }
  }

  private async handleDirectResponse(query: string): Promise<string> {
    const response = await this.llm.complete(query);
    return response.content;
  }

  private addTraceEntry(trace: Trace, step: string, duration: number): void {
    const entry: TraceEntry = {
      traceId: trace.id,
      timestamp: new Date().toISOString(),
      step,
      duration,
    };
    trace.entries.push(entry);
  }

  getTrace(traceId: string): Trace | undefined {
    return this.traces.get(traceId);
  }
}
