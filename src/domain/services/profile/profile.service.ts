import { v6 as uuidv6 } from 'uuid'
import { ProfileEntity } from '@domain/entities/profile.entity'

export class ProfileDomainService {
  canCreateProfile(existingProfile: ProfileEntity | null): boolean {
    return !existingProfile
  }

  createProfileEntity(profileData: {
    name: ProfileEntity['name']
    lastname: ProfileEntity['lastname']
  }): ProfileEntity {
    this.validateProfileData(profileData)

    const profile: ProfileEntity = {
      id: this.generateProfileId(),
      name: profileData.name,
      lastname: profileData.lastname,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return profile
  }

  isProfileComplete(profile: ProfileEntity): boolean {
    return !!(profile.name && profile.lastname)
  }

  validateProfileData(profileData: { name: ProfileEntity['name']; lastname: ProfileEntity['lastname'] }): void {
    this.validateName(profileData.name)
    this.validateLastname(profileData.lastname)
  }

  validateName(name: ProfileEntity['name']): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long')
    }
  }

  validateLastname(lastname: ProfileEntity['lastname']): void {
    if (!lastname || lastname.trim().length < 2) {
      throw new Error('Lastname must be at least 2 characters long')
    }
  }

  generateProfileId(): string {
    return uuidv6()
  }
}
