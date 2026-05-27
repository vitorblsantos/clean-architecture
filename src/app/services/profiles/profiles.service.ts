import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { EnvironmentService } from '@app/services/environment/environment.service'
import { KafkaService } from '@app/services/kafka/kafka.service'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { IProfilesRepository } from '@domain/interfaces/repositories/profiles-repository.interface'
import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'
import { ProfileDomainService } from '@domain/services/profile/profile.service'

@Injectable()
export class ProfilesService implements IProfilesService {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly kafkaService: KafkaService,
    private readonly profileDomainService: ProfileDomainService,
    private readonly profileRepository: IProfilesRepository,
  ) {}

  async create(payload: Partial<ProfilesEntity>): Promise<ProfilesEntity> {
    const { name, lastname } = payload

    if (!lastname || !name) throw new BadRequestException('Name and lastname are required')

    const ProfilesEntity = this.profileDomainService.createProfilesEntity({
      name,
      lastname,
    })

    return await this.profileRepository.create(ProfilesEntity)
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.update(id, { updatedAt: new Date(), deletedAt: new Date() })
  }

  async enqueue(payload: Partial<ProfilesEntity>): Promise<void> {
    const profilesEntity = this.profileDomainService.updateProfilesEntity(payload)

    await this.kafkaService.enqueue({
      topic: this.environmentService.getKafkaTopicProfilesSync(),
      payload: profilesEntity,
    })
  }

  async findAll(): Promise<ProfilesEntity[]> {
    const profiles = await this.profileRepository.findAll()

    if (!profiles.length) throw new NotFoundException('No profiles found')
    return profiles
  }

  async findById(id: string): Promise<ProfilesEntity> {
    return await this.profileRepository.findById(id)
  }

  async update(payload: Partial<ProfilesEntity> & { id: string }): Promise<ProfilesEntity> {
    const profilesEntity = this.profileDomainService.updateProfilesEntity(payload)

    return await this.profileRepository.update(payload.id, profilesEntity)
  }
}
