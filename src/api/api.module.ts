import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from '@api/controllers/health/health.controller'
import { ProfilesController } from '@api/controllers/profiles/profiles.controller'

import { AppModule } from '@app/app.module'
import { EnvironmentModule } from '@infra/environment/environment.module'
import { KafkaHealthIndicator } from '@infra/health/kafka.health'

@Module({
  imports: [AppModule, CqrsModule, EnvironmentModule, TerminusModule],
  controllers: [HealthController, ProfilesController],
  providers: [KafkaHealthIndicator],
})
export class ApiModule {}
