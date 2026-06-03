import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { ProfilesNotFoundError } from '@domain/exceptions/index.exceptions'
import { IProfilesRepository } from '@domain/interfaces/repositories/profiles-repository.interface'

import { ProfilesModel } from '@infra/models/profiles/profiles.model'
import { ProfilesMapper } from '@infra/repositories/profiles/profiles.mapper'

@Injectable()
export class ProfilesRepository implements IProfilesRepository {
  constructor(
    @InjectRepository(ProfilesModel)
    private readonly profilesRepository: Repository<ProfilesModel>,
  ) {}

  async create(profile: ProfilesEntity): Promise<ProfilesEntity> {
    const saved = await this.profilesRepository.save(ProfilesMapper.toPersistence(profile))
    return ProfilesMapper.toDomain(saved)
  }

  async delete(id: string): Promise<void> {
    await this.profilesRepository.update({ id }, { updatedAt: new Date(), deletedAt: new Date() })
  }

  async findAll(): Promise<ProfilesEntity[]> {
    const profiles = await this.profilesRepository.find()
    return profiles.map((profile) => ProfilesMapper.toDomain(profile))
  }

  async findById(id: string): Promise<ProfilesEntity> {
    const profile = await this.profilesRepository.findOne({ where: { id } })

    if (!profile) throw new ProfilesNotFoundError(id)

    return ProfilesMapper.toDomain(profile)
  }

  async update(id: string, payload: Partial<Omit<ProfilesEntity, 'id'>>): Promise<ProfilesEntity> {
    await this.profilesRepository.update({ id }, ProfilesMapper.toPersistence(payload))
    return await this.findById(id)
  }
}
