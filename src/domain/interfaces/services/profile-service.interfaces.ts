import { ProfileEntity } from '@domain/entities/profile.entity'

export interface IProfileService {
  create(profile: ProfileEntity): Promise<ProfileEntity>
  findAll(): Promise<ProfileEntity[]>
}
