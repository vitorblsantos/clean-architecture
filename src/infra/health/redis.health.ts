import { Injectable } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'

import { RedisService } from '@infra/redis/redis.service'

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly redisService: RedisService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key)

    try {
      const response = await this.redisService.ping()
      return indicator.up({ response })
    } catch (error) {
      return indicator.down({
        message: error instanceof Error ? error.message : 'Redis is unreachable',
      })
    }
  }
}
