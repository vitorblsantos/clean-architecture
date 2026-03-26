import { Module } from '@nestjs/common'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { LoggerService } from './logger.service'

@Module({
  imports: [EnvironmentModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
