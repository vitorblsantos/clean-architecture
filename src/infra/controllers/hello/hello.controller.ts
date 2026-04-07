import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { SayHelloCommand } from '@app/hello/sayHello.command'

import { HelloDto } from './hello-dto.class'

@ApiTags('Hello')
@Controller({
  path: 'hello',
  version: '1',
})
export class HelloController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/')
  @ApiBody({ type: HelloDto })
  @ApiOperation({ description: 'say hello' })
  async login(@Body() body: HelloDto) {
    return await this.commandBus.execute(new SayHelloCommand(body.id))
  }
}
