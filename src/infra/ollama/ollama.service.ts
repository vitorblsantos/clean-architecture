import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

import { LLMConfig } from '@domain/interfaces/config/llm.interface'
import { ILLMGenerateRes, ILLMService } from '@domain/interfaces/llm/llm.interface'
import { ILogger } from '@domain/interfaces/logger/logger.interface'

@Injectable()
export class OllamaService implements ILLMService {
  constructor(
    private readonly http: HttpService,
    private readonly config: LLMConfig,
    private readonly logger: ILogger,
  ) {}

  async generate(prompt: string, options?: Record<string, unknown>): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<ILLMGenerateRes>(
          `${this.config.getLLMBaseUrl()}/api/generate`,
          {
            model: this.config.getLLMModel(),
            prompt,
            stream: false,
            options,
          },
          { timeout: this.config.getLLMTimeout() },
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
