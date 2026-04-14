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
    private readonly profileRepository: Repository<ProfileModel>,
  ) {}

  async create(profile: ProfileEntity): Promise<ProfileEntity> {
    return await this.profileRepository.save(profile)
  }

  async findAll(): Promise<ProfileEntity[]> {
    return await this.profileRepository.find()
  }
}
