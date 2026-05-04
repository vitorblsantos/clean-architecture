import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'

import { ProfileEntity } from '@domain/entities/profile.entity'
import { IProfileRepository } from '@domain/interfaces/repositories/profile-repository.interface'
import { IProfileService } from '@domain/interfaces/services/profile-service.interfaces'
import { ITasksService } from '@domain/interfaces/services/tasks-service.interface'
import { ProfileDomainService } from '@domain/services/profile/profile.service'
import { TASKS_SERVICE } from '@infra/tasks/tasks.module'

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    private readonly profileDomainService: ProfileDomainService,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject(TASKS_SERVICE)
    private readonly tasks: ITasksService,
  ) {}

  async create(payload: Partial<ProfileEntity>): Promise<ProfileEntity> {
    const { name, lastname } = payload

    if (!lastname || !name) throw new BadRequestException('Name and lastname are required')

    const profileEntity = this.profileDomainService.createProfileEntity({
      name,
      lastname,
    })

    return await this.profileRepository.create(profileEntity)
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.update(id, { updatedAt: new Date(), deletedAt: new Date() })
  }

  async enqueue(payload: Partial<ProfileEntity>): Promise<void> {
    const { id, name, lastname } = payload

    if (!id) throw new BadRequestException('id is required')
    if (name == null && lastname == null) {
      throw new BadRequestException('At least one of name or lastname is required to update a profile')
    }

    await this.tasks.enqueue({
      topic: 'profile.update',
      payload: { id, name, lastname },
    })
  }

  async findAll(): Promise<ProfileEntity[]> {
    const profiles = await this.profileRepository.findAll()

    if (!profiles.length) throw new NotFoundException('No profiles found')
    return profiles
  }

  async findById(id: string): Promise<ProfileEntity> {
    return await this.profileRepository.findById(id)
  }

  async update(payload: Partial<ProfileEntity>): Promise<ProfileEntity> {
    const { id, name, lastname } = payload
    if (!id) throw new BadRequestException('id is required')
    if (!name && !lastname) {
      throw new BadRequestException('At least one of name or lastname is required to update a profile')
    }

    const data: Partial<Omit<ProfileEntity, 'id'>> = { updatedAt: new Date() }
    if (name != null) data.name = name
    if (lastname != null) data.lastname = lastname

    return await this.profileRepository.update(id, data)
  }
}
