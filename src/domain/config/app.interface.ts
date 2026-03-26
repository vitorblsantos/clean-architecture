export interface AppConfig {
  getAppHost(): string
  getAppPort(): number
  getEnvironment(): string
}
