import { DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV === 'local') dotenv.config({ path: './env' })

const config: DataSourceOptions = {
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  host: process.env.DATABASE_HOST,
  migrationsRun: false,
  migrations: ['database/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT!),
  type: 'postgres',
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
  username: process.env.DATABASE_USER,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
}

export default config
