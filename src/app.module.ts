import { Module } from '@nestjs/common'

import { EnvironmentModule } from './infra/config/environment/environment.module'

@Module({
  imports: [EnvironmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
