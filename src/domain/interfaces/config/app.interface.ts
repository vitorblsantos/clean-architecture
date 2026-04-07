export interface AppConfig {
  getAppEnvironment(): string
  getAppHost(): string
  getAppPort(): number
}
