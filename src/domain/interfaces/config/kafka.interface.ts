export abstract class KafkaConfig {
  abstract getKafkaBrokers(): string[]
  abstract getKafkaClientId(): string
  abstract getKafkaTopicProfilesSync(): string
  abstract getKafkaTopicProfilesSyncDLQ(): string
}
