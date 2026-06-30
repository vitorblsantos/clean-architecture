import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { GenerateCommand } from '@app/llm/command/generate.command'
import { ILLMService } from '@domain/interfaces/ollama/ollama.interface'

@CommandHandler(GenerateCommand)
export class GenerateHandler implements ICommandHandler<GenerateCommand, string> {
  constructor(private readonly llmService: ILLMService) {}

  async execute(command: GenerateCommand): Promise<string> {
    const { prompt, options } = command
    return this.llmService.generate(prompt, options)
  }
}
