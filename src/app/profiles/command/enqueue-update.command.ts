import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export class EnqueueProfileUpdateCommand {
  constructor(
    public readonly id: ProfilesEntity['id'],
    public readonly name: ProfilesEntity['name'] | undefined,
    public readonly lastname: ProfilesEntity['lastname'] | undefined,
  ) {}
}
