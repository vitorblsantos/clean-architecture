import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateProfileCommand } from '@app/profiles/command/create.command'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand, ProfilesEntity> {
  constructor(private readonly profilesService: IProfilesService) {}

  async execute(command: CreateProfileCommand): Promise<ProfilesEntity> {
    const { name, lastname } = command
    return await this.profilesService.create({ name, lastname })
  }
}
