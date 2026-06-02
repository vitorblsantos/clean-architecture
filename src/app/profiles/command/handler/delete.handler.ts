import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { DeleteProfileCommand } from '@app/profiles/command/delete.command'

import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileHandler implements ICommandHandler<DeleteProfileCommand, void> {
  constructor(private readonly profilesService: IProfilesService) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const { id } = command
    await this.profilesService.delete(id)
    return
  }
}
