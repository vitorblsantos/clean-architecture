import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ProfileEntity } from '@domain/entities/profile.entity'
import { IProfileRepository } from '@domain/interfaces/repositories/profile-repository.interface'

import { ProfileModel } from '@infra/models/profile/profile.model'

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(
    @InjectRepository(ProfileModel)
    private readonly userEntityRepository: Repository<ProfileModel>,
  ) {}

  async create(profile: ProfileEntity): Promise<ProfileEntity> {
    const user = this.userEntityRepository.create(profile)
    await this.userEntityRepository.save(user)
    return user
  }
}
