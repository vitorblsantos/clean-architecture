import { ProfileEntity } from '@domain/entities/profile.entity'

export interface IProfileService {
  create(profile: ProfileEntity): Promise<ProfileEntity>
  enqueue(payload: Partial<ProfileEntity>): Promise<void>
  findAll(): Promise<ProfileEntity[]>
  findById(id: string): Promise<ProfileEntity>
  update(id: string, payload: Partial<ProfileEntity>): Promise<ProfileEntity>
}
