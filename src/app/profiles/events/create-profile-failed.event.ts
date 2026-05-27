export class CreateProfileFailedEvent {
  constructor(
    public readonly profile: string,
    public readonly error: Error,
  ) {}
}
