import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { UsecasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module'
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy'

import { SayHelloUseCase } from '@usecases/hello/sayHello.usecase'

import { HelloDto } from './hello-dto.class'

@Controller('hello')
@ApiTags('hello')
export class HelloController {
  constructor(
    @Inject(UsecasesProxyModule.SAY_HELLO_USECASES_PROXY)
    private readonly sayHelloUsecaseProxy: UseCaseProxy<SayHelloUseCase>,
  ) {}

  @Post('/')
  @ApiBody({ type: HelloDto })
  @ApiOperation({ description: 'say hello' })
  async login(@Body() body: HelloDto) {
    return await this.sayHelloUsecaseProxy.getInstance().execute(body.id)
  }
}
