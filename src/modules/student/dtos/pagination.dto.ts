import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Gender, StudentStatus } from 'src/database/enums';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}

export class FilterStudentDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'active', enum: StudentStatus })
  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;

  @ApiPropertyOptional({ example: 'uuid-of-session' })
  @IsUUID('4')
  @IsOptional()
  session_id?: string;

  @ApiPropertyOptional({ example: 'uuid-of-class' })
  @IsUUID('4')
  @IsOptional()
  class_id?: string;

  @ApiPropertyOptional({ example: 'uuid-of-class-arm' })
  @IsUUID('4')
  @IsOptional()
  class_arm_id?: string;

  @ApiPropertyOptional({ example: 'uuid-of-guardian' })
  @IsUUID('4')
  @IsOptional()
  guardian_id?: string;

  @ApiPropertyOptional({ example: 'male', enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ example: 'john or GKA/2024/0001' })
  @IsString()
  @IsOptional()
  search?: string;
}

export class FilterGuardianDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'Jane or 08012345678' })
  @IsString()
  @IsOptional()
  search?: string;
}

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
