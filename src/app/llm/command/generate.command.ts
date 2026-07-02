export class LLMGenerateCommand {
  constructor(
    public readonly prompt: string,
    public readonly options?: Record<string, unknown>,
  ) {}
}
