import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { EnqueueProfileUpdateCommand } from '@app/profiles/command/enqueue-update.command'

import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'

@CommandHandler(EnqueueProfileUpdateCommand)
export class EnqueueProfileUpdateHandler implements ICommandHandler<EnqueueProfileUpdateCommand, void> {
  constructor(private readonly profilesService: IProfilesService) {}

  async execute(command: EnqueueProfileUpdateCommand): Promise<void> {
    const { id, name, lastname } = command
    return await this.profilesService.enqueue({ id, name, lastname })
  }
}
