import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export class UpdateProfileCommand {
  constructor(
    public readonly id: ProfilesEntity['id'],
    public readonly payload: Partial<ProfilesEntity>,
  ) {}
}
