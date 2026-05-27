import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export abstract class IProfilesRepository {
  abstract create(profile: ProfilesEntity): Promise<ProfilesEntity>
  abstract delete(id: string): Promise<void>
  abstract findAll(): Promise<ProfilesEntity[]>
  abstract findById(id: string): Promise<ProfilesEntity>
  abstract update(id: string, payload: Partial<Omit<ProfilesEntity, 'id'>>): Promise<ProfilesEntity>
}
