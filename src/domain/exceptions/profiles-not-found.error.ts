import { DomainError } from '@domain/exceptions/domain.error'

export class ProfilesNotFoundError extends DomainError {
  constructor(id?: string) {
    super(id ? `Profiles with id ${id} not found` : 'No profiles found')
  }
}
