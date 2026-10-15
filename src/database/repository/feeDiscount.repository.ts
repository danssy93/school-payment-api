import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { FeeDiscount } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeeDicountRepository extends BaseRepository<FeeDiscount> {
  protected readonly logger = new Logger(FeeDicountRepository.name);

  constructor(
    @InjectRepository(FeeDiscount)
    readonly feeDiscountRepository: Repository<FeeDiscount>,
  ) {
    super(feeDiscountRepository);
  }
}
