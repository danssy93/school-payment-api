import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth/auth.service';
import { CONFIGURATION } from 'src/lib';
import { IJwtDecodedToken } from 'src/common';
import AppError from 'src/common/error/AppError';
import { UserStatus } from 'src/database/entities';
import type { Request } from 'express';

@Injectable()
export class UserRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: CONFIGURATION.JWT.USER.REFRESH_TOKEN.SECRET!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtDecodedToken) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const user = await this.authService.validateRefreshUser(payload.sub);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const storedRefreshToken = user.refresh_token;

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new AppError(
        'Session Expired, login again',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
