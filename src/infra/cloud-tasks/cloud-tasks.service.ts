import { CloudTasksClient, protos } from '@google-cloud/tasks'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

type EnqueueHttpTaskArgs = {
  url: string
  body: unknown
  method?: protos.google.cloud.tasks.v2.HttpMethod
  scheduleTime?: Date
  headers?: Record<string, string>
}

@Injectable()
export class CloudTasksService {
  private readonly client = new CloudTasksClient()

  constructor(private readonly config: ConfigService) {}

  async enqueueHttpTask(args: EnqueueHttpTaskArgs): Promise<{ name: string }> {
    const project = this.config.getOrThrow<string>('GCP_PROJECT_ID')
    const location = this.config.getOrThrow<string>('GCP_TASKS_LOCATION')
    const queue = this.config.getOrThrow<string>('GCP_PROFILE_UPDATE_QUEUE')
    const parent = this.client.queuePath(project, location, queue)

    const bodyBuffer = Buffer.from(JSON.stringify(args.body), 'utf8')
    const task: protos.google.cloud.tasks.v2.ITask = {
      httpRequest: {
        httpMethod: args.method ?? protos.google.cloud.tasks.v2.HttpMethod.POST,
        url: args.url,
        headers: {
          'Content-Type': 'application/json',
          ...(args.headers ?? {}),
        },
        body: bodyBuffer,
      },
    }

    if (args.scheduleTime) {
      task.scheduleTime = {
        seconds: Math.floor(args.scheduleTime.getTime() / 1000),
      }
    }

    const [response] = await this.client.createTask({ parent, task })
    return { name: response.name ?? '' }
  }
}
