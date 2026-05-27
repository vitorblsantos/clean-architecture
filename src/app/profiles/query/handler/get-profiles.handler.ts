import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetProfilesQuery } from '@app/profiles/query/get-profiles.query'
import { ProfilesService } from '@app/services/profiles/profiles.service'
import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

@QueryHandler(GetProfilesQuery)
export class GetProfilesHandler implements IQueryHandler<GetProfilesQuery, ProfilesEntity[]> {
  constructor(private readonly ProfilesService: ProfilesService) {}

  async execute(_query: GetProfilesQuery): Promise<ProfilesEntity[]> {
    return await this.ProfilesService.findAll()
  }
}
