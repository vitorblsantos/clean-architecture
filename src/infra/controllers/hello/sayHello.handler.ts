import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { LoggerService } from '@infra/logger/logger.service'
import { DatabaseUserRepository } from '@infra/repositories/users.repository'

import { SayHelloCommand } from '@usecases/hello/sayHello.command'
import { SayHelloUseCase } from '@usecases/hello/sayHello.usecase'

@CommandHandler(SayHelloCommand)
export class SayHelloHandler implements ICommandHandler<SayHelloCommand> {
  private readonly useCase: SayHelloUseCase

  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: DatabaseUserRepository,
  ) {
    this.useCase = new SayHelloUseCase(this.logger, this.userRepository)
  }

  async execute(command: SayHelloCommand): Promise<string> {
    return this.useCase.execute(command.id)
  }
}
