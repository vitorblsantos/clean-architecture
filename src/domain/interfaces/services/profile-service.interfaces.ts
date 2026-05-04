import { ProfileEntity } from '@domain/entities/profile.entity'

export interface IProfileService {
  create(profile: ProfileEntity): Promise<ProfileEntity>
  delete(id: string): Promise<void>
  enqueue(payload: Partial<ProfileEntity>): Promise<void>
  findAll(): Promise<ProfileEntity[]>
  findById(id: string): Promise<ProfileEntity>
  update(payload: Partial<ProfileEntity>): Promise<ProfileEntity>
}
