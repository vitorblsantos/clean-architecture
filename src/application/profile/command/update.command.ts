import { ProfileEntity } from '@domain/entities/profile.entity'

export class UpdateProfileCommand {
  constructor(
    public readonly id: ProfileEntity['id'],
    public readonly payload: Partial<ProfileEntity>,
  ) {}
}
