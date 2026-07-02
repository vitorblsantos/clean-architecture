export abstract class ILLMService {
  abstract generate(prompt: string, options?: Record<string, unknown>): Promise<string>
}

export interface ILLMGenerateRes {
  response?: string
}
