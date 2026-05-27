import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export class DeleteProfileCommand {
  constructor(public readonly id: ProfilesEntity['id']) {}
}
