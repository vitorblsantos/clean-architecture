import { ProfileEntity } from '@domain/entities/profile.entity'

export interface IProfileRepository {
  create(profile: ProfileEntity): Promise<ProfileEntity>
  findAll(): Promise<ProfileEntity[]>
  findById(id: string): Promise<ProfileEntity>
  update(id: string, profile: Partial<ProfileEntity>): Promise<ProfileEntity>
}
