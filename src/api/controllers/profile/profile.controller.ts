import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ProfileDto, UpdateProfileDto } from '@api/dto/profile/profile.dto'

import { CreateProfileCommand } from '@app/profile/command/create.command'
import { EnqueueProfileUpdateCommand } from '@app/profile/command/enqueue-update.command'
import { UpdateProfileCommand } from '@app/profile/command/update.command'

import { GetProfileByIdQuery } from '@app/profile/query/get-profile-by-id.query'
import { GetProfilesQuery } from '@app/profile/query/get-profiles.query'
import { ProfileEntity } from '@domain/entities/profile.entity'

@ApiTags('Profiles')
@Controller({
  path: 'profiles',
  version: '1',
})
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/')
  @ApiOperation({ description: 'List of profiles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of profiles' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No profiles found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ProfileEntity[]> {
    return await this.queryBus.execute(new GetProfilesQuery())
  }

  @Post('/')
  @ApiBody({ type: ProfileDto })
  @ApiOperation({ description: 'Create a new profile' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Profile created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: ProfileDto): Promise<ProfileEntity> {
    return await this.commandBus.execute(new CreateProfileCommand(body.name, body.lastname))
  }

  @Put('/')
  @ApiBody({ type: UpdateProfileDto })
  @ApiOperation({ description: 'Update a profile' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Profile updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.ACCEPTED)
  async enqueue(@Body() body: UpdateProfileDto): Promise<void> {
    return await this.commandBus.execute(new EnqueueProfileUpdateCommand(body.id, body.name, body.lastname))
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Profile id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOperation({ description: 'Get a profile by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile found successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No profile found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ProfileEntity> {
    return await this.queryBus.execute(new GetProfileByIdQuery(id))
  }

  @Post('/:id/update')
  @ApiParam({ name: 'id', description: 'Profile id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: ProfileDto })
  @ApiOperation({ description: 'Update a profile' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Profile updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: ProfileDto): Promise<ProfileEntity> {
    return await this.commandBus.execute(new UpdateProfileCommand(id, body))
  }
}
