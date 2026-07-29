import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GenericObjectType } from 'src/common';
import AppError from 'src/common/error/AppError';
import { User, UserType } from 'src/database/entities';
import { UserRepository } from 'src/database/repository/user.repository';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { ChangePasswordDto } from '../../dtos/user.dto';

@Injectable()
export class UserService {
  protected readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async create(user: Partial<User>, queryRunner?: QueryRunner): Promise<User> {
    return await this.userRepository.create(user, queryRunner);
  }

  async findOneBy(query: GenericObjectType): Promise<User> {
    const user = await this.userRepository.findOne(query);

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOne(
    query: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    throwError: boolean = false,
    options?: Omit<FindOneOptions<User>, 'where'>,
  ): Promise<User | null> {
    const existingUser = await this.userRepository.findOne(query, options);

    if (throwError && !existingUser) {
      throw new AppError('User record not found', HttpStatus.NOT_FOUND);
    }

    return existingUser;
  }

  async find(
    options?: FindManyOptions<User> | FindOptionsWhere<User>,
  ): Promise<User[]> {
    return this.userRepository.find(options);
  }

  async update(
    queryObject: GenericObjectType,
    data: Partial<User>,
    queryRunner?: QueryRunner,
  ): Promise<User> {
    return await this.userRepository.update(queryObject, data, queryRunner);
  }

  async save(data: Partial<User>): Promise<User> {
    return await this.userRepository.save(data);
  }

  async changePassword(id: string, payload: ChangePasswordDto): Promise<void> {
    const { password, confirm_password } = payload;

    if (password !== confirm_password) {
      throw new AppError('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const user = await this.findOne({ id }, true);
    user!.password = password;
    await this.userRepository.save(user!);
  }

  async promoteAdmin(id: string): Promise<User> {
    const user = await this.findOne({ id }, true);
    if (user!.type !== UserType.BURSAR) {
      throw new AppError(
        'Only a Bursar can be promoted to Admin',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userRepository.update({ id }, { type: UserType.ADMIN });
  }

  async demoteToBursar(id: string): Promise<User> {
    const user = await this.findOne({ id }, true);

    if (user!.type !== UserType.ADMIN) {
      throw new AppError(
        'Only an Admin can be demoted to Bursar',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userRepository.update({ id }, { type: UserType.BURSAR });
  }

  async deactivate(id: string): Promise<void> {
    await this.findOne({ id }, true);
    await this.userRepository.softDelete({ id });
  }
}
