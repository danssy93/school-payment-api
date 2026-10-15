import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { GuardianRelationship } from 'src/database/enums';

export class CreateGuardianDto {
  @ApiProperty({ example: 'John', required: true })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  first_name: string;

  @ApiPropertyOptional({ example: 'Michael' })
  @IsString({ message: 'Middle name must be a string' })
  @IsOptional()
  middle_name?: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  last_name: string;

  @ApiProperty({ example: '2348012345678', required: true })
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]+$/, { message: 'Phone number can only contain numbers' })
  phone_no: string;

  @ApiPropertyOptional({ example: '2348012345678' })
  @IsString({ message: 'WhatsApp number must be a string' })
  @IsOptional()
  @Matches(/^[0-9]+$/, { message: 'WhatsApp number can only contain numbers' })
  whatsapp_no?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Engineer', required: true })
  @IsString({ message: 'Occupation must be a string' })
  @IsNotEmpty({ message: 'Occupation is required' })
  occupation: string;

  @ApiProperty({ example: '12 Main Street, Lagos', required: true })
  @IsString({ message: 'Home address must be a string' })
  @IsNotEmpty({ message: 'Home address is required' })
  home_address: string;

  @ApiPropertyOptional({ example: '5 Victoria Island, Lagos' })
  @IsString({ message: 'Work address must be a string' })
  @IsOptional()
  work_address?: string;

  @ApiProperty({
    example: 'father',
    enum: GuardianRelationship,
    required: true,
  })
  @IsEnum(GuardianRelationship, {
    message: 'Relationship must be a valid value',
  })
  @IsNotEmpty({ message: 'Relationship is required' })
  relationship: GuardianRelationship;
}

export class UpdateGuardianDto extends PartialType(CreateGuardianDto) {}
