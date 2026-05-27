import { EachMessagePayload } from 'kafkajs'

export interface EnqueueTaskArgs {
  topic: string
  payload: Record<string, unknown>
  scheduleTime?: Date
  headers?: Record<string, string>
}

export interface IKafkaService {
  enqueue(args: EnqueueTaskArgs): Promise<void>
  subscribe(
    topic: string,
    eachMessage: (payload: EachMessagePayload) => Promise<void>,
    fromBeginning: boolean,
  ): Promise<void>
}
