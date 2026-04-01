import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class HelloDto {
  @ApiProperty({ required: true, default: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  @IsNotEmpty()
  @IsString()
  readonly id: string
}
