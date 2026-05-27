import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Consumer, EachMessagePayload, Kafka, Partitioners, Producer, logLevel } from 'kafkajs'

import { EnvironmentService } from '@app/services/environment/environment.service'

import { EnqueueTaskArgs, IKafkaService } from '@domain/interfaces/kafka/kafka.interface'

@Injectable()
export class KafkaService implements IKafkaService, OnModuleInit, OnModuleDestroy {
  private readonly consumer: Consumer
  private readonly producer: Producer

  constructor(private readonly environmentService: EnvironmentService) {
    const brokers = this.environmentService.getKafkaBrokers()

    const kafka = new Kafka({
      brokers,
      clientId: this.environmentService.getKafkaClientId(),
      logLevel: logLevel.WARN,
    })

    this.consumer = kafka.consumer({ groupId: this.environmentService.getKafkaClientId() })
    this.producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    })
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

  async onModuleInit(): Promise<void> {
    await this.consumer.connect()
    await this.producer.connect()
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect()
    await this.producer.disconnect()
  }

  async subscribe(
    topic: string,
    eachMessage: (payload: EachMessagePayload) => Promise<void>,
    fromBeginning = false,
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning })
    await this.consumer.run({ eachMessage })
  }
}
