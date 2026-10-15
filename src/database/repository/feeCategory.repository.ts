import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { FeeCategory } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeeCategoryRepository extends BaseRepository<FeeCategory> {
  protected readonly logger = new Logger(FeeCategoryRepository.name);

  constructor(
    @InjectRepository(FeeCategory)
    readonly feeCategoryRepository: Repository<FeeCategory>,
  ) {
    super(feeCategoryRepository);
  }
}
