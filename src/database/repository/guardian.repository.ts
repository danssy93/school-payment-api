import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Guardian } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GuardianRepository extends BaseRepository<Guardian> {
  protected readonly logger = new Logger(GuardianRepository.name);

  constructor(
    @InjectRepository(Guardian)
    readonly guardianRepository: Repository<Guardian>,
  ) {
    super(guardianRepository);
  }
}
