import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export interface IProfilesService {
  create(profile: ProfilesEntity): Promise<ProfilesEntity>
  delete(id: string): Promise<void>
  enqueue(payload: Partial<ProfilesEntity>): Promise<void>
  findAll(): Promise<ProfilesEntity[]>
  findById(id: string): Promise<ProfilesEntity>
  update(payload: Partial<ProfilesEntity>): Promise<ProfilesEntity>
}
