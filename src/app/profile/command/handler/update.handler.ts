import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UpdateProfileCommand } from '@app/profile/command/update.command'
import { ProfileService } from '@app/services/profile/profile.service'

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand, void> {
  constructor(private readonly profileService: ProfileService) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    const { id, payload } = command
    await this.profileService.update({ id, ...payload })
  }
}
