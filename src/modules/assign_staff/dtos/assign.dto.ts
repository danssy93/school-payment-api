import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignStaffDto {
  @ApiProperty({ description: 'User ID of the staff member' })
  @IsUUID('4', { message: 'user_id must be a valid UUID' })
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: string;

  @ApiProperty({ description: 'Class arm ID' })
  @IsUUID('4', { message: 'class_arm_id must be a valid UUID' })
  @IsNotEmpty({ message: 'class_arm_id is required' })
  class_arm_id: string;

  @ApiProperty({ description: 'Academic session ID' })
  @IsUUID('4', { message: 'session_id must be a valid UUID' })
  @IsNotEmpty({ message: 'session_id is required' })
  session_id: string;
}
