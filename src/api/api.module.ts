import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from '@api/controllers/health/health.controller'
import { ProfileController } from '@api/controllers/profile/profile.controller'

import { AppModule } from '@app/application.module'

import { EEnvironment } from '@domain/interfaces/enums/environment.enum'
import { KafkaHealthIndicator } from '@infra/health/kafka.health'

const healthProviders: Provider[] =
  process.env.NODE_ENV === EEnvironment.Local
    ? [KafkaHealthIndicator]
    : [
        {
          provide: KafkaHealthIndicator,
          useValue: {
            isHealthy: (key: string) => ({ [key]: { status: 'up', skipped: true } }),
          },
        },
      ]

@Module({
  imports: [CqrsModule, AppModule, TerminusModule],
  controllers: [HealthController, ProfileController],
  providers: [...healthProviders],
})
export class ApiModule {}
