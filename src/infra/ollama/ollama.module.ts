import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { IOllamaService } from '@domain/interfaces/ollama/ollama.interface'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { OllamaService } from '@infra/ollama/ollama.service'
import { LoggerModule } from '@infra/logger/logger.module'

@Module({
  imports: [EnvironmentModule, HttpModule, LoggerModule],
  providers: [OllamaService, { provide: IOllamaService, useExisting: OllamaService }],
  exports: [IOllamaService],
})
export class OllamaModule {}
