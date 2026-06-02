import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export abstract class IProfilesService {
  abstract create(payload: Partial<ProfilesEntity>): Promise<ProfilesEntity>
  abstract delete(id: string): Promise<void>
  abstract enqueue(payload: Partial<ProfilesEntity>): Promise<void>
  abstract findAll(): Promise<ProfilesEntity[]>
  abstract findById(id: string): Promise<ProfilesEntity>
  abstract update(payload: Partial<ProfilesEntity> & { id: string }): Promise<ProfilesEntity>
}
