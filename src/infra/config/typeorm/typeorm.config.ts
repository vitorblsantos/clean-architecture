import { DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV === 'local') dotenv.config({ path: './env' })

const config: DataSourceOptions = {
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../../**/*.entity{.ts}'],
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT!),
  type: 'postgres',
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  schema: process.env.DATABASE_SCHEMA,
  username: process.env.DATABASE_USER,
  ssl: {
    rejectUnauthorized: false,
  },
}

export default config
