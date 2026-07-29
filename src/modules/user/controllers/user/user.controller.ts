import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../services/user';
import type { Response } from 'express';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from '../../dtos/user.dto';
import { ResponseFormat } from 'src/common/utils';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users Account Module')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create New User Account',
    description: 'Return the user detail of created account',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User create successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Post()
  async createUser(@Body() payload: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(payload);
    return ResponseFormat.success(
      res,
      'User successfully create',
      user,
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @Get()
  async getAllUser(@Res() res: Response) {
    const user = await this.userService.find();
    return ResponseFormat.success(
      res,
      'Users Retrieved successfully',
      user,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async getUserById(@Res() res: Response, @Param('id') id: string) {
    const user = await this.userService.findOne({ id }, true);
    return ResponseFormat.success(
      res,
      'User Retrieved successfully',
      user,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 202, description: 'User updated successfully' })
  @Patch(':id')
  async updateUser(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ) {
    const user = await this.userService.update({ id }, payload);
    return ResponseFormat.success(
      res,
      'User update successfully',
      user,
      HttpStatus.ACCEPTED,
    );
  }

  @ApiOperation({ summary: 'Promote Bursar to Admin' })
  @ApiResponse({ status: 200, description: 'User promoted successfully' })
  @Patch(':id/promote-admin')
  async upgradeUserType(@Res() res: Response, @Param('id') id: string) {
    const user = await this.userService.promoteAdmin(id);
    return ResponseFormat.success(
      res,
      'User upgraded successfully',
      user,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Demote Admin to Bursar' })
  @ApiResponse({ status: 200, description: 'User demoted successfully' })
  @Patch(':id/demote-admin')
  async downgradeUserType(@Res() res: Response, @Param('id') id: string) {
    const user = await this.userService.demoteToBursar(id);
    return ResponseFormat.success(
      res,
      'User downgrade successfully',
      user,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @Patch(':id/change-password')
  async changePassword(
    @Res() res: Response,
    @Body() payload: ChangePasswordDto,
    @Param('id') id: string,
  ) {
    const user = await this.userService.changePassword(id, payload);
    return ResponseFormat.success(
      res,
      'Password successfully changed',
      user,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Deactivate user account' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @Delete(':id')
  async deleteUser(@Res() res: Response, @Param('id') id: string) {
    await this.userService.deactivate(id);
    return ResponseFormat.success(
      res,
      'User successfully deleted',
      null,
      HttpStatus.OK,
    );
  }
}
