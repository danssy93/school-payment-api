import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class EnrollStudentDto {
  @ApiProperty({ example: 'uuid-of-class-arm', required: true })
  @IsUUID('4', { message: 'Class arm ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Class arm ID is required' })
  class_arm_id: string;

  @ApiProperty({ example: 'uuid-of-session', required: true })
  @IsUUID('4', { message: 'Session ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Session ID is required' })
  session_id: string;

  @ApiPropertyOptional({ example: 'uuid-of-term' })
  @IsUUID('4', { message: 'Term ID must be a valid UUID' })
  @IsOptional()
  term_id?: string;
}

export class ClassifyStudentDto {
  @ApiProperty({ example: 'uuid-of-class-arm', required: true })
  @IsUUID('4', { message: 'Class arm ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Class arm ID is required' })
  class_arm_id: string;
}

export class PromoteStudentDto {
  @ApiProperty({ example: 'uuid-of-next-class-arm', required: true })
  @IsUUID('4', { message: 'Class arm ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Class arm ID is required' })
  class_arm_id: string;

  @ApiProperty({ example: 'uuid-of-new-session', required: true })
  @IsUUID('4', { message: 'Session ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Session ID is required' })
  session_id: string;

  @ApiPropertyOptional({ example: 'uuid-of-term' })
  @IsUUID('4', { message: 'Term ID must be a valid UUID' })
  @IsOptional()
  term_id?: string;
}

export class BulkPromoteDto {
  @ApiProperty({ example: 'uuid-of-next-class-arm', required: true })
  @IsUUID('4', { message: 'Next class arm ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Next class arm Id is required' })
  next_class_arm_id: string;

  @ApiProperty({ example: 'uuid-of-new-session', required: true })
  @IsUUID('4', { message: 'Session ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Session ID is required' })
  session_id: string;

  @ApiPropertyOptional({ example: 'uuid-of-term' })
  @IsUUID('4', { message: 'Term ID must be a valid UUID' })
  @IsOptional()
  term_id?: string;
}
