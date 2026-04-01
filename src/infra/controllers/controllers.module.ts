import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TerminusModule } from '@nestjs/terminus'

import { LoggerModule } from '@infra/logger/logger.module'
import { RepositoriesModule } from '@infra/repositories/repositories.module'

import { HealthController } from './health/health.controller'
import { HelloController } from './hello/hello.controller'
import { SayHelloHandler } from './hello/sayHello.handler'

@Module({
  imports: [CqrsModule, LoggerModule, RepositoriesModule, TerminusModule],
  controllers: [HealthController, HelloController],
  providers: [SayHelloHandler],
})
export class ControllersModule {}
