import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from '../../services/session/session.service';
import { ResponseFormat } from 'src/common/utils';
import { User, UserType } from 'src/database/entities';
import { CreateSessionDto, UpdateSessionDto } from '../../dtos';
import { CurrentUser } from 'src/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserJwtGuard } from 'src/modules/auth/guards';

@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
@ApiTags('Academic session controller')
@Controller('sessions')
export class SessionController {
  protected readonly Logger = new Logger(SessionController.name);

  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({
    summary: 'Create a new academic session',
    description:
      'Create a new academic session in the system. Only accessible by the admin',
  })
  @ApiBody({ type: CreateSessionDto })
  @ApiResponse({
    status: 201,
    description: 'Academic session created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invaild data' })
  @Post()
  async createSession(
    @Res() res: Response,
    @Body() payload: CreateSessionDto,
    @CurrentUser() user: User,
  ) {
    const newSession = await this.sessionService.createSession(
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Academic Session created successfully',
      newSession,
    );
  }

  @ApiOperation({ summary: 'Get all academic session' })
  @ApiResponse({
    status: 200,
    description: 'Academic sessions retrieved successfully',
  })
  @Get()
  async getAllSessions(@Res() res: Response) {
    const sessions = await this.sessionService.getAllSessions();
    return ResponseFormat.success(
      res,
      'Academic sessions retrieved successfully',
      sessions,
    );
  }

  @ApiOperation({ summary: 'Get the active academic session' })
  @ApiResponse({
    status: 200,
    description: 'Active Academic sessions retrieve successfully',
  })
  @Get('active')
  async getActiveSession(@Res() res: Response) {
    const activeSession = await this.sessionService.getActiveSession();
    return ResponseFormat.success(
      res,
      'Active academic session retrieved successfully',
      activeSession,
    );
  }

  @ApiOperation({ summary: 'Get academic session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Active Academic sessions retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Academic session not found' })
  @Get(':session_id')
  async findSession(
    @Res() res: Response,
    @Param('session_id') session_id: string,
  ) {
    const session = await this.sessionService.findSession(session_id);
    return ResponseFormat.success(
      res,
      'Academic session retrieved successfully',
      session,
    );
  }

  @ApiOperation({ summary: 'Update academic session' })
  @ApiResponse({
    status: 200,
    description: ' Academic sessions Update successfully',
  })
  @ApiResponse({ status: 400, description: 'Academic session not found' })
  @Patch(':session_id')
  async updateSession(
    @Res() res: Response,
    @Param('session_id') session_id: string,
    @Body() payload: UpdateSessionDto,
  ) {
    const updateSession = await this.sessionService.updateSession(
      session_id,
      payload,
    );
    return ResponseFormat.success(
      res,
      'Academic session updated successfully',
      updateSession,
    );
  }

  @ApiOperation({ summary: 'Activate academic session' })
  @ApiResponse({
    status: 200,
    description: ' Academic sessions activated successfully',
  })
  @ApiResponse({ status: 400, description: 'Academic session not found' })
  @Patch(':session_id/activate')
  async activateSession(
    @Res() res: Response,
    @Param('session_id') session_id: string,
  ) {
    const activeSession = await this.sessionService.activateSession(session_id);
    return ResponseFormat.success(
      res,
      'Academic session activated successfully.',
      activeSession,
    );
  }

  @ApiOperation({ summary: 'Lock academic session' })
  @ApiResponse({
    status: 200,
    description: ' Academic sessions locked successfully',
  })
  @ApiResponse({ status: 400, description: 'Academic session not found' })
  @Patch(':session_id/lock')
  async lockSession(
    @Res() res: Response,
    @Param('session_id') session_id: string,
  ) {
    const session = await this.sessionService.lockSession(session_id);
    return ResponseFormat.success(
      res,
      'Academic session locked successfully',
      session,
    );
  }

  @ApiOperation({ summary: 'Unlock academic session' })
  @ApiResponse({
    status: 200,
    description: 'Academic session unlocked successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Academic session is already unlocked',
  })
  @ApiResponse({
    status: 404,
    description: 'Academic session not found',
  })
  @UseGuards(UserJwtGuard)
  @Roles(UserType.SUPER_ADMIN)
  @Patch(':session_id/unlock')
  async unlockSession(
    @Res() res: Response,
    @Param('session_id') session_id: string,
  ) {
    const session = await this.sessionService.unlockSession(session_id);

    return ResponseFormat.success(
      res,
      'Academic session unlocked successfully',
      session,
    );
  }

  @ApiOperation({ summary: 'Deactivate academic session' })
  @ApiResponse({
    status: 200,
    description: ' Academic sessions deactivated successfully',
  })
  @ApiResponse({ status: 400, description: 'Academic session not found' })
  @Patch(':session_id/deactivate')
  async deactivateSession(
    @Res() res: Response,
    @Param('session_id') session_id: string,
  ) {
    const session = await this.sessionService.deactivateSession(session_id);
    return ResponseFormat.success(
      res,
      'Academic session deactivated successfully',
      session,
    );
  }
}
