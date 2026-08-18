import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, IsString, IsPhoneNumber } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+2348031234567',
    title: ' Phone number',
    required: true,
  })
  @IsNotEmpty({ message: ' Phone number is required.' })
  @Matches(/^[^\s]+$/, { message: ' Phone number cannot be empty.' })
  @IsString({ message: ' Phone number must be a string' })
  identifier: string;

  @ApiProperty({
    example: '123456',
    required: true,
    title: '6-digit PIN',
  })
  @IsNotEmpty({ message: 'Login PIN is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
