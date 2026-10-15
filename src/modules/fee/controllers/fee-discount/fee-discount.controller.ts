import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FeeDiscountService } from '../../services/fee-discount/fee-discount.service';
import { Response } from 'express';
import { CreateFeeDiscountDto, UpdateFeeDiscountDto } from '../../dtos';
import { CurrentUser } from 'src/common';
import { User, UserType } from 'src/database/entities';
import { ResponseFormat } from 'src/common/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserJwtGuard } from 'src/modules/auth/guards';
import { Roles } from 'src/common/decorators/role.decorator';

@ApiTags('Fee Discount Module')
@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
@Controller('fee-discounts')
export class FeeDiscountController {
  protected readonly logger = new Logger(FeeDiscountController.name);

  constructor(private readonly feeDiscountService: FeeDiscountService) {}

  @ApiOperation({ summary: 'Apply discount to a student' })
  @ApiResponse({
    status: 201,
    description: 'Discount applied successfully',
  })
  @ApiResponse({ status: 400, description: 'invalid data' })
  @ApiBody({ type: CreateFeeDiscountDto })
  @Post('apply-discount')
  async applyDiscount(
    @Res() res: Response,
    @Body() payload: CreateFeeDiscountDto,
    @CurrentUser() user: User,
  ) {
    const discount = await this.feeDiscountService.applyDiscount(
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Discount successfully applied',
      discount,
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({
    summary: 'Get student discount',
    description: 'Retrieves the student discount ',
  })
  @ApiResponse({ status: 200, description: 'student discount retrieved' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Get('student/:student_id')
  async getStudentDiscounts(
    @Res() res: Response,
    @Param('student_id') student_id: string,
  ) {
    const discount =
      await this.feeDiscountService.getStudentDiscounts(student_id);
    return ResponseFormat.success(
      res,
      'Discount retrieved successfully',
      discount,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Update a discount' })
  @Patch(':discount_id')
  async updateDiscount(
    @Res() res: Response,
    @Param('discount_id') discount_id: string,
    @Body() payload: UpdateFeeDiscountDto,
  ) {
    const discount = await this.feeDiscountService.updateDiscount(
      discount_id,
      payload,
    );
    return ResponseFormat.success(
      res,
      'Discount updated successfully',
      discount,
      HttpStatus.OK,
    );
  }

  @ApiOperation({ summary: 'Remove a discount' })
  @Delete(':discount_id')
  async removeDiscount(
    @Res() res: Response,
    @Param('discount_id') discount_id: string,
  ) {
    await this.feeDiscountService.removeDiscount(discount_id);
    return ResponseFormat.success(
      res,
      'Discount removed successfully',
      null,
      HttpStatus.OK,
    );
  }
}
