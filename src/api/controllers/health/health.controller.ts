import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HealthIndicatorFunction,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { SkipThrottle } from '@nestjs/throttler'

import { EEnvironment } from '@domain/interfaces/enums/environment.enum'
import { KafkaHealthIndicator } from '@infra/health/kafka.health'

@SkipThrottle()
@ApiTags('Health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly kafka: KafkaHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ description: 'application health check' })
  check() {
    const checks: HealthIndicatorFunction[] = [
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),
    ]

    if (this.config.get<EEnvironment>('NODE_ENV') === EEnvironment.Local) {
      checks.push(() => this.kafka.isHealthy('kafka'))
    }

    return this.health.check(checks)
  }
}
