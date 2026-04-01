import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { ControllersModule } from '@infra/controllers/controllers.module'
import { LoggerModule } from '@infra/logger/logger.module'

@Module({
  imports: [ControllersModule, EnvironmentModule, LoggerModule, ThrottlerModule.forRoot([{ limit: 10, ttl: 60_000 }])],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
