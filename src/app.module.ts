import { Module } from '@nestjs/common'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { LoggerModule } from '@infra/logger/logger.module'

@Module({
  imports: [EnvironmentModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
