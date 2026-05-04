import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { DeleteProfileCommand } from '@app/profile/command/delete.command'
import { ProfileService } from '@app/services/profile/profile.service'

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileHandler implements ICommandHandler<DeleteProfileCommand, void> {
  constructor(private readonly profileService: ProfileService) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const { id } = command
    await this.profileService.delete(id)
    return
  }
}
