import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { ILogger } from '@domain/logger/logger.interface'
import { UserRepository } from '@domain/repositories/users.repositories'

import { SayHelloCommand } from '@app/hello/sayHello.command'
import { SayHelloUseCase } from '@app/hello/sayHello.usecase'

@CommandHandler(SayHelloCommand)
export class SayHelloHandler implements ICommandHandler<SayHelloCommand> {
  private readonly useCase: SayHelloUseCase

  constructor(
    @Inject('ILogger') private readonly logger: ILogger,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {
    this.useCase = new SayHelloUseCase(this.logger, this.userRepository)
  }

  async execute(command: SayHelloCommand): Promise<string> {
    return this.useCase.execute(command.id)
  }
}
