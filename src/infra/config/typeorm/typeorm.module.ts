import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { EnvironmentService } from '@infra/config/environment/environment.service'
import { ProfileModel } from '@infra/models/profile/profile.model'

export const getTypeOrmModuleOptions = (config: EnvironmentService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getDatabaseHost(),
  port: config.getDatabasePort(),
  username: config.getDatabaseUser(),
  password: config.getDatabasePassword(),
  database: config.getDatabaseName(),
  entities: [ProfileModel],
  synchronize: config.getDatabaseSync(),
  schema: config.getDatabaseSchema(),
  ssl: {
    rejectUnauthorized: false,
  },
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
