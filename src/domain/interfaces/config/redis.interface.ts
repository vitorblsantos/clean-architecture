export abstract class RedisConfig {
  abstract getRedisDb(): number
  abstract getRedisHost(): string
  abstract getRedisPassword(): string
  abstract getRedisPort(): number
  abstract getRedisTlsEnabled(): boolean
  abstract getRedisTlsRejectUnauthorized(): boolean
}
