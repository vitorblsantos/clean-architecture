import { Module } from '@nestjs/common'
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module'
import { HelloController } from './hello/hello.controller'

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [HelloController],
})
export class ControllersModule {}
