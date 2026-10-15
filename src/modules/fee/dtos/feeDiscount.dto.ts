import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { DiscountReason, DiscountType } from 'src/database/enums/fees.enum';

export class CreateFeeDiscountDto {
  @ApiProperty({ example: 'uuid-of-student', required: true })
  @IsUUID('4', { message: 'student ID must be a valid UUID' })
  @IsNotEmpty({ message: 'student ID is required' })
  student_id: string;

  @ApiProperty({ example: 'uuid-of-fee-structure', required: true })
  @IsUUID('4', { message: 'fee-structure ID must be a valid UUID' })
  @IsNotEmpty({ message: 'fee-structure ID is required' })
  fee_structure_id: string;

  @ApiProperty({
    enum: DiscountType,
    title: 'Discount Type',
    required: true,
  })
  @IsEnum(DiscountType, {
    message: `Discount type must be one of: ${Object.values(DiscountType).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Discount type is required' })
  discount_type: DiscountType;

  @ApiProperty({ example: 50000, required: true })
  @IsNumber({}, { message: 'Discount value must be a number' })
  @Min(0, { message: 'Discount value must be greater than 0' })
  @IsNotEmpty({ message: 'discount value is required' })
  discount_value: number;

  @ApiProperty({
    enum: DiscountReason,
    title: 'Discount Type',
    required: true,
  })
  @IsEnum(DiscountReason, {
    message: `Discount reason must be one of: ${Object.values(DiscountReason).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Discount reason is required' })
  reason: DiscountReason;
}

export class UpdateFeeDiscountDto extends PartialType(CreateFeeDiscountDto) {}
