import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class HelloDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly id: string
}
