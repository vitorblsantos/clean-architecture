import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { ControllersModule } from '@infra/controllers/controllers.module'

import { LoggerModule } from '@infra/logger/logger.module'
import { UsecasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module'

@Module({
  imports: [
    ControllersModule,
    EnvironmentModule,
    LoggerModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    UsecasesProxyModule.register(),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
