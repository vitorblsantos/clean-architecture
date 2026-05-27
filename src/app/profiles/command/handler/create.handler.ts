import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateProfileCommand } from '@app/profiles/command/create.command'
import { ProfilesService } from '@app/services/profiles/profiles.service'
import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand, ProfilesEntity> {
  constructor(private readonly ProfilesService: ProfilesService) {}

  async execute(command: CreateProfileCommand): Promise<ProfilesEntity> {
    const { name, lastname } = command
    return await this.ProfilesService.create({ name, lastname })
  }
}
