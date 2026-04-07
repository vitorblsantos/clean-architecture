import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { SayHelloHandler } from '@app/hello/sayHello.handler'

@Module({
  imports: [CqrsModule],
  providers: [SayHelloHandler],
  exports: [SayHelloHandler],
})
export class UseCasesModule {}
