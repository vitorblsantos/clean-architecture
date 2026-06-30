import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GenerateDto, GenerateResponseDto } from '@api/dto/llm/llm.dto'

import { GenerateCommand } from '@app/llm/command/generate.command'

@ApiTags('LLM')
@Controller({
  path: 'llm',
  version: '1',
})
export class LLMController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/')
  @ApiBody({ type: GenerateDto })
  @ApiOperation({ description: 'Generate LLM response' })
  @ApiResponse({ status: HttpStatus.OK, description: 'LLM response', type: GenerateResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.OK)
  async generate(@Body() body: GenerateDto): Promise<GenerateResponseDto> {
    const response = await this.commandBus.execute<GenerateCommand, string>(
      new GenerateCommand(body.prompt, body.options),
    )

    return GenerateResponseDto.fromResponse(response)
  }
}
