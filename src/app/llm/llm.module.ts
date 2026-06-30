import { Module } from '@nestjs/common'

import { GenerateHandler } from '@app/llm/command/handler/generate.handler'

import { LLMModule as LLMInfraModule } from '@infra/llm/llm.module'

export const Commands = [GenerateHandler]
export const Queries = []
export const Sagas = []

@Module({
  imports: [LLMInfraModule],
  providers: [...Commands, ...Queries, ...Sagas],
})
export class LLMModule {}
