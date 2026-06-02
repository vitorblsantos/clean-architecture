import { Module } from '@nestjs/common'

import { IKafkaService } from '@domain/interfaces/kafka/kafka.interface'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { KafkaService } from '@infra/kafka/kafka.service'
import { LoggerModule } from '@infra/logger/logger.module'

@Module({
  imports: [EnvironmentModule, LoggerModule],
  providers: [KafkaService, { provide: IKafkaService, useExisting: KafkaService }],
  exports: [KafkaService, IKafkaService],
})
export class KafkaModule {}
