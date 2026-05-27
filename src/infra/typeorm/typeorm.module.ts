import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { EnvironmentModule } from '@infra/environment/environment.module'
import { EnvironmentService } from '@app/services/environment/environment.service'
import { ProfilesModel } from '@infra/models/profiles/profiles.model'
import { EEnvironment } from '@domain/interfaces/enums/environment.enum'
import { DataSourceOptions } from 'typeorm'

const typeormConfig = (config: EnvironmentService): TypeOrmModuleOptions => {
  const tz = config.getDatabaseTimezone()

  let oddConfig: DataSourceOptions = {
    database: config.getDatabaseName(),
    entities: [ProfilesModel],
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
