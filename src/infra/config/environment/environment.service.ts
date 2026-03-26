import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { DatabaseConfig } from '../../../domain/config/database.interface'
import { AppConfig } from '../../../domain/config/app.interface'

@Injectable()
export class EnvironmentService implements AppConfig, DatabaseConfig {
  constructor(private configService: ConfigService) {}

  getAppHost(): string {
    return this.configService.getOrThrow<string>('APP_HOST')
  }

  getAppPort(): number {
    return this.configService.getOrThrow<number>('APP_PORT')
  }

  getDatabaseHost(): string {
    return this.configService.getOrThrow<string>('DATABASE_HOST')
  }

  getDatabasePort(): number {
    return this.configService.getOrThrow<number>('DATABASE_PORT')
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

  getEnvironment(): string {
    return this.configService.getOrThrow<string>('NODE_ENV')
  }
}
