import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { FeeStructure } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeeStructureRepository extends BaseRepository<FeeStructure> {
  protected readonly logger = new Logger(FeeStructureRepository.name);

  constructor(
    @InjectRepository(FeeStructure)
    readonly feeStructureRepository: Repository<FeeStructure>,
  ) {
    super(feeStructureRepository);
  }
}
