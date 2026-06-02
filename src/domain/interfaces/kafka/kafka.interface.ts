export interface EnqueueTaskArgs {
  topic: string
  payload: Record<string, unknown>
  scheduleTime?: Date
  headers?: Record<string, string>
}

export interface IncomingMessage {
  topic: string
  partition: number
  key: string | null
  value: string | null
  headers?: Record<string, string | undefined>
  heartbeat: () => Promise<void>
}

export abstract class IKafkaService {
  abstract enqueue(args: EnqueueTaskArgs): Promise<void>
  abstract subscribe(
    topic: string,
    eachMessage: (message: IncomingMessage) => Promise<void>,
    fromBeginning?: boolean,
  ): Promise<void>
}
