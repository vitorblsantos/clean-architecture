import { Module } from '@nestjs/common'

import { LoggerService } from 'src/application/services/logger/logger.service'
import { EnvironmentModule } from '@infra/config/environment/environment.module'

@Module({
  imports: [EnvironmentModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
