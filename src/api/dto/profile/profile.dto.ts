import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ProfileDto {
  @ApiProperty({ required: true, default: 'John' })
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @ApiProperty({ required: true, default: 'Doe' })
  @IsNotEmpty()
  @IsString()
  readonly lastname: string
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ default: 'John' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string

  @ApiPropertyOptional({ default: 'Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly lastname?: string
}
