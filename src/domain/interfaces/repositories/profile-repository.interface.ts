import { ProfileEntity } from '@domain/entities/profile.entity'

export interface IProfileRepository {
  create(profile: ProfileEntity): Promise<ProfileEntity>
}
