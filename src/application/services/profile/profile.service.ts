import { Inject, Injectable } from '@nestjs/common'

import { CreateProfileDto } from '@api/dto/profile/profile.dto'
import { ProfileEntity } from '@domain/entities/profile.entity'
import { IProfileRepository } from '@domain/interfaces/repositories/profile-repository.interface'
import { IProfileService } from '@domain/interfaces/services/profile-service.interfaces'
import { ProfileDomainService } from '@domain/services/profile/profile.service'

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    private readonly profileDomainService: ProfileDomainService,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async create(payload: CreateProfileDto): Promise<ProfileEntity> {
    const { name, lastname } = payload

    const profileEntity = this.profileDomainService.createProfileEntity({
      name,
      lastname,
    })

    return await this.profileRepository.create(profileEntity)
  }

  async findAll(): Promise<ProfileEntity[]> {
    return await this.profileRepository.findAll()
  }
}
