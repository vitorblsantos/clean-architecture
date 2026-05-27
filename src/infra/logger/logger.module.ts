import { Module } from '@nestjs/common'

import { LoggerService } from '@app/services/logger/logger.service'
import { EnvironmentModule } from '@infra/environment/environment.module'

@Module({
  imports: [EnvironmentModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
