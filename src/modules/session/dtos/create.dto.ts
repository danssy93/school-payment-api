import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TermName } from 'src/database/enums';

export class CreateSessionDto {
  @ApiProperty({
    example: '2024/2025',
    description: 'Academic session name',
    required: true,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Session start date (YYYY-MM-DD)',
    required: true,
  })
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString(
    {},
    { message: 'Start date must be a valid date format (YYYY-MM-DD)' },
  )
  start_date: string;

  @ApiProperty({
    example: '2024-06-30',
    description: 'Session end date (YYYY-MM-DD) - must be after start date',
    required: true,
  })
  @IsNotEmpty({ message: 'End date is required' })
  @IsDateString(
    {},
    { message: 'End date must be a valid date format (YYYY-MM-DD)' },
  )
  end_date: string;
}

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}

export class CreateTermDto {
  @ApiProperty({
    example: 'first_term',
    description: 'Term name (FIRST_TERM, SECOND_TERM, THIRD_TERM)',
    enum: TermName,
    required: true,
  })
  @IsEnum(TermName, { message: 'Name must be a valid enum value' })
  @IsNotEmpty({ message: 'Name is required' })
  name: TermName;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Start Date',
    required: true,
  })
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString(
    {},
    { message: 'Start date must be a valid date format (YYYY-MM-DD)' },
  )
  start_date: string;

  @ApiProperty({
    example: '2024-06-30',
    description: 'Term end date (YYYY-MM-DD) - must be after start date',
    required: true,
  })
  @IsNotEmpty({ message: 'End date is required' })
  @IsDateString(
    {},
    { message: 'End date must be a valid date  format (YYYY-MM-DD)' },
  )
  end_date: string;
}

export class UpdateTermDto extends PartialType(CreateTermDto) {}
