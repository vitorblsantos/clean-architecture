import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateProfileCommand } from '@app/profile/command/create.command'
import { ProfileService } from '@app/services/profile/profile.service'
import { ProfileEntity } from '@domain/entities/profile.entity'

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand, ProfileEntity> {
  constructor(private readonly profileService: ProfileService) {}

  async execute(command: CreateProfileCommand): Promise<ProfileEntity> {
    const { name, lastname } = command
    return await this.profileService.create({ name, lastname })
  }
}
