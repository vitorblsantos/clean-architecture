import { Module } from '@nestjs/common'

import { EnvironmentModule } from '@infra/config/environment/environment.module'

import { CloudTasksService } from './cloud-tasks.service'

@Module({
  imports: [EnvironmentModule],
  providers: [CloudTasksService],
  exports: [CloudTasksService],
})
export class CloudTasksModule {}
