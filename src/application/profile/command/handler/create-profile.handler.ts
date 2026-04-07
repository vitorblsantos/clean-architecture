import { Inject } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { v6 as uuidv6 } from 'uuid'

import { CreateProfileCommand } from 'src/application/profile/command/create-profile.command'
import { CreateProfileFailedEvent } from 'src/application/profile/events/create-profile-failed.event'
import { LoggerService } from 'src/application/services/logger/logger.service'
import { IProfileRepository } from '@domain/interfaces/repositories/profile-repository.interface'

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly logger: LoggerService,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(command: CreateProfileCommand): Promise<void> {
    const { name, lastname } = command
    const id = uuidv6()

    this.logger.log(CreateProfileHandler.name, `Creating profile with id: ${id}`)

    try {
      await this.profileRepository.create({
        createdAt: new Date(),
        id,
        lastname,
        name,
        updatedAt: new Date(),
      })
    } catch (err) {
      this.eventBus.publish(new CreateProfileFailedEvent(id, err))
    }

    this.logger.log(CreateProfileHandler.name, `Profile created with id: ${id}`)
  }
}
