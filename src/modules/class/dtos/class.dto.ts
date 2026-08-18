import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ArmName, ClassCategory } from 'src/database/enums/class.enum';

export class CreateClassDto {
  @ApiProperty({
    example: 'JSS',
    title: 'Class Name',
    required: true,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: '1',
    title: 'Class Level',
    required: true,
  })
  @IsString({ message: 'Level must be a string' })
  @IsNotEmpty({ message: 'Level is required' })
  level: number;

  @ApiProperty({
    enum: ClassCategory,
    title: 'category',
    required: true,
  })
  @IsEnum(ClassCategory, { message: 'category must be a valid enum value' })
  @IsNotEmpty({ message: 'category is required' })
  category: ClassCategory;
}

export class CreateClassArmDto {
  @ApiProperty({
    enum: ArmName,
    title: 'Arm Name',
    required: true,
  })
  @IsEnum(ArmName, {
    message: `Arm name must be one of: ${Object.values(ArmName).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Arm name is required' })
  name: ArmName;

  @ApiProperty({
    example: 'uuid-of-form-teacher',
    title: 'Form Teacher ID',
    required: false,
  })
  @IsOptional({ message: 'form_teacher_id is optional' })
  @IsString({ message: 'form_teacher_id must be a string' })
  form_teacher_id?: string;
}
