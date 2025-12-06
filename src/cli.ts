import { loadConfig } from './config/index.js';
import { Indexer } from './indexer/index.js';
import { Orchestrator } from './orchestrator/index.js';
import { createInterface } from 'readline';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const config = loadConfig();
  const indexer = new Indexer(config);

  if (command === 'index') {
    const files = args.slice(1);
    if (files.length === 0) {
      console.log('Usage: npm run dev index <file1> <file2> ...');
      process.exit(1);
    }

    console.log(`Indexing ${files.length} file(s)...`);
    for (const file of files) {
      try {
        const chunks = await indexer.indexDocument(file);
        console.log(`  ✓ ${file}: ${chunks.length} chunks`);
      } catch (error) {
        console.error(`  ✗ ${file}: ${error instanceof Error ? error.message : 'Error'}`);
      }
    }
    console.log(`\nIndexing complete. Vector store size: ${indexer.getVectorStore().size()}`);
    return;
  }

  if (command === 'query') {
    const query = args.slice(1).join(' ');
    if (!query) {
      console.log('Usage: npm run dev query <your question>');
      process.exit(1);
    }

    const orchestrator = new Orchestrator(indexer.getVectorStore(), config);
    const response = await orchestrator.process(query);
    
    console.log('\n--- Response ---');
    console.log(response.answer);
    if (response.sources?.length) {
      console.log('\n--- Sources ---');
      response.sources.forEach(s => console.log(`  - ${s}`));
    }
    console.log(`\nTrace ID: ${response.traceId}`);
    return;
  }

  if (command === 'interactive') {
    const orchestrator = new Orchestrator(indexer.getVectorStore(), config);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('Agentic RAG System - Interactive Mode');
    console.log('Type "exit" to quit, "index <file>" to add documents\n');

    const prompt = () => {
      rl.question('> ', async (input) => {
        const trimmed = input.trim();
        
        if (trimmed === 'exit') {
          rl.close();
          return;
        }

        if (trimmed.startsWith('index ')) {
          const file = trimmed.slice(6).trim();
          try {
            const chunks = await indexer.indexDocument(file);
            console.log(`Indexed ${file}: ${chunks.length} chunks\n`);
          } catch (error) {
            console.error(`Error: ${error instanceof Error ? error.message : 'Unknown'}\n`);
          }
          prompt();
          return;
        }

        if (trimmed) {
          const response = await orchestrator.process(trimmed);
          console.log(`\n${response.answer}\n`);
        }
        prompt();
      });
    };

    prompt();
    return;
  }

  console.log('Agentic RAG System MVP');
  console.log('\nCommands:');
  console.log('  npm run dev index <files...>  - Index documents');
  console.log('  npm run dev query <question>  - Query the system');
  console.log('  npm run dev interactive       - Interactive mode');
}

main().catch(console.error);
