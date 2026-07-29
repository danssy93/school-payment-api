import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { CONFIGURATION } from 'src/lib';
import { UserModule } from '../user/user.module';
import { StringValue } from 'ms';

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
  providers: [AuthService],
})
export class AuthModule {}
