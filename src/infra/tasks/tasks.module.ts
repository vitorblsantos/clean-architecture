import { Module } from '@nestjs/common'

import { EEnvironment } from '@domain/interfaces/enums/environment.enum'
import { EnvironmentModule } from '@infra/config/environment/environment.module'

import { CloudTasksService } from './cloud-tasks.service'
import { KafkaTasksService } from './kafka-tasks.service'

export const TASKS_SERVICE = 'ITasksService'

const TasksImpl = process.env.NODE_ENV === EEnvironment.Local ? KafkaTasksService : CloudTasksService

@Module({
  imports: [EnvironmentModule],
  providers: [
    {
      provide: TASKS_SERVICE,
      useClass: TasksImpl,
    },
  ],
  exports: [TASKS_SERVICE],
})
export class TasksModule {}
