import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EnvironmentService } from '@app/services/environment/environment.service'
import { EnvironmentDomainService } from '@domain/services/environment/environment.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => new EnvironmentDomainService().validate(config),
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
