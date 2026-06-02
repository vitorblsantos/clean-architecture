import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetProfileByIdQuery } from '@app/profiles/query/get-profile-by-id.query'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'

@QueryHandler(GetProfileByIdQuery)
export class GetProfileByIdHandler implements IQueryHandler<GetProfileByIdQuery, ProfilesEntity> {
  constructor(private readonly profilesService: IProfilesService) {}

  async execute(query: GetProfileByIdQuery): Promise<ProfilesEntity> {
    return await this.profilesService.findById(query.id)
  }
}
