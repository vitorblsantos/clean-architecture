import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ProfilesDto, ProfileResponseDto, UpdateProfileDto } from '@api/dto/profiles/profiles.dto'

import { CreateProfileCommand } from '@app/profiles/command/create.command'
import { DeleteProfileCommand } from '@app/profiles/command/delete.command'
import { EnqueueProfileUpdateCommand } from '@app/profiles/command/enqueue-update.command'
import { UpdateProfileCommand } from '@app/profiles/command/update.command'

import { GetProfileByIdQuery } from '@app/profiles/query/get-profile-by-id.query'
import { GetProfilesQuery } from '@app/profiles/query/get-profiles.query'

import { ProfilesEntity } from '@domain/entities/profiles/profiles.entity'

@ApiTags('Profiles')
@Controller({
  path: 'profiles',
  version: '1',
})
export class ProfilesController {
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
  async findAll(): Promise<ProfileResponseDto[]> {
    const profiles = await this.queryBus.execute<GetProfilesQuery, ProfilesEntity[]>(new GetProfilesQuery())
    return ProfileResponseDto.fromEntities(profiles)
  }

  @Post('/')
  @ApiBody({ type: ProfilesDto })
  @ApiOperation({ description: 'Create a new profile' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Profile created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: ProfilesDto): Promise<ProfileResponseDto> {
    const profile = await this.commandBus.execute<CreateProfileCommand, ProfilesEntity>(
      new CreateProfileCommand(body.name, body.lastname),
    )
    return ProfileResponseDto.fromEntity(profile)
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Profile id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOperation({ description: 'Get a profile by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile found successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No profile found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ProfileResponseDto> {
    const profile = await this.queryBus.execute<GetProfileByIdQuery, ProfilesEntity>(new GetProfileByIdQuery(id))
    return ProfileResponseDto.fromEntity(profile)
  }

  @Put('/:id')
  @ApiParam({ name: 'id', description: 'Profile id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOperation({ description: 'Update a profile' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Profile updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.ACCEPTED)
  async enqueue(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateProfileDto): Promise<void> {
    return await this.commandBus.execute(new EnqueueProfileUpdateCommand(id, body.name, body.lastname))
  }

  @Delete('/:id/delete')
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Profile deleted successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteProfileCommand(id))
  }

  @Put('/:id/update')
  @ApiExcludeEndpoint()
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Profile updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.commandBus.execute<UpdateProfileCommand, ProfilesEntity>(
      new UpdateProfileCommand(id, body),
    )
    return ProfileResponseDto.fromEntity(profile)
  }
}
