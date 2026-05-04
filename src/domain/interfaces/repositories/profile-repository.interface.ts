import { ProfileEntity } from '@domain/entities/profile.entity'

export interface IProfileRepository {
  create(profile: ProfileEntity): Promise<ProfileEntity>
  delete(id: string): Promise<void>
  findAll(): Promise<ProfileEntity[]>
  findById(id: string): Promise<ProfileEntity>
  update(id: string, payload: Partial<Omit<ProfileEntity, 'id'>>): Promise<ProfileEntity>
}
