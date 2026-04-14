import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ProfileDto, UpdateProfileDto } from '@api/dto/profile/profile.dto'
import { ProfileService } from '@app/services/profile/profile.service'
import { ProfileEntity } from '@domain/entities/profile.entity'

@ApiTags('profile')
@Controller({
  path: 'profile',
  version: '1',
})
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/')
  @ApiOperation({ description: 'Get all profiles' })
  async findAll(): Promise<ProfileEntity[]> {
    return await this.profileService.findAll()
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Profile id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOperation({ description: 'Get a profile by id' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ProfileEntity> {
    return await this.profileService.findById(id)
  }

  @Post('/')
  @ApiBody({ type: ProfileDto })
  @ApiOperation({ description: 'Create a new profile' })
  async create(@Body() body: ProfileDto): Promise<ProfileEntity> {
    return await this.profileService.create(body)
  }

  @Put('/:id')
  @ApiParam({ name: 'id', description: 'Profile id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOperation({ description: 'Update a profile' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateProfileDto): Promise<ProfileEntity> {
    return await this.profileService.update(id, body)
  }
}
