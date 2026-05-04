import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CreateProfileHandler } from '@app/profile/command/handler/create.handler'
import { DeleteProfileHandler } from '@app/profile/command/handler/delete.handler'
import { EnqueueProfileUpdateHandler } from '@app/profile/command/handler/enqueue-update.handler'
import { UpdateProfileHandler } from '@app/profile/command/handler/update.handler'
import { GetProfileByIdHandler } from '@app/profile/query/handler/get-profile-by-id.handler'
import { GetProfilesHandler } from '@app/profile/query/handler/get-profiles.handler'

import { ProfileService } from '@app/services/profile/profile.service'

import { ProfileDomainService } from '@domain/services/profile/profile.service'

import { LoggerModule } from '@infra/logger/logger.module'
import { ProfileModel } from '@infra/models/profile/profile.model'
import { ProfileRepository } from '@infra/repositories/profile/profile.repository'
import { TasksModule } from '@infra/tasks/tasks.module'

export const Commands = [CreateProfileHandler, DeleteProfileHandler, EnqueueProfileUpdateHandler, UpdateProfileHandler]
export const Queries = [GetProfilesHandler, GetProfileByIdHandler]
export const Sagas = []

@Module({
  imports: [LoggerModule, TasksModule, TypeOrmModule.forFeature([ProfileModel])],
  providers: [
    ProfileService,
    ProfileDomainService,
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
    ...Commands,
    ...Queries,
    ...Sagas,
  ],
  exports: [ProfileService, ProfileDomainService, 'IProfileRepository'],
})
export class ProfileModule {}
