import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { EnvironmentModule } from '@infra/config/environment/environment.module'
import { EnvironmentService } from '@infra/config/environment/environment.service'
import { ProfileModel } from '@infra/models/profile/profile.model'
import { EEnvironment } from '@domain/interfaces/enums/environment.enum'
import { DataSourceOptions } from 'typeorm'

const typeormConfig = (config: EnvironmentService): TypeOrmModuleOptions => {
  const tz = config.getDatabaseTimezone()

  let oddConfig: DataSourceOptions = {
    database: config.getDatabaseName(),
    entities: [ProfileModel],
    extra: {
      options: `-c timezone=${tz}`,
    },
    host: config.getDatabaseHost(),
    password: config.getDatabasePassword(),
    port: config.getDatabasePort(),
    schema: config.getDatabaseSchema(),
    synchronize: config.getDatabaseSync(),
    type: 'postgres',
    username: config.getDatabaseUser(),
  }

  if (config.getAppEnvironment() !== EEnvironment.Local) {
    oddConfig = { ...oddConfig, ssl: { rejectUnauthorized: false } }
  }

  return oddConfig
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: typeormConfig,
    }),
  ],
})
export class TypeOrmConfigModule {}
