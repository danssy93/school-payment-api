import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
