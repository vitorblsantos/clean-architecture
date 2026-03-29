import { Module } from '@nestjs/common'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { ControllersModule } from '@infra/controllers/controllers.module'

import { LoggerModule } from '@infra/logger/logger.module'
import { UsecasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module'

@Module({
  imports: [ControllersModule, EnvironmentModule, LoggerModule, UsecasesProxyModule.register()],
})
export class AppModule {}
