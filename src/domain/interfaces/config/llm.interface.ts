export abstract class LlmConfig {
  abstract getLlmBaseUrl(): string
  abstract getLlmModel(): string
  abstract getLlmTimeout(): number
}
