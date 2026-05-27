export interface KafkaConfig {
  getKafkaBrokers(): string[]
  getKafkaClientId(): string
  getKafkaTopicProfilesSync(): string
  getKafkaTopicProfilesSyncDLQ(): string
}
