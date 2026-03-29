import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { addUser1774808948434 } from '@database/migrations/index.migrations'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { EnvironmentService } from '@infra/config/environment/environment.service'
import { User } from '@infra/entities/user.entity'

export const getTypeOrmModuleOptions = (config: EnvironmentService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getDatabaseHost(),
  port: config.getDatabasePort(),
  username: config.getDatabaseUser(),
  password: config.getDatabasePassword(),
  database: config.getDatabaseName(),
  entities: [User],
  synchronize: config.getDatabaseSync(),
  schema: config.getDatabaseSchema(),
  migrationsRun: true,
  migrations: [addUser1774808948434],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
})

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}
