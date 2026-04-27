import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from '@api/controllers/health/health.controller'
import { ProfileController } from '@api/controllers/profile/profile.controller'

import { AppModule } from '@app/application.module'

@Module({
  imports: [CqrsModule, AppModule, TerminusModule],
  controllers: [HealthController, ProfileController],
})
export class ApiModule {}
