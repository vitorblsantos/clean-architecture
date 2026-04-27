import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CreateProfileHandler } from '@app/profile/command/handler/create.handler'
import { EnqueueProfileUpdateHandler } from '@app/profile/command/handler/enqueue-update.handler'
import { GetProfileByIdHandler } from '@app/profile/query/handler/get-profile-by-id.handler'
import { GetProfilesHandler } from '@app/profile/query/handler/get-profiles.handler'
import { ProfileService } from '@app/services/profile/profile.service'
import { ProfileDomainService } from '@domain/services/profile/profile.service'
import { CloudTasksModule } from '@infra/cloud-tasks/cloud-tasks.module'
import { LoggerModule } from '@infra/logger/logger.module'
import { ProfileModel } from '@infra/models/profile/profile.model'
import { ProfileRepository } from '@infra/repositories/profile/profile.repository'

export const CommandHandlers = [CreateProfileHandler, EnqueueProfileUpdateHandler]
export const QueryHandlers = [GetProfilesHandler, GetProfileByIdHandler]
export const Sagas = []

@Module({
  imports: [LoggerModule, CloudTasksModule, TypeOrmModule.forFeature([ProfileModel])],
  providers: [
    ProfileService,
    ProfileDomainService,
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
    ...Sagas,
  ],
  exports: [ProfileService, ProfileDomainService, 'IProfileRepository'],
})
export class ProfileModule {}
