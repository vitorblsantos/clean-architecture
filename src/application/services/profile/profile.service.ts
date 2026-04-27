import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ProfileEntity } from '@domain/entities/profile.entity'
import { IProfileRepository } from '@domain/interfaces/repositories/profile-repository.interface'
import { IProfileService } from '@domain/interfaces/services/profile-service.interfaces'
import { ProfileDomainService } from '@domain/services/profile/profile.service'
import { CloudTasksService } from '@infra/cloud-tasks/cloud-tasks.service'

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    private readonly config: ConfigService,
    private readonly profileDomainService: ProfileDomainService,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    private readonly tasks: CloudTasksService,
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

  async enqueue(payload: Partial<ProfileEntity>): Promise<void> {
    const { id, name, lastname } = payload

    if (!id) throw new BadRequestException('id is required')
    if (name == null && lastname == null) {
      throw new BadRequestException('At least one of name or lastname is required to update a profile')
    }

    const url = this.config.getOrThrow<string>('GCP_PROFILE_UPDATE_TASK_URL')
    await this.tasks.enqueueHttpTask({
      url,
      body: { id, name, lastname },
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

  async update(id: string, payload: Partial<ProfileEntity>): Promise<ProfileEntity> {
    return await this.profileRepository.update(id, payload)
  }
}
