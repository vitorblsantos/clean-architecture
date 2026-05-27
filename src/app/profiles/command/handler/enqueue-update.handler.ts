import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { EnqueueProfileUpdateCommand } from '@app/profiles/command/enqueue-update.command'
import { ProfilesService } from '@app/services/profiles/profiles.service'

@CommandHandler(EnqueueProfileUpdateCommand)
export class EnqueueProfileUpdateHandler implements ICommandHandler<EnqueueProfileUpdateCommand, void> {
  constructor(private readonly ProfilesService: ProfilesService) {}

  async execute(command: EnqueueProfileUpdateCommand): Promise<void> {
    const { id, name, lastname } = command
    return await this.ProfilesService.enqueue({ id, name, lastname })
  }
}
