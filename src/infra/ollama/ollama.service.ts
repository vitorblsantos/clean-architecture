import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

import { LlmConfig } from '@domain/interfaces/config/llm.interface'
import { IOllamaService } from '@domain/interfaces/ollama/ollama.interface'
import { ILogger } from '@domain/interfaces/logger/logger.interface'

interface OllamaGenerateResponse {
  response?: string
}

@Injectable()
export class OllamaService implements IOllamaService {
  constructor(
    private readonly http: HttpService,
    private readonly config: LlmConfig,
    private readonly logger: ILogger,
  ) {}

  async generate(prompt: string, options?: Record<string, unknown>): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<OllamaGenerateResponse>(
          `${this.config.getLlmBaseUrl()}/api/generate`,
          {
            model: this.config.getLlmModel(),
            prompt,
            stream: false,
            options,
          },
          { timeout: this.config.getLlmTimeout() },
        ),
      )

      return (data.response ?? '').trim()
    } catch (error) {
      const trace = error instanceof Error ? error.stack : String(error)
      this.logger.error('OllamaService', 'Failed to generate LLM response', trace)
      throw error
    }
  }
}
