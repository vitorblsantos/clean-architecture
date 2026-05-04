import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Kafka, Producer, logLevel } from 'kafkajs'

import { EnqueueTaskArgs, ITasksService } from '@domain/interfaces/services/tasks-service.interface'

@Injectable()
export class KafkaTasksService implements ITasksService, OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka
  private readonly producer: Producer

  constructor(private readonly config: ConfigService) {
    const brokers = this.config
      .getOrThrow<string>('KAFKA_BROKERS')
      .split(',')
      .map((broker) => broker.trim())

    this.kafka = new Kafka({
      brokers,
      clientId: this.config.getOrThrow<string>('KAFKA_CLIENT_ID'),
      logLevel: logLevel.WARN,
    })

    this.producer = this.kafka.producer()
  }

  async onModuleInit(): Promise<void> {
    await this.producer.connect()
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect()
  }

  async enqueue({ topic, payload, scheduleTime, headers }: EnqueueTaskArgs): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(payload),
          headers: {
            ...(headers ?? {}),
            ...(scheduleTime ? { 'x-schedule-time': scheduleTime.toISOString() } : {}),
          },
        },
      ],
    })
  }
}
