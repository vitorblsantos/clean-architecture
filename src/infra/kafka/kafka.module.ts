import { Module } from '@nestjs/common'

import { KafkaService } from '@app/services/kafka/kafka.service'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { LoggerModule } from '@infra/logger/logger.module'

@Module({
  imports: [EnvironmentModule, LoggerModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
