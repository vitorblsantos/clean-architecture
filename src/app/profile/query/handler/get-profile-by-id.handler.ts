import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetProfileByIdQuery } from '@app/profile/query/get-profile-by-id.query'
import { ProfileService } from '@app/services/profile/profile.service'
import { ProfileEntity } from '@domain/entities/profile.entity'

@QueryHandler(GetProfileByIdQuery)
export class GetProfileByIdHandler implements IQueryHandler<GetProfileByIdQuery, ProfileEntity> {
  constructor(private readonly profileService: ProfileService) {}

  async execute(query: GetProfileByIdQuery): Promise<ProfileEntity> {
    return await this.profileService.findById(query.id)
  }
}
