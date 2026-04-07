import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { ApiModule } from '@api/api.module'
import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { LoggerModule } from '@infra/logger/logger.module'

@Module({
  imports: [ApiModule, EnvironmentModule, LoggerModule, ThrottlerModule.forRoot([{ limit: 10, ttl: 60_000 }])],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
