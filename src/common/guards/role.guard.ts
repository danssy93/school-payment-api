import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { UserType } from 'src/database/entities';
import AppError from '../error/AppError';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.type) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (user.type === UserType.SUPER_ADMIN) {
      return true;
    }

    if (!requiredRoles.includes(user.type)) {
      throw new AppError(
        'Forbidden: Insufficient permission',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
