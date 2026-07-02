import { Module } from '@nestjs/common'

import { LLMGenerateHandler } from '@app/llm/command/handler/generate.handler'

import { OllamaModule } from '@infra/ollama/ollama.module'

export const Commands = [LLMGenerateHandler]
export const Queries = []
export const Sagas = []

@Module({
  imports: [OllamaModule],
  providers: [...Commands, ...Queries, ...Sagas],
})
export class LLMModule {}
