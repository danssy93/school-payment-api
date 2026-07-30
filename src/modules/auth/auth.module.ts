import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { CONFIGURATION } from 'src/lib';
import { UserModule } from '../user/user.module';
import { StringValue } from 'ms';
import { UserJwtStrategy } from './strategies/jwt.strategy';
import { UserRefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserJwtGuard, UserRefreshAuthGuard } from './guards';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: CONFIGURATION.JWT.USER.ACCESS_TOKEN.SECRET,
        signOptions: {
          expiresIn: CONFIGURATION.JWT.USER.ACCESS_TOKEN.EXPIRY as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserJwtStrategy,
    UserRefreshTokenStrategy,
    UserJwtGuard,
    UserRefreshAuthGuard,
  ],
})
export class AuthModule {}
