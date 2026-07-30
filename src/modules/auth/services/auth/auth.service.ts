import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ICurrentUser, User, UserType } from 'src/database/entities';
import { UserService } from 'src/modules/user/services/user';
import { LoginDto } from '../../dtos';
import { In } from 'typeorm';
import AppError from 'src/common/error/AppError';
import { CONFIGURATION } from 'src/lib';
import { Helpers } from 'src/common/utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(userId: string): Promise<ICurrentUser | null> {
    const existingUser = await this.userService.findOne({ id: userId }, false);
    if (!existingUser) {
      return null;
    }

    return {
      id: existingUser.id,
      user_name: existingUser.user_name,
      phone: existingUser.phone,
      email: existingUser.email,
      full_name: existingUser.full_name,
      type: existingUser.type,
      status: existingUser.status,
    };
  }

  async validateRefreshUser(userId: string): Promise<User | null> {
    return this.userService.findOne({ id: userId }, false);
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    const existingUser = await this.userService.findOne(
      [
        {
          email: identifier,
          type: In([UserType.SUPER_ADMIN, UserType.BURSAR, UserType.TEACHER]),
        },
        {
          user_name: identifier,
          type: In([UserType.SUPER_ADMIN, UserType.BURSAR, UserType.TEACHER]),
        },
        {
          phone: identifier.replace('+', ''),
          type: In([UserType.SUPER_ADMIN, UserType.BURSAR, UserType.TEACHER]),
        },
      ],
      true,
    );

    if (!existingUser) {
      throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const comparePassword = await existingUser.comparePassword(password);

    if (!comparePassword) {
      throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.generateAccessToken(existingUser);
    const refreshToken = await this.generateRefreshToken(existingUser);

    if (!existingUser.id) {
      throw new AppError('UserID is missing', HttpStatus.NOT_FOUND);
    }

    const payload = {
      ...existingUser.toPayload(),
      accessToken: accessToken.access_token,
      refreshToken: refreshToken.refresh_token,
    };

    await this.userService.update(
      { id: existingUser.id },
      {
        last_login: new Date(Helpers.getWATDateTimestamp()),
        refresh_token: refreshToken.refresh_token,
      },
    );

    return {
      status: HttpStatus.OK,

      message: 'Login successful',
      data: payload,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userService.update({ id: userId }, { refresh_token: null });
  }

  async generateAccessToken(payload: Partial<User>) {
    const data = {
      sub: payload.id,
      email: payload.email,
      user_name: payload.user_name,
      phone: payload.phone,
    };

    const options: JwtSignOptions = {
      secret: CONFIGURATION.JWT.USER.ACCESS_TOKEN.SECRET,
      expiresIn: CONFIGURATION.JWT.USER.ACCESS_TOKEN.EXPIRY,
    };

    const accessToken = await this.jwtService.signAsync(data, options);

    return {
      type: 'Bearer',
      access_token: accessToken,
      expiresIn: CONFIGURATION.JWT.USER.ACCESS_TOKEN.EXPIRY,
    };
  }

  async generateRefreshToken(payload: Partial<User>) {
    const data = {
      sub: payload.id,
      email: payload.email,
      user_name: payload.user_name,
      phone: payload.phone,
    };

    const options: JwtSignOptions = {
      secret: CONFIGURATION.JWT.USER.REFRESH_TOKEN.SECRET,
      expiresIn: CONFIGURATION.JWT.USER.REFRESH_TOKEN.EXPIRY,
    };

    const refreshToken = await this.jwtService.signAsync(data, options);

    return {
      type: 'Bearer',
      refresh_token: refreshToken,
      expiresIn: CONFIGURATION.JWT.USER.REFRESH_TOKEN.EXPIRY,
    };
  }
}
