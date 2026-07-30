import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { LoginDto } from '../../dtos';
import type { Request, Response } from 'express';
import { ResponseFormat } from 'src/common/utils';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Public } from '../../strategies/public.strategy';
import { CurrentUser } from 'src/common';
import { ICurrentUser, User } from 'src/database/entities';
import { UserJwtGuard, UserRefreshAuthGuard } from '../../guards';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Authentication Module')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * User Login
   * @description Authenticates a customer using their credentials and returns an access token.
   * @param loginDto - The customer's login details (email/phone and password).
   * @param res - The HTTP response object.
   * @returns JSON response with access token and user details.
   */

  @ApiOperation({
    summary: 'User Authentication',
    description: 'Validate login credential and provide auth token',
  })
  @ApiOkResponse({
    description: 'Login successful',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login details',
  })
  @Throttle({
    default: {
      limit: 1,
      ttl: 1000,
    },
  })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { message, data, status } = await this.authService.login(loginDto);

    return ResponseFormat.success(res, message, data, status);
  }

  /**payloadpayload
   * Refresh Access Token
   * @description Refreshes the user's access token using a valid refresh token.
   * @param user - The authenticated user's details (from refresh token).
   * @param res - The HTTP response object.
   * @returns JSON response with a new access token.
   */

  @ApiOkResponse({
    description: 'Token refreshed successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'User record not found',
  })
  @ApiBearerAuth('jwt-refresh')
  @UseGuards(UserRefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Res() res: Response, @CurrentUser() user: ICurrentUser) {
    const result = await this.authService.generateAccessToken(user);
    return ResponseFormat.success(res, 'Token refreshed successfully', result);
  }

  /**
   * Logout a customer
   * @description Blacklist a user token
   * @param res - The HTTP response object.
   * @returns JSON response with access token and user details.
   */
  @ApiOperation({
    summary: 'Deactivate customer token',
    description: 'Logout customer and blacklist token',
  })
  @ApiOkResponse({
    description: 'Deactivation/Logout successful',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid user',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or required parameters missing.',
  })
  @Throttle({
    default: {
      limit: 1,
      ttl: 1000,
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(UserJwtGuard)
  @Post('logout')
  async logout(@Res() res: Response, @CurrentUser() user: User) {
    await this.authService.logout(user.id);
    return ResponseFormat.ok(res, 'Logged out successfully');
  }
}
