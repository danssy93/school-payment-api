import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth/auth.service';
import { CONFIGURATION } from 'src/lib';
import { IJwtDecodedToken } from 'src/common';
import { UserStatus } from 'src/database/entities';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(UserJwtStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: CONFIGURATION.JWT.USER.ACCESS_TOKEN.SECRET!,
    });
  }

  async validate(payload: IJwtDecodedToken) {
    const user = await this.authService.validateUser(payload.sub);

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    return user;
  }
}
