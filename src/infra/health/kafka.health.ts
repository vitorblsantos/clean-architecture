import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HealthIndicatorService } from '@nestjs/terminus'
import { Admin, Kafka, logLevel } from 'kafkajs'

@Injectable()
export class KafkaHealthIndicator implements OnModuleInit, OnModuleDestroy {
  private readonly admin: Admin
  private readonly kafka: Kafka

  constructor(
    private readonly config: ConfigService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {
    const brokers = this.config
      .getOrThrow<string>('KAFKA_BROKERS')
      .split(',')
      .map((broker) => broker.trim())

    this.kafka = new Kafka({
      brokers,
      clientId: `${this.config.getOrThrow<string>('KAFKA_CLIENT_ID')}-health`,
      logLevel: logLevel.NOTHING,
    })

    this.admin = this.kafka.admin()
  }

  async onModuleInit(): Promise<void> {
    await this.admin.connect()
  }

  async onModuleDestroy(): Promise<void> {
    await this.admin.disconnect()
  }

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key)

    try {
      const { brokers } = await this.admin.describeCluster()
      return indicator.up({ brokers: brokers.length })
    } catch (error) {
      return indicator.down({
        message: error instanceof Error ? error.message : 'Kafka is unreachable',
      })
    }
  }
}
