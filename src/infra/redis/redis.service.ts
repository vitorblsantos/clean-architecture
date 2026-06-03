import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import Redis from 'ioredis'

import { EnvironmentService } from '@infra/environment/environment.service'
import { IRedisService } from '@domain/interfaces/redis/redis.interface'

@Injectable()
export class RedisService implements IRedisService, OnModuleInit, OnModuleDestroy {
  private readonly client: Redis

  constructor(private readonly environmentService: EnvironmentService) {
    const pass = this.environmentService.getRedisPassword()

    this.client = new Redis({
      db: this.environmentService.getRedisDb(),
      host: this.environmentService.getRedisHost(),
      lazyConnect: true,
      password: pass ? pass : undefined,
      port: this.environmentService.getRedisPort(),
      ...(this.environmentService.getRedisTlsEnabled()
        ? { tls: { rejectUnauthorized: this.environmentService.getRedisTlsRejectUnauthorized() } }
        : {}),
    })
  }

  async onModuleInit() {
    await this.client.connect()
  }

  async onModuleDestroy() {
    await this.client.quit()
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async ping(): Promise<string> {
    return await this.client.ping()
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl)
    } else {
      await this.client.set(key, value)
    }
  }
}
