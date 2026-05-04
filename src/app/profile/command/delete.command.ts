import { ProfileEntity } from '@domain/entities/profile.entity'

export class DeleteProfileCommand {
  constructor(public readonly id: ProfileEntity['id']) {}
}
