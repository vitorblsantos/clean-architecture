export class CreateProfileCommand {
  constructor(
    public readonly lastname: string,
    public readonly name: string,
  ) {}
}
