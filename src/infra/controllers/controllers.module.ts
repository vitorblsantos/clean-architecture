import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module'
import { HealthController } from './health/health.controller'
import { HelloController } from './hello/hello.controller'

@Module({
  imports: [TerminusModule, UsecasesProxyModule.register()],
  controllers: [HealthController, HelloController],
})
export class ControllersModule {}
