import z from 'zod'

import { EEnvironment } from '@domain/interfaces/enums/environment.enum'

export type Env = z.infer<EnvironmentDomainService['schema']>

export class EnvironmentDomainService {
  public readonly schema = z.object({
    HOST: z.string().default('0.0.0.0'),

    DATABASE_HOST: z.string().default('localhost'),
    DATABASE_NAME: z.string().default('clean_arch'),
    DATABASE_PASSWORD: z.string().default('postgres'),
    DATABASE_PORT: z.coerce.number().default(5432),
    DATABASE_SCHEMA: z.string().default('public'),
    DATABASE_SYNCHRONIZE: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),
    DATABASE_TIMEZONE: z.string().default('UTC'),
    DATABASE_USER: z.string().default('postgres'),

    HUBSPOT_ACCESS_TOKEN: z.string().min(1).optional(),
    HUBSPOT_API_BASE: z.string().url().optional(),

    KAFKA_BROKERS: z.string().min(1).optional(),
    KAFKA_CLIENT_ID: z.string().min(1).default('clean-arch'),
    KAFKA_TOPIC_PROFILES_SYNC: z.string().min(1),
    KAFKA_TOPIC_PROFILES_SYNC_DLQ: z.string().min(1).optional(),

    NODE_ENV: z.enum(EEnvironment).default(EEnvironment.Local),

    OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
    OLLAMA_MODEL: z.string().min(1).default('qwen2.5:3b'),
    OLLAMA_TIMEOUT: z.coerce.number().default(30000),

    PORT: z.coerce.number().default(8080),

    REDIS_DB: z.coerce.number().default(0),
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_TLS_ENABLED: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),
    REDIS_TLS_REJECT_UNAUTHORIZED: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),
  })

  validate(config: Record<string, unknown>): Env {
    const parsed = this.schema.safeParse(config)

    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error)
      throw new Error(`Invalid environment variables: ${JSON.stringify(fieldErrors)}`)
    }

    return parsed.data
  }
}
