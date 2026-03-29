import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ModelUsers } from '@domain/models/users.model'
import { UserRepository } from '@domain/repositories/users.repositories'

import { User } from '@infra/entities/user.entity'

@Injectable()
export class DatabaseUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<ModelUsers | null> {
    const user = await this.userEntityRepository.findOne({
      where: {
        id,
      },
    })

    if (!user) return null
    return user
  }
}
