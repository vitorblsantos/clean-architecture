import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class GenerateDto {
  @ApiProperty({ required: true, example: 'Hello, LLM!' })
  @IsNotEmpty()
  @IsString()
  readonly prompt!: string

  @ApiPropertyOptional({ example: { temperature: 0.7 } })
  @IsOptional()
  @IsObject()
  readonly options?: Record<string, unknown>
}

export class GenerateResponseDto {
  @ApiProperty({ example: 'Generated response text' })
  response!: string

  static fromResponse(response: string): GenerateResponseDto {
    const dto = new GenerateResponseDto()
    dto.response = response
    return dto
  }
}
