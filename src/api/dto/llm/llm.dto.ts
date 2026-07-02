import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'

export class OllamaGenerateOptionsDto {
  @ApiPropertyOptional({ description: 'Sampling temperature. Higher is more creative.', example: 0.7, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly temperature?: number

  @ApiPropertyOptional({ description: 'Limits the next token to the top K most probable.', example: 40, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly top_k?: number

  @ApiPropertyOptional({ description: 'Nucleus sampling probability mass.', example: 0.9, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  readonly top_p?: number

  @ApiPropertyOptional({
    description: 'Minimum probability relative to the most likely token.',
    example: 0.05,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  readonly min_p?: number

  @ApiPropertyOptional({ description: 'Typical sampling probability mass.', example: 1.0, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly typical_p?: number

  @ApiPropertyOptional({ description: 'Seed for deterministic generation.', example: 42, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly seed?: number

  @ApiPropertyOptional({
    description: 'Maximum number of tokens to generate. -1 = infinite, -2 = fill context.',
    example: 512,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly num_predict?: number

  @ApiPropertyOptional({ description: 'Size of the context window (in tokens).', example: 4096, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly num_ctx?: number

  @ApiPropertyOptional({ description: 'Number of initial tokens to keep when truncating context.', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly num_keep?: number

  @ApiPropertyOptional({ description: 'Penalty applied to repeated tokens.', example: 1.1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly repeat_penalty?: number

  @ApiPropertyOptional({
    description: 'Window of tokens considered for the repeat penalty. -1 = num_ctx.',
    example: 64,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly repeat_last_n?: number

  @ApiPropertyOptional({ description: 'OpenAI-style presence penalty.', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly presence_penalty?: number

  @ApiPropertyOptional({ description: 'OpenAI-style frequency penalty.', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly frequency_penalty?: number

  @ApiPropertyOptional({ description: 'Whether to penalize newlines.', type: Boolean })
  @IsOptional()
  @IsBoolean()
  readonly penalize_newline?: boolean

  @ApiPropertyOptional({ description: 'Mirostat sampling mode: 0 (off), 1 or 2.', example: 0, enum: [0, 1, 2] })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2)
  readonly mirostat?: number

  @ApiPropertyOptional({ description: 'Mirostat target entropy (tau).', example: 5.0, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly mirostat_tau?: number

  @ApiPropertyOptional({ description: 'Mirostat learning rate (eta).', example: 0.1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly mirostat_eta?: number

  @ApiPropertyOptional({
    description: 'Sequences that stop generation when produced.',
    example: ['\n\n', 'User:'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly stop?: string[]

  @ApiPropertyOptional({ description: 'Number of threads to use during computation.', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly num_thread?: number
}

export class OllamaGenerateResDto {
  @ApiProperty({ example: 'Generated response text' })
  response!: string

  static fromResponse(response: string): OllamaGenerateResDto {
    const dto = new OllamaGenerateResDto()
    dto.response = response
    return dto
  }
}

export class OllamaGenerateReqDto {
  @ApiProperty({ required: true, example: 'Hello, LLM!' })
  @IsNotEmpty()
  @IsString()
  readonly prompt!: string

  @ApiPropertyOptional({ type: OllamaGenerateOptionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OllamaGenerateOptionsDto)
  readonly options?: OllamaGenerateOptionsDto
}
