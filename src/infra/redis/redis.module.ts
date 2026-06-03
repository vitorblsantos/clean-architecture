import { Module } from '@nestjs/common'

import { IRedisService } from '@domain/interfaces/redis/redis.interface'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { LoggerModule } from '@infra/logger/logger.module'
import { RedisService } from '@infra/redis/redis.service'

@Module({
  imports: [EnvironmentModule, LoggerModule],
  providers: [RedisService, { provide: IRedisService, useExisting: RedisService }],
  exports: [RedisService, IRedisService],
})
export class RedisModule {}
