import type { MigrationInterface } from 'typeorm'

import { AddProfile1775563200000 } from './migrations/1775563200000-add-profile'

export const typeOrmMigrations: (new () => MigrationInterface)[] = [AddProfile1775563200000]
