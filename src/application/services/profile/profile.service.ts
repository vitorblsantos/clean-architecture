import { Injectable } from '@nestjs/common'

import { CreateProfileDto } from '@api/dto/profile/profile.dto'
import { LoggerService } from '@app/services/logger/logger.service'
import { ProfileEntity } from '@domain/entities/profile.entity'
import { IProfileRepository } from '@domain/interfaces/repositories/profile-repository.interface'
import { ProfileDomainService } from '@domain/services/profile/profile.service'

@Injectable()
export class ProfileService {
  constructor(
    private readonly repository: IProfileRepository,
    private readonly logger: LoggerService,
    private readonly profileDomainService: ProfileDomainService,
  ) {}

  async create(payload: CreateProfileDto): Promise<ProfileEntity> {
    const { name, lastname } = payload
    this.logger.log('ProfileService', 'Creating profile.')

    const profileEntity = this.profileDomainService.createProfileEntity({
      name,
      lastname,
    })

    return await this.repository.create(profileEntity)
  }
}
