import 'dotenv/config'

import { DataSourceOptions } from 'typeorm'

import { EEnvironment } from '@domain/interfaces/enums/environment.enum'

const tz = process.env.DATABASE_TIMEZONE

export const typeormConfig: DataSourceOptions = {
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../../**/*.entity{.ts}'],
  extra: {
    options: `-c timezone=${tz}`,
  },
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT!),
  type: 'postgres',
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  schema: process.env.DATABASE_SCHEMA,
  username: process.env.DATABASE_USER,
  ...(process.env.NODE_ENV !== EEnvironment.Local && { ssl: { rejectUnauthorized: false } }),
}

export default typeormConfig
