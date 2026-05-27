import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { DeleteProfileCommand } from '@app/profiles/command/delete.command'
import { ProfilesService } from '@app/services/profiles/profiles.service'

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileHandler implements ICommandHandler<DeleteProfileCommand, void> {
  constructor(private readonly ProfilesService: ProfilesService) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const { id } = command
    await this.ProfilesService.delete(id)
    return
  }
}
