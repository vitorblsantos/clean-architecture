import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EnvironmentConfigService } from './environment.service'
import { validate } from './environment.validate'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentModule {}
