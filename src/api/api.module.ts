import { Module } from '@nestjs/common'

import { HealthController } from '@api/controllers/health/health.controller'
import { ProfileController } from '@api/controllers/profile/profile.controller'

import { AppModule } from '@app/application.module'

@Module({
  imports: [AppModule],
  controllers: [HealthController, ProfileController],
})
export class ApiModule {}
