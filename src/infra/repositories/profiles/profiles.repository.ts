import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { ProfileNotFoundError } from '@domain/exceptions/profile-not-found.error'
import { IProfilesRepository } from '@domain/interfaces/repositories/profiles-repository.interface'

import { ProfilesModel } from '@infra/models/profiles/profiles.model'
import { ProfilesMapper } from '@infra/repositories/profiles/profiles.mapper'

@Injectable()
export class ProfilesRepository implements IProfilesRepository {
  constructor(
    @InjectRepository(ProfilesModel)
    private readonly profileRepository: Repository<ProfilesModel>,
  ) {}

  async create(profile: ProfilesEntity): Promise<ProfilesEntity> {
    const saved = await this.profileRepository.save(ProfilesMapper.toPersistence(profile))
    return ProfilesMapper.toDomain(saved)
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.update({ id }, { deletedAt: new Date() })
    return
  }

  async findAll(): Promise<ProfilesEntity[]> {
    const profiles = await this.profileRepository.find()
    return profiles.map((profile) => ProfilesMapper.toDomain(profile))
  }

  async findById(id: string): Promise<ProfilesEntity> {
    const profile = await this.profileRepository.findOne({ where: { id } })

    if (!profile) throw new ProfileNotFoundError(id)

    return ProfilesMapper.toDomain(profile)
  }

  async update(id: string, payload: Partial<Omit<ProfilesEntity, 'id'>>): Promise<ProfilesEntity> {
    await this.profileRepository.update({ id }, ProfilesMapper.toPersistence(payload))
    return await this.findById(id)
  }
}
