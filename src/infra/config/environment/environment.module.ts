import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EnvironmentService } from './environment.service'
import { validate } from './environment.validate'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
