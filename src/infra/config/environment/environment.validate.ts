import { Logger } from '@nestjs/common'
import { z } from 'zod'

import { EEnvironment } from '@domain/interfaces/enums/environment.enum'

const envSchema = z
  .object({
    HOST: z.string().default('0.0.0.0'),

    DATABASE_HOST: z.string().default('localhost'),
    DATABASE_NAME: z.string().default('clean-arch'),
    DATABASE_PASSWORD: z.string().default('postgres'),
    DATABASE_PORT: z.coerce.number().default(5432),
    DATABASE_SCHEMA: z.string().default('public'),
    DATABASE_SYNCHRONIZE: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),
    DATABASE_TIMEZONE: z.string().default('UTC'),
    DATABASE_USER: z.string().default('postgres'),

    GCP_PROJECT_ID: z.string().min(1).optional(),
    GCP_TASKS_LOCATION: z.string().min(1).default('us-central1'),

    KAFKA_BROKERS: z.string().min(1).optional(),
    KAFKA_CLIENT_ID: z.string().min(1).default('clean-arch'),

    NODE_ENV: z.enum(EEnvironment).default(EEnvironment.Local),
    PORT: z.coerce.number().default(8080),

    TASK_QUEUE_PROFILE_UPDATE: z.string().min(1).default('profile-update'),
    TASK_URL_PROFILE_UPDATE: z.url().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === EEnvironment.Local) {
      if (!env.KAFKA_BROKERS) {
        ctx.addIssue({
          code: 'custom',
          path: ['KAFKA_BROKERS'],
          message: 'KAFKA_BROKERS is required when NODE_ENV=local',
        })
      }
    } else {
      if (!env.GCP_PROJECT_ID) {
        ctx.addIssue({
          code: 'custom',
          path: ['GCP_PROJECT_ID'],
          message: 'GCP_PROJECT_ID is required when NODE_ENV!=local',
        })
      }
      if (!env.TASK_URL_PROFILE_UPDATE) {
        ctx.addIssue({
          code: 'custom',
          path: ['TASK_URL_PROFILE_UPDATE'],
          message: 'TASK_URL_PROFILE_UPDATE is required when NODE_ENV!=local',
        })
      }
    }
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
