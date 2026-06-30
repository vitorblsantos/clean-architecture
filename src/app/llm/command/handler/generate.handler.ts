import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { GenerateCommand } from '@app/llm/command/generate.command'
import { IOllamaService } from '@domain/interfaces/ollama/ollama.interface'

@CommandHandler(GenerateCommand)
export class GenerateHandler implements ICommandHandler<GenerateCommand, string> {
  constructor(private readonly ollamaService: IOllamaService) {}

  async execute(command: GenerateCommand): Promise<string> {
    const { prompt, options } = command
    return this.ollamaService.generate(prompt, options)
  }
}
