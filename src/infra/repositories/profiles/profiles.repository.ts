import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { IProfilesRepository } from '@domain/interfaces/repositories/profiles-repository.interface'

import { ProfilesModel } from '@infra/models/profiles/profiles.model'

@Injectable()
export class ProfilesRepository implements IProfilesRepository {
  constructor(
    @InjectRepository(ProfilesModel)
    private readonly profileRepository: Repository<ProfilesModel>,
  ) {}

  async create(profile: ProfilesEntity): Promise<ProfilesEntity> {
    return await this.profileRepository.save(profile)
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.update({ id }, { deletedAt: new Date() })
    return
  }

  async findAll(): Promise<ProfilesEntity[]> {
    return await this.profileRepository.find()
  }

  async findById(id: string): Promise<ProfilesEntity> {
    const profile = await this.profileRepository.findOne({ where: { id } })

    if (!profile) throw new NotFoundException(`Profile with id ${id} not found`)

    return profile
  }

  async update(id: string, payload: Partial<Omit<ProfilesEntity, 'id'>>): Promise<ProfilesEntity> {
    await this.profileRepository.update({ id }, payload)
    return await this.findById(id)
  }
}
