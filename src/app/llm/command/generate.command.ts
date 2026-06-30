export class GenerateCommand {
  constructor(
    public readonly prompt: string,
    public readonly options?: Record<string, unknown>,
  ) {}
}
