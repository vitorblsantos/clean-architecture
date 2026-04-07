import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { CreateProfileHandler } from '@app/profile/command/handler/create-profile.handler'
import { ProfileService } from '@app/services/profile/profile.service'
import { ProfileDomainService } from '@domain/services/profile/profile.service'
import { ProfileRepository } from '@infra/repositories/profile/profile.repository'

export const CommandHandlers = [CreateProfileHandler]
export const Sagas = []

@Module({
  imports: [CqrsModule],
  providers: [
    ProfileService,
    ProfileDomainService,
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
    ...CommandHandlers,
    ...Sagas,
  ],
  exports: [ProfileService, ProfileDomainService, 'IProfileRepository'],
})
export class ProfileModule {}
