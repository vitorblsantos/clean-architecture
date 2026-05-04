import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetProfilesQuery } from '@app/profile/query/get-profiles.query'
import { ProfileService } from '@app/services/profile/profile.service'
import { ProfileEntity } from '@domain/entities/profile.entity'

@QueryHandler(GetProfilesQuery)
export class GetProfilesHandler implements IQueryHandler<GetProfilesQuery, ProfileEntity[]> {
  constructor(private readonly profileService: ProfileService) {}

  async execute(_query: GetProfilesQuery): Promise<ProfileEntity[]> {
    return await this.profileService.findAll()
  }
}
