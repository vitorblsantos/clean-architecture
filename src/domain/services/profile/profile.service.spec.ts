import { ProfileDomainService } from '@domain/services/profile/profile.service'

describe('ProfileDomainService', () => {
  const service = new ProfileDomainService()

  describe('createProfilesEntity', () => {
    it('creates a profile with valid data', () => {
      const profile = service.createProfilesEntity({ name: 'John', lastname: 'Doe' })

      expect(profile.name).toBe('John')
      expect(profile.lastname).toBe('Doe')
      expect(profile.id).toBeDefined()
      expect(profile.deletedAt).toBeNull()
    })

    it('throws when name is too short', () => {
      expect(() => service.createProfilesEntity({ name: 'J', lastname: 'Doe' })).toThrow(
        'Name must be at least 2 characters long',
      )
    })
  })

  describe('canCreateProfile', () => {
    it('returns true when profile does not exist', () => {
      expect(service.canCreateProfile(null)).toBe(true)
    })

    it('returns false when profile already exists', () => {
      const existing = service.createProfilesEntity({ name: 'John', lastname: 'Doe' })
      expect(service.canCreateProfile(existing)).toBe(false)
    })
  })
})
