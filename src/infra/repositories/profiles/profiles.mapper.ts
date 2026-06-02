import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

import { ProfilesModel } from '@infra/models/profiles/profiles.model'

export const ProfilesMapper = {
  toDomain(model: ProfilesModel): ProfilesEntity {
    const entity = new ProfilesEntity()

    entity.id = model.id
    entity.name = model.name
    entity.lastname = model.lastname
    entity.createdAt = model.createdAt
    entity.updatedAt = model.updatedAt
    entity.deletedAt = model.deletedAt

    return entity
  },

  toPersistence(entity: Partial<ProfilesEntity>): Partial<ProfilesModel> {
    const model: Partial<ProfilesModel> = {}

    if (entity.id !== undefined) model.id = entity.id
    if (entity.name !== undefined) model.name = entity.name
    if (entity.lastname !== undefined) model.lastname = entity.lastname
    if (entity.createdAt !== undefined) model.createdAt = entity.createdAt
    if (entity.updatedAt !== undefined) model.updatedAt = entity.updatedAt
    if (entity.deletedAt !== undefined) model.deletedAt = entity.deletedAt

    return model
  },
}
