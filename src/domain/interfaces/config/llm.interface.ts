export abstract class LLMConfig {
  abstract getLLMBaseUrl(): string
  abstract getLLMModel(): string
  abstract getLLMTimeout(): number
}
