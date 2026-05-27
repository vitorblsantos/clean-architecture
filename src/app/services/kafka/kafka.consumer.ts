import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EachMessagePayload } from 'kafkajs'

import { EnvironmentService } from '@app/services/environment/environment.service'
import { KafkaService } from '@app/services/kafka/kafka.service'
import { LoggerService } from '@app/services/logger/logger.service'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'
import { ProfilesService } from '@app/services/profiles/profiles.service'

@Injectable()
export class HubspotContactsKafkaConsumer implements OnApplicationBootstrap {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly environmentService: EnvironmentService,
    private readonly kafkaService: KafkaService,
    private readonly logger: LoggerService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const topic = this.environmentService.getKafkaTopicProfilesSync()

    try {
      await this.kafkaService.subscribe(topic, (payload) => this.handleMessage(payload))
      this.logger.log(HubspotContactsKafkaConsumer.name, `Subscribed to Kafka topic: ${topic}`)
    } catch (err) {
      this.logger.error(HubspotContactsKafkaConsumer.name, 'Kafka subscriber failed to start', String(err))
    }
  }

  private async handleMessage({ heartbeat, message }: EachMessagePayload): Promise<void> {
    try {
      const { profile }: { profile: ProfilesEntity } = JSON.parse(message.value?.toString() ?? '{}')

      await this.profilesService.create(profile)

      await heartbeat()
    } catch (error) {
      this.logger.error(HubspotContactsKafkaConsumer.name, 'Failed to process Kafka message', String(error))
    }
  }
}
