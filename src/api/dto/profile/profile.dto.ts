import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateProfileDto {
  @ApiProperty({ required: true, default: 'John' })
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @ApiProperty({ required: true, default: 'Doe' })
  @IsNotEmpty()
  @IsString()
  readonly lastname: string
}
