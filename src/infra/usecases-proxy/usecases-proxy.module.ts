import { DynamicModule, Module } from '@nestjs/common'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { EnvironmentService } from '@infra/config/environment/environment.service'

import { LoggerModule } from '@infra/logger/logger.module'
import { LoggerService } from '@infra/logger/logger.service'

import { RepositoriesModule } from '@infra/repositories/repositories.module'
import { DatabaseUserRepository } from '@infra/repositories/users.repository'

import { SayHelloUseCase } from '@usecases/hello/sayHello.usecase'

import { UseCaseProxy } from './usecases-proxy'

@Module({
  imports: [LoggerModule, EnvironmentModule, RepositoriesModule],
})
export class UsecasesProxyModule {
  static SAY_HELLO_USECASES_PROXY = 'SayHelloUseCasesProxy'

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [LoggerService, EnvironmentService, DatabaseUserRepository],
          provide: UsecasesProxyModule.SAY_HELLO_USECASES_PROXY,
          useFactory: (logger: LoggerService, userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new SayHelloUseCase(logger, userRepo)),
        },
      ],
      exports: [UsecasesProxyModule.SAY_HELLO_USECASES_PROXY],
    }
  }
}
