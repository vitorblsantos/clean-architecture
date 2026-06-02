import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Consumer, Kafka, Partitioners, Producer, logLevel } from 'kafkajs'

import { KafkaConfig } from '@domain/interfaces/config/kafka.interface'
import { EnqueueTaskArgs, IKafkaService, IncomingMessage } from '@domain/interfaces/kafka/kafka.interface'

@Injectable()
export class KafkaService implements IKafkaService, OnModuleInit, OnModuleDestroy {
  private readonly consumer: Consumer
  private readonly producer: Producer

  constructor(private readonly kafkaConfig: KafkaConfig) {
    const brokers = this.kafkaConfig.getKafkaBrokers()

    const kafka = new Kafka({
      brokers,
      clientId: this.kafkaConfig.getKafkaClientId(),
      logLevel: logLevel.WARN,
    })

    this.consumer = kafka.consumer({ groupId: this.kafkaConfig.getKafkaClientId() })
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
    eachMessage: (message: IncomingMessage) => Promise<void>,
    fromBeginning = false,
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning })
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat }) =>
        eachMessage({
          topic,
          partition,
          key: message.key?.toString() ?? null,
          value: message.value?.toString() ?? null,
          headers: this.parseHeaders(message.headers),
          heartbeat,
        }),
    })
  }

  private parseHeaders(headers?: Record<string, unknown>): Record<string, string | undefined> | undefined {
    if (!headers) return undefined

    return Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [key, value === undefined ? undefined : String(value)]),
    )
  }
}
