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
import { TermService } from '../../services/term/term.service';
import { Response } from 'express';
import { CreateTermDto, UpdateTermDto } from '../../dtos';
import { ResponseFormat } from 'src/common/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserType } from 'src/database/entities';
import { UserJwtGuard } from 'src/modules/auth/guards';

@ApiTags('Term Module route')
@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
@Controller('sessions/:session_id/terms')
export class TermController {
  protected readonly logger = new Logger(TermController.name);
  constructor(private readonly termService: TermService) {}

  @ApiOperation({
    summary: 'create a new term',
    description:
      'Create a new term in the system. only accessible by the admin and super-admin',
  })
  @ApiBody({ type: CreateTermDto })
  @ApiResponse({ status: 201, description: 'Term created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Post()
  async createdTerm(
    @Res() res: Response,
    @Param('session_id') session_id: string,
    @Body() payload: CreateTermDto,
  ) {
    const newTerm = await this.termService.createTerm(session_id, payload);
    return ResponseFormat.success(
      res,
      'New term created successfully',
      newTerm,
    );
  }

  @ApiOperation({ summary: 'Get all term' })
  @ApiResponse({
    status: 200,
    description: 'Term retrieved successfully',
  })
  @Get()
  async getAllTerm(
    @Res() res: Response,
    @Param('session_id') session_id: string,
  ) {
    const term = await this.termService.getAllTerm(session_id);
    return ResponseFormat.success(res, 'Terms retrieved successfully', term);
  }

  @ApiOperation({ summary: 'Update term' })
  @ApiResponse({
    status: 200,
    description: 'Term updated successfully',
  })
  @Patch(':term_id')
  async updateTerm(
    @Res() res: Response,
    @Param('session_id') session_id: string,
    @Param('term_id') term_id: string,
    @Body() payload: UpdateTermDto,
  ) {
    const term = await this.termService.updateTerm(
      session_id,
      term_id,
      payload,
    );
    return ResponseFormat.success(res, 'Term updated successfully', term);
  }

  @ApiOperation({ summary: 'Activate term' })
  @ApiResponse({
    status: 200,
    description: 'term activated successfully',
  })
  @Patch(':term_id/activate')
  async activateTerm(
    @Res() res: Response,
    @Param('session_id') session_id: string,
    @Param('term_id') term_id: string,
  ) {
    const activeTerm = await this.termService.activateTerm(session_id, term_id);
    return ResponseFormat.success(
      res,
      'Term activated successfully',
      activeTerm,
    );
  }

  @ApiOperation({ summary: 'deactivate term' })
  @ApiResponse({
    status: 200,
    description: 'Term deactivated successfully',
  })
  @Patch(':term_id/deactivate')
  async deactivateTerm(
    @Res() res: Response,
    @Param('session_id') session_id: string,
    @Param('term_id') term_id: string,
  ) {
    const term = await this.termService.deactivateTerm(session_id, term_id);
    return ResponseFormat.success(res, 'Term deactivated successfully', term);
  }
}
