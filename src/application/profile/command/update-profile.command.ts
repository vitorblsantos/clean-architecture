import { ProfileEntity } from '@domain/entities/profile.entity'

export class EnqueueProfileUpdateCommand {
  constructor(
    public readonly id: ProfileEntity['id'],
    public readonly name: ProfileEntity['name'] | undefined,
    public readonly lastname: ProfileEntity['lastname'] | undefined,
  ) {}
}
