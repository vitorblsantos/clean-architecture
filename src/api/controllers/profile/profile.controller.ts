import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CreateProfileDto } from '@api/dto/profile/profile.dto'
import { ProfileService } from '@app/services/profile/profile.service'

@ApiTags('profile')
@Controller({
  path: 'profile',
  version: '1',
})
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('/')
  @ApiBody({ type: CreateProfileDto })
  @ApiOperation({ description: 'say hello' })
  async login(@Body() body: CreateProfileDto) {
    return await this.profileService.create(body)
  }
}
