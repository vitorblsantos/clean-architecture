import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CreateProfileHandler } from '@app/profiles/command/handler/create.handler'
import { DeleteProfileHandler } from '@app/profiles/command/handler/delete.handler'
import { EnqueueProfileUpdateHandler } from '@app/profiles/command/handler/enqueue-update.handler'
import { UpdateProfileHandler } from '@app/profiles/command/handler/update.handler'

import { GetProfileByIdHandler } from '@app/profiles/query/handler/get-profile-by-id.handler'
import { GetProfilesHandler } from '@app/profiles/query/handler/get-profiles.handler'

import { ProfilesService } from '@app/services/profiles/profiles.service'

import { IProfilesRepository } from '@domain/interfaces/repositories/profiles-repository.interface'
import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'
import { ProfilesDomainService } from '@domain/services/profiles/profiles.service'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { KafkaModule } from '@infra/kafka/kafka.module'
import { LoggerModule } from '@infra/logger/logger.module'
import { RedisModule } from '@infra/redis/redis.module'
import { ProfilesModel } from '@infra/models/profiles/profiles.model'
import { ProfilesRepository } from '@infra/repositories/profiles/profiles.repository'

export const Commands = [CreateProfileHandler, DeleteProfileHandler, EnqueueProfileUpdateHandler, UpdateProfileHandler]
export const Queries = [GetProfilesHandler, GetProfileByIdHandler]
export const Sagas = []

@Module({
  imports: [EnvironmentModule, KafkaModule, LoggerModule, RedisModule, TypeOrmModule.forFeature([ProfilesModel])],
  providers: [
    ProfilesDomainService,
    { provide: IProfilesService, useClass: ProfilesService },
    { provide: IProfilesRepository, useClass: ProfilesRepository },
    ...Commands,
    ...Queries,
    ...Sagas,
  ],
  exports: [IProfilesService, ProfilesDomainService],
})
export class ProfileModule {}
