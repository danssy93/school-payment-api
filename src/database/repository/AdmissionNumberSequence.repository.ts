import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { AdmissionNumberSequence } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdmissionNumberSequenceRepository extends BaseRepository<AdmissionNumberSequence> {
  protected readonly logger = new Logger(
    AdmissionNumberSequenceRepository.name,
  );

  constructor(
    @InjectRepository(AdmissionNumberSequence)
    readonly admissionNumberSequenceRepository: Repository<AdmissionNumberSequence>,
  ) {
    super(admissionNumberSequenceRepository);
  }
}
