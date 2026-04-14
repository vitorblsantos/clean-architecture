import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CreateProfileDto } from '@api/dto/profile/profile.dto'
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

  @Post('/')
  @ApiBody({ type: CreateProfileDto })
  @ApiOperation({ description: 'Create a new profile' })
  async create(@Body() body: CreateProfileDto): Promise<ProfileEntity> {
    return await this.profileService.create(body)
  }
}
