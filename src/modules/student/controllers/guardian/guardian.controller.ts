import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GuardianService } from '../../services/guardian/guardian.service';
import { Response } from 'express';
import { CreateGuardianDto, UpdateGuardianDto } from '../../dtos/guardian.dto';
import { ResponseFormat } from 'src/common/utils';
import { Roles } from 'src/common/decorators/role.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UserType } from 'src/database/entities';
import { UserJwtGuard } from 'src/modules/auth/guards';
import { FilterGuardianDto } from '../../dtos/pagination.dto';

@ApiTags('Guardian Module')
@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Controller('guardians')
export class GuardianController {
  protected readonly logger = new Logger(GuardianController.name);

  constructor(private readonly guardianService: GuardianService) {}

  @ApiOperation({
    summary: 'Create a new guardian',
    description:
      'Creates a new guardian in the system. Only accessible by admin users.',
  })
  @ApiBody({ type: CreateGuardianDto })
  @ApiResponse({ status: 201, description: 'Guardian created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Post()
  async createGuardian(
    @Res() res: Response,
    @Body() payload: CreateGuardianDto,
  ) {
    const newGuardian = await this.guardianService.createGuardian(payload);
    return ResponseFormat.success(
      res,
      'Guardian created successfully',
      newGuardian,
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({
    summary: 'Get all guardians',
    description: 'Retrieves a list of all guardians in the system.',
  })
  @ApiResponse({ status: 200, description: 'Guardians retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No guardians found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get()
  async getAllGuardians(@Res() res: Response, @Body() filters: FilterGuardianDto) {
    const guardians = await this.guardianService.getAllGuardians(filters);
    return ResponseFormat.success(
      res,
      'Guardians retrieved successfully',
      guardians,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Get guardian by ID',
    description: 'Retrieves a specific guardian by their ID.',
  })
  @ApiResponse({ status: 200, description: 'Guardian retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Guardian not found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get(':guardian_id')
  async getGuardiansById(
    @Res() res: Response,
    @Param('guardian_id') guardian_id: string,
  ) {
    const guardian = await this.guardianService.getGuardianById(guardian_id);
    return ResponseFormat.success(
      res,
      'Guardian retrieved successfully',
      guardian,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Update guardian by ID',
    description: 'Updates a specific guardian by their ID.',
  })
  @ApiBody({ type: UpdateGuardianDto })
  @ApiResponse({ status: 200, description: 'Guardian updated successfully' })
  @ApiResponse({ status: 404, description: 'Guardian not found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Patch(':guardian_id')
  async updatedGuardian(
    @Res() res: Response,
    @Param('guardian_id') guardian_id: string,
    @Body() payload: UpdateGuardianDto,
  ) {
    const guardian = await this.guardianService.updatedGuardians(
      guardian_id,
      payload,
    );
    return ResponseFormat.success(
      res,
      'Guardian updated successfully',
      guardian,
      HttpStatus.OK,
    );
  }
}
