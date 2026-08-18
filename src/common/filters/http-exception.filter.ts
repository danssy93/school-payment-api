import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    }

    // Handle custom AppError
    else if ((exception as any).isOperational) {
      statusCode = (exception as any).statusCode;
      message = (exception as any).message;
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      const detail = (exception as any).driverError?.detail;
      message = detail || 'Database query failed';

      // Handle specific PostgreSQL error codes
      const code = (exception as any).driverError?.code;
      if (code === '23505') {
        message = 'A record with this value already exists';
      } else if (code === '23503') {
        message = 'Referenced record does not exist';
      } else if (code === '22P02') {
        message = 'Invalid value provided for one of the fields';
      }
    }

    // Log unexpected errors
    else {
      this.logger.error('Unexpected error:', exception);
    }

    // Always return consistent response shape
    return response.status(statusCode).json({
      status: false,
      statusCode,
      message: Array.isArray(message) ? message.join(', ') : message,
      timestamp: new Date().toISOString(),
    });
  }
}
