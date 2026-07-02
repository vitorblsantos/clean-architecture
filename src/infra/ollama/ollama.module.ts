import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { ILLMService } from '@domain/interfaces/llm/llm.interface'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { OllamaService } from '@infra/ollama/ollama.service'
import { LoggerModule } from '@infra/logger/logger.module'

@Module({
  imports: [EnvironmentModule, HttpModule, LoggerModule],
  providers: [OllamaService, { provide: ILLMService, useExisting: OllamaService }],
  exports: [ILLMService],
})
export class OllamaModule {}
