import { v6 as uuidv6 } from 'uuid'
import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export class ProfileDomainService {
  canCreateProfile(existingProfile: ProfilesEntity | null): boolean {
    return !existingProfile
  }

  createProfilesEntity(profileData: {
    name: ProfilesEntity['name']
    lastname: ProfilesEntity['lastname']
  }): ProfilesEntity {
    this.validateProfileData(profileData)

    const profile: ProfilesEntity = {
      id: this.generateProfileId(),
      deletedAt: null,
      name: profileData.name,
      lastname: profileData.lastname,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return profile
  }

  isProfileComplete(profile: ProfilesEntity): boolean {
    return !!(profile.name && profile.lastname)
  }

  updateProfilesEntity(profileData: Partial<ProfilesEntity>): Partial<ProfilesEntity> {
    const { id, name, lastname } = profileData

    if (!id) throw new Error('id is required')
    if (!name && !lastname) throw new Error('At least one of name or lastname is required to update a profile')
    const payload = { ...profileData, updatedAt: new Date() }

    return payload
  }

  validateProfileData(profileData: { name: ProfilesEntity['name']; lastname: ProfilesEntity['lastname'] }): void {
    this.validateName(profileData.name)
    this.validateLastname(profileData.lastname)
  }

  validateName(name: ProfilesEntity['name']): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long')
    }
  }

  validateLastname(lastname: ProfilesEntity['lastname']): void {
    if (!lastname || lastname.trim().length < 2) {
      throw new Error('Lastname must be at least 2 characters long')
    }
  }

  generateProfileId(): string {
    return uuidv6()
  }
}
