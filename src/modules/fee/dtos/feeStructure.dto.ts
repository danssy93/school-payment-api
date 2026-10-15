import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateFeeStructureDto {
  @ApiProperty({ example: 'uuid-of-fee category', required: true })
  @IsUUID('4', { message: 'fee_category ID must be a valid UUID' })
  @IsNotEmpty({ message: 'fee_category ID is required' })
  fee_category_id: string;

  @ApiProperty({ example: 'uuid-of-class', required: true })
  @IsUUID('4', { message: 'class ID must be a valid UUID' })
  @IsNotEmpty({ message: 'class ID is required' })
  class_id: string;

  @ApiProperty({ example: 'uuid-of-class_arm', required: false })
  @IsUUID('4', { message: 'class_arm ID must be a valid UUID' })
  @IsOptional({ message: 'class_arm ID is optional' })
  class_arm_id?: string;

  @ApiProperty({ example: 'uuid-of-term', required: true })
  @IsUUID('4', { message: 'term ID must be a valid UUID' })
  @IsNotEmpty({ message: 'term ID is required' })
  term_id: string;

  @ApiProperty({ example: 'uuid-of-session', required: true })
  @IsUUID('4', { message: 'session ID must be a valid UUID' })
  @IsNotEmpty({ message: 'session ID is required' })
  session_id: string;

  @ApiProperty({
    example: 'N100,000',
    description: 'Amount required',
    required: true,
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0, { message: 'Amount must be greater than 0' })
  @IsNotEmpty({ message: 'amount is required' })
  amount: number;

  @ApiProperty({ example: '2024-11-30', required: true })
  @IsDateString({}, { message: 'Due date must be a valid date (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Due date is required' })
  due_date: string;
}

export class UpdateFeeStructureDto extends PartialType(CreateFeeStructureDto) {}
