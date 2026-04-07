import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmConfigModule } from '@infra/config/typeorm/typeorm.module'
import { User } from '@infra/entities/user.entity'

import { DatabaseUserRepository } from './users.repository'

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User])],
  providers: [DatabaseUserRepository, { provide: 'UserRepository', useClass: DatabaseUserRepository }],
  exports: [DatabaseUserRepository, 'UserRepository'],
})
export class RepositoriesModule {}
