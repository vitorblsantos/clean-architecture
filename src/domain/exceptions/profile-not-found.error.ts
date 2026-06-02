import { DomainError } from '@domain/exceptions/domain.error'

export class ProfileNotFoundError extends DomainError {
  constructor(id?: string) {
    super(id ? `Profile with id ${id} not found` : 'No profiles found')
  }
}
