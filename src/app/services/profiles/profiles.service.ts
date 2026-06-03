import { Injectable } from '@nestjs/common'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { InvalidProfileDataError } from '@domain/exceptions/invalid-profile-data.error'
import { KafkaConfig } from '@domain/interfaces/config/kafka.interface'
import { IKafkaService } from '@domain/interfaces/kafka/kafka.interface'
import { IProfilesRepository } from '@domain/interfaces/repositories/profiles-repository.interface'
import { IRedisService } from '@domain/interfaces/redis/redis.interface'
import { IProfilesService } from '@domain/interfaces/services/profile-service.interface'
import { ProfilesDomainService } from '@domain/services/profiles/profiles.service'

@Injectable()
export class ProfilesService implements IProfilesService {
  constructor(
    private readonly kafkaConfig: KafkaConfig,
    private readonly kafkaService: IKafkaService,
    private readonly profilesDomainService: ProfilesDomainService,
    private readonly profilesRepository: IProfilesRepository,
    private readonly redisService: IRedisService,
  ) {}

  async create(payload: Partial<ProfilesEntity>): Promise<ProfilesEntity> {
    const { name, lastname } = payload

    if (!lastname || !name) throw new InvalidProfileDataError('Name and lastname are required')

    const profilesEntity = this.profilesDomainService.createProfilesEntity({
      name,
      lastname,
    })

    return await this.profilesRepository.create(profilesEntity)
  }

  async delete(id: string): Promise<void> {
    await this.profilesRepository.delete(id)
  }

  async enqueue(payload: Partial<ProfilesEntity>): Promise<void> {
    await this.kafkaService.enqueue({
      topic: this.kafkaConfig.getKafkaTopicProfilesSync(),
      payload,
    })
  }

  async findAll(): Promise<ProfilesEntity[]> {
    return await this.profilesRepository.findAll()
  }

  async findById(id: string): Promise<ProfilesEntity> {
    const cacheKey = `profile:id:${id}`
    const cached = await this.redisService.get(cacheKey)

    if (cached) return JSON.parse(cached) as ProfilesEntity

    const profile = await this.profilesRepository.findById(id)

    await this.redisService.set(cacheKey, JSON.stringify(profile), 300)
    return profile
  }

  async update(payload: Partial<ProfilesEntity> & { id: string }): Promise<ProfilesEntity> {
    return await this.profilesRepository.update(payload.id, payload)
  }
}
