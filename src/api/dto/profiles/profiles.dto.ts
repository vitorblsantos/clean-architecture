import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

export class ProfilesDto {
  @ApiProperty({ required: true, default: 'John' })
  @IsNotEmpty()
  @IsString()
  readonly name!: string

  @ApiProperty({ required: true, default: 'Doe' })
  @IsNotEmpty()
  @IsString()
  readonly lastname!: string
}

export class ProfileResponseDto {
  @ApiProperty({ example: '1ef9b8c0-1e2d-6a3b-9c4d-5e6f7a8b9c0d' })
  id!: string

  @ApiProperty({ example: 'John' })
  name!: string

  @ApiProperty({ example: 'Doe' })
  lastname!: string

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  deletedAt!: Date | null

  static fromEntity(entity: ProfilesEntity): ProfileResponseDto {
    const dto = new ProfileResponseDto()

    dto.id = entity.id
    dto.name = entity.name
    dto.lastname = entity.lastname
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    dto.deletedAt = entity.deletedAt

    return dto
  }

  static fromEntities(entities: ProfilesEntity[]): ProfileResponseDto[] {
    return entities.map((entity) => ProfileResponseDto.fromEntity(entity))
  }
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
