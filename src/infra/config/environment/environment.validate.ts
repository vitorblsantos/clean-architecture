import { Logger } from '@nestjs/common'
import { z } from 'zod'

import { EEnvironment } from '@domain/enums/environment.enum'

const envSchema = z.object({
  APP_HOST: z.string().default('0.0.0.0'),
  APP_PORT: z.coerce.number().default(8080),

  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_NAME: z.string().default('clean-arch'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_SCHEMA: z.string().default('public'),
  DATABASE_SYNCHRONIZE: z.coerce.boolean().default(false),
  DATABASE_USER: z.string().default('postgres'),

  NODE_ENV: z.enum(EEnvironment).default(EEnvironment.Development),
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
