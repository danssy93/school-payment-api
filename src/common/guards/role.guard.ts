import { CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';
import { UserType } from 'src/database/entities';
import AppError from '../error/AppError';

export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.roles.includes(UserType.SUPER_ADMIN)) {
      return true;
    }

    if (!user || !user.roles) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const hashRequiredRole = user.roles.some((role) =>
      requiredRoles.includes(role),
    );

    if (!hashRequiredRole) {
      throw new AppError(
        'Forbidden: Insufficient permission',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
