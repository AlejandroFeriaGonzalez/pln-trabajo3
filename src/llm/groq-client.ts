import Groq from 'groq-sdk';
import type { Config } from '../config/index.js';

export interface LLMResponse {
  content: string;
  tokensUsed: number;
}

export class GroqClient {
  private client: Groq;
  private model: string;

  constructor(config: Config) {
    this.client = new Groq({ apiKey: config.groq.apiKey });
    this.model = config.groq.model;
  }

  async complete(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.1,
      max_tokens: 1024,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: response.usage?.total_tokens || 0,
    };
  }
}
