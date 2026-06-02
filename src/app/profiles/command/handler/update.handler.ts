import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UpdateProfileCommand } from '@app/profiles/command/update.command'

import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand, void> {
  constructor(private readonly profilesService: IProfilesService) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    const { id, payload } = command
    await this.profilesService.update({ id, ...payload })
  }
}
