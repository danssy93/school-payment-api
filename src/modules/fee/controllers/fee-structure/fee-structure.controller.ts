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
import { FeeCategoryService } from '../../services/fee-category/fee-category.service';
import { Response } from 'express';
import { CreateFeeStructureDto, UpdateFeeStructureDto } from '../../dtos';
import { CurrentUser } from 'src/common';
import { User, UserType } from 'src/database/entities';
import { ResponseFormat } from 'src/common/utils';
import { FeeStructureService } from '../../services/fee-structure/fee-structure.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserJwtGuard } from 'src/modules/auth/guards';

@ApiTags('Fee Structure Module')
@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
@Controller('fee-structures')
export class FeeStructureController {
  protected readonly logger = new Logger(FeeStructureController.name);

  constructor(private readonly feeStructureService: FeeStructureService) {}

  @ApiOperation({ summary: 'Create a new fee structure' })
  @ApiResponse({
    status: 201,
    description: 'Fee structure created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiBody({ type: CreateFeeStructureDto })
  @Post()
  async createStructure(
    @Res() res: Response,
    @Body() payload: CreateFeeStructureDto,
    @CurrentUser() user: User,
  ) {
    const structure = await this.feeStructureService.createStructure(
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Structure successfully created',
      structure,
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({ summary: 'Get all fee structures' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get()
  async getAllStructure(@Res() res: Response) {
    const structures = await this.feeStructureService.getAllStructures();
    return ResponseFormat.success(
      res,
      'Structures successfully retrieved',
      structures,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Get fee structures by class' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get('class/:class_id')
  async getStructuresByClass(
    @Res() res: Response,
    @Param('class_id') class_id: string,
  ) {
    const structure =
      await this.feeStructureService.getStructuresByClass(class_id);
    return ResponseFormat.success(
      res,
      'Structure retrieved by class_id',
      structure,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Get fee structures by term' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get('term/:term_id')
  async getStructuresByTerm(
    @Res() res: Response,
    @Param('term_id') term_id: string,
  ) {
    const structure =
      await this.feeStructureService.getStructuresByClass(term_id);
    return ResponseFormat.success(
      res,
      'Structure retrieved by term_id',
      structure,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Get fee structure by ID' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get(':fee_structure_id')
  async findStructure(
    @Res() res: Response,
    @Param('fee_structure_id') fee_structure_id: string,
  ) {
    const structure =
      await this.feeStructureService.getStructuresByClass(fee_structure_id);
    return ResponseFormat.success(
      res,
      'Structure retrieved by fee_structure_id',
      structure,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Update fee structure' })
  @Patch(':fee_structure_id')
  async updateStructure(
    @Res() res: Response,
    @Param('fee_structure_id') fee_structure_id: string,
    @Body() payload: UpdateFeeStructureDto,
  ) {
    const structure = await this.feeStructureService.updateStructure(
      fee_structure_id,
      payload,
    );
    return ResponseFormat.success(
      res,
      'Structure updated successfully',
      structure,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Toggle fee structure active status' })
  @Patch()
  async toggleFeeStructure(
    @Res() res: Response,
    @Param('fee_structure_id') fee_structure_id: string,
  ) {
    const structure =
      await this.feeStructureService.getStructuresByClass(fee_structure_id);
    return ResponseFormat.success(
      res,
      'Structure toggled successfully',
      structure,
      HttpStatus.OK,
    );
  }
}
