import { v6 as uuidv6 } from 'uuid'

import { CreateProfileProps } from '@domain/entities/profiles/create-profile.props'
import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export class ProfilesDomainService {
  canCreateProfile(existingProfile: ProfilesEntity): boolean {
    return !existingProfile
  }

  createProfilesEntity(profileData: CreateProfileProps): ProfilesEntity {
    this.validateProfileData(profileData)

    const profile = {
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

  validateProfileData(profileData: CreateProfileProps): void {
    this.validateName(profileData.name)
    this.validateLastname(profileData.lastname)
  }

  validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long')
    }
  }

  validateLastname(lastname: string): void {
    if (!lastname || lastname.trim().length < 2) {
      throw new Error('Lastname must be at least 2 characters long')
    }
  }

  generateProfileId(): string {
    return uuidv6()
  }
}
