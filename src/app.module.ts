import { Module } from '@nestjs/common'

import { EnvironmentConfigModule } from './infra/config/environment/environment.module'

@Module({
  imports: [EnvironmentConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
