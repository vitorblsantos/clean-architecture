import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { ILLMService } from '@domain/interfaces/llm/llm.interface'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { LLMService } from '@infra/llm/llm.service'
import { LoggerModule } from '@infra/logger/logger.module'

@Module({
  imports: [EnvironmentModule, HttpModule, LoggerModule],
  providers: [LLMService, { provide: ILLMService, useExisting: LLMService }],
  exports: [ILLMService],
})
export class LLMModule {}
