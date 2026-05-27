import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UpdateProfileCommand } from '@app/profiles/command/update.command'
import { ProfilesService } from '@app/services/profiles/profiles.service'

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand, void> {
  constructor(private readonly ProfilesService: ProfilesService) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    const { id, payload } = command
    await this.ProfilesService.update({ id, ...payload })
  }
}
