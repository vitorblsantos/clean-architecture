import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

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
  synchronize: false,
  schema: config.getDatabaseSchema(),
  migrationsRun: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
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
