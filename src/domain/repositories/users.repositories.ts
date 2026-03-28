import { ModelUsers } from '@domain/models/users.model'

export interface UserRepository {
  getUserById(id: ModelUsers['id']): Promise<ModelUsers>
}
