export abstract class IOllamaService {
  abstract generate(prompt: string, options?: Record<string, unknown>): Promise<string>
}
