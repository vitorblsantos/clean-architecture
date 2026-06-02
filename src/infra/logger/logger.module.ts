import { Module } from '@nestjs/common'

import { ILogger } from '@domain/interfaces/logger/logger.interface'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { LoggerService } from '@infra/logger/logger.service'

@Module({
  imports: [EnvironmentModule],
  providers: [LoggerService, { provide: ILogger, useExisting: LoggerService }],
  exports: [LoggerService, ILogger],
})
export class LoggerModule {}
