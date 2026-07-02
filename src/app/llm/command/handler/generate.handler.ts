import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { LLMGenerateCommand } from '@app/llm/command/generate.command'
import { ILLMService } from '@domain/interfaces/llm/llm.interface'

@CommandHandler(LLMGenerateCommand)
export class LLMGenerateHandler implements ICommandHandler<LLMGenerateCommand, string> {
  constructor(private readonly llmService: ILLMService) {}

  async execute(command: LLMGenerateCommand): Promise<string> {
    const { prompt, options } = command
    return await this.llmService.generate(prompt, options)
  }
}
