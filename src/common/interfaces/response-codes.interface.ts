import { HttpStatus } from '@nestjs/common';

export interface ResponseCode {
  status_code: HttpStatus;
  type: string;
  success: boolean;
  message: string;
}
