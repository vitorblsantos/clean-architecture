import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AppConfig } from '@domain/interfaces/config/app.interface'
import { DatabaseConfig } from '@domain/interfaces/config/database.interface'
import { KafkaConfig } from '@domain/interfaces/config/kafka.interface'
import { LLMConfig } from '@domain/interfaces/config/llm.interface'
import { EEnvironment } from '@domain/interfaces/enums/environment.enum'
import { RedisConfig } from '@domain/interfaces/config/redis.interface'

@Injectable()
export class EnvironmentService implements AppConfig, DatabaseConfig, KafkaConfig, LLMConfig, RedisConfig {
  constructor(private configService: ConfigService) {}

  getAppEnvironment(): EEnvironment {
    return this.configService.getOrThrow<EEnvironment>('NODE_ENV')
  }

  getAppHost(): string {
    return this.configService.getOrThrow<string>('HOST')
  }

  getAppPort(): number {
    return this.configService.getOrThrow<number>('PORT')
  }

  getDatabaseHost(): string {
    return this.configService.getOrThrow<string>('DATABASE_HOST')
  }

  getDatabasePort(): number {
    return this.configService.getOrThrow<number>('DATABASE_PORT')
  }

  getDatabaseTimezone(): string {
    return this.configService.getOrThrow<string>('DATABASE_TIMEZONE')
  }

  getDatabaseUser(): string {
    return this.configService.getOrThrow<string>('DATABASE_USER')
  }

  getDatabasePassword(): string {
    return this.configService.getOrThrow<string>('DATABASE_PASSWORD')
  }

  getDatabaseName(): string {
    return this.configService.getOrThrow<string>('DATABASE_NAME')
  }

  getDatabaseSchema(): string {
    return this.configService.getOrThrow<string>('DATABASE_SCHEMA')
  }

  getDatabaseSync(): boolean {
    return this.configService.getOrThrow<boolean>('DATABASE_SYNCHRONIZE')
  }

  getKafkaBrokers(): string[] {
    return this.configService
      .getOrThrow<string>('KAFKA_BROKERS')
      .split(',')
      .map((broker) => broker.trim())
  }

  getKafkaClientId(): string {
    return this.configService.getOrThrow<string>('KAFKA_CLIENT_ID')
  }

  getKafkaTopicProfilesSync(): string {
    return this.configService.getOrThrow<string>('KAFKA_TOPIC_PROFILES_SYNC')
  }

  getKafkaTopicProfilesSyncDLQ(): string {
    return this.configService.getOrThrow<string>('KAFKA_TOPIC_PROFILES_SYNC_DLQ')
  }

  getRedisDb(): number {
    return this.configService.getOrThrow<number>('REDIS_DB')
  }

  getRedisHost(): string {
    return this.configService.getOrThrow<string>('REDIS_HOST')
  }

  getRedisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD') ?? ''
  }

  getRedisPort(): number {
    return this.configService.getOrThrow<number>('REDIS_PORT')
  }

  getRedisTlsEnabled(): boolean {
    return this.configService.getOrThrow<boolean>('REDIS_TLS_ENABLED')
  }

  getRedisTlsRejectUnauthorized(): boolean {
    return this.configService.getOrThrow<boolean>('REDIS_TLS_REJECT_UNAUTHORIZED')
  }

  getLLMBaseUrl(): string {
    return this.configService.getOrThrow<string>('OLLAMA_BASE_URL')
  }

  getLLMModel(): string {
    return this.configService.getOrThrow<string>('OLLAMA_MODEL')
  }

  getLLMTimeout(): number {
    return this.configService.getOrThrow<number>('OLLAMA_TIMEOUT')
  }
}
