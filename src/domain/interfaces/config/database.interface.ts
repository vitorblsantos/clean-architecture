export abstract class DatabaseConfig {
  abstract getDatabaseHost(): string
  abstract getDatabaseName(): string
  abstract getDatabasePassword(): string
  abstract getDatabasePort(): number
  abstract getDatabaseSchema(): string
  abstract getDatabaseSync(): boolean
  abstract getDatabaseTimezone(): string
  abstract getDatabaseUser(): string
}
