import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
} from 'class-validator';
import {
  BloodGroup,
  Gender,
  Genotype,
  GuardianRelationship,
  StudentStatus,
} from 'src/database/enums';

export class CreateStudentDto {
  @ApiProperty({ example: 'John', required: true })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name can only contain letters' })
  first_name: string;

  @ApiPropertyOptional({ example: 'Michael' })
  @IsString({ message: 'Middle name must be a string' })
  @IsOptional()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Middle name can only contain letters' })
  middle_name?: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name can only contain letters' })
  last_name: string;

  @ApiProperty({ example: '2015-04-12', required: true })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid date (YYYY-MM-DD)' },
  )
  date_of_birth: string;

  @ApiProperty({ example: 'male', enum: Gender, required: true })
  @IsEnum(Gender, { message: 'Gender must be male or female' })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: Gender;

  @ApiProperty({ example: 'uuid-of-guardian', required: true })
  @IsUUID('4', { message: 'Guardian ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Guardian ID is required' })
  guardian_id: string;

  @ApiPropertyOptional({ example: 'Sunshine Primary School' })
  @IsString({ message: 'Previous school must be a string' })
  @IsOptional()
  previous_school?: string;

  @ApiPropertyOptional({ example: 'O+', enum: BloodGroup })
  @IsEnum(BloodGroup, { message: 'Blood group must be a valid value' })
  @IsOptional()
  blood_group?: BloodGroup;

  @ApiPropertyOptional({ example: 'AA', enum: Genotype })
  @IsEnum(Genotype, { message: 'Genotype must be a valid value' })
  @IsOptional()
  genotype?: Genotype;

  @ApiPropertyOptional({ example: 'Allergic to penicillin' })
  @IsString({ message: 'Health notes must be a string' })
  @IsOptional()
  health_notes?: string;

  @ApiProperty({
    example: 'uuid-of-primary-1',
    description: 'Class the student is admitted into',
  })
  @IsUUID('4', { message: 'Class ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Class ID is required' })
  class_id: string;

  @ApiProperty({ example: 'uuid-of-primary3-new-admission-arm', required: true })
  @IsUUID('4', { message: 'Class arm ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Class arm ID is required' })
  class_arm_id: string;

  @ApiProperty({ example: 'uuid-of-session', required: true })
  @IsUUID('4', { message: 'Session ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Session ID is required' })
  session_id: string;
}

export class UpdateStudentDto extends PartialType(
  OmitType(CreateStudentDto, ['class_id'] as const),
) {
  @ApiPropertyOptional({ example: 'https://cdn.example.com/photo.jpg' })
  @IsOptional()
  @IsUrl({}, { message: 'Profile photo must be a valid URL' })
  profile_photo_url?: string;
}

export class BulkUploadStudentDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name can only contain letters' })
  first_name: string;

  @ApiPropertyOptional({ example: 'Michael' })
  @IsString()
  @IsOptional()
  middle_name?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name can only contain letters' })
  last_name: string;

  @ApiProperty({ example: '2015-04-12' })
  @IsDateString({}, { message: 'Date of birth must be YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  date_of_birth: string;

  @ApiProperty({ example: 'male', enum: Gender })
  @IsEnum(Gender, { message: 'Gender must be male or female' })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: Gender;

  @ApiPropertyOptional({ example: 'Sunshine Primary School' })
  @IsString()
  @IsOptional()
  previous_school?: string;

  @ApiPropertyOptional({ example: 'O+', enum: BloodGroup })
  @IsEnum(BloodGroup, { message: 'Blood group must be a valid value' })
  @IsOptional()
  blood_group?: BloodGroup;

  @ApiPropertyOptional({ example: 'AA', enum: Genotype })
  @IsEnum(Genotype, { message: 'Genotype must be a valid value' })
  @IsOptional()
  genotype?: Genotype;

  @ApiPropertyOptional({ example: 'Allergic to penicillin' })
  @IsString()
  @IsOptional()
  health_notes?: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Guardian name is required' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Guardian name can only contain letters',
  })
  guardian_name: string;

  @ApiProperty({ example: '08012345678' })
  @IsString()
  @IsNotEmpty({ message: 'Guardian phone is required' })
  @Matches(/^[0-9]+$/, { message: 'Guardian phone can only contain numbers' })
  guardian_phone: string;

  @ApiPropertyOptional({ example: 'jane@example.com' })
  @IsString()
  @IsOptional()
  guardian_email?: string;

  @ApiProperty({ example: 'mother', enum: GuardianRelationship })
  @IsEnum(GuardianRelationship, {
    message: 'Relationship must be a valid value',
  })
  @IsNotEmpty({ message: 'Guardian relationship is required' })
  guardian_relationship: GuardianRelationship;

  @ApiProperty({
    example: 'uuid-of-primary-1',
    description: 'Class the student is admitted into',
  })
  @IsUUID('4', { message: 'Class ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Class ID is required' })
  class_id: string;
}

export class ChangeStudentStatusDto {
  @ApiProperty({ example: 'suspended', enum: StudentStatus, required: true })
  @IsEnum(StudentStatus, { message: 'Status must be a valid student status' })
  @IsNotEmpty({ message: 'Status is required' })
  student_status: StudentStatus;

  @ApiPropertyOptional({ example: 'Disciplinary action' })
  @IsString({ message: 'Reason must be a string' })
  @IsOptional()
  reason?: string;
}
