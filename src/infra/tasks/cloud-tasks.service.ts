import { CloudTasksClient, protos } from '@google-cloud/tasks'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnqueueTaskArgs, ITasksService } from '@domain/interfaces/services/tasks-service.interface'

@Injectable()
export class CloudTasksService implements ITasksService {
  private readonly client = new CloudTasksClient()

  constructor(private readonly config: ConfigService) {}

  async enqueue({ topic, payload, scheduleTime, headers }: EnqueueTaskArgs): Promise<void> {
    const project = this.config.getOrThrow<string>('GCP_PROJECT_ID')
    const location = this.config.getOrThrow<string>('GCP_TASKS_LOCATION')
    const queue = this.resolveQueue(topic)
    const url = this.resolveUrl(topic, payload)
    const parent = this.client.queuePath(project, location, queue)

    const task: protos.google.cloud.tasks.v2.ITask = {
      httpRequest: {
        httpMethod: protos.google.cloud.tasks.v2.HttpMethod.POST,
        url,
        headers: {
          'Content-Type': 'application/json',
          ...(headers ?? {}),
        },
        body: Buffer.from(JSON.stringify(payload), 'utf8'),
      },
    }

    if (scheduleTime) {
      task.scheduleTime = { seconds: Math.floor(scheduleTime.getTime() / 1000) }
    }

    await this.client.createTask({ parent, task })
  }

  private resolveQueue(topic: string): string {
    return this.config.getOrThrow<string>(`TASK_QUEUE_${this.envKey(topic)}`)
  }

  private resolveUrl(topic: string, payload: Record<string, unknown>): string {
    const template = this.config.getOrThrow<string>(`TASK_URL_${this.envKey(topic)}`)
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      const value = payload[key]
      if (value == null) throw new Error(`Missing payload field "${key}" required by URL template for topic "${topic}"`)
      return encodeURIComponent(String(value))
    })
  }

  private envKey(topic: string): string {
    return topic.toUpperCase().replace(/[.-]/g, '_')
  }
}
