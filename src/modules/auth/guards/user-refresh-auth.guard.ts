import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AppError from 'src/common/error/AppError';

@Injectable()
export class UserRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new AppError(
        'Unauthorized because refresh token is invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
