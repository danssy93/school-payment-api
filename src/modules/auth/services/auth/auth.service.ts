import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICurrentUser } from 'src/database/entities';
import { UserService } from 'src/modules/user/services/user';

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

    // /*eslint-disable @typescript-eslint/no-unused-vars*/
    // const { password, ...result } = existingUser;

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
}
