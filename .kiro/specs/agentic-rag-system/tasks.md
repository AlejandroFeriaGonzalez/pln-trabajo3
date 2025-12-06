# Implementation Plan

## Agentic RAG System MVP

- [x] 1. Project Setup and Configuration



  - [x] 1.1 Initialize TypeScript project with dependencies

    - Create package.json with: typescript, fast-check, vitest, faiss-node, pdf-parse, groq-sdk, @xenova/transformers
    - Configure tsconfig.json for ES modules
    - Set up vitest.config.ts
    - _Requirements: 1.1, 1.6_
  - [x] 1.2 Create configuration module and types


    - Implement Config interface with groq, faiss, chunking, retrieval settings
    - Create config loader from environment variables
    - _Requirements: All_


- [x] 2. Core Data Models and Serialization

  - [x] 2.1 Implement Chunk and Document interfaces


    - Create src/models/chunk.ts with Chunk interface
    - Create src/models/document.ts with Document interface
    - Implement serializeChunk and deserializeChunk functions
    - _Requirements: 1.8, 1.9_
  - [ ]* 2.2 Write property test for Chunk serialization round-trip
    - **Property 1: Chunk Serialization Round-Trip**
    - **Validates: Requirements 1.8, 1.9**
  - [x] 2.3 Implement Trace and TraceEntry interfaces


    - Create src/models/trace.ts with Trace interface
    - Implement serializeTrace and deserializeTrace functions
    - _Requirements: 7.5, 7.6_
  - [ ]* 2.4 Write property test for Trace serialization round-trip
    - **Property 2: Trace Serialization Round-Trip**
    - **Validates: Requirements 7.5, 7.6**

- [x] 3. Indexer Component


  - [x] 3.1 Implement document loaders


    - Create src/indexer/loaders.ts with loadPdf and loadTxt functions
    - Handle file reading and text extraction
    - _Requirements: 1.1, 1.3_

  - [x] 3.2 Implement text normalization

    - Create src/indexer/normalizer.ts with normalizeText function
    - Remove excessive whitespace and special characters
    - _Requirements: 1.4_
  - [ ]* 3.3 Write property test for text normalization idempotence
    - **Property 4: Text Normalization Idempotence**
    - **Validates: Requirements 1.4**
  - [x] 3.4 Implement chunking logic


    - Create src/indexer/chunker.ts with chunkDocument function
    - Split text into 200-500 token segments with overlap
    - _Requirements: 1.5_
  - [ ]* 3.5 Write property test for chunk token count invariant
    - **Property 3: Chunk Token Count Invariant**
    - **Validates: Requirements 1.5**
  - [x] 3.6 Implement embedding generation and FAISS indexing


    - Create src/indexer/embeddings.ts using Sentence Transformers
    - Create src/indexer/faiss-store.ts for FAISS operations
    - _Requirements: 1.6, 1.7_
  - [x] 3.7 Create Indexer class combining all indexing functionality


    - Create src/indexer/index.ts with Indexer class
    - Implement loadDocument, chunkDocument, indexChunks methods
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 4. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.


- [x] 5. Classifier Component


  - [x] 5.1 Implement Groq LLM client

    - Create src/llm/groq-client.ts with GroqClient class
    - Handle API calls with error handling and timeouts
    - _Requirements: 2.1_
  - [x] 5.2 Implement Classifier


    - Create src/classifier/index.ts with Classifier class
    - Implement classify method using Groq for intent detection
    - Return 'general' or 'rag_required' intent
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [ ]* 5.3 Write property test for classification result validity
    - **Property 6: Classification Result Validity**
    - **Validates: Requirements 2.1, 2.6**


- [x] 6. Retriever Component

  - [x] 6.1 Implement Retriever


    - Create src/retriever/index.ts with Retriever class
    - Implement search method querying FAISS
    - Return results ordered by similarity score
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 6.2 Write property test for retrieval results ordering
    - **Property 5: Retrieval Results Ordering**
    - **Validates: Requirements 3.3**

- [x] 7. RAG Generator Component



  - [x] 7.1 Implement RAGGenerator

    - Create src/rag/index.ts with RAGGenerator class
    - Implement generate method combining query with context
    - Format response with source citations
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 7.2 Write property test for RAG response sources
    - **Property 7: RAG Response Contains Sources**
    - **Validates: Requirements 4.3**

- [x] 8. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.


- [x] 9. Orchestrator Component


  - [x] 9.1 Implement Orchestrator

    - Create src/orchestrator/index.ts with Orchestrator class
    - Implement process method coordinating all components
    - Route queries based on classification result
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [ ] 9.2 Implement trace logging
    - Add trace creation and logging to Orchestrator
    - Record step, timestamp, duration for each operation
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ]* 9.3 Write property test for routing correctness
    - **Property 8: Routing Correctness**
    - **Validates: Requirements 6.2, 6.3**


- [x] 10. Integration and CLI


  - [x] 10.1 Create main entry point

    - Create src/index.ts exporting all components
    - Create src/cli.ts for command-line interface
    - Support: index documents, query system
    - _Requirements: All_
  - [ ]* 10.2 Write integration tests
    - Test full pipeline with mock LLM responses
    - Test indexing and retrieval flow
    - _Requirements: All_




- [ ] 11. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
