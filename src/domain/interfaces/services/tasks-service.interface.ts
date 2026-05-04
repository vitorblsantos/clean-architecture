export interface EnqueueTaskArgs {
  topic: string
  payload: Record<string, unknown>
  scheduleTime?: Date
  headers?: Record<string, string>
}

export interface ITasksService {
  enqueue(args: EnqueueTaskArgs): Promise<void>
}
