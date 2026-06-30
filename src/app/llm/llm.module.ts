import { Module } from '@nestjs/common'

import { GenerateHandler } from '@app/llm/command/handler/generate.handler'

import { OllamaModule } from '@infra/ollama/ollama.module'

export const Commands = [GenerateHandler]
export const Queries = []
export const Sagas = []

@Module({
  imports: [OllamaModule],
  providers: [...Commands, ...Queries, ...Sagas],
})
export class LLMModule {}
