import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateFeeCategoryDto {
  @ApiProperty({
    example: 'Tuition Fee',
    title: 'Fee Category Name',
    required: true,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(255, { message: 'Name must be less than 255 characters long' })
  name: string;

  @ApiPropertyOptional({
    example: 'Annual tuition fee for all students',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    title: 'Is Mandatory',
    required: true,
  })
  @IsBoolean({ message: 'Is Mandatory must be a boolean' })
  @IsNotEmpty({ message: 'Is Mandatory is required' })
  is_mandatory: boolean;
}

export class UpdateFeeCategoryDto extends PartialType(CreateFeeCategoryDto) {}
