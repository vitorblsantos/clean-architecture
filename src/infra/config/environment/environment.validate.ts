import { Logger } from '@nestjs/common'
import { z } from 'zod'

import { EEnvironment } from '@domain/interfaces/enums/environment.enum'

const envSchema = z.object({
  APP_HOST: z.string().default('0.0.0.0'),

  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_NAME: z.string().default('clean-arch'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_SCHEMA: z.string().default('public'),
  DATABASE_SYNCHRONIZE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  DATABASE_USER: z.string().default('postgres'),

  GCP_PROJECT_ID: z.string().min(1),
  GCP_TASKS_LOCATION: z.string().min(1).default('us-central1'),
  GCP_PROFILE_UPDATE_QUEUE: z.string().min(1).default('profile-update'),
  GCP_PROFILE_UPDATE_TASK_URL: z.url(),

  NODE_ENV: z.enum(EEnvironment).default(EEnvironment.Development),
  PORT: z.coerce.number().default(8080),
})

export type Env = z.infer<typeof envSchema>

export const validate = (config: Record<string, unknown>): Env => {
  const parsed = envSchema.safeParse(config)

  if (!parsed.success) {
    Logger.error(z.treeifyError(parsed.error), 'environment.validate')
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}
