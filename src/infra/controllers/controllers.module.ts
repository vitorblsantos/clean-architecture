import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TerminusModule } from '@nestjs/terminus'

import { UseCasesModule } from '@app/usecases.module'
import { LoggerModule } from '@infra/logger/logger.module'
import { RepositoriesModule } from '@infra/repositories/repositories.module'

import { HealthController } from './health/health.controller'
import { HelloController } from './hello/hello.controller'

@Module({
  imports: [CqrsModule, LoggerModule, RepositoriesModule, TerminusModule, UseCasesModule],
  controllers: [HealthController, HelloController],
})
export class ControllersModule {}
