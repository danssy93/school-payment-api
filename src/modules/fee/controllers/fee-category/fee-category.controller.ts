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
import { CreateFeeCategoryDto, UpdateFeeCategoryDto } from '../../dtos';
import { CurrentUser } from 'src/common';
import { User, UserType } from 'src/database/entities';
import { ResponseFormat } from 'src/common/utils';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserJwtGuard } from 'src/modules/auth/guards';

@ApiTags('Fee Category Module')
@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
@Controller('fee-categories')
export class FeeCategoryController {
  protected readonly logger = new Logger(FeeCategoryController.name);

  constructor(private readonly feeCategoryService: FeeCategoryService) {}

  @ApiOperation({ summary: 'Create a new fee category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @Post()
  async createCategory(
    @Res() res: Response,
    @Body() payload: CreateFeeCategoryDto,
    @CurrentUser() user: User,
  ) {
    const category = await this.feeCategoryService.createCategory(
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Category successfully created',
      category,
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({ summary: 'Get all fee categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get()
  async getAllCategories(@Res() res: Response) {
    const categories = await this.feeCategoryService.getAllCategories();
    return ResponseFormat.success(
      res,
      'Categories retrived successfully',
      categories,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Get fee category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get(':category_id')
  async findCategory(
    @Res() res: Response,
    @Param('category_id') category_id: string,
  ) {
    const category = await this.feeCategoryService.findCategory(category_id);
    return ResponseFormat.success(
      res,
      'Category retrived successfull',
      category,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Update fee category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @Patch(':category_id')
  async updateCategory(
    @Res() res: Response,
    @Param('category_id') category_id: string,
    @Body() payload: UpdateFeeCategoryDto,
  ) {
    const category = await this.feeCategoryService.updateCategory(
      category_id,
      payload,
    );
    return ResponseFormat.success(
      res,
      'Category updated successfully',
      category,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Toggle fee category active status' })
  @ApiResponse({ status: 200, description: 'Category toggled successfully' })
  @Patch(':category_id/toggle')
  async toggleCategory(
    @Res() res: Response,
    @Param('category_id') category_id: string,
  ) {
    const category = await this.feeCategoryService.toggleCategory(category_id);
    return ResponseFormat.success(
      res,
      'Category toggled successfully',
      category,
      HttpStatus.OK,
    );
  }
}
