import { Injectable } from '@nestjs/common'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { InvalidProfileDataError } from '@domain/exceptions/invalid-profile-data.error'
import { KafkaConfig } from '@domain/interfaces/config/kafka.interface'
import { IKafkaService } from '@domain/interfaces/kafka/kafka.interface'
import { IProfilesRepository } from '@domain/interfaces/repositories/profiles-repository.interface'
import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'
import { ProfileDomainService } from '@domain/services/profile/profile.service'

@Injectable()
export class ProfilesService implements IProfilesService {
  constructor(
    private readonly kafkaConfig: KafkaConfig,
    private readonly kafkaService: IKafkaService,
    private readonly profileDomainService: ProfileDomainService,
    private readonly profileRepository: IProfilesRepository,
  ) {}

  async create(payload: Partial<ProfilesEntity>): Promise<ProfilesEntity> {
    const { name, lastname } = payload

    if (!lastname || !name) throw new InvalidProfileDataError('Name and lastname are required')

    const profilesEntity = this.profileDomainService.createProfilesEntity({
      name,
      lastname,
    })

    return await this.profileRepository.create(profilesEntity)
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.update(id, { updatedAt: new Date(), deletedAt: new Date() })
  }

  async enqueue(payload: Partial<ProfilesEntity>): Promise<void> {
    await this.kafkaService.enqueue({
      topic: this.kafkaConfig.getKafkaTopicProfilesSync(),
      payload,
    })
  }

  async findAll(): Promise<ProfilesEntity[]> {
    return await this.profileRepository.findAll()
  }

  async findById(id: string): Promise<ProfilesEntity> {
    return await this.profileRepository.findById(id)
  }

  async update(payload: Partial<ProfilesEntity> & { id: string }): Promise<ProfilesEntity> {
    return await this.profileRepository.update(payload.id, payload)
  }
}
