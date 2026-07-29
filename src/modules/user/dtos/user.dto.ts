import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/database/entities';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    title: 'Full-Name',
    required: true,
  })
  @IsString({ message: 'Full_name must be a string' })
  @IsNotEmpty({ message: 'Full_name is required' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Full_name can only contain letters and spaces',
  })
  full_name: string;

  @ApiProperty({
    example: 'tobs99',
    title: 'Username',
    required: true,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @Matches(/^[^\s]+$/, { message: 'Username cannot contain whitespace' })
  user_name: string;

  @ApiProperty({
    example: 'john@example.com',
    title: 'Email',
    required: true,
  })
  @IsEmail()
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[^\s]+$/, { message: 'Email cannot contain whitespace' })
  email: string;

  @ApiProperty({
    example: '+23480xxxxxxxx',
    title: 'Customer Phone Number',
    required: true,
  })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^[^\s]+$/, { message: 'Phone cannot contain whitespace' })
  phone: string;

  @ApiProperty({
    example: 'bursar',
    enum: UserType,
    required: true,
  })
  @IsEnum(UserType, { message: 'Type must be bursar or teacher' })
  @IsNotEmpty({ message: 'User type is required' })
  type: UserType;

  @ApiProperty({
    example: '123456',
    title: 'Change Password',
    required: true,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^[^\s]+$/, { message: 'Password cannot contain whitespace' })
  @MinLength(6, { message: 'Password must be at least 4 characters long' })
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ChangePasswordDto {
  @ApiProperty({
    example: '123456',
    title: 'Change Password',
    required: true,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^[^\s]+$/, { message: 'Password cannot contain whitespace' })
  @MinLength(6, { message: 'Password must be at least 4 characters long' })
  readonly password: string;

  @ApiProperty({
    example: '123456',
    title: 'Change Password',
    required: true,
  })
  @IsString({ message: 'Confirm password must be a string' })
  @Matches(/^[^\s]+$/, { message: 'Old password cannot contain whitespace' })
  @MinLength(6, {
    message: ' Confirm Password must be at least 4 characters long',
  })
  @IsNotEmpty({ message: 'Confirm Password is required' })
  readonly confirm_password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'tobs99',
    title: 'Username',
    required: true,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @Matches(/^[^\s]+$/, { message: 'Username cannot contain whitespace' })
  user_name: string;

  @ApiProperty({
    example: '+23480xxxxxxxx',
    title: 'Customer Phone Number',
    required: true,
  })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^[^\s]+$/, { message: 'Phone cannot contain whitespace' })
  readonly phone: string;
}
