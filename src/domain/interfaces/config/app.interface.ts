import { EEnvironment } from '@domain/interfaces/enums/environment.enum'

export abstract class AppConfig {
  abstract getAppEnvironment(): EEnvironment
  abstract getAppHost(): string
  abstract getAppPort(): number
}
