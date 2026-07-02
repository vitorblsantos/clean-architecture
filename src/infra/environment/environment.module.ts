import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppConfig } from '@domain/interfaces/config/app.interface'
import { DatabaseConfig } from '@domain/interfaces/config/database.interface'
import { KafkaConfig } from '@domain/interfaces/config/kafka.interface'
import { LLMConfig } from '@domain/interfaces/config/llm.interface'
import { RedisConfig } from '@domain/interfaces/config/redis.interface'
import { EnvironmentDomainService } from '@domain/services/environment/environment.service'

import { EnvironmentService } from '@infra/environment/environment.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => new EnvironmentDomainService().validate(config),
    }),
  ],
  providers: [
    EnvironmentService,
    { provide: AppConfig, useExisting: EnvironmentService },
    { provide: DatabaseConfig, useExisting: EnvironmentService },
    { provide: KafkaConfig, useExisting: EnvironmentService },
    { provide: LLMConfig, useExisting: EnvironmentService },
    { provide: RedisConfig, useExisting: EnvironmentService },
    { provide: LLMConfig, useExisting: EnvironmentService },
  ],
  exports: [EnvironmentService, AppConfig, DatabaseConfig, KafkaConfig, LLMConfig, RedisConfig],
})
export class EnvironmentModule {}
