import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetProfileByIdQuery } from '@app/profiles/query/get-profile-by-id.query'
import { ProfilesService } from '@app/services/profiles/profiles.service'
import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

@QueryHandler(GetProfileByIdQuery)
export class GetProfileByIdHandler implements IQueryHandler<GetProfileByIdQuery, ProfilesEntity> {
  constructor(private readonly ProfilesService: ProfilesService) {}

  async execute(query: GetProfileByIdQuery): Promise<ProfilesEntity> {
    return await this.ProfilesService.findById(query.id)
  }
}
