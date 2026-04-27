import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { EnqueueProfileUpdateCommand } from '@app/profile/command/update-profile.command'
import { ProfileService } from '@app/services/profile/profile.service'

@CommandHandler(EnqueueProfileUpdateCommand)
export class EnqueueProfileUpdateHandler implements ICommandHandler<EnqueueProfileUpdateCommand, void> {
  constructor(private readonly profileService: ProfileService) {}

  async execute(command: EnqueueProfileUpdateCommand): Promise<void> {
    const { id, name, lastname } = command
    return await this.profileService.enqueue({ id, name, lastname })
  }
}
