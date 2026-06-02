import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetProfilesQuery } from '@app/profiles/query/get-profiles.query'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'

@QueryHandler(GetProfilesQuery)
export class GetProfilesHandler implements IQueryHandler<GetProfilesQuery, ProfilesEntity[]> {
  constructor(private readonly profilesService: IProfilesService) {}

  async execute(_query: GetProfilesQuery): Promise<ProfilesEntity[]> {
    return await this.profilesService.findAll()
  }
}
